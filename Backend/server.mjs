import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';



dotenv.config();
const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
const PORT = process.env.PORT || 5000;

app.use(cookieParser());

app.use(express.json());


// Param middleware to parse :id once
app.param("id", (req, res, next, id) => {
  const jobId = parseInt(id, 10);
  if (isNaN(jobId)) return res.status(400).json({ error: "Invalid job ID" });
  req.jobId = jobId;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Job Tracker API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/interviews", interviewRoutes);


app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
