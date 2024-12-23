import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EventDetailPage = () => {
  const { eventId } = useParams(); // Extract the event ID from the URL
  const [tasks, setTasks] = useState([]); // Store tasks related to the event
  const [attendees, setAttendees] = useState([]); // Store all attendees
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAttendeeModal, setShowAttendeeModal] = useState(false); // Show/Hide attendee modal
  const [selectedTaskId, setSelectedTaskId] = useState(""); // Store selected task for assignment
  const navigate = useNavigate();

  // Fetch tasks for the specific event
  useEffect(() => {
    const fetchTasksForEvent = async () => {
      try {
        const response = await axios.post(
          'http://localhost:4000/api/v1/admins/gettask',
          { eventId },
          { withCredentials: true }
        );

        if (response.data.success) {
          setTasks(response.data.data.formattedTasks); // Set tasks data
        } else {
          toast.error(response.data.message || "Failed to fetch tasks for this event.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasksForEvent();
  }, [eventId]);

  // Fetch all attendees for the event
  const fetchAttendees = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/admins/getallattendees',
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setAttendees(response.data.data.attendees); // Set attendees data
      } else {
        toast.error(response.data.message || "Failed to fetch attendees.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching attendees. Please try again.");
    }
  };

  // Open modal to assign an attendee to a task
  const openAssignModal = (taskId) => {
    console.log("Opening modal for taskId:", taskId); // Debugging - log taskId
    setSelectedTaskId(taskId); // Set the selected taskId
    setShowAttendeeModal(true);
    fetchAttendees(); // Fetch attendees when modal is opened
  };

  // Assign attendee to a task
  const assignAttendee = async (userId) => {
    console.log("Assigning attendee to task. TaskId:", selectedTaskId, "UserId:", userId); // Debugging - log taskId and userId
    if (!selectedTaskId) {
      toast.error("No task selected. Please try again.");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/admins/assignAttendee',
        { taskid: selectedTaskId, userid: userId },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Attendee assigned successfully!");
        // Refresh the task list to show updated attendee information
        const updatedTasks = tasks.map((task) => {
          if (task._id === selectedTaskId) {
            return { ...task, assignedAttendees: [...task.assignedAttendees, userId] };
          }
          return task;
        });
        setTasks(updatedTasks);
      } else {
        toast.error(response.data.message || "Failed to assign attendee.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error assigning attendee.");
    }
  };

  // Close the modal
  const closeAssignModal = () => {
    setShowAttendeeModal(false);
    setSelectedTaskId(null);
  };

  if (loading) {
    return <div className="text-center text-xl font-bold text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl font-bold text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Tasks for Event</h1>

        {/* Task Table */}
        {tasks.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Agenda</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Due Date</th>
                <th className="py-2 px-4 text-left">Assigned Attendees</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="border-t border-gray-200">
                  <td className="py-2 px-4">{task.agenda}</td>
                  <td className="py-2 px-4">{task.status}</td>
                  <td className="py-2 px-4">{task.lastdate}</td>
                  <td className="py-2 px-4">
                    {task.assignedAttendees && task.assignedAttendees.length > 0 ? (
                      <ul>
                        {task.assignedAttendees.map((attendee) => (
                          <li key={attendee._id} className="text-sm text-gray-600">
                            {attendee.fullName} ({attendee.email})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">No attendees assigned</p>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <button
                       onClick={() => {
                        console.log("Opening modal for task ID:", task._id);  // Debugging log
                        openAssignModal(task.taskId);  // Open modal for the task
                      }}// Open modal for the task
                      className="mt-2 bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
                    >
                      Assign Attendee
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No tasks found for this event.</p>
        )}

        <button
          onClick={() => navigate('/events')}
          className="mt-6 bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition duration-300"
        >
          Back to Events
        </button>
      </div>

      {/* Modal to show all attendees */}
      {showAttendeeModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
            <h2 className="text-xl font-semibold mb-4">Select an Attendee</h2>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Cover Image</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((attendee) => (
                  <tr key={attendee._id} className="border-t border-gray-200">
                    <td className="py-2 px-4">
                      <img
                        src={attendee.coverImage || '/default-cover.jpg'}
                        alt={attendee.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="py-2 px-4">{attendee.fullName}</td>
                    <td className="py-2 px-4">{attendee.email}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => assignAttendee(attendee._id)} // Assign attendee
                        className="bg-indigo-600 text-white py-1 px-4 rounded-md hover:bg-indigo-700"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeAssignModal}
                className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
