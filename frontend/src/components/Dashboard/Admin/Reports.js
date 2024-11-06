import React, { useEffect, useState } from "react";
import './Reports.css'; // Make sure to create a CSS file for styling

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports data from the backend (you can replace the URL with your actual endpoint)
  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports"); // Replace with your API endpoint
      const data = await response.json();
      setReports(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="reports">
      <h1>Reports</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <div className="report-list">
          <h2>User Statistics</h2>
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.userStatistics && reports.userStatistics.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Financial Reports</h2>
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.financialReports && reports.financialReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.description}</td>
                  <td>{report.amount}</td>
                  <td>{new Date(report.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
