import axios from "axios";

import { API_URL } from "./constants";

const baseURL = import.meta.env.VITE_APP_API_URL || API_URL;

const api = axios.create({
  baseURL: baseURL,
});

export default api;
