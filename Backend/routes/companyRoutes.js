import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} from "../controllers/companyController.js";

const router = express.Router();

router.get("/", authenticate, asyncHandler(getCompanies));
router.post("/", authenticate, asyncHandler(createCompany));
router.get("/:id", authenticate, asyncHandler(getCompanyById));
router.put("/:id", authenticate, asyncHandler(updateCompany));
router.delete("/:id", authenticate, asyncHandler(deleteCompany));

export default router;
