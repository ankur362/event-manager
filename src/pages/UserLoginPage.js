import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const UserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/admins/login",
        { email, password },
        { withCredentials: true }
      );

      toast.success(response.data.message);
      setIsLoggedIn(true);
      navigate("/dashboard");  // Redirect to dashboard after successful login
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {!isLoggedIn ? (
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>
            <Link to={"/user-register"} className=" underline text-blue-500 mt-4">Don't have an account, register here</Link>
          </form>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome, Admin</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLoginPage;
