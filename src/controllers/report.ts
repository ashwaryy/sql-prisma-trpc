import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

export default async function createReport(req: Request, res: Response) {
  try {
    const { name, url } = req.body;
    if (typeof name !== "string" || name === "") {
      res.status(400).json({ error: "name is required" });
      return;
    }

    if (typeof url !== "string" || url === "") {
      res.status(400).json({ error: "url is required" });
      return;
    }

    await prisma.report.create({
      data: {
        name,
        id: uuidv4(),
        url,
      },
    });
    res.send("Report created successfully");
    await prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    await prisma.$disconnect();
  }
}

export async function deleteReport(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.report.delete({
      where: {
        id,
      },
    });
    res.send("Report deleted successfully");
    await prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    await prisma.$disconnect();
  }
}

export async function getReport(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const report = await prisma.report.findUnique({
      where: {
        id,
      },
    });
    if (!report) {
      res.status(404).json({ error: "Report not found" });
      return;
    }
    res.json(report);
    await prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    await prisma.$disconnect();
  }
}

export async function getReports(req: Request, res: Response) {
  try {
    const reports = await prisma.report.findMany();
    res.json(reports);
    await prisma.$disconnect();
  } catch (error: any) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

export async function updateReport(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, url } = req.body;
    if (typeof name !== "string" || name === "") {
      res.status(400).json({ error: "name is required" });
      return;
    }

    if (typeof url !== "string" || url === "") {
      res.status(400).json({ error: "url is required" });
      return;
    }

    await prisma.report.update({
      where: {
        id,
      },
      data: {
        name,
        url,
      },
    });
    res.send("Report updated successfully");
    await prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    await prisma.$disconnect();
  }
}
