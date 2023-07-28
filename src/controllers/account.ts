import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
const prisma = new PrismaClient();

export default async function getAccount(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id || id === "") {
      res.status(400).json({ error: "id is required" });
    }
    const account = await prisma.account.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!account) {
      res.status(404).json({ error: "Account not found" });
      return;
    }
    res.json(account);
    prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    prisma.$disconnect();
  }
}

export async function createAccount(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (typeof name !== "string" || name === "") {
      res.status(400).json({ error: "name is required" });
      return;
    }

    await prisma.account.create({
      data: {
        name,
      },
    });
    res.send("Account created successfully");
    prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    prisma.$disconnect();
  }
}

export async function deleteAccount(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.account.delete({
      where: {
        id: Number(id),
      },
    });
    res.send("Account deleted successfully");
    prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    prisma.$disconnect();
  }
}

export async function getAccounts(req: Request, res: Response) {
  try {
    const accounts = await prisma.account.findMany();
    res.json(accounts);
    prisma.$disconnect();
  } catch (error) {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  }
}

export async function updateAccount(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (typeof name !== "string" || name === "") {
      res.status(400).json({ error: "name is required" });
      return;
    }
    await prisma.account.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });
    res.send("Account updated successfully");
    prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    prisma.$disconnect();
  }
}
