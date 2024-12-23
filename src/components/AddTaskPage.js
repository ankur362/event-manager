import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AddTaskPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [agenda, setAgenda] = useState("");
  const [lastDate, setLastDate] = useState("");
  
  

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/v1/admins/getEvent",
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          setEvents(response.data.data);
        } else {
          toast.error(response.data.message || "Failed to fetch events.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching events.");
      }
    };

    fetchEvents();
  }, []);

  // Handle form submission to create a task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEventId || !agenda || !lastDate) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/admins/createTask",
        { eventid: selectedEventId, agenda, lastdate: lastDate },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Task successfully created!");
        setAgenda("");
        setLastDate("");
        setSelectedEventId(null);
      } else {
        toast.error(response.data.message || "Failed to create task.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating task.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Add Task</h1>
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Select an Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {events.map((event) => (
            <div
              key={event._id}
              className={`p-4 border rounded ${
                selectedEventId === event._id ? "border-indigo-500" : "border-gray-300"
              }`}
              onClick={() => setSelectedEventId(event._id)}
            >
              <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500">
                <strong>Date:</strong> {event.date}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Location:</strong> {event.location}
              </p>
            </div>
          ))}
        </div>
      </div>

      {selectedEventId && (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Task Details</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="agenda">
              Agenda
            </label>
            <input
              type="text"
              id="agenda"
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter task agenda"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="lastDate">
              Last Date
            </label>
            <input
              type="date"
              id="lastDate"
              value={lastDate}
              onChange={(e) => setLastDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
          >
            Create Task
          </button>
        </form>
      )}
    </div>
  );
};

export default AddTaskPage;
