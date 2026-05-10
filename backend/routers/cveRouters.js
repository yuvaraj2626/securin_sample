import express from 'express';
import {
    getAllCVEs,
    getCVEById,
    getCVEsByYear,
    getCVEsByScore,
    getCVEsByModifiedDays
} from '../controllers/cveContollers.js';

const router = express.Router();

router.get('/cves', getAllCVEs);
router.get('/cves/:id', getCVEById);
router.get('/cves/year/:year', getCVEsByYear);
router.get('/cves/score/:score', getCVEsByScore);
router.get('/cves/modified/:days', getCVEsByModifiedDays);

export default router;
