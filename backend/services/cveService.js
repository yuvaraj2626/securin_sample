import axios from 'axios';
import cron from 'node-cron';
import { CVE, Progress } from '../models/cveModels.js';


// Helper function to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry mechanism with exponential backoff
const fetchWithRetry = async (url, maxRetries = 5, initialDelay = 30000) => {
    let retries = 0;
    let delay = initialDelay;

    while (retries < maxRetries) {
        try {
            const response = await axios.get(url);
            return response;
        } catch (error) {
            // Handle 429 (Too Many Requests) or 503 (Service Unavailable)
            if (error.response?.status === 429 || error.response?.status === 503) {
                retries++;
                
                // Parse retry-after header (in seconds), default to exponential backoff
                const retryAfterHeader = parseInt(error.response.headers['retry-after']) || null;
                const exponentialBackoffSeconds = Math.ceil(delay / 1000);
                
                // Use the maximum of the two, with minimum of 30 seconds
                const waitSeconds = Math.max(
                    retryAfterHeader || 0,
                    exponentialBackoffSeconds,
                    30 // Always wait at least 30 seconds
                );
                const waitTime = waitSeconds * 1000;
                
                console.warn(
                    `Rate limited (429). Retry ${retries}/${maxRetries}. ` +
                    `Waiting ${waitSeconds}s before retrying...`
                );
                
                await sleep(waitTime);
                delay = Math.min(delay * 2, 300000); // Max wait time 5 minutes
                continue;
            }
            
            // Throw other errors
            throw error;
        }
    }

    throw new Error(`Failed to fetch after ${maxRetries} retries`);
};

// Extract CVSS metrics from the raw API response
const extractMetrics = (cveData) => {
    const metrics = {};
    
    try {
        const cvssMetricV3 = cveData.metrics?.cvssMetricV31?.[0] || cveData.metrics?.cvssMetricV30?.[0];
        const cvssMetricV2 = cveData.metrics?.cvssMetricV2?.[0];
        
        // Prefer V3 over V2
        if (cvssMetricV3) {
            metrics.severity = cvssMetricV3.cvssData?.baseSeverity || null;
            metrics.score = cvssMetricV3.cvssData?.baseScore || null;
            metrics.attackVector = cvssMetricV3.cvssData?.attackVector || null;
            metrics.attackComplexity = cvssMetricV3.cvssData?.attackComplexity || null;
            metrics.exploitabilityScore = cvssMetricV3.exploitabilityScore || null;
            metrics.impactScore = cvssMetricV3.impactScore || null;
        } else if (cvssMetricV2) {
            metrics.severity = cvssMetricV2.baseSeverity || null;
            metrics.score = cvssMetricV2.cvssData?.baseScore || null;
            metrics.attackVector = cvssMetricV2.cvssData?.accessVector || null;
            metrics.attackComplexity = cvssMetricV2.cvssData?.accessComplexity || null;
            metrics.exploitabilityScore = cvssMetricV2.exploitabilityScore || null;
            metrics.impactScore = cvssMetricV2.impactScore || null;
        }
    } catch (error) {
        console.warn('Error extracting metrics:', error);
    }
    
    return metrics;
};

// Get English description
const getDescription = (cveData) => {
    try {
        const descriptions = cveData.descriptions || [];
        const englishDesc = descriptions.find(d => d.lang === 'en');
        return englishDesc?.value || descriptions[0]?.value || '';
    } catch (error) {
        console.warn('Error extracting description:', error);
        return '';
    }
};

export const fetchAndStoreCVE = async (incremental = false) => {
    console.log('Starting CVE data fetch process...');
    const progress = await Progress.findOne({ task: 'cve_fetch' });
    let startIndex = incremental && progress ? progress.lastIndex : 0;
    let lastModifiedDate = progress?.lastModified || '2000-01-01T00:00:00Z';

    try {
        do {
            console.log(`Fetching data from NVD API with startIndex: ${startIndex}`);
            const apiUrl = `https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=2000&startIndex=${startIndex}${
                incremental ? `&lastModified=${lastModifiedDate}` : ''
            }`;
            
            // Use retry mechanism for API call
            const response = await fetchWithRetry(apiUrl);

            if (response.status !== 200) {
                console.error(`Unexpected response status: ${response.status}`);
                break;
            }

            const vulnerabilities = response.data.vulnerabilities;

            if (!vulnerabilities || vulnerabilities.length === 0) {
                console.log('No vulnerabilities found in the current batch. Exiting.');
                break;
            }

            console.log(`Fetched ${vulnerabilities.length} vulnerabilities. Processing...`);

            // Filter out existing vulnerabilities
            const ids = vulnerabilities.map(v => v.cve.id);
            const existingIds = new Set(
                (await CVE.find({ cveId: { $in: ids } }, { cveId: 1 })).map(doc => doc.cveId)
            );

            const newVulnerabilities = vulnerabilities
                .filter(v => !existingIds.has(v.cve.id))
                .map(v => {
                    const cveData = v.cve;
                    const metrics = extractMetrics(cveData);
                    
                    return {
                        cveId: cveData.id,
                        sourceIdentifier: cveData.sourceIdentifier,
                        vulnStatus: cveData.vulnStatus,
                        published: cveData.published,
                        lastModified: cveData.lastModified,
                        description: getDescription(cveData),
                        severity: metrics.severity,
                        score: metrics.score,
                        attackVector: metrics.attackVector,
                        attackComplexity: metrics.attackComplexity,
                        exploitabilityScore: metrics.exploitabilityScore,
                        impactScore: metrics.impactScore,
                        raw: cveData,
                    };
                });

            if (newVulnerabilities.length > 0) {
                await CVE.insertMany(newVulnerabilities, { ordered: false });
                console.log(`Inserted ${newVulnerabilities.length} new vulnerabilities into the database.`);
            } else {
                console.log('No new vulnerabilities to insert.');
            }

            startIndex += 2000;

            await Progress.updateOne(
                { task: 'cve_fetch' },
                {
                    $set: {
                        lastIndex: startIndex,
                        lastModified: vulnerabilities[vulnerabilities.length - 1]?.cve.lastModified || lastModifiedDate,
                    },
                },
                { upsert: true }
            );

            if (startIndex >= response.data.totalResults) {
                console.log('Reached the end of available data. Fetching process completed.');
                break;
            }

            // Add delay between requests to avoid rate limiting
            console.log('Waiting 2 seconds before next request...');
            await sleep(2000);

        } while (true);
    } catch (error) {
        if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
            console.warn('Connection reset. Retrying in 5 seconds...');
            await new Promise(res => setTimeout(res, 5000)); // Retry delay
            return fetchAndStoreCVE(incremental); // Retry the function
        } else {
            console.error('An error occurred during the CVE fetch process:', error.message);
        }
    }
};

export const initializeCVEScheduler = () => {
    cron.schedule('0 */6 * * *', async () => {
        console.log('Running periodic CVE synchronization...');
        await fetchAndStoreCVE(true); 
    });
};
