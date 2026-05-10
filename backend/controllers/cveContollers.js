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
