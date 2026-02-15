import { PrismaClient } from "../generated/prisma/index.js";
import { logActivity } from "../utils/activityLogger.js";

const prisma = new PrismaClient();

const parseId = (value) => {
  const id = Number.parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
};

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

export const getInterviews = async (req, res) => {
  const userId = req.user.id;
  const status = req.query.status?.trim().toLowerCase();
  const from = req.query.from;
  const to = req.query.to;

  try {
    const where = { userId };
    if (status) {
      where.status = status;
    }
    if (from || to) {
      where.scheduledAt = {};
      if (from) where.scheduledAt.gte = new Date(from);
      if (to) where.scheduledAt.lte = new Date(to);
    }

    const interviews = await prisma.interview.findMany({
      where,
      include: {
        job: {
          select: { id: true, position: true, company: true, status: true },
        },
      },
      orderBy: { scheduledAt: "asc" },
    });

    res.status(200).json({ success: true, data: interviews });
  } catch (error) {
    console.error("Get interviews error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getInterviewById = async (req, res) => {
  const userId = req.user.id;
  const interviewId = parseId(req.params.interviewId);
  if (!interviewId) {
    return res.status(400).json({ success: false, error: "Invalid interview ID" });
  }

  try {
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: {
        job: {
          select: { id: true, position: true, company: true, status: true },
        },
      },
    });

    if (!interview) {
      return res.status(404).json({ success: false, error: "Interview not found" });
    }

    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    console.error("Get interview error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateInterview = async (req, res) => {
  const userId = req.user.id;
  const interviewId = parseId(req.params.interviewId);
  if (!interviewId) {
    return res.status(400).json({ success: false, error: "Invalid interview ID" });
  }

  try {
    const existingInterview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: { job: { select: { id: true, position: true, company: true } } },
    });
    if (!existingInterview) {
      return res.status(404).json({ success: false, error: "Interview not found" });
    }

    const scheduledAtRaw =
      typeof req.body.scheduledAt === "string" ? req.body.scheduledAt : null;
    const mode = typeof req.body.mode === "string" ? normalizeText(req.body.mode) : null;
    const round = typeof req.body.round === "string" ? normalizeText(req.body.round) : null;
    const status =
      typeof req.body.status === "string"
        ? normalizeText(req.body.status).toLowerCase()
        : null;
    const notes = typeof req.body.notes === "string" ? normalizeText(req.body.notes) : null;

    let scheduledAt;
    if (scheduledAtRaw) {
      const parsed = new Date(scheduledAtRaw);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({ success: false, error: "Invalid scheduledAt value" });
      }
      scheduledAt = parsed;
    }

    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        ...(scheduledAt ? { scheduledAt } : {}),
        ...(mode !== null ? { mode } : {}),
        ...(round !== null ? { round } : {}),
        ...(status !== null ? { status } : {}),
        ...(notes !== null ? { notes } : {}),
      },
    });

    await logActivity({
      userId,
      jobId: existingInterview.jobId,
      type: "interview_updated",
      description: `Interview updated for ${existingInterview.job.position} at ${existingInterview.job.company}`,
      metadata: {
        interviewId: updatedInterview.id,
        oldStatus: existingInterview.status,
        newStatus: updatedInterview.status,
      },
    });

    res.status(200).json({ success: true, data: updatedInterview });
  } catch (error) {
    console.error("Update interview error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteInterview = async (req, res) => {
  const userId = req.user.id;
  const interviewId = parseId(req.params.interviewId);
  if (!interviewId) {
    return res.status(400).json({ success: false, error: "Invalid interview ID" });
  }

  try {
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: { job: { select: { id: true, position: true, company: true } } },
    });
    if (!interview) {
      return res.status(404).json({ success: false, error: "Interview not found" });
    }

    await prisma.interview.delete({ where: { id: interviewId } });

    await logActivity({
      userId,
      jobId: interview.jobId,
      type: "interview_deleted",
      description: `Interview removed for ${interview.job.position} at ${interview.job.company}`,
      metadata: { interviewId },
    });

    res.status(200).json({
      success: true,
      data: { message: "Interview deleted successfully" },
    });
  } catch (error) {
    console.error("Delete interview error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
