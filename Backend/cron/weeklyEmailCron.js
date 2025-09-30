import cron from 'node-cron';
import { getJobSummaryEmail } from '../controllers/jobController.js'; // We’ll adjust this
import { PrismaClient } from '../generated/prisma/index.js';
import { sendEmail } from "../utils/email.js";

const prisma = new PrismaClient();

async function sendWeeklySummaryToAllUsers() {
  try {
    // Fetch all users
    const users = await prisma.user.findMany();

    for (const user of users) {
      // Fetch jobs for the user
      const jobs = await prisma.job.findMany({
        where: { userId: user.id },
      });

      const totalApplications = jobs.length;

      // Count jobs by status
      const counts = {
        applied: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
      };

      jobs.forEach(job => {
        switch (job.status?.toLowerCase().trim()) {
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
      });

      // Compose email content (reuse your existing HTML template here)
      const emailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333; }
    .email-container { background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    h2 { color: #2c3e50; }
    .summary-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .summary-table th, .summary-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #ddd; }
    .summary-table th { background-color: #f0f0f0; color: #555; }
    .footer { margin-top: 30px; font-size: 13px; color: #777; text-align: center; }
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
      await sendEmail(user.email, 'Your Weekly Job Summary', emailContent);

      console.log(`✅ Weekly summary sent to ${user.email}`);
    }
  } catch (error) {
    console.error('❌ Error sending weekly summaries:', error);
  }
}

// Schedule cron job for every Monday at 9:00 AM server time
cron.schedule('0 9 * * 1', () => {
  console.log('🕘 Running weekly job summary email cron job...');
  sendWeeklySummaryToAllUsers();
});

