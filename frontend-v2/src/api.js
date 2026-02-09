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
