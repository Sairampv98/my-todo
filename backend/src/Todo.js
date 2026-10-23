import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    note: {
        type:String,
        required:true
    },
    content:{
        type:String
    }
});

const Todo = mongoose.model("Todo", todoSchema, "todo");

export default Todo;