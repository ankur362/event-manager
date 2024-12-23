import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateEventForm = () => {
  const { eventId } = useParams(); // Get event ID from URL
  const [eventDetails, setEventDetails] = useState({
    name: '',
    location: '',
    description: '',
    date: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch existing event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.post(
          'http://localhost:4000/api/v1/admins/getevent', // Create an API if not exists
          { eventid: eventId },
          { withCredentials: true }
        );
        if (response.data.success) {
          const event = response.data.data; // Adjust according to the API response structure
          setEventDetails({
            name: event.name || '',
            location: event.location || '',
            description: event.description || '',
            date: event.date || '',
          });
        } else {
          toast.error(response.data.message || 'Failed to fetch event details.');
        }
      } catch (error) {
        console.error(error);
        setError('Error fetching event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/admins/updateEvent',
        { eventid: eventId, ...eventDetails },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Event updated successfully!');
        navigate('/events'); // Navigate back to the events page
      } else {
        toast.error(response.data.message || 'Failed to update the event.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating the event.');
    }
  };

  if (loading) {
    return <div className="text-center text-xl font-bold text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl font-bold text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Update Event</h1>
        <form onSubmit={handleFormSubmit}>
          {/* Event Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Event Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={eventDetails.name}
              onChange={handleInputChange}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Event Location */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 font-medium">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={eventDetails.location}
              onChange={handleInputChange}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Event Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={eventDetails.description}
              onChange={handleInputChange}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Event Date */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 font-medium">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={eventDetails.date}
              onChange={handleInputChange}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateEventForm;
