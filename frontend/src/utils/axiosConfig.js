import axios from "axios";

const API_BASE =
  window.__API_BASE_URL__ ||
  process.env.REACT_APP_API_URL ||
  "";

axios.defaults.baseURL = API_BASE.replace(/\/$/, "");
axios.defaults.withCredentials = true;
axios.defaults.timeout = 20000;

axios.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("token");

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("➡️ API:", config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("❌ API Error:", err.response?.status, err.response?.data);
    if (err.response?.status === 401) {
      localStorage.clear();
    }
    return Promise.reject(err);
  }
);

export default axios;
