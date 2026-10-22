import { test, expect, beforeEach } from "vitest";
import { createExpense, getExpense, deleteExpense, getTotals, resetExpenses } from "./expenses.js";
import type { NewExpense } from "../schemas/expense.js";

beforeEach(() => {
  resetExpenses();       // every test starts from the same 3 expenses
});

test("getExpense returns undefined for an id that doesn't exist", () => {
  expect(getExpense(99)).toBe(undefined);
});

test("getExpense returns expense of an id", () => {
  const name = "Coffee";  
  expect(getExpense(1)?.name).toBe(name);
});

test("check the create function", () => {
    const newExpense: NewExpense = {
        "name": "Croissand" , "amount" : 3, "category": "Food", "date" : "2026-10-23" 
    };
    const created = createExpense(newExpense);
    expect(created.id).toBe(4);
    expect(getExpense(created.id)).toEqual(created);
});

test("Check if delete function works", () => {
    expect(deleteExpense(1)).toBe(true);
    expect(getExpense(1)).toBe(undefined);
    expect(deleteExpense(1)).toBe(false);
});

test("totals", () => {
    const totals = { Drink: 2.5, Food: 60, Life: 15 };

    expect(getTotals()).toEqual(totals);
});

test("Adds up the totals after a created expense", () => {
    const newExpense: NewExpense = {
        "name": "Croissand" , "amount" : 10, "category": "Food", "date" : "2026-10-23" 
    };
    
    createExpense(newExpense);
    expect(getTotals().Food).toBe(70);
});

test("a new expense never reuses a deleted id", () => {
 
  deleteExpense(2);

  
  const newExpense: NewExpense = { name: "Lunch", amount: 10, category: "Food", date: "2026-10-22" };
  const created = createExpense(newExpense);

  
  expect(created.id).toBe(4);
});