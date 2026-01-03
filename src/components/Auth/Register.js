import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../Connectapi";
import "./Auth.css";

function Register() {
  const [role, setRole] = useState("volunteer");
  const navigate = useNavigate();

  const emptyForm = {
    name: "",
    email: "",
    password: "",
    availability: "",
    location: "",
    skills: [],
    languages: [],
    orgName: "",
    contact: "",
    address: "",
  };

  const [form, setForm] = useState(emptyForm);

  const skillsList = ["Teaching", "Communication", "Healthcare", "Fundraising"];
  const languagesList = ["English", "Kannada", "Hindi", "Tamil", "Telugu"];

  const toggleCheckbox = (key, value) => {
    setForm((prev) => {
      const arr = prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value];
      return { ...prev, [key]: arr };
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (role === "volunteer") {
        const payload = {
          Name: form.name,
          Email: form.email,
          Password: form.password,
          Skills: form.skills,
          Availability: form.availability,
          Location: form.location,
          Languages: form.languages,
        };
        const res = await api.registerVolunteer(payload);
        alert(res.data.message || "Volunteer registered successfully!");
      } else {
        const payload = {
          OrganizationID: "O" + Math.floor(Math.random() * 1000),
          OrgName: form.orgName,
          Email: form.email,
          Password: form.password,
          Contact: form.contact,
          Address: form.address,
        };
        const res = await api.registerOrganization(payload);
        alert(res.data.message || "Organization registered successfully!");
      }
      setForm(emptyForm);
      navigate("/login");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      <div className="tabs">
        <button
          className={role === "volunteer" ? "active" : ""}
          onClick={() => {
            setRole("volunteer");
            setForm(emptyForm);
          }}
        >
          Volunteer
        </button>
        <button
          className={role === "organization" ? "active" : ""}
          onClick={() => {
            setRole("organization");
            setForm(emptyForm);
          }}
        >
          Organization
        </button>
      </div>

      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Hidden fake fields to block Chrome autofill */}
        <input type="text" style={{ display: "none" }} name="fakeusernameremembered" />
        <input type="password" style={{ display: "none" }} name="fakepasswordremembered" />

        {role === "volunteer" ? (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="off"
            />

            <input
              type="email"
              name="user_email"
              id="user_email"
              placeholder="Volunteer Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />

            <input
              type="password"
              name="user_pass"
              id="user_pass"
              placeholder="Create Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck="false"
            />

            <label>Skills:</label>
            <div className="checkbox-group">
              {skillsList.map((skill) => (
                <label key={skill}>
                  <input
                    type="checkbox"
                    checked={form.skills.includes(skill)}
                    onChange={() => toggleCheckbox("skills", skill)}
                  />
                  {skill}
                </label>
              ))}
            </div>

            <input
              type="text"
              name="availability"
              placeholder="Availability (e.g., 31-10-2025)"
              value={form.availability}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location (e.g., Bangalore)"
              value={form.location}
              onChange={handleChange}
              required
            />

            <label>Languages Known:</label>
            <div className="checkbox-group">
              {languagesList.map((lang) => (
                <label key={lang}>
                  <input
                    type="checkbox"
                    checked={form.languages.includes(lang)}
                    onChange={() => toggleCheckbox("languages", lang)}
                  />
                  {lang}
                </label>
              ))}
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              name="orgName"
              placeholder="Organization Name"
              value={form.orgName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="org_email"
              id="org_email"
              placeholder="Organization Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />

            <input
              type="password"
              name="org_pass"
              id="org_pass"
              placeholder="Set Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck="false"
            />

            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              value={form.contact}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit">Register</button>
      </form>

      <p className="switch-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
