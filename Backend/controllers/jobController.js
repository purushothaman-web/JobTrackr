/**
 * @api {get} /api/jobs Get all jobs (admin)
 * @apiSuccess {Object[]} jobs List of all jobs
 * @apiError {String} error Error message
 */
/**
 * @api {get} /api/jobs/:id Get job by ID
 * @apiParam {Number} id Job ID
 * @apiSuccess {Object} job Job details
 * @apiError {String} error Error message
 */
/**
 * @api {post} /api/jobs Create a new job
 * @apiBody {String} position
 * @apiBody {String} company
 * @apiBody {String} status
 * @apiBody {String} location
 * @apiBody {String} notes
 * @apiSuccess {Object} job Created job
 * @apiError {String} error Error message
 */
/**
 * @api {put} /api/jobs/:id Update job
 * @apiParam {Number} id Job ID
 * @apiBody {String} position
 * @apiBody {String} company
 * @apiBody {String} status
 * @apiBody {String} location
 * @apiBody {String} notes
 * @apiSuccess {Object} job Updated job
 * @apiError {String} error Error message
 */
/**
 * @api {patch} /api/jobs/:id/status Update job status
 * @apiParam {Number} id Job ID
 * @apiBody {String} status New status
 * @apiSuccess {Object} job Updated job
 * @apiError {String} error Error message
 */
/**
 * @api {delete} /api/jobs/:id Delete job
 * @apiParam {Number} id Job ID
 * @apiSuccess {String} message Success message
 * @apiError {String} error Error message
 */
/**
 * @api {get} /api/jobs/stats Get job stats
 * @apiSuccess {Object} stats Job statistics
 * @apiError {String} error Error message
 */
/**
 * @api {get} /api/jobs/export Export jobs as CSV
 * @apiSuccess {File} csv CSV file of jobs
 * @apiError {String} error Error message
 */
/**
 * @api {post} /api/jobs/summary-email Send job summary email
 * @apiSuccess {String} message Success message
 * @apiError {String} error Error message
 */
/**
 * @api {get} /api/jobs/user Get paginated jobs for user
 * @apiQuery {Number} page
 * @apiQuery {Number} limit
 * @apiQuery {String} status
 * @apiQuery {String} search
 * @apiQuery {String} sortBy
 * @apiQuery {String} order
 * @apiSuccess {Object} jobs Paginated jobs
 * @apiError {String} error Error message
 */
import { Parser } from 'json2csv';
import { sendEmail } from "../utils/email.js";
import ApiError from '../utils/ApiError.js';
import * as jobRepository from '../repositories/jobRepository.js';
import { PrismaClient } from '../generated/prisma/index.js';
import { logActivity } from '../utils/activityLogger.js';

const prisma = new PrismaClient();

