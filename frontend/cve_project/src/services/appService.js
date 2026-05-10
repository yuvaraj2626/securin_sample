import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Fetch all CVEs with pagination
export const fetchAllCVEs = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/api/cves`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching CVEs:', error);
    throw error;
  }
};

// Fetch CVE by ID
export const fetchCVEById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/cves/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching CVE by ID:', error);
    throw error;
  }
};

// Fetch CVEs by year
export const fetchCVEsByYear = async (year, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/api/cves/year/${year}`, {
      params: { page, limit, year }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching CVEs by year:', error);
    throw error;
  }
};

// Fetch CVEs by score
export const fetchCVEsByScore = async (score, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/api/cves/score/${score}`, {
      params: { page, limit, score }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching CVEs by score:', error);
    throw error;
  }
};

// Fetch CVEs modified in last N days
export const fetchCVEsByModifiedDays = async (days, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/api/cves/modified/${days}`, {
      params: { page, limit, days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching CVEs by modified days:', error);
    throw error;
  }
};
