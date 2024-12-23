import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post(
          'http://localhost:4000/api/v1/admins/getEvent', 
          {},
          { withCredentials: true }
        );

        console.log('API Response:', response.data);

        // Update events array based on the new API response structure
        if (response.data.success && Array.isArray(response.data.data)) {
          setEvents(response.data.data);  // Directly set the events from the `data` array
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Error fetching events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEventClick = () => {
    navigate('/dashboard/events/add'); // Navigate to the add event form
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.post(
        'http://localhost:4000/api/v1/admins/deleteEvent',
        { eventid: eventId },
        { withCredentials: true }
      );
      toast.success("Event deleted successfully!");
      setEvents(events.filter(event => event._id !== eventId)); // Remove deleted event from the list
    } catch (error) {
      toast.error("Failed to delete event.");
      console.error(error);
    }
  };

  // Calculate task completion percentage
  const calculateCompletionPercentage = (event) => {
    const totalTasks = Array.isArray(event?.task) ? event.task.length : 0; // Ensure task is an array
    const completedTasks = Array.isArray(event?.taskCompleted) ? event.taskCompleted.length : 0; // Ensure taskCompleted is an array
    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  };

  if (loading) {
    return <div className="text-center text-xl font-bold text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl font-bold text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Upcoming Events</h1>

        {/* Button to navigate to AddEventForm */}
        <button
          onClick={handleAddEventClick}
          className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-300 mb-6"
        >
          Add New Event
        </button>

        {/* Display events if they are available */}
        {events.length === 0 ? (
          <div className="text-center text-lg text-gray-600">No events available at the moment.</div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {events.map((event) => (
              <div
                key={event?._id}  // Use optional chaining to prevent errors if event is null/undefined
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 w-[25%]" 
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {event?.title || 'Event Title Unavailable'}  {/* Fallback if title is undefined */}
                  </h2>
                  <p className="text-lg text-gray-600 mt-2">
                    {event?.description || 'No description available'}  {/* Fallback if description is undefined */}
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Attendees: {event?.totalAttendees || 'No attendees'}</p>
                    <p>Location: {event?.location || 'Location not available'}</p>
                    <p>Date: {event?.date || 'Date not available'}</p>
                  </div>

                  {/* Display task completion percentage as a progress bar */}
                  <div className="mt-4">
                    <p className="font-semibold text-gray-700">
                      Task Completion: {calculateCompletionPercentage(event)}%
                    </p>
                    <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${calculateCompletionPercentage(event)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Buttons for View, Edit, and Delete */}
                <div className="mt-4 flex space-x-4">
                  <Link
                    to={`/dashboard/event/${event?._id}`}  // Use optional chaining
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    View Details
                  </Link>

                  <Link
                    to={`/dashboard/events/update/${event?._id}`}  // Use optional chaining
                    className="text-yellow-600 hover:text-yellow-800 font-semibold"
                  >
                    Update
                  </Link>

                  <button
                    onClick={() => handleDeleteEvent(event?._id)}  // Use optional chaining
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;
