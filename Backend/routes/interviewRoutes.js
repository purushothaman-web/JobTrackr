import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  deleteInterview,
  getInterviewById,
  getInterviews,
  updateInterview,
} from "../controllers/interviewController.js";

const router = express.Router();

router.get("/", authenticate, asyncHandler(getInterviews));
router.get("/:interviewId", authenticate, asyncHandler(getInterviewById));
router.put("/:interviewId", authenticate, asyncHandler(updateInterview));
router.delete("/:interviewId", authenticate, asyncHandler(deleteInterview));

export default router;
