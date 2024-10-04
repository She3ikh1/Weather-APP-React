
const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");

app.use(express.json());
app.use(cors()); 

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "sys",
});
db.connect((err) => {
  if (!err) {
    console.log("Connected To Database successfully");
  } else {
    console.log("Failed to connect");
  }
});
app.post("/new-task", (req, res) => {
  const q = "INSERT INTO todos (task, createdAt, status) VALUES (?, ?, ?)";
  db.query(q, [req.body.task, new Date(), "active"], (err) => {
    if (err) {
      return res.status(500).send("Failed to save todo");
    }

    // Fetch the updated todos list after adding the new task
    const getTodosQuery = "SELECT * FROM todos";
    db.query(getTodosQuery, (error, todos) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Failed to retrieve updated todo list");
      }
      res.status(200).send(todos); // Return the updated list of todos
    });
  });
});
app.get("/read-tasks", (req, res) => {
  const q = "select * from todos";
  db.query(q, (err, result) => {
    if (err) {
      res.status(500).send("Failed to read task");
    } else {
      res.status(200).json(result);
      // res.status(200).send('Read task from dB successfully');
      // res.send(result);
    }
  });
});
app.post("/update-task", (req, res) => {
  const { updatedId, updatedtask } = req.body;

  // Check if updatedtask is not empty or null
  if (!updatedtask || updatedtask.trim() === "") {
    return res.status(400).send("Task cannot be null or empty");
  }

  const q = "UPDATE todos SET task = ? WHERE id = ?";
  db.query(q, [req.body.task,req.body.updatedId] ,(err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Failed to update task");
    } else {
      console.log("Task updated");
      db.query('select* from todos',(e,r)=>{
        if(e){
          console.log(e);
        }else{
          res.send(r);
        }
      })
    }
  });
});
app.post('/delete-task',(req,res)=>{
  const q = 'delete from todos where id = ? ';
  db.query(q,[req.body.id],(err,result)=>{
    if(err){
      console.log("Failed to deleted");
    }else{
      console.log('Deleted successfully');
      db.query('select * from todos',(e,newList)=>{
        res.send(newList);
      })
    }
  })
})

app.post('/complete-task',(req,res)=>{
  const q='update todo set status = ?  where id = ?'
  db.query(q,['completed',req.body.id],(err,result)=>{
      if(result){
        db.query('select * from todos',(e,newList)=>{
          res.send(newList)
        })
      }

  })
})
app.listen(5000, () => {
  console.log("server started");
});
