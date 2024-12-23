import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AttendeePage = () => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch attendees when the component mounts
  useEffect(() => {
    fetchAttendees();
  }, []);

  // Function to fetch attendees
  const fetchAttendees = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/admins/getallattendees",
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setAttendees(response.data.data.attendees);
      } else {
        setError("Failed to fetch attendees.");
      }
    } catch (error) {
      setError("Error fetching attendees. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete an attendee
  const deleteAttendee = async (userid) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/admins/deleteattendee",
        { userid },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Attendee deleted successfully!");
        fetchAttendees(); // Refresh the list of attendees
      } else {
        setError("Failed to delete attendee.");
        toast.error("Failed to delete attendee.");
      }
    } catch (error) {
      setError("Error deleting attendee. Please try again.");
      toast.error("Error deleting attendee.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle navigate to Add Attendee Form
  const handleAddAttendee = () => {
    navigate("/attendees/add"); // Navigate to the Add Attendee Form
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Attendees</h1>

        {/* Button to navigate to Add Attendee Form */}
        <button
          onClick={handleAddAttendee}
          className="bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition duration-300 mb-6"
        >
          Add Attendee
        </button>

        {/* Loading State */}
        {loading && <div className="text-center text-gray-500">Loading attendees...</div>}

        {/* Error State */}
        {error && <div className="text-center text-red-500 mb-4">{error}</div>}

        {/* Display attendees if available */}
        {attendees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {attendees.map((attendee) => (
              <div
                key={attendee._id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={attendee.coverImage || "http://res.cloudinary.com/ankur786/image/upload/v1734916416/eljjg3ta2ynvoo6dlzps.png"}
                    alt={attendee.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{attendee.fullName}</h2>
                    <p className="text-gray-600">{attendee.email}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <span
                    className={`${
                      attendee.assignedAttendees ? "text-green-600" : "text-red-600"
                    } font-semibold`}
                  >
                    {attendee.task ? "Assigned" : "Not Assigned"}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => deleteAttendee(attendee._id)}
                  className="mt-4 bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          !loading && <div className="text-center text-gray-500">No attendees available.</div>
        )}
      </div>
    </div>
  );
};

export default AttendeePage;
