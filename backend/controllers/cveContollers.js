import { CVE } from '../models/cveModels.js';

export const getAllCVEs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalRecords = await CVE.countDocuments();

        const cves = await CVE.find()
            .skip(skip)
            .limit(limit)
            .select('cveId published lastModified severity score vulnStatus description');

        res.json({ cves, totalRecords, currentPage: page, totalPages: Math.ceil(totalRecords / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching CVEs', error });
    }
};

export const getCVEById = async (req, res) => {
    try {
        const { id } = req.params;
        const cve = await CVE.findOne({ cveId: id });
        if (!cve)
            return res.status(404).json({ error: 'CVE not found' });
        res.json(cve);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getCVEsByYear = async (req, res) => {
    try {
        const { year } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31T23:59:59Z`);

        const cves = await CVE.find({
            published: { $gte: startDate, $lte: endDate }
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('cveId published severity score vulnStatus description');

        const totalRecords = await CVE.countDocuments({ 
            published: { $gte: startDate, $lte: endDate } 
        });

        res.status(200).json({ totalRecords, cves, year });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getCVEsByScore = async (req, res) => {
    try {
        const { score } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const scoreValue = parseFloat(score);

        const cves = await CVE.find({ score: { $gte: scoreValue } })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('cveId published score severity vulnStatus description');

        const totalRecords = await CVE.countDocuments({ score: { $gte: scoreValue } });

        res.status(200).json({ totalRecords, cves, minScore: scoreValue });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getCVEsByModifiedDays = async (req, res) => {
    try {
        const { days } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - parseInt(days));

        const cves = await CVE.find({ lastModified: { $gte: currentDate } })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('cveId published severity score vulnStatus description');

        const totalRecords = await CVE.countDocuments({ lastModified: { $gte: currentDate } });

        res.status(200).json({ totalRecords, cves, daysBack: parseInt(days) });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * CREATE: Add a new CVE record
 */
export const createCVE = async (req, res) => {
    try {
        const { cveId, sourceIdentifier, vulnStatus, published, lastModified, description, severity, score, attackVector, attackComplexity, exploitabilityScore, impactScore, raw } = req.body;

        // Validate required fields
        if (!cveId) {
            return res.status(400).json({ error: 'CVE ID is required' });
        }

        // Check if CVE already exists
        const existingCVE = await CVE.findOne({ cveId });
        if (existingCVE) {
            return res.status(409).json({ error: 'CVE already exists with this ID' });
        }

        // Create new CVE
        const newCVE = new CVE({
            cveId,
            sourceIdentifier,
            vulnStatus,
            published: published ? new Date(published) : new Date(),
            lastModified: lastModified ? new Date(lastModified) : new Date(),
            description,
            severity,
            score: score ? parseFloat(score) : null,
            attackVector,
            attackComplexity,
            exploitabilityScore: exploitabilityScore ? parseFloat(exploitabilityScore) : null,
            impactScore: impactScore ? parseFloat(impactScore) : null,
            raw
        });

        await newCVE.save();
        res.status(201).json({ message: 'CVE created successfully', cve: newCVE });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

/**
 * UPDATE: Replace an entire CVE record (PUT)
 */
export const updateCVE = async (req, res) => {
    try {
        const { id } = req.params;
        const { cveId, sourceIdentifier, vulnStatus, published, lastModified, description, severity, score, attackVector, attackComplexity, exploitabilityScore, impactScore, raw } = req.body;

        // Find CVE by ID
        const cve = await CVE.findOne({ cveId: id });
        if (!cve) {
            return res.status(404).json({ error: 'CVE not found' });
        }

        // Update all fields
        cve.cveId = cveId || cve.cveId;
        cve.sourceIdentifier = sourceIdentifier !== undefined ? sourceIdentifier : cve.sourceIdentifier;
        cve.vulnStatus = vulnStatus !== undefined ? vulnStatus : cve.vulnStatus;
        cve.published = published ? new Date(published) : cve.published;
        cve.lastModified = new Date(); // Always update lastModified
        cve.description = description !== undefined ? description : cve.description;
        cve.severity = severity !== undefined ? severity : cve.severity;
        cve.score = score !== undefined ? parseFloat(score) : cve.score;
        cve.attackVector = attackVector !== undefined ? attackVector : cve.attackVector;
        cve.attackComplexity = attackComplexity !== undefined ? attackComplexity : cve.attackComplexity;
        cve.exploitabilityScore = exploitabilityScore !== undefined ? parseFloat(exploitabilityScore) : cve.exploitabilityScore;
        cve.impactScore = impactScore !== undefined ? parseFloat(impactScore) : cve.impactScore;
        cve.raw = raw !== undefined ? raw : cve.raw;

        await cve.save();
        res.status(200).json({ message: 'CVE updated successfully', cve });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

/**
 * PARTIAL UPDATE: Update specific CVE fields (PATCH)
 */
export const patchCVE = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Find CVE by ID
        const cve = await CVE.findOne({ cveId: id });
        if (!cve) {
            return res.status(404).json({ error: 'CVE not found' });
        }

        // Update only provided fields
        const allowedFields = ['sourceIdentifier', 'vulnStatus', 'published', 'description', 'severity', 'score', 'attackVector', 'attackComplexity', 'exploitabilityScore', 'impactScore', 'raw'];
        
        for (const field of allowedFields) {
            if (updates.hasOwnProperty(field)) {
                if (field === 'published' && updates[field]) {
                    cve[field] = new Date(updates[field]);
                } else if ((field === 'score' || field === 'exploitabilityScore' || field === 'impactScore') && updates[field] !== undefined) {
                    cve[field] = parseFloat(updates[field]);
                } else {
                    cve[field] = updates[field];
                }
            }
        }

        cve.lastModified = new Date(); // Always update lastModified
        await cve.save();
        res.status(200).json({ message: 'CVE patched successfully', cve });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

/**
 * DELETE: Remove a CVE record
 */
export const deleteCVE = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete CVE by ID
        const cve = await CVE.findOneAndDelete({ cveId: id });
        if (!cve) {
            return res.status(404).json({ error: 'CVE not found' });
        }

        res.status(200).json({ message: 'CVE deleted successfully', deletedCVE: cve });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
