import { useEffect, useState, useCallback } from 'react';
import { employeeAPI, resourceAPI, transactionAPI, settingsAPI, aiConfigAPI } from '../services/api';
import { Employee, Resource, Transaction, Settings } from '../context/OrganizationContext';

// Hook for managing async API data with local fallback
export const useApiData = <T,>(
  apiCall: () => Promise<any>,
  fallbackData: T[],
  options?: { autoRefresh?: number; onError?: (err: any) => void }
) => {
  const [data, setData] = useState<T[]>(fallbackData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiCall();
      const result = Array.isArray(response.data) ? response.data : response.data.data || [];
      setData(result);
      setError(null);
      console.log('✅ Data synced from backend');
    } catch (err) {
      console.warn('⚠️ Failed to sync from backend, using local data:', err);
      setError((err as Error).message);
      options?.onError?.(err);
      // Keep fallback data on error
    } finally {
      setLoading(false);
    }
  }, [apiCall, options]);

  useEffect(() => {
    fetchData();

    if (options?.autoRefresh) {
      const interval = setInterval(fetchData, options.autoRefresh);
      return () => clearInterval(interval);
    }
  }, [fetchData, options]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for creating/updating data on backend
export const useApiMutation = <T,>(
  mutationFn: (data: T) => Promise<any>,
  onSuccess?: (data: any) => void,
  onError?: (err: any) => void
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (data: T) => {
    setLoading(true);
    try {
      const response = await mutationFn(data);
      onSuccess?.(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMsg = (err as Error).message;
      console.error('❌ Mutation failed:', errorMsg);
      setError(errorMsg);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

// Helper hook for real-time sync
export const useSyncWithBackend = () => {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('syncing');

  const syncData = useCallback(async () => {
    try {
      setSyncStatus('syncing');
      // Test API connectivity
      await employeeAPI.getAll({ limit: 1 });
      setSyncStatus('synced');
      return true;
    } catch (err) {
      console.warn('⚠️ Backend sync failed, working with local data');
      setSyncStatus('error');
      return false;
    }
  }, []);

  return { syncStatus, syncData };
};
