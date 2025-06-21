import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useLogs() {
  return useQuery({
    queryKey: ['logs'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/intake/logs`, { headers: getAuthHeaders() });
      return res.data;
    }
  });
}

export function useAdherence() {
  return useQuery({
    queryKey: ['adherence'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/intake/adherence`, { headers: getAuthHeaders() });
      return res.data;
    }
  });
} 