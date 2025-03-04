import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchMetrics = async () => {
  const response = await axios.get(`${API_BASE_URL}/metrics`);
  return response.data;
};
