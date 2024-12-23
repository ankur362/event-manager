import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddAttendeeForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    coverImage: null,
  });
  const [coverImagePreview, setCoverImagePreview] = useState(null); // To store the preview of the image

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, coverImage: file });

    // Generate a preview URL for the selected image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, coverImage: null });
    setCoverImagePreview(null); // Remove preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, username, password, coverImage } = formData;

    if (!fullName || !email || !username || !password || !coverImage) {
      toast.error("All fields are required!");
      return;
    }

    if (password.length < 8 || password.length > 15) {
      toast.error("Password must be between 8 and 15 characters!");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("fullName", fullName);
    formDataToSubmit.append("email", email);
    formDataToSubmit.append("username", username);
    formDataToSubmit.append("password", password);
    formDataToSubmit.append("coverImage", coverImage);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/admins/addattendee",
        formDataToSubmit,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/dashboard/attendees"); // Navigate back to the attendee list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating attendee:", error);
      toast.error("Failed to add attendee. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
        {/* Image Preview at the Top */}
        {coverImagePreview && (
          <div className="flex justify-center mb-6">
            <img
              src={coverImagePreview}
              alt="Cover Preview"
              className="w-32 h-32 object-cover rounded-full border-4 border-indigo-600"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="mt-2 ml-4 text-red-600 hover:text-red-800"
            >
              Remove Image
            </button>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-700 mb-6">Add Attendee</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Cover Image</label>
            <input
              type="file"
              name="coverImage"
              onChange={handleFileChange}
              className="w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Add Attendee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAttendeeForm;
