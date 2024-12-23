import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

const AddEventsPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [showForm, setShowForm] = useState(false); // State to manage form visibility

  const navigate = useNavigate();  // Hook to navigate between routes

  const handleAddEventClick = () => {
    setShowForm(!showForm);  // Toggle form visibility
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    if (!name || !description || !location || !date) {
      toast.error('All fields are required.', { position: "top-right", autoClose: 5000 });
      return; // Prevent form submission if any field is empty
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/admins/addEvent',  // API to add event
        {
          name,
          description,
          location,
          date,
        },
        { withCredentials: true } // Ensure to send cookies for authentication
      );
      
      // Show success toast from backend message
      toast.success(response.data.message, { position: "top-right", autoClose: 5000 });

      // Optionally, reset form and refresh event list
      setName('');
      setDescription('');
      setLocation('');
      setDate('');
      setShowForm(false);

      // Navigate to events page after successful event creation
      navigate('/events'); // Redirect to the events page
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Error adding event. Please try again.', { position: "top-right", autoClose: 5000 }); // Show error toast
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-700 mb-4">Add New Event</h1>

      {/* Button to show/hide AddEventForm */}
      <button
        onClick={handleAddEventClick}
        className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
      >
        {showForm ? 'Cancel Add Event' : 'Add New Event'}
      </button>

      {/* Conditional Rendering of AddEventForm */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor="name">
              Event Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
            Add Event
          </button>
        </form>
      )}

      {/* Toast container for displaying notifications */}
      <ToastContainer />
    </div>
  );
};

export default AddEventsPage;
