import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const logActivity = async ({
  userId,
  jobId,
  type,
  description,
  fromValue = null,
  toValue = null,
  metadata = null,
}) => {
  try {
    await prisma.activity.create({
      data: {
        userId,
        jobId,
        type,
        description,
        fromValue,
        toValue,
        metadata: metadata ?? undefined,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
