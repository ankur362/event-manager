import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]); // Initialize tasks as an empty array
  const [editTask, setEditTask] = useState(null);
  const [newTaskAgenda, setNewTaskAgenda] = useState("");
  const [newTaskLastDate, setNewTaskLastDate] = useState("");
  const navigate = useNavigate();

  // Fetch all tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/admins/getTask",
        { withCredentials: true }
      );
      console.log(response.data); // Inspect the API response
      setTasks(Array.isArray(response.data.data?.tasks) ? response.data.data.tasks : []);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data?.message || error.message);
      setTasks([]); // Set tasks to an empty array in case of an error
    }
  };

  // Update a task
  const handleUpdateTask = async (taskId, agenda, lastDate) => {
    try {
      await axios.post(
        "http://localhost:4000/api/v1/admins/updateTask",
        { taskid: taskId, agenda, lastdate: lastDate },
        { withCredentials: true }
      );
      fetchTasks(); // Refresh tasks after update
      setEditTask(null); // Close the edit modal
    } catch (error) {
      console.error("Error updating task:", error.response?.data?.message || error.message);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.post(
        "http://localhost:4000/api/v1/admins/deleteTask",
        { taskid: taskId },
        { withCredentials: true }
      );
      fetchTasks(); // Refresh tasks after deletion
    } catch (error) {
      console.error("Error deleting task:", error.response?.data?.message || error.message);
    }
  };

  // Navigate to Add Task Page
  const handleAddTaskClick = () => {
    navigate("/dashboard/tasks/add-task"); // Navigate to the add task page
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700">Tasks</h1>

      <button
        onClick={handleAddTaskClick}
        className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
      >
        Add Task
      </button>

      <div className="mt-6 flex flex-wrap gap-4">
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded shadow mb-4">
              <h2 className="text-xl font-semibold">{task.agenda}</h2>
              <p>Status: {task.status}</p>
              <p>Last Date: {task.lastdate}</p>
              <p>
                Related Event:{" "}
                {typeof task.relatedEvent === "object"
                  ? task.relatedEvent?.name
                  : task.relatedEvent}
              </p>

              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => setEditTask(task)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit Task
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete Task
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No tasks available.</p>
        )}
      </div>

      {/* Edit Task Modal */}
      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl font-semibold">Edit Task</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateTask(editTask._id, newTaskAgenda, newTaskLastDate);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Agenda
                </label>
                <input
                  type="text"
                  value={newTaskAgenda}
                  onChange={(e) => setNewTaskAgenda(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Last Date
                </label>
                <input
                  type="date"
                  value={newTaskLastDate}
                  onChange={(e) => setNewTaskLastDate(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditTask(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage;
