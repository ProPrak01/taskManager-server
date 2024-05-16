// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://ph1010ishard:abcd@cluster0.pwk1gyn.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Define the Task model
const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  time: String,
});

const Task = mongoose.model('Task', taskSchema);
app.get("/",cors(),(req,res)=>{
  res.send("hello this is server");
})

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
  const { text, time } = req.body;
  const task = new Task({ text, completed: false, time });
  await task.save();
  res.send(task);
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { text, completed, time } = req.body;
  const task = await Task.findByIdAndUpdate(
    id,
    { text, completed, time },
    { new: true }
  );
  if (!task) return res.status(404).send('Task not found');
  res.send(task);
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) return res.status(404).send('Task not found');
  res.send(task);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
