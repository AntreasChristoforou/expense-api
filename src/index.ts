import express from "express";
const app = express();
const PORT = 3000;

type Expense = {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
};





const expenses: Expense[] = [
    { "id": 1 , "name" : "Coffee", "amount" : 2.5, "category": "Drink", "date" : "2026-10-17" },
    { "id": 2 , "name" : "Supermarket", "amount" : 60, "category": "Food","date" : "2026-10-17"},
    { "id": 3 , "name" : "Bar", "amount" : 15, "category": "Life","date" : "2026-10-17"}

];

app.get("/api/health", (req,res) =>{
    res.json({ok: true});
} );

app.get("/api/expenses", (req,res) =>{
    res.json(expenses);
} );


app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});