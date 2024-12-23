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
import HomePage from "./pages/HomePage";
import UserLoginPage from "./pages/UserLoginPage";
import UserRegisterPage from "./pages/UserRegisterPage";

const App = () => {
  return (
    <div className="relative min-h-screen flex">
      <ToastContainer />

      {/* Sidebar: fixed position on the left */}
      

      {/* Main content area: takes up remaining space */}
      <div className="w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} >
            <Route path="/dashboard/events" element={<EventsPage />} />
            <Route path="/dashboard/tasks" element={<TasksPage />} />
            <Route path="/dashboard/attendees" element={<AttendeesPage />} />
            <Route path="/dashboard/events/add" element={<AddEventsPage />} />
            <Route path="/dashboard/event/:eventId" element={<EventDetailPage />} />
            <Route path="/dashboard/tasks/add-task" element={<AddTaskPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-login" element={<UserLoginPage />} />
          <Route path="/user-register" element={<UserRegisterPage />} />
          <Route path="/attendees/add" element={<AddAttendeeForm />} />
          <Route path="/events/update/:eventId" element={<UpdateEventForm />} />


          <Route path="/user-dashboard" element={<DashboardPage/>}>

          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
