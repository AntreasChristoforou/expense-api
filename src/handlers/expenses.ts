import type { Request, Response } from "express";
import { getExpense , listExpenses , deleteExpense , createExpense , updateExpense, getTotals } from "../services/expenses.js";
import { expenseSchema, updateSchema,formatIssues} from "../schemas/expense.js";

export function getExpenseHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Id must be a number" });
  }

  const expense = getExpense(id);               
  if (!expense) {
    return res.status(404).json({ error: "Expense not found" });
  }

  res.json(expense);
}

export function listExpensesHandler(req: Request , res:Response){
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const list = listExpenses(category);
    return res.json(list);
    
    
}

export function deleteExpenseHandler(req: Request, res: Response){
    const id = Number(req.params.id);
    if(Number.isNaN(id)){
        return res.status(400).json({error: "Id must be a number" });
    }
    const deleted = deleteExpense(id);
    if(!deleted){
        return res.status(404).json({ error: "Expense not found" });
    }
    res.status(204).send();
}

export function createExpenseHandler(req: Request, res: Response){
    const result = expenseSchema.safeParse(req.body);

     if (!result.success) {
    return res.status(400).json({
    error: "Invalid expense",
    details: formatIssues(result.error),   
    });
  }
  const newExpense = createExpense(result.data);
  return res.status(201).json(newExpense);
}

export function updateExpenseHandler(req: Request, res: Response){
    
    const result = updateSchema.safeParse(req.body)

    if (!result.success) {
    return res.status(400).json({
    error: "Invalid expense",
    details: formatIssues(result.error),     
    });
  }

    const id = Number(req.params.id);

    if(Number.isNaN(id)){
        return res.status(400).json({error: "Id must be a number" });
        
    }

   
    const updated = updateExpense(id, result.data);

    if(!updated){
        return res.status(404).json({ error: "Expense not found" }); 
    }

    return res.json(updated);
}

export function getTotalsHandler(req: Request , res: Response){
    return res.json(getTotals());
}