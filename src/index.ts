import express, { type ErrorRequestHandler } from "express";
import { expensesRouter } from "./routes/expenses.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
app.use(express.json());




app.get("/api/health", (req,res) =>{
    res.json({ok: true});
} );
app.use("/api/expenses", expensesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
 
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }

  
  console.error(err);                                   
  res.status(500).json({ error: "Something went wrong" });  
};



app.use(errorHandler);
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});


