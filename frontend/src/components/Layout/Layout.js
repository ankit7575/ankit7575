import React from "react";
import CustomerNavigation from "../Menu/CustomerNavigation"; // Adjust the path as needed
import AdminNavigation from "../Menu/AdminNavigation"; // Adjust the path as needed
import './Layout.css'; // Import CSS for layout styles

const Layout = ({ children, userRole }) => {
  return (
    <div className="layout">
      <aside className="sidebar"> {/* Sidebar for navigation */}
        {userRole === 'admin' ? <AdminNavigation /> : <CustomerNavigation />}
      </aside>
      <main className="main-content"> {/* Use semantic HTML for better accessibility */}
        {children} {/* This is where your page content will be rendered */}
      </main>
    </div>
  );
};

export default Layout;
