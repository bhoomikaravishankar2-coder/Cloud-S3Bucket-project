import React from "react";

function ApplicationList({ applications }) {
  return (
    <div>
      <h2>📝 Applications</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Application ID</th>
            <th>Volunteer ID</th>
            <th>Project ID</th>
            <th>Status</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.ApplicationID}>
              <td>{a.ApplicationID}</td>
              <td>{a.VolunteerID}</td>
              <td>{a.ProjectID}</td>
              <td>{a.Status}</td>
              <td>{a.Hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationList;
