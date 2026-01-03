import React from "react";

function VolunteerList({ volunteers }) {
  return (
    <div>
      <h2>🧑‍🤝‍🧑 Volunteers</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Volunteer ID</th>
            <th>Name</th>
            <th>Skills</th>
            <th>Availability</th>
            <th>Location</th>
            <th>Languages</th>
            <th>Hours Logged</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((v) => (
            <tr key={v.VolunteerID}>
              <td>{v.VolunteerID}</td>
              <td>{v.Name}</td>
              <td>{v.Skills.join(", ")}</td>
              <td>{v.Availability}</td>
              <td>{v.Location}</td>
              <td>{v.Languages.join(", ")}</td>
              <td>{v.HoursLogged}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VolunteerList;
