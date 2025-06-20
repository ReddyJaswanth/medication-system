import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useMedications() {
  return useQuery({
    queryKey: ['medications'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/medications`, { headers: getAuthHeaders() });
      return res.data;
    }
  });
}

export function useAddMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${API_URL}/medications`, data, { headers: getAuthHeaders() });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medications'] })
  });
}

export function useUpdateMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await axios.put(`${API_URL}/medications/${id}`, data, { headers: getAuthHeaders() });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medications'] })
  });
}

export function useDeleteMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`${API_URL}/medications/${id}`, { headers: getAuthHeaders() });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medications'] })
  });
}

export function useMarkAsTaken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (medicationId) => {
      const res = await axios.post(`${API_URL}/intake/${medicationId}`, {}, { headers: getAuthHeaders() });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['adherence'] });
    }
  });
} 