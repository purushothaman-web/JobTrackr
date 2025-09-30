import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from "./generated/prisma/index.js";
import errorHandler from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import './cron/weeklyEmailCron.js'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleLogin, googleCallback } from './controllers/googleAuthController.js';



dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,            
}));
const prisma = new PrismaClient();
const PORT = process.env.PORT;

app.use(cookieParser());

app.use(express.json());
// Express session middleware (required for Passport)
app.use(session({ secret: process.env.SESSION_SECRET || 'your_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth strategy
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        },
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));


// Param middleware to parse :id once
app.param("id", (req, res, next, id) => {
  const jobId = parseInt(id, 10);
  if (isNaN(jobId)) return res.status(400).json({ error: "Invalid job ID" });
  req.jobId = jobId;
  next();
});

// Routes
app.get("/", (req, res) =>{
  res.send("Job Tracker API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
// Google OAuth routes
app.get('/api/auth/google', googleLogin);
app.get('/api/auth/google/callback', googleCallback);


app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
