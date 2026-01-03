import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CommunityAPI from "../../Connectapi";
import "./Auth.css";

function Login() {
  const [role, setRole] = useState("volunteer");
  const [form, setForm] = useState({
    name: "",
    orgName: "",
    email: "",
    password: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      let response;
      if (role === "volunteer") {
        response = await CommunityAPI.loginVolunteer({
          Email: form.email,
          Name: form.name,
          Password: form.password,
        });
      } else {
        response = await CommunityAPI.loginOrganization({
          Email: form.email,
          OrgName: form.orgName,
          Password: form.password,
        });
      }

      if (response.data.success) {
        const nameToShow =
          role === "volunteer" ? form.name : form.orgName;
        setSuccessMsg(`✅ Logged in successfully — Welcome ${nameToShow}!`);

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate(role === "volunteer" ? "/volunteer" : "/organization");
        }, 1500);
      } else {
        setErrorMsg(response.data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMsg("⚠️ Login failed due to invalid creds. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <div className="tabs">
        <button
          className={role === "volunteer" ? "active" : ""}
          onClick={() => setRole("volunteer")}
        >
          Volunteer
        </button>
        <button
          className={role === "organization" ? "active" : ""}
          onClick={() => setRole("organization")}
        >
          Organization
        </button>
      </div>

      <form onSubmit={handleSubmit} autoComplete="off">
        {role === "volunteer" ? (
          <input
            type="text"
            name="name"
            placeholder="Volunteer Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        ) : (
          <input
            type="text"
            name="orgName"
            placeholder="Organization Name"
            value={form.orgName}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder={
            role === "volunteer" ? "Volunteer Email" : "Organization Email"
          }
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="off"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <button type="submit">Login</button>
      </form>

      {/* ✅ Styled success & error messages */}
      {successMsg && <div className="success-box">{successMsg}</div>}
      {errorMsg && <div className="error-box">{errorMsg}</div>}

      <p className="switch-link">
        New user? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