export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await jobRepository.getAllJobs();
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error("get all job error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const jobId = parseInt(req.params.id, 10);
    const job = await jobRepository.getJobById(jobId, userId);
    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    console.error("get job by id error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createJob = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { position, company, status, location, notes } = req.body;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const jobData = {
      position,
      company,
      status,
      location,
      notes,
      userId, // link job to the authenticated user
    };
    const job = await jobRepository.createJob(jobData);
    await logActivity({
      userId,
      jobId: job.id,
      type: 'job_created',
      description: `Created job application for ${job.position} at ${job.company}`,
      toValue: job.status,
    });
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// ----------------- Update entire job -----------------
export const updateJob = async (req, res, next) => {
  const { position, company, status, location, notes } = req.body;
  const jobId = parseInt(req.params.id, 10);
  const userId = req.user.id;
  try {
    const existingJob = await jobRepository.getJobById(jobId, userId);
    if (!existingJob) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }
    const jobData = {
      position,
      company,
      status,
      location,
      notes,
    };
    const job = await jobRepository.updateJob(jobId, jobData);
    if (existingJob.status !== job.status) {
      await logActivity({
        userId,
        jobId: job.id,
        type: 'job_status_changed',
        description: `Job status changed from ${existingJob.status} to ${job.status}`,
        fromValue: existingJob.status,
        toValue: job.status,
      });
    } else {
      await logActivity({
        userId,
        jobId: job.id,
        type: 'job_updated',
        description: `Updated job details for ${job.position} at ${job.company}`,
      });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error("update job error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ----------------- Update job status only -----------------
export const updateStatus = async (req, res, next) => {
  const jobId = parseInt(req.params.id, 10);
  const { status } = req.body;
  const userId = req.user.id;
  if (!status) {
    return res.status(400).json({ success: false, error: "Status is required" });
  }
  try {
    const existingJob = await jobRepository.getJobById(jobId, userId);
    if (!existingJob) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }
    const job = await jobRepository.updateJob(jobId, { status });
    if (existingJob.status !== job.status) {
      await logActivity({
        userId,
        jobId: job.id,
        type: 'job_status_changed',
        description: `Job status changed from ${existingJob.status} to ${job.status}`,
        fromValue: existingJob.status,
        toValue: job.status,
      });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error("update job status error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ----------------- Delete job -----------------
export const deleteJob = async (req, res, next) => {
  const jobId = parseInt(req.params.id, 10);
  const userId = req.user.id;
  try {
    const existingJob = await jobRepository.getJobById(jobId, userId);
    if (!existingJob) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }
    await logActivity({
      userId,
      jobId,
      type: 'job_deleted',
      description: `Deleted job application for ${existingJob.position} at ${existingJob.company}`,
    });
    const job = await jobRepository.deleteJob(jobId);
    res.status(200).json({ success: true, data: { message: "Job deleted successfully" } });
  } catch (error) {
    console.error("delete job error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getJobStats = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const { totalJobs, stats } = await jobRepository.getJobStats(userId);
    res.status(200).json({ success: true, data: { totalJobs, stats } });
  } catch (error){
    console.error("get job stats error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const exportJobsCSV = async (req, res, next) => {
  const userID = req.user.id;
  try {
    const jobs = await jobRepository.exportJobsCSV(userID);
    const fields = ['id', 'position', 'company', 'status', 'location', 'notes', 'createdAt', 'updatedAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(jobs);
    res.header('Content-Type', 'text/csv');
    res.attachment('jobs.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export jobs error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getJobSummaryEmail = async (req, res, next) => {
  const userId = req.user?.id;
  const userEmail = req.user?.email;
  if (!userId || !userEmail) {
    return res.status(400).json({ success: false, error: 'User information is missing' });
  }
  try {
    // Fetch user to get the name
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    // Fetch all jobs for user
    const jobs = await jobRepository.getAllJobs(userId);
    // Count jobs by status
    const counts = {
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };
    let totalApplications = 0;
    jobs.forEach(job => {
      const statusLower = job.status.toLowerCase();
      switch (statusLower) {
        case 'applied':
          counts.applied++;
          break;
        case 'interview':
          counts.interview++;
          break;
        case 'offer':
          counts.offer++;
          break;
        case 'rejected':
          counts.rejected++;
          break;
        default:
          break;
      }
      totalApplications++;
    });
    // Construct personalized email content
    //Consider using a template engine for more complex emails and security.
    const emailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      padding: 20px;
      color: #333;
    }
    .email-container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 0 auto;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    h2 {
      color: #2c3e50;
    }
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .summary-table th, .summary-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .summary-table th {
      background-color: #f0f0f0;
      color: #555;
    }
    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #777;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h2>Hello ${user.name},</h2>
    <p>Here is your weekly job application summary:</p>

    <table class="summary-table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Applied</td>
          <td>${counts.applied}</td>
        </tr>
        <tr>
          <td>Interview</td>
          <td>${counts.interview}</td>
        </tr>
        <tr>
          <td>Offer</td>
          <td>${counts.offer}</td>
        </tr>
        <tr>
          <td>Rejected</td>
          <td>${counts.rejected}</td>
        </tr>
        <tr>
          <td>Total</td>
          <td>${totalApplications}</td>
        </tr>
      </tbody>
    </table>

    <p>Keep tracking and applying — you're doing great!</p>

    <div class="footer">
      &copy; ${new Date().getFullYear()} JobTrackr. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;
    // Send email
    await sendEmail(userEmail, 'Your Weekly Job Summary', emailContent);
    res.status(200).json({ success: true, data: { message: 'Job summary email sent successfully' } });
  } catch (error) {
    console.error('Error sending job summary email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getJobs = async (req, res, next) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order || 'desc';
  try {
    // Centralize logic in repository for testability and maintainability
    const result = await jobRepository.getJobs(userId, page, limit, status, sortBy, order);
    // Add search filtering (position/company) if search param is present
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      result.jobs = result.jobs.filter(job =>
        job.position.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search)
      );
      result.totalJobs = result.jobs.length;
      result.totalPages = Math.ceil(result.totalJobs / limit);
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const importJobs = async (req, res) => {
  const userId = req.user.id;
  const rows = Array.isArray(req.body.rows) ? req.body.rows : null;
  if (!rows || rows.length === 0) {
    return res.status(400).json({ success: false, error: "rows array is required" });
  }

  const normalize = (value) => (typeof value === "string" ? value.trim() : "");
  const normalizeStatus = (value) => value.trim().toLowerCase();
  const makeDedupeKey = (position, company) =>
    `${position.trim().toLowerCase()}::${company.trim().toLowerCase()}`;

  try {
    const existingJobs = await prisma.job.findMany({
      where: { userId },
      select: { id: true, position: true, company: true },
    });
    const existingKeys = new Set(existingJobs.map((job) => makeDedupeKey(job.position, job.company)));
    const batchKeys = new Set();

    let imported = 0;
    let skippedDuplicates = 0;
    let invalidRows = 0;

    for (const row of rows) {
      const position = normalize(row?.position);
      const status =
        typeof row?.status === "string" && row.status.trim()
          ? normalizeStatus(row.status)
          : "applied";
      const location = normalize(row?.location) || null;
      const notes = normalize(row?.notes) || null;
      const inputCompany = normalize(row?.company);
      const inputCompanyId = Number.isInteger(row?.companyId) ? row.companyId : null;

      if (!position || (!inputCompany && !inputCompanyId)) {
        invalidRows += 1;
        continue;
      }

      let companyId = null;
      let companyName = inputCompany;

      if (inputCompanyId) {
        const company = await prisma.company.findFirst({
          where: { id: inputCompanyId, userId },
        });
        if (!company) {
          invalidRows += 1;
          continue;
        }
        companyId = company.id;
        companyName = company.name;
      } else {
        const company = await prisma.company.findFirst({
          where: { userId, name: companyName },
        });
        if (company) {
          companyId = company.id;
          companyName = company.name;
        }
      }

      const dedupeKey = makeDedupeKey(position, companyName);
      if (existingKeys.has(dedupeKey) || batchKeys.has(dedupeKey)) {
        skippedDuplicates += 1;
        continue;
      }

      const created = await prisma.job.create({
        data: {
          userId,
          position,
          company: companyName,
          companyId,
          status,
          location,
          notes,
        },
      });

      batchKeys.add(dedupeKey);
      imported += 1;

      await logActivity({
        userId,
        jobId: created.id,
        type: 'job_imported',
        description: `Imported job application for ${created.position} at ${created.company}`,
        toValue: created.status,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        imported,
        skippedDuplicates,
        invalidRows,
        totalRows: rows.length,
      },
    });
  } catch (error) {
    console.error("Import jobs error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getJobTimeline = async (req, res) => {
  const userId = req.user.id;
  const jobId = parseInt(req.params.id, 10);
  if (Number.isNaN(jobId)) {
    return res.status(400).json({ success: false, error: "Invalid job ID" });
  }

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.userId !== userId) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    const timeline = await prisma.activity.findMany({
      where: { jobId, userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, data: timeline });
  } catch (error) {
    console.error("Get timeline error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getJobInterviews = async (req, res) => {
  const userId = req.user.id;
  const jobId = parseInt(req.params.id, 10);
  if (Number.isNaN(jobId)) {
    return res.status(400).json({ success: false, error: "Invalid job ID" });
  }

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.userId !== userId) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    const interviews = await prisma.interview.findMany({
      where: { jobId, userId },
      orderBy: { scheduledAt: "asc" },
    });

    res.status(200).json({ success: true, data: interviews });
  } catch (error) {
    console.error("Get job interviews error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createJobInterview = async (req, res) => {
  const userId = req.user.id;
  const jobId = parseInt(req.params.id, 10);
  if (Number.isNaN(jobId)) {
    return res.status(400).json({ success: false, error: "Invalid job ID" });
  }

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.userId !== userId) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    const scheduledAtRaw =
      typeof req.body.scheduledAt === "string" ? req.body.scheduledAt : "";
    const mode = typeof req.body.mode === "string" ? req.body.mode.trim() : null;
    const round = typeof req.body.round === "string" ? req.body.round.trim() : null;
    const status =
      typeof req.body.status === "string" ? req.body.status.trim().toLowerCase() : "scheduled";
    const notes = typeof req.body.notes === "string" ? req.body.notes.trim() : null;

    if (!scheduledAtRaw) {
      return res.status(400).json({ success: false, error: "scheduledAt is required" });
    }

    const scheduledAt = new Date(scheduledAtRaw);
    if (Number.isNaN(scheduledAt.getTime())) {
      return res.status(400).json({ success: false, error: "Invalid scheduledAt value" });
    }

    const interview = await prisma.interview.create({
      data: {
        jobId,
        userId,
        scheduledAt,
        mode,
        round,
        status,
        notes,
      },
    });

    await logActivity({
      userId,
      jobId,
      type: 'interview_created',
      description: `Interview scheduled for ${job.position} at ${job.company}`,
      toValue: scheduledAt.toISOString(),
      metadata: {
        interviewId: interview.id,
        interviewStatus: interview.status,
      },
    });

    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    console.error("Create interview error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
