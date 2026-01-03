import React, { useEffect, useState, useCallback } from "react";
import CommunityAPI from "../../Connectapi";
import "./Dashboard.css";

function OrganizationDashboard() {
  const [activeSection, setActiveSection] = useState("post");
  const [projects, setProjects] = useState([]);
  const [projectsWithApplicants, setProjectsWithApplicants] = useState([]);
  const [newProject, setNewProject] = useState({
    Title: "",
    Description: "",
    SkillsRequired: "",
    Capacity: "",
    Location: "",
    Status: "Open",
  });

  // ✅ Replace with actual organizer login value later
  const organizerID = localStorage.getItem("OrganizerID") || "O100";

  // 🔄 Fetch all related data (Projects + Applications + Volunteers)
  const fetchAllData = useCallback(async () => {
    try {
      const [projRes, appRes, volRes] = await Promise.all([
        CommunityAPI.getProjects(),
        CommunityAPI.getApplications(),
        CommunityAPI.getVolunteers(),
      ]);

      const allProjects = projRes.data.projects || [];
      const allApplications = appRes.data.applications || [];

      // ✅ FIX: parse volunteer body properly if it's a string
      let volunteerList = [];
      if (volRes.data.body) {
        const parsed = JSON.parse(volRes.data.body);
        volunteerList = parsed.data || [];
      } else if (volRes.data.data) {
        volunteerList = volRes.data.data;
      } else {
        volunteerList = volRes.data.volunteers || [];
      }

      // ✅ Filter projects for the logged-in organizer
      const orgProjects = allProjects.filter(
        (p) => p.OrganizerID === organizerID
      );

      // ✅ Combine projects ↔ applications ↔ volunteers
      const combinedData = orgProjects.map((proj) => {
        const relatedApps = allApplications.filter(
          (a) => a.ProjectID === proj.ProjectID
        );

        const applicants = relatedApps.map((app) => {
          const volunteer = volunteerList.find(
            (v) => v.VolunteerID.trim() === app.VolunteerID.trim()
          );

          return {
            VolunteerName: volunteer?.Name || "Unknown",
            Email: volunteer?.Email || "N/A",
            Skills: volunteer?.Skills?.join(", ") || "N/A",
            Location: volunteer?.Location || "N/A",
            Languages: volunteer?.Languages?.join(", ") || "N/A",
            Availability: volunteer?.Availability || "N/A",
            Hours: app.Hours || 0,
          };
        });

        // Auto-close project when capacity reached
        const updatedStatus =
          applicants.length >= Number(proj.Capacity) ? "Closed" : "Open";

        return { ...proj, Status: updatedStatus, Applicants: applicants };
      });

      setProjects(orgProjects);
      setProjectsWithApplicants(combinedData);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  }, [organizerID]);

  // 🕐 Refresh every 30 seconds when viewing projects or applicants
  useEffect(() => {
    if (activeSection === "projects" || activeSection === "view") {
      fetchAllData();
      const interval = setInterval(fetchAllData, 30000);
      return () => clearInterval(interval);
    }
  }, [activeSection, fetchAllData]);

  // 📤 Add a new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProject,
        ProjectID: "P" + Math.floor(1000 + Math.random() * 9000),
        OrganizerID: organizerID,
        StartDate: new Date().toISOString().split("T")[0],
        SkillsRequired: newProject.SkillsRequired.split(",").map((s) =>
          s.trim()
        ),
        Capacity: Number(newProject.Capacity),
      };

      await CommunityAPI.registerProject(payload);
      alert("✅ Project posted successfully!");
      setNewProject({
        Title: "",
        Description: "",
        SkillsRequired: "",
        Capacity: "",
        Location: "",
        Status: "Open",
      });
      fetchAllData();
    } catch (error) {
      console.error("Error posting project:", error);
      alert("❌ Error posting project.");
    }
  };

  const handleChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  return (
    <div className="org-dashboard">
      {/* 📁 Sidebar Navigation */}
      <div className="sidebar">
        <h3>Organization Panel</h3>
        <button
          className={activeSection === "post" ? "active" : ""}
          onClick={() => setActiveSection("post")}
        >
          ➕ Post a New Project
        </button>
        <button
          className={activeSection === "projects" ? "active" : ""}
          onClick={() => setActiveSection("projects")}
        >
          📋 Posted Projects
        </button>
        <button
          className={activeSection === "view" ? "active" : ""}
          onClick={() => setActiveSection("view")}
        >
          👥 View Applicants
        </button>
      </div>

      {/* 🧩 Content Area */}
      <div className="content-area">
        {/* 🟩 Post a Project Section */}
        {activeSection === "post" && (
          <section>
            <h2>Post a New Project</h2>
            <form className="project-form" onSubmit={handleAddProject}>
              <input
                type="text"
                name="Title"
                placeholder="Project Title"
                value={newProject.Title}
                onChange={handleChange}
                required
              />
              <textarea
                name="Description"
                placeholder="Project Description"
                value={newProject.Description}
                onChange={handleChange}
                required
              ></textarea>
              <input
                type="text"
                name="SkillsRequired"
                placeholder="Skills Required (comma separated)"
                value={newProject.SkillsRequired}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="Capacity"
                placeholder="Volunteer Capacity"
                value={newProject.Capacity}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="Location"
                placeholder="City / Location"
                value={newProject.Location}
                onChange={handleChange}
                required
              />
              <button type="submit">Post Project</button>
            </form>
          </section>
        )}

        {/* 🟦 Posted Projects Section */}
        {activeSection === "projects" && (
          <section>
            <h2>Your Posted Projects</h2>
            {projects.length === 0 ? (
              <p>No projects found for this organization.</p>
            ) : (
              <ul className="project-list">
                {projects.map((p) => (
                  <li key={p.ProjectID} className="project-card">
                    <h4>{p.Title}</h4>
                    <p>{p.Description}</p>
                    <p>
                      <strong>Location:</strong> {p.Location}
                    </p>
                    <p>
                      <strong>Skills:</strong> {p.SkillsRequired?.join(", ")}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {p.Capacity}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {p.Status === "Open" ? "🟢 Open" : "🔴 Closed"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* 🟨 View Applicants Section */}
        {activeSection === "view" && (
          <section>
            <h2>Applicants</h2>
            {projectsWithApplicants.length === 0 ? (
              <p>No applicants found for your projects.</p>
            ) : (
              projectsWithApplicants.map((proj) => (
                <div key={proj.ProjectID} className="detailed-card">
                  <div className="project-header">
                    <h3>{proj.Title}</h3>
                    <p className="status-line">
                      {proj.Status === "Open" ? "🟢 Open" : "🔴 Closed"} —{" "}
                      {proj.Applicants.length}/{proj.Capacity} filled
                    </p>
                  </div>

                  {proj.Applicants.length > 0 ? (
                    <table className="volunteer-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Skills</th>
                          <th>Location</th>
                          <th>Languages</th>
                          <th>Availability</th>
                          <th>Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proj.Applicants.map((a, idx) => (
                          <tr key={idx}>
                            <td>{a.VolunteerName}</td>
                            <td>{a.Email}</td>
                            <td>{a.Skills}</td>
                            <td>{a.Location}</td>
                            <td>{a.Languages}</td>
                            <td>{a.Availability}</td>
                            <td>{a.Hours}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="no-applicants">No applicants yet.</p>
                  )}
                </div>
              ))
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default OrganizationDashboard;
