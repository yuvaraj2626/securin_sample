import express from 'express';
import {
    getAllCVEs,
    getCVEById,
    getCVEsByYear,
    getCVEsByScore,
    getCVEsByModifiedDays,
    createCVE,
    updateCVE,
    patchCVE,
    deleteCVE
} from '../controllers/cveContollers.js';

const router = express.Router();

// GET operations
router.get('/cves', getAllCVEs);
router.get('/cves/year/:year', getCVEsByYear);
router.get('/cves/score/:score', getCVEsByScore);
router.get('/cves/modified/:days', getCVEsByModifiedDays);
router.get('/cves/:id', getCVEById);

// POST operation - Create a new CVE
router.post('/cves', createCVE);

// PUT operation - Replace entire CVE record
router.put('/cves/:id', updateCVE);

// PATCH operation - Partial update to CVE record
router.patch('/cves/:id', patchCVE);

// DELETE operation - Remove a CVE
router.delete('/cves/:id', deleteCVE);

export default router;
