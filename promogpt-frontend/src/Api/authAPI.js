import axios from 'axios';

const API_BASE = '.';

export async function loginUser(credentials) {
  const response = await axios.post(`${API_BASE}/users/login`, credentials);
  return response.data;
}

export async function registerUser(data) {
  const response = await axios.post(`${API_BASE}/users/register`, data);
  return response.data;
}
