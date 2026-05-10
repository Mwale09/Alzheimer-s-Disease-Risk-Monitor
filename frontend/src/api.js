import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    window.location.reload();
  }
  return Promise.reject(error);
});

export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await api.post('/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

export const registerUser = async (username, password) => {
  const response = await api.post('/register', { username, password });
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

export const getPredictions = async (patientData, modelType = "XGBoost") => {
  try {
    const response = await api.post('/predict', {
      patient_data: patientData,
      model_type: modelType
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};

export const getBatchPredictions = async (patients, modelType = "XGBoost") => {
  try {
    const response = await api.post('/predict/batch', {
      patients: patients,
      model_type: modelType
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching batch predictions:', error);
    throw error;
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    return []; // Return empty array on failure
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('API Health check failed:', error);
    throw error;
  }
};

export const getHistoryDetail = async (id) => {
  try {
    const response = await api.get(`/history/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching history detail for ID ${id}:`, error);
    throw error;
  }
};

export const updatePassword = async (new_password) => {
  const response = await api.post('/update-password', { new_password });
  return response.data;
};

export default api;
