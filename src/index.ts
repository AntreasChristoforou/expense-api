import express, { type ErrorRequestHandler } from "express";
import { z } from "zod";

const app = express();
app.use(express.json());
const PORT = 3000;

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
 
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }

  
  console.error(err);                                   
  res.status(500).json({ error: "Something went wrong" });  
};


const expenseSchema = z.object({
  
  name: z.string().min(1),
  amount: z.number().positive(),
  category: z.enum(["Food", "Drink", "Life", "Travel", "Bills"]),
  date: z.iso.date(),
});

const updateSchema = expenseSchema.partial();
type NewExpense = z.infer<typeof expenseSchema>;
type Expense = NewExpense & {id: number};



let expenses: Expense[] = [
    { "id": 1 , "name" : "Coffee", "amount" : 2.5, "category": "Drink", "date" : "2026-10-17" },
    { "id": 2 , "name" : "Supermarket", "amount" : 60, "category": "Food","date" : "2026-10-17"},
    { "id": 3 , "name" : "Bar", "amount" : 15, "category": "Life","date" : "2026-10-17"}

];

let nextId = 4;

app.get("/api/health", (req,res) =>{
    res.json({ok: true});
} );


app.get("/api/expenses", (req, res) => {
  

  const category = req.query.category;
  
  if (typeof category === "string") {
    
    return res.json(expenses.filter(e => e.category === category));
  }

  res.json(expenses);  
});

app.get("/api/expenses/totals", (req,res) => {

    const totals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
    }, {} as Record<string, number>);
    res.json(totals);
});


app.get("/api/expenses/:id", (req,res) =>{
    const id = Number(req.params.id);



    if(Number.isNaN(id)){
        return res.status(400).json({error: "Id must be a number"});
    }

    const expense = expenses.find(e => e.id === id);

    if(!expense){
        return res.status(404).json({error: "Expense not found"});
    }
    res.json(expense);
});

app.post("/api/expenses", (req, res) => {
  const result = expenseSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid expense",
      details: result.error.issues.map(i => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const newExpense: Expense = {
    id: nextId++,                
    ...result.data,
  };

  expenses = [...expenses, newExpense];  

  res.status(201).json(newExpense);
});



app.patch("/api/expenses/:id" , (req,res) =>{
    const result = updateSchema.safeParse(req.body)

    if (!result.success) {
    return res.status(400).json({
      error: "Invalid expense",
      details: result.error.issues.map(i => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }
    const id = Number(req.params.id);

    if(Number.isNaN(id)){
        return res.status(400).json({error: "Id must be a number"});
    }
    const expense = expenses.find(e => e.id === id);

    if(!expense){
        return res.status(404).json({error: "Expense not found"});
    }
    const updated = {...expense , ...result.data, id };
    
    expenses = expenses.map(e => e.id === id ? updated : e);
    
     res.json(updated);
   
});

app.delete("/api/expenses/:id", (req,res)=>{

    const id = Number(req.params.id);
    

    if(Number.isNaN(id)){
        return res.status(400).json({ error:"Id must be a number" });
    }
    if(!expenses.find(e => e.id === id)){
        return res.status(404).json({error: "Expense not found"});
    }

    expenses = expenses.filter(e => e.id !== id);
    res.status(204).send();
})

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});