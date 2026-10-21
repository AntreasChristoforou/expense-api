import {z} from "zod";

export const expenseSchema = z.object({
  
  name: z.string().min(1),
  amount: z.number().positive(),
  category: z.enum(["Food", "Drink", "Life", "Travel", "Bills"]),
  date: z.iso.date(),
});

export const updateSchema = expenseSchema.partial();
export type NewExpense = z.infer<typeof expenseSchema>;
export type Expense = NewExpense & {id: number};
export type UpdateExpense = z.infer<typeof updateSchema>;

export function formatIssues(error: z.ZodError) {
  return error.issues.map(i => ({ field: i.path.join("."), message: i.message }));
}

