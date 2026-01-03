import React from "react";

function ProjectList({ projects }) {
  return (
    <div>
      <h2>📋 Projects</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Skills Required</th>
            <th>Start Date</th>
            <th>Capacity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.ProjectID}>
              <td>{p.ProjectID}</td>
              <td>{p.Title}</td>
              <td>{p.Description}</td>
              <td>{p.SkillsRequired.join(", ")}</td>
              <td>{p.StartDate}</td>
              <td>{p.Capacity}</td>
              <td>{p.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectList;
