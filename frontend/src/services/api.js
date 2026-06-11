import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});
// withCredentials is required because the backend stores auth in an httpOnly cookie.

export function getErrorMessage(error) {
  return error.response?.data?.message || error.message || "Something went wrong";
}

export function resolveAssetUrl(path) {
  if (!path) {
    return "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=80";
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `${SERVER_URL}${path}`;
}

export default api;
