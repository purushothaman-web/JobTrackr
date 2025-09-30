import express from 'express';
import { getJobById, getAllJobs, createJob, updateJob, updateStatus, deleteJob, getJobStats, exportJobsCSV, getJobSummaryEmail, getJobs } from '../controllers/jobController.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/authMiddleware.js';
import validateJobData from '../middleware/validations/jobValidation.js';
import validateStatus from '../middleware/validations/statusValidation.js';

const router = express.Router();

router.get("/", authenticate, asyncHandler(getJobs));
router.get('/export', authenticate, asyncHandler(exportJobsCSV));
router.get('/email', authenticate, asyncHandler(getJobSummaryEmail));
router.get("/stats", authenticate, asyncHandler(getJobStats));
router.get("/:id", authenticate, asyncHandler(getJobById));
router.post("/", authenticate, validateJobData, asyncHandler(createJob));
router.put("/:id", authenticate, validateJobData, asyncHandler(updateJob));
router.patch("/:id/status", authenticate, validateStatus, asyncHandler(updateStatus));
router.delete("/:id", authenticate, asyncHandler(deleteJob));

export default router;
