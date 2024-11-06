import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Layout from "../../../components/Layout/Layout"; // Adjust path if needed
import '../../../styles/global.css'; // Import CSS for additional styling if needed

const AdminDashboard = () => {
  const totalUsers = 150; // Replace with dynamic data
  const activeUsers = 120; // Replace with dynamic data
  const totalPayouts = 10000; // Replace with dynamic data
  const pendingPayouts = 1500; // Replace with dynamic data

  const overviewData = [
    { title: "Total Users", value: totalUsers },
    { title: "Active Users", value: activeUsers },
    { title: "Total Payouts", value: `$${totalPayouts.toFixed(2)}` },
    { title: "Pending Payouts", value: `$${pendingPayouts.toFixed(2)}` },
  ];

  return (
    <Layout userRole="admin"> {/* Specify the user role to render AdminNavigation */}
      <section className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-overview">
          <h2>Overview</h2>
          <div className="overview-cards">
            {overviewData.map((item, index) => (
              <div className="overview-card" key={index}>
                <h3>{item.title}</h3>
                <p className="overview-value">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-menu">
          <h2>Management</h2>
          <ul>
            <li>
              <Link to="/admin/user-management">User Management</Link>
            </li>
            <li>
              <Link to="/admin/payout-management">Payout Management</Link>
            </li>
            <li>
              <Link to="/admin/reports">Reports</Link>
            </li>
            <li>
              <Link to="/admin/settings">Settings</Link>
            </li>
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
