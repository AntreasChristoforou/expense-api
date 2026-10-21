import { Router } from "express";
import { listExpensesHandler, updateExpenseHandler, createExpenseHandler,deleteExpenseHandler,getTotalsHandler,getExpenseHandler } from "../handlers/expenses.js";

export const expensesRouter = Router();

expensesRouter.get("/", listExpensesHandler);
expensesRouter.get("/totals", getTotalsHandler);     
expensesRouter.get("/:id", getExpenseHandler);
expensesRouter.post("/", createExpenseHandler);
expensesRouter.patch("/:id", updateExpenseHandler);
expensesRouter.delete("/:id", deleteExpenseHandler);