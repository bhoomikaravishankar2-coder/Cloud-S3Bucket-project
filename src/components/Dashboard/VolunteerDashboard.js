import React, { useEffect, useState } from "react";
import CommunityAPI from "../../Connectapi";
import "./Dashboard.css";

function VolunteerDashboard() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [hoursSelection, setHoursSelection] = useState({});
  const volunteerID = "V001"; // ✅ replace dynamically after login

  // ✅ Fetch all projects and applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, appRes] = await Promise.all([
          CommunityAPI.getProjects(),
          CommunityAPI.getApplications(),
        ]);

        const allProjects = projRes.data.projects || [];
        setProjects(allProjects);
        setFilteredProjects(allProjects);

        const allApps = appRes.data.applications || [];
        const userApps = allApps.filter((a) => a.VolunteerID === volunteerID);

        const appliedIDs = userApps.map((a) => a.ProjectID);
        const appliedHours = userApps.reduce((acc, app) => {
          acc[app.ProjectID] = app.Hours;
          return acc;
        }, {});

        setAppliedProjects(appliedIDs);
        setHoursSelection(appliedHours);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Filters by skill and location
  useEffect(() => {
    let result = projects;

    if (selectedSkill) {
      result = result.filter((p) =>
        p.SkillsRequired?.some((skill) =>
          skill.toLowerCase().includes(selectedSkill.toLowerCase())
        )
      );
    }

    if (selectedLocation) {
      result = result.filter((p) =>
        p.Location?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredProjects(result);
  }, [selectedSkill, selectedLocation, projects]);

  // ✅ Handle applying for a project
  const handleApply = async (project) => {
    const selectedHours = hoursSelection[project.ProjectID];

    if (!selectedHours) {
      setErrorMessages((prev) => ({
        ...prev,
        [project.ProjectID]: "Please select hours before applying.",
      }));
      return;
    }

    try {
      setErrorMessages((prev) => ({ ...prev, [project.ProjectID]: "" }));

      const payload = {
        VolunteerID: volunteerID,
        ProjectID: project.ProjectID,
        Status: "Pending",
        Hours: selectedHours,
      };

      // Register application in DynamoDB
      await CommunityAPI.registerApplication(payload);

      // Fetch updated applications to sync hours from DB
      const res = await CommunityAPI.getApplications();
      const updatedApps = res.data.applications || [];
      const userApps = updatedApps.filter((a) => a.VolunteerID === volunteerID);

      const appliedIDs = userApps.map((a) => a.ProjectID);
      const appliedHours = userApps.reduce((acc, app) => {
        acc[app.ProjectID] = app.Hours;
        return acc;
      }, {});

      setAppliedProjects(appliedIDs);
      setHoursSelection(appliedHours);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "❌ Could not apply. Please try again later.";
      setErrorMessages((prev) => ({ ...prev, [project.ProjectID]: msg }));
    }
  };

  // ✅ Handle hours dropdown
  const handleHoursChange = (projectID, value) => {
    setHoursSelection((prev) => ({
      ...prev,
      [projectID]: value,
    }));
  };

  return (
    <div className="dashboard-container">
      <h2>Volunteer Dashboard</h2>

      {/* 🔍 Filters */}
      <section className="filters">
        <h4>Search & Filters</h4>
        <input
          type="text"
          placeholder="Filter by location"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        />
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          <option value="">All Skills</option>
          <option value="Teaching">Teaching</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Fundraising">Fundraising</option>
          <option value="Communication">Communication</option>
          <option value="Teamwork">Teamwork</option>
          <option value="Environmental Awareness">
            Environmental Awareness
          </option>
        </select>
      </section>

      {/* 📋 Projects */}
      <section className="projects">
        <h3>Available Projects</h3>
        {filteredProjects.length === 0 ? (
          <p>No matching projects found.</p>
        ) : (
          <ul className="project-list">
            {filteredProjects.map((p) => (
              <li key={p.ProjectID} className="project-card">
                <h4>{p.Title}</h4>
                <p>{p.Description}</p>
                <p>
                  <strong>Location:</strong> {p.Location || "Not specified"}
                </p>
                <p>
                  <strong>Skills Required:</strong>{" "}
                  {p.SkillsRequired?.join(", ") || "None"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {p.Status === "Open" ? "🟢 Open" : "🔴 Closed"}
                </p>

                {/* ⏱️ Hours Section */}
                <div className="hours-select">
                  {!appliedProjects.includes(p.ProjectID) ? (
                    <>
                      <label>Select Hours: </label>
                      <select
                        value={hoursSelection[p.ProjectID] || ""}
                        onChange={(e) =>
                          handleHoursChange(p.ProjectID, e.target.value)
                        }
                      >
                        <option value="">--Choose--</option>
                        <option value="8">8 hours</option>
                        <option value="9">9 hours</option>
                        <option value="10">10 hours</option>
                      </select>
                    </>
                  ) : (
                    <span className="applied-hours">
                      ⏱️ Applied for{" "}
                      <strong>{hoursSelection[p.ProjectID] || "0"}</strong> hours{" "}
                      <span style={{ color: "green" }}></span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleApply(p)}
                  disabled={appliedProjects.includes(p.ProjectID)}
                >
                  {appliedProjects.includes(p.ProjectID)
                    ? "Applied ✅"
                    : "Apply Now"}
                </button>

                {/* ⚠️ Error message */}
                {errorMessages[p.ProjectID] && (
                  <p className="error-text">{errorMessages[p.ProjectID]}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 🧾 Applied Projects */}
      {appliedProjects.length > 0 && (
        <section className="applied-section">
          <h3>Your Applications</h3>
          <ul>
            {appliedProjects.map((id) => {
              const proj = projects.find((p) => p.ProjectID === id);
              return (
                <li key={id}>
                  {proj?.Title || id} — ⏱️ {hoursSelection[id]} hrs
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

export default VolunteerDashboard;
