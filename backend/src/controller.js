import Todo from "./Todo.js";

export async function getAllTodo(req, res) {
    try {
        const todos = await Todo.find();
        console.log("Retrieved all notes from database");
        // Send the actual data back. res.json() is what reaches the frontend.
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error in retrieving todo's error: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json(todo);
    } catch (error) {
        console.error("Error in retrieving the selected todo. Error: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createTodo = async (req, res) => {
    try {
        const { note, content } = req.body;
        const newTodo = new Todo({ note, content });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        console.error("Error in creating new todo. Error: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { note, content } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { note, content },
            { new: true, runValidators: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json(updatedTodo);
    } catch (error) {
        console.error("Error in updating the selected todo. Error: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "Deleted selected todo" });
    } catch (error) {
        console.error("Error in deleting the selected todo. Error: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
