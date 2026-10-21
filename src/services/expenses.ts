import type { Expense, NewExpense, UpdateExpense } from "../schemas/expense.js";

const seed: Expense[] = [ 
    { "id": 1 , "name" : "Coffee", "amount" : 2.5, "category": "Drink", "date" : "2026-10-17" },
    { "id": 2 , "name" : "Supermarket", "amount" : 60, "category": "Food","date" : "2026-10-17"},
    { "id": 3 , "name" : "Bar", "amount" : 15, "category": "Life","date" : "2026-10-17"}
 ];
let expenses: Expense[] = [...seed];
let nextId = 4;

export function resetExpenses() {
  expenses = [...seed];
  nextId = 4;
}

export function getExpense(id: number): Expense | undefined {
  return expenses.find(e => e.id === id);
}

export function listExpenses(category?: string): Expense[]{

    if(!category){
        return expenses;
    }
    
    return expenses.filter(e => e.category === category);
    
    
}

export function createExpense(data: NewExpense): Expense{
    const newExpense: Expense = {
    id: nextId++,                
    ...data,
  };
  expenses = [...expenses , newExpense];
  return newExpense;
}

export function updateExpense(id: number, changes : UpdateExpense): Expense | undefined{
    const expense = expenses.find(e=> e.id === id);
    if(!expense){
        return undefined;
    }
    const updated = {...expense , ...changes, id };

    expenses = expenses.map(e => e.id === id ? updated : e);

    return updated;
}

export function deleteExpense(id: number): boolean{
    if(!expenses.find(e => e.id === id)){
        return false;
    }

    expenses = expenses.filter(e => e.id !== id);
    return true;
}

export function getTotals(): Record<string, number>{
    const totals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
    }, {} as Record<string, number>);
    return totals;
}