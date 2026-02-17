import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

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

export default api;
