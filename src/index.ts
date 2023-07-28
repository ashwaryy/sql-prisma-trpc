//express server
import express from "express";
import { Request, Response } from "express";
import { deleteUserDefaultReport, getUserDefaultReport, setUserDefaultReport } from "./controllers/userDefaultReport";
import morgan from "morgan";
import createReport, { getReports, getReport, updateReport, deleteReport } from "./controllers/report";
import getAccount, { createAccount, deleteAccount, getAccounts, updateAccount } from "./controllers/account";
import { createUser, deleteUser, getUser, getUsers } from "./controllers/user";
import { addAccountToUser } from "./controllers/userAccount";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.route("/users").get(getUsers);
app.route("/user/:id?").get(getUser).post(createUser).delete(deleteUser);
app.route("/user/:id/default_report/:reportId?").get(getUserDefaultReport).put(setUserDefaultReport).delete(deleteUserDefaultReport);
app.route("/reports").get(getReports);
app.route("/report/:id?").get(getReport).post(createReport).patch(updateReport).delete(deleteReport);
app.route("/accounts").get(getAccounts);
app.route("/account/:id?").get(getAccount).post(createAccount).patch(updateAccount).delete(deleteAccount);
app.route("/user/:id/account/:accountId?").post(addAccountToUser);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
