import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const parseId = (value) => {
  const id = Number.parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
};

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

export const getCompanies = async (req, res) => {
  const userId = req.user.id;
  const search = req.query.search?.trim();

  try {
    const where = { userId };
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const companies = await prisma.company.findMany({
      where,
      include: {
        _count: {
          select: { jobs: true },
        },
      },
      orderBy: { name: "asc" },
    });

    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createCompany = async (req, res) => {
  const userId = req.user.id;
  const name = normalizeText(req.body.name);
  const website = normalizeText(req.body.website) || null;
  const industry = normalizeText(req.body.industry) || null;
  const location = normalizeText(req.body.location) || null;
  const notes = normalizeText(req.body.notes) || null;

  if (!name) {
    return res.status(400).json({ success: false, error: "Company name is required" });
  }

  try {
    const existing = await prisma.company.findFirst({
      where: { userId, name },
    });
    if (existing) {
      return res.status(400).json({ success: false, error: "Company already exists" });
    }

    const company = await prisma.company.create({
      data: { userId, name, website, industry, location, notes },
    });

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    console.error("Create company error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCompanyById = async (req, res) => {
  const userId = req.user.id;
  const companyId = parseId(req.params.id);
  if (!companyId) {
    return res.status(400).json({ success: false, error: "Invalid company ID" });
  }

  try {
    const company = await prisma.company.findFirst({
      where: { id: companyId, userId },
      include: {
        jobs: {
          select: { id: true, position: true, status: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!company) {
      return res.status(404).json({ success: false, error: "Company not found" });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    console.error("Get company error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCompany = async (req, res) => {
  const userId = req.user.id;
  const companyId = parseId(req.params.id);
  if (!companyId) {
    return res.status(400).json({ success: false, error: "Invalid company ID" });
  }

  const name = normalizeText(req.body.name);
  const website = normalizeText(req.body.website) || null;
  const industry = normalizeText(req.body.industry) || null;
  const location = normalizeText(req.body.location) || null;
  const notes = normalizeText(req.body.notes) || null;

  if (!name) {
    return res.status(400).json({ success: false, error: "Company name is required" });
  }

  try {
    const existingCompany = await prisma.company.findFirst({
      where: { id: companyId, userId },
    });
    if (!existingCompany) {
      return res.status(404).json({ success: false, error: "Company not found" });
    }

    const duplicate = await prisma.company.findFirst({
      where: {
        userId,
        name,
        id: { not: companyId },
      },
    });
    if (duplicate) {
      return res.status(400).json({
        success: false,
        error: "Another company with this name already exists",
      });
    }

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name,
        website,
        industry,
        location,
        notes,
        jobs: {
          updateMany: {
            where: {},
            data: { company: name },
          },
        },
      },
    });

    res.status(200).json({ success: true, data: updatedCompany });
  } catch (error) {
    console.error("Update company error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  const userId = req.user.id;
  const companyId = parseId(req.params.id);
  if (!companyId) {
    return res.status(400).json({ success: false, error: "Invalid company ID" });
  }

  try {
    const company = await prisma.company.findFirst({
      where: { id: companyId, userId },
      include: {
        _count: {
          select: { jobs: true },
        },
      },
    });

    if (!company) {
      return res.status(404).json({ success: false, error: "Company not found" });
    }

    if (company._count.jobs > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete company while jobs are linked to it",
      });
    }

    await prisma.company.delete({ where: { id: companyId } });
    res.status(200).json({
      success: true,
      data: { message: "Company deleted successfully" },
    });
  } catch (error) {
    console.error("Delete company error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
