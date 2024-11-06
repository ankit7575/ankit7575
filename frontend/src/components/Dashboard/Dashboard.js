import React from "react";
import { Outlet } from 'react-router-dom';
import Navigation from '../Menu/Navigation';
import './Dashboard.css'; // Import CSS for styling

function Dashboard() {
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <Navigation />
      </nav>
      <main className="content">
        <Outlet /> {/* This is where the content of each page will be rendered */}
      </main>
    </div>
  );
}

export default Dashboard;
