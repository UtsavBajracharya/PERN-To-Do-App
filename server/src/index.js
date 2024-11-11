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
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});


// get all todos

app.get("/todos", async(req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");

        // Format `created_at` to `YYYY-MM-DD`
        const formattedTodos = allTodos.rows.map(todo => ({
            ...todo,
            created_at: todo.created_at.toISOString().split("T")[0],
        }));
        res.json(formattedTodos);
    } catch (err) {
        console.error(err.message);
    }
});

// get todos by id
app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

         // Check if the todo was found
        if (todo.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        // Format `created_at` to `YYYY-MM-DD`
        const formattedTodo = {
            ...todo.rows[0],
            created_at: todo.rows[0].created_at.toISOString().split("T")[0]
        };

        res.json(formattedTodo);
        
    } catch (error) {
        console.error(err.message);
    }

});

//update a todo

app.put("/todos/:id", async(req,res) =>  {
    try {
        const { id } = req.params;
        const { description, completed } = req.body;
        // Ensure `completed` is a boolean
        const completedBool = completed === true || completed === "true" || completed === 1 || completed === "1";

        // Update both description and completed status
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1, completed = $2 WHERE todo_id = $3",
            [description, completedBool, id]
        );

        res.json("Todo was updated");   
    } catch (err) {
        console.error(err.message);
    }
});


//Delete a todo


// Start a server
const port = 5000;

app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
})