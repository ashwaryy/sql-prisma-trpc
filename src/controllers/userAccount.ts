import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

export async function addAccountToUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { accountId, roleId } = req.body;
    if (!id) {
      res.status(400).json({ error: "Missing user id" });
      return;
    }

    if (!accountId) {
      res.status(400).json({ error: "Missing account id" });
      return;
    }

    const dbAccountId = Number(accountId);
    const dbRoleId = roleId ? Number(roleId) : 1;

    await prisma.user_account.create({
      data: {
        user_id: id,
        account_id: dbAccountId,
        role_id: dbRoleId,
      },
    });

    res.send("Account added to user successfully");
    await prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    await prisma.$disconnect();
  }
}
