import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/admins/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
      toast.success(response.data.message); // Show success toast
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to logout!";
      toast.error(errorMessage); // Show error toast
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white fixed h-screen top-0 left-0">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      <ul className="mt-6">
        <li>
          <NavLink
            to="/dashboard/events"
            className={({ isActive }) =>
              `block py-2 px-4 hover:bg-gray-700 text-center ${isActive ? "bg-gray-900" : ""}`
            }
          >
            Events
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/tasks"
            className={({ isActive }) =>
              `block py-2 px-4 hover:bg-gray-700 text-center ${isActive ? "bg-gray-900" : ""}`
            }
          >
            Tasks
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/attendees"
            className={({ isActive }) =>
              `block py-2 px-4 hover:bg-gray-700 text-center ${isActive ? "bg-gray-900" : ""}`
            }
          >
            Attendees
          </NavLink>
        </li>
      </ul>

      {/* Logout Button at the bottom */}
      <div className="absolute bottom-4 w-full px-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
