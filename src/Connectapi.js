// src/Connectapi.js
import axios from "axios";

// API Gateway Invoke URL
const BASE_URL = "https://lc8bkt7rbc.execute-api.ap-south-1.amazonaws.com/prod";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const CommunityAPI = {
  // Volunteers
  registerVolunteer: (data) => api.post("/register-volunteer", data),
  getVolunteers: () => api.get("/volunteers"),

  // Organizations
  registerOrganization: (data) => api.post("/register-organization", data),
  getOrganizations: () => api.get("/organizations"),

  // Projects
  registerProject: (data) => api.post("/register-project", data),
  getProjects: () => api.get("/projects"),

  // Applications
  registerApplication: (data) => api.post("/register-application", data),
  getApplications: () => api.get("/applications"),

  // Login
  loginVolunteer: (data) => api.post("/login-volunteer", data),
  loginOrganization: (data) => api.post("/login-organization", data),

  // Optional
  getCommunityData: () => api.get("/community-data"),
};

// ✅ Fix: Add default export
export default CommunityAPI;
