import axios from 'axios';

// Use an environment variable for the backend URL to adapt to different environments
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000'; // Default to localhost for local development

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
