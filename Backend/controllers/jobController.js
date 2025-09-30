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
    const jobId = parseInt(req.params.id, 10);
    const job = await jobRepository.getJobById(jobId);
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
  try {
    const jobData = {
      position,
      company,
      status,
      location,
      notes,
    };
    const job = await jobRepository.updateJob(jobId, jobData);
    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found" });
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
  if (!status) {
    return res.status(400).json({ success: false, error: "Status is required" });
  }
  try {
    const job = await jobRepository.updateJob(jobId, { status });
    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found" });
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
  try {
    const job = await jobRepository.deleteJob(jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }
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
