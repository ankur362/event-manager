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
  const [selectedTaskId, setSelectedTaskId] = useState(''); // Store selected task for assignment
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
          toast.error(response.data.message || 'Failed to fetch tasks for this event.');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching tasks. Please try again later.');
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
        toast.error(response.data.message || 'Failed to fetch attendees.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching attendees. Please try again.');
    }
  };

  // Open modal to assign an attendee to a task
  const openAssignModal = (taskId) => {
    setSelectedTaskId(taskId); // Set the selected taskId
    setShowAttendeeModal(true);
    fetchAttendees(); // Fetch attendees when modal is opened
  };

  // Close the modal
  const closeAssignModal = () => {
    setShowAttendeeModal(false);
    setSelectedTaskId(null);
  };

  // Assign attendee to a task
  const assignAttendee = async (userId) => {
    if (!selectedTaskId) {
      toast.error('No task selected. Please try again.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/admins/assignAttendee',
        { taskid: selectedTaskId, userid: userId },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success('Attendee assigned successfully!');
        // Refresh the task list to show updated attendee information
        const updatedTasks = tasks.map((task) => {
          if (task._id === selectedTaskId) {
            task.assignedTo = userId;
          }
          return task;
        });
        setTasks(updatedTasks);
        closeAssignModal();
      } else {
        toast.error('Failed to assign attendee.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error assigning attendee. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Event Details</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">Task</th>
              <th className="p-3 border">Assigned To</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.taskId} className="hover:bg-gray-100">
                <td className="p-3 border">{task.agenda}</td>
                <td className="p-3 border">
                  {task.assignedAttendees ? task.assignedAttendees.fullName : 'Not assigned yet'}
                </td>
                <td className="p-3 border">
                  {task.assignedAttendees?.fullName ? (
                    <span className="text-green-600">Assigned</span>
                  ) : (
                    <button
                      onClick={() => openAssignModal(task.taskId)}
                      className="bg-indigo-600 text-white py-1 px-3 rounded-md hover:bg-indigo-700 transition duration-200"
                    >
                      Assign
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAttendeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h3 className="text-lg font-bold mb-4">Select an Attendee</h3>
            <ul className="space-y-2">
              {attendees.map((attendee) => (
                <li key={attendee._id}>
                  <button
                    onClick={() => assignAttendee(attendee._id)}
                    className="w-full flex items-center gap-1 text-left bg-gray-100 p-2 rounded hover:bg-gray-200 transition duration-150"
                  >
                    <img src={attendee.coverImage} className='size-[20px] rounded-full' alt="" />
                    {attendee.fullName}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={closeAssignModal}
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
