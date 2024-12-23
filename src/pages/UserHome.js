import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserHome = () => {
  const [tasks, setTasks] = useState([]); // Store all tasks assigned to the user
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submission process
  const [selectedTaskId, setSelectedTaskId] = useState(null); // Track selected task for submission
  const [proof, setProof] = useState(null); // Store the uploaded proof file
  const [loading, setLoading] = useState(false); // Loading state for submission
  const navigate = useNavigate();

  // Fetch tasks when the component loads
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/users/alltask",
          { withCredentials: true }
        );

        if (response.data.success) {
          setTasks(response.data.data);
        } else {
          toast.error(response.data.message || "Failed to fetch tasks.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Unable to fetch tasks. Please try again later.");
      }
    };

    fetchTasks();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/users/logout",
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Logged out successfully.");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  // Submit proof handler
  const handleSubmitProof = async (taskId) => {
    if (!proof) {
      toast.error("Please upload a proof file.");
      return;
    }

    const formData = new FormData();
    formData.append("taskid", taskId);
    formData.append("proof", proof);

    setLoading(true); // Set loading state during submission

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/users/submittask",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Proof submitted successfully.");

        // Update the task status locally
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.taskId === taskId ? { ...task, status: "submitted" } : task
          )
        );
        setProof(null); // Reset proof input
        setIsSubmitting(false); // Close the submission process
      } else {
        toast.error(response.data.message || "Failed to submit proof.");
      }
    } catch (error) {
      console.error("Error submitting proof:", error);
      toast.error("An error occurred while submitting proof. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/users/delete",
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Account deleted successfully.");
        navigate("/user-login");
      } else {
        toast.error(response.data.message || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Error deleting account. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-lg">
        <div className="text-white font-bold text-lg">Task Manager</div>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/update-profile")}
            className="text-white hover:bg-gray-700 px-4 py-2 rounded-md transition duration-200"
          >
            Update Profile
          </button>
          <button
            onClick={handleDeleteAccount}
            className="text-white hover:bg-red-600 px-4 py-2 rounded-md transition duration-200"
          >
            Delete Account
          </button>
          <button
            onClick={handleLogout}
            className="text-white hover:bg-gray-700 px-4 py-2 rounded-md transition duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Task List */}
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Assigned Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-600">No tasks assigned yet.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.taskId}
              className="bg-white shadow-md rounded-lg p-6 mb-6"
            >
              <h3 className="text-xl font-semibold text-gray-700">
                {task.title}
              </h3>
              <p className="text-gray-600 mt-2">{task.description}</p>
              <p
                className={`mt-4 font-semibold ${
                  task.status === "submitted"
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                Status: {task.status}
              </p>
              {task.status !== "submitted" && (
                <>
                  <button
                    onClick={() => {
                      setSelectedTaskId(task.taskId);
                      setIsSubmitting(true);
                    }}
                    className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
                  >
                    Submit Work
                  </button>

                  {isSubmitting && selectedTaskId === task.taskId && (
                    <div className="mt-4">
                      <input
                        type="file"
                        onChange={(e) => setProof(e.target.files[0])}
                        className="border-2 border-gray-300 rounded-md p-2 w-full mb-4"
                      />
                      <button
                        onClick={() => handleSubmitProof(task.taskId)}
                        disabled={loading}
                        className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-200"
                      >
                        {loading ? "Submitting..." : "Submit Proof"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserHome;
