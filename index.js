// index.js

const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./todo');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a To-Do Item API - POST /api/todo
app.post('/api/todo', async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.create({ title, description });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a to-do item' });
  }
});

// Get All To-Do Items API - GET /api/todo
app.get('/api/todo', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve to-do items' });
  }
});

// Get a Single To-Do Item API - GET /api/todo/:id
app.get('/api/todo/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'To-do item not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the to-do item' });
  }
});

// Update a To-Do Item API - PUT /api/todo/:id
app.put('/api/todo/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: 'To-do item not found' });
    }
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the to-do item' });
  }
});

// Delete a To-Do Item API - DELETE /api/todo/:id
app.delete('/api/todo/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndRemove(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ error: 'To-do item not found' });
    }
    res.json({ message: 'To-do item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the to-do item' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
