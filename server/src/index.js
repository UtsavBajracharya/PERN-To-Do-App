const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db")


//middleware 
app.use(cors());
app.use(express.json());

//Routes 

const createdAt = new Date();
const formattedDate = createdAt.toISOString().split('T')[0];




// create a todo


app.post("/todos", async(req, res) => {
    try {
        const {description} = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );
        const formattedTodos = todos.rows.map(todo => ({
            ...todo,
            created_at: todo.created_at.toISOString().split('T')[0] // Format as YYYY-MM-DD
          }));
        
        res.json(newTodo.rows[0]);

          res.json(formattedTodos);
    } catch (err) {
        console.error(err.message);
    }

    
})


// get all todos

app


//update a todo


//Delete a todo

const port = 5000;

app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
})