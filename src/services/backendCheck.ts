import axios from 'axios';

// Create a simple utility to test backend connectivity
export const testBackendConnection = async () => {
  try {
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    console.log(`Testing backend connection to: ${API_URL.replace(/\/api$/, '')}/health`);
    
    const response = await axios.get(
      `${API_URL.replace(/\/api$/, '')}/health`,
      { timeout: 5000 }
    );
    
    console.log('✅ Backend connected:', response.data);
    return { connected: true, data: response.data };
  } catch (error) {
    console.warn('⚠️ Backend connection failed:', (error as Error).message);
    return { connected: false, data: null };
  }
};

// Test during module load
export const initializeBackendConnection = async () => {
  const result = await testBackendConnection();
  return result.connected;
};
