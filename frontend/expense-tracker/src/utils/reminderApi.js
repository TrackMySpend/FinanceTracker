import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:8000/api/v1/reminders' });

// Attach token if needed
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getDueReminders = () => API.get('/due');
export const getAllReminders = () => API.get('/all'); // ✅ New function
export const addReminder = (data) => API.post('/', data);
export const dismissReminder = (id) => API.post(`/${id}/dismiss`);
