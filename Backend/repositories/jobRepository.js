import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export const getAllJobs = async (userId) => {
  return prisma.job.findMany({
    where: { userId }, // Filter jobs by logged-in user's id
  });
};


export const getJobById = async (id) => {
  return prisma.job.findUnique({
    where: { id },
  });
};

export const createJob = async (data) => {
  return prisma.job.create({
    data,
  });
};

export const updateJob = async (id, data) => {
  return prisma.job.update({
    where: { id },
    data,
  });
};

export const deleteJob = async (id) => {
  return prisma.job.delete({
    where: { id },
  });
};

export const getJobStats = async (userId) => {
  const totalJobs = await prisma.job.count({ where: { userId } });
    const statusCounts = await prisma.job.groupBy({
      by: ['status'],
      where: { userId },
      _count: { _all: true }
    });
    const stats = {};
statusCounts.forEach((item) => {
  stats[item.status] = item._count._all;
});
  return { totalJobs, stats };

};

export const getJobs = async (userId, page, limit, status, sortBy, order) => {
  const skip = (page - 1) * limit;

    const whereClause = {
      userId,
      ...(status ? { status: status.toLowerCase() } : {}),
    };

    const totalJobs = await prisma.job.count({ where: whereClause });

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { [sortBy]: order },
      skip,
      take: limit,
    });

    return {
      page,
      limit,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      jobs,
    };
}

export const exportJobsCSV = async (userID) => {
  return prisma.job.findMany({
    where: { userId: userID },
    select: {
      id: true,
      position: true,
      company: true,
      status: true,
      location: true,
      notes: true,
      createdAt: true,
    },
  });
};
