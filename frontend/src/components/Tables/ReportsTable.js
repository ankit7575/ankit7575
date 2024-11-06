import React from "react";
import './Tables.css'; // Optional: Add CSS for table styles

const ReportsTable = ({ reports }) => {
  return (
    <div className="reports-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.title}</td>
                <td>{new Date(report.date).toLocaleDateString()}</td>
                <td>{report.status}</td>
                <td>
                  <button onClick={() => handleViewReport(report.id)}>View</button>
                  <button onClick={() => handleDeleteReport(report.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No reports available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Example functions for actions (you can implement these according to your needs)
const handleViewReport = (id) => {
  alert(`Viewing report with ID: ${id}`);
};

const handleDeleteReport = (id) => {
  const confirmDelete = window.confirm(`Are you sure you want to delete report with ID: ${id}?`);
  if (confirmDelete) {
    alert(`Report with ID: ${id} has been deleted.`);
    // Implement delete functionality here
  }
};

export default ReportsTable;
