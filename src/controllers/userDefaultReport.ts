import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
const prisma = new PrismaClient();

export async function setUserDefaultReport(req: Request, res: Response) {
  try {
    const { id, reportId } = req.params;
    if (!reportId || reportId === "") {
      res.status(400).json({ error: "reportId is required" });
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        default_report_id: reportId,
      },
    });
    res.send("User default report updated successfully");
    prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    prisma.$disconnect();
  }
}

export async function getUserDefaultReport(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ defaultReport: user.default_report_id });
    prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    prisma.$disconnect();
  }
}

export async function deleteUserDefaultReport(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        default_report_id: null,
      },
    });
    res.send("User default report deleted successfully");
    prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    prisma.$disconnect();
  }
}
