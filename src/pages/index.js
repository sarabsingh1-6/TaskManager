import { useState, useEffect } from 'react';
import '../styles/globals.css';

const AddTaskForm = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask({ id: Date.now(), title, description, priority, completed: false });
    setTitle("");
    setDescription("");
    setPriority("low");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Task Title" 
        required 
      />
      
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Task Description" 
        required 
      />

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
};

const TaskList = ({ tasks, toggleComplete, deleteTask, editTask }) => {
  const [isEditing, setIsEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("low");

  const handleEdit = (task) => {
    setIsEditing(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
  };

  const saveEdit = (task) => {
    editTask(task.id, { ...task, title: editTitle, description: editDescription, priority: editPriority });
    setIsEditing(null);
  };

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li 
          key={task.id} 
          className={`task-item ${task.completed ? 'completed' : ''} ${task.priority}`}
        >
          {isEditing === task.id ? (
            <div>
              <input 
                type="text" 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)} 
              />
              <textarea 
                value={editDescription} 
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button onClick={() => saveEdit(task)}>Save</button>
              <button onClick={() => setIsEditing(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <h3>{task.title} <span>({task.priority})</span></h3>
              <p>{task.description}</p>
              <div className="task-buttons">
                <button onClick={() => toggleComplete(task.id)}>
                  {task.completed ? "Mark as Incomplete" : "Mark as Completed"}
                </button>
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const editTask = (id, updatedTask) => {
    const updatedTasks = tasks.map(task => task.id === id ? updatedTask : task);
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const sortTasksByPriority = () => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sortedTasks = [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    setTasks(sortedTasks);
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="task-manager">
      <h1>Task Manager</h1>

      <input 
        type="text" 
        placeholder="Search tasks..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="search-bar"
      />

      <button onClick={sortTasksByPriority}>Sort by Priority</button>

      <TaskList 
        tasks={filteredTasks} 
        toggleComplete={toggleComplete} 
        deleteTask={deleteTask} 
        editTask={editTask} 
      />

      <AddTaskForm addTask={addTask} />
    </div>
  );
};

export default Home;
