import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventPage";
import TasksPage from "./pages/TaskPage";
import AttendeesPage from "./pages/AttendeePage";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Sidebar";
import AddEventsPage from "./components/AddEventForm";
import EventDetailPage from "./components/EventDetailPage";
import AddTaskPage from "./components/AddTaskPage";
import LoginPage from "./pages/LoginPage";
import AddAttendeeForm from "./components/AddAttendeeForm";
import UpdateEventForm from "./components/UpdateEventForm";

const App = () => {
  return (
    <div className="relative min-h-screen flex">
      <ToastContainer />

      {/* Sidebar: fixed position on the left */}
      <Sidebar />

      {/* Main content area: takes up remaining space */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-100 ml-64">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/attendees" element={<AttendeesPage />} />
          <Route path="/events/add" element={<AddEventsPage />} />
          <Route path="/event/:eventId" element={<EventDetailPage />} />
          <Route path="/tasks/add-task" element={<AddTaskPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/attendees/add" element={<AddAttendeeForm />} />
          <Route path="/events/update/:eventId" element={<UpdateEventForm />} />

        </Routes>
      </div>
    </div>
  );
};

export default App;
