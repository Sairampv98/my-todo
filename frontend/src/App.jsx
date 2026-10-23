import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const API = "http://localhost:8001/todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [content, setContent] = useState("");

  // Which todo is being viewed (full details) and which one is being edited.
  const [viewingId, setViewingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState("");
  const [editContent, setEditContent] = useState("");

  // Read - GET all todos from the API and store them in state.
  const fetchTodos = async () => {
    try {
      const res = await axios.get(API);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err.message);
    }
  };

  // useEffect with an empty dependency array runs once, after the first render.
  useEffect(() => {
    fetchTodos();
  }, []);

  // Create - POST a new todo, then refresh the list.
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      await axios.post(API, { note: newTodo, content });
      setNewTodo("");
      setContent("");
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err.message);
    }
  };

  // Open the edit form for ONE todo, pre-filled with that todo's own values.
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditNote(todo.note);
    setEditContent(todo.content || "");
    setViewingId(null);
  };

  // Close the edit form without saving.
  const cancelEdit = () => {
    setEditingId(null);
    setEditNote("");
    setEditContent("");
  };

  // Update - PUT the edited note AND content back to the server.
  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editNote.trim()) return;
    try {
      await axios.put(`${API}/${editingId}`, {
        note: editNote,
        content: editContent,
      });
      cancelEdit();
      fetchTodos();
    } catch (err) {
      console.error("Error updating todo:", err.message);
    }
  };

  // Show / hide the full details of one todo.
  const toggleView = (id) => {
    setViewingId(viewingId === id ? null : id);
  };

  // Delete - DELETE by id, then refresh the list.
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err.message);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <h1 className="text-center mb-4">My Todo App</h1>

      <form onSubmit={addTodo} className="card p-3 mb-4 shadow-sm">
        <div className="mb-2">
          <label className="form-label">Note</label>
          <input
            type="text"
            className="form-control"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows="2"
            placeholder="Add a few details (optional)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Add Todo
        </button>
      </form>

      <ul className="list-group shadow-sm">
        {todos.map((todo) => {
          const isViewing = viewingId === todo._id;
          const isEditing = editingId === todo._id;

          return (
            <li key={todo._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1 me-3">
                  <strong>{todo.note}</strong>
                  {todo.content && !isEditing && !isViewing && (
                    <p className="mb-0 mt-1 todo-preview">{todo.content}</p>
                  )}
                </div>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => toggleView(todo._id)}
                  >
                    {isViewing ? "Hide" : "View"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => startEdit(todo)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Full details - the readable version of the whole todo. */}
              {isViewing && (
                <div className="todo-details mt-3">
                  <div className="mb-2">
                    <span className="fw-semibold">Note: </span>
                    <span className="text-break">{todo.note}</span>
                  </div>
                  <div>
                    <span className="fw-semibold">Content: </span>
                    {todo.content ? (
                      <span className="text-break">{todo.content}</span>
                    ) : (
                      <span className="fst-italic">No content added for this todo.</span>
                    )}
                  </div>
                </div>
              )}

              {/* Edit form - both fields are editable here. */}
              {isEditing && (
                <form onSubmit={saveEdit} className="todo-details mt-3 p-3">
                  <div className="mb-2">
                    <label className="form-label">Note</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-sm btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </li>
          );
        })}
        {todos.length === 0 && (
          <li className="list-group-item text-center text-muted">
            No todos yet. Add your first one above.
          </li>
        )}
      </ul>
    </div>
  );
}
