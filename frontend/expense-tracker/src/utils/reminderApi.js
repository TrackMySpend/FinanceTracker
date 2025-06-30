import axios from 'axios';
import { BASE_URL,API_PATHS } from './apiPaths';

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const addReminder = (data) => API.post(API_PATHS.REMINDER.ADD, data);
export const getDueReminders = () => API.get(API_PATHS.REMINDER.GET_DUE);
export const dismissReminder = (id) => API.post(API_PATHS.REMINDER.DISMISS(id));
export const getAllReminders = () => API.get(API_PATHS.REMINDER.ALL); // make sure ALL is defined
