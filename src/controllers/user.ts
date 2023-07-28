import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function createUser(req: Request, res: Response) {
  try {
    const { first_name, email, last_name, default_report_id } = req.body;
    await prisma.user.create({
      data: {
        id: uuidv4(),
        first_name,
        last_name,
        sysadmin: false,
        default_report_id,
        email,
      },
    });
    res.send("User created successfully");
    await prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    await prisma.$disconnect();
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: {
        id,
      },
    });
    res.send("User deleted successfully");
    await prisma.$disconnect();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    await prisma.$disconnect();
  }
}

export async function getUsers(req: Request, res: Response) {
  const { accounts } = req.query;

  try {
    const users = await prisma.user.findMany();

    if (accounts === "true") {
      const userAccounts = await prisma.user_account.findMany();
      const accounts = await prisma.account.findMany();
      const usersWithAccounts = users.map((user) => {
        const allAccounts = userAccounts.filter((userAccount) => userAccount.user_id === user.id);
        const accountIds = allAccounts.map((userAccount) => userAccount.account_id);
        const userAccountsDetails = accounts.filter((account) => accountIds.includes(account.id));

        return {
          ...user,
          accounts: userAccountsDetails,
        };
      });
      res.json(usersWithAccounts);
      return;
    }

    res.json(users);

    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing user id" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    const userAccounts = await prisma.user_account.findMany({
      where: {
        user_id: id,
      },
    });

    const accounts = await prisma.account.findMany({
      where: {
        id: {
          in: userAccounts.map((userAccount) => userAccount.account_id),
        },
      },
    });

    const userWithAccounts = {
      ...user,
      accounts,
    };

    res.json(userWithAccounts);
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
