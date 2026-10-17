import express from "express";
const app = express();
app.use(express.json());
const PORT = 3000;

type Expense = {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
};





let expenses: Expense[] = [
    { "id": 1 , "name" : "Coffee", "amount" : 2.5, "category": "Drink", "date" : "2026-10-17" },
    { "id": 2 , "name" : "Supermarket", "amount" : 60, "category": "Food","date" : "2026-10-17"},
    { "id": 3 , "name" : "Bar", "amount" : 15, "category": "Life","date" : "2026-10-17"}

];

let nextId = 4;

app.get("/api/health", (req,res) =>{
    res.json({ok: true});
} );

app.get("/api/expenses", (req,res) =>{
    res.json(expenses);
} );

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
  const newExpense: Expense = {
    id: nextId++,                
    name: req.body.name,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
  };

  expenses = [...expenses, newExpense];  

  res.status(201).json(newExpense);
});



app.patch("/api/expenses/:id" , (req,res) =>{
    const id = Number(req.params.id);

    if(Number.isNaN(id)){
        return res.status(400).json({error: "Id must be a number"});
    }
    const expense = expenses.find(e => e.id === id);

    if(!expense){
        return res.status(404).json({error: "Expense not found"});
    }
    const updated = {...expense , ...req.body, id };
    
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

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});