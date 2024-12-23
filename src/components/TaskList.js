import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskList = ({ eventId }) => {
  const [tasks, setTasks] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [assignedAttendees, setAssignedAttendees] = useState({});
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Fetch tasks for the event
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.post("http://localhost:4000/api/v1/gettask", { eventId });
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchAttendees = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/attendees"); // Example URL
        setAttendees(response.data.attendees);
      } catch (error) {
        console.error("Error fetching attendees:", error);
      }
    };

    fetchTasks();
    fetchAttendees();
  }, [eventId]);

  // Handle task assignment
  const handleAssignAttendee = async (taskId, userId) => {
    try {
      const response = await axios.post("http://localhost:4000/api/v1/assignAttendee", { taskid: taskId, userid: userId });
      setAssignedAttendees((prevState) => ({
        ...prevState,
        [taskId]: userId,
      }));
      alert(response.data.message);  // Show success message
    } catch (error) {
      console.error("Error assigning attendee:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl">Tasks for Event</h2>
      <div className="mt-4">
        {tasks.map((task) => (
          <div key={task._id} className="border-b p-2">
            <h3 className="font-bold">{task.agenda}</h3>
            <p>Status: {task.status}</p>
            {task.assingnedAttendees ? (
              <p>Assigned: {task.assingnedAttendees.name}</p>
            ) : (
              <button
                onClick={() => setSelectedTaskId(task._id)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Assign Attendee
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal to show the list of attendees to assign */}
      {selectedTaskId && (
        <div className="modal">
          <h3>Select Attendee</h3>
          <ul>
            {attendees.map((attendee) => (
              <li key={attendee._id}>
                <button
                  onClick={() => handleAssignAttendee(selectedTaskId, attendee._id)}
                  className="py-2 px-4 bg-green-500 text-white rounded-md"
                >
                  {attendee.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskList;
