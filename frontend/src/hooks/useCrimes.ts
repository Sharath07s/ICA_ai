import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const useCrimes = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['crimes'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/crimes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch crimes');
      return res.json();
    },
    enabled: !!token,
  });
};
