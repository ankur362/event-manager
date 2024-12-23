import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import EventsPage from "./EventPage";
import TasksPage from "./TaskPage";
import AttendeesPage from "./AttendeePage";
import { ToastContainer } from "react-toastify";


const DashboardPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming the user is logged in

  return (
    <div className="relative left-[16rem] w-full">
      <Sidebar/>
      <Outlet/>
    </div>
     

  );
};

export default DashboardPage;
