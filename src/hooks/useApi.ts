import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { apiClient, Employee, Resource, Transaction, Settings } from './api';
import { AxiosError } from 'axios';

// ==================== EMPLOYEES ====================

export const useEmployees = (
  params?: { page?: number; limit?: number; status?: string; department?: string },
  options?: UseQueryOptions<{ data: Employee[]; total: number }, AxiosError>
) => {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => apiClient.getEmployees(params),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Re-fetch every minute for real-time updates
    ...options,
  });
};

export const useEmployeeById = (id: string, options?: UseQueryOptions<Employee, AxiosError>) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => apiClient.getEmployeeById(id),
    staleTime: 30000,
    ...options,
  });
};

export const useSearchEmployees = (query: string) => {
  return useQuery({
    queryKey: ['employeeSearch', query],
    queryFn: () => apiClient.searchEmployees(query),
    enabled: query.length > 0,
    staleTime: 30000,
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Employee> }) =>
      apiClient.updateEmployee(id, updates),
    onSuccess: (data) => {
      // Invalidate employees list
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      // Update specific employee
      queryClient.setQueryData(['employee', data.id], data);
    },
  });
};

export const useToggleEmployeeStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.toggleEmployeeStatus(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.setQueryData(['employee', data.id], data);
    },
  });
};

export const useEmployeePayrollStats = () => {
  return useQuery({
    queryKey: ['employeePayrollStats'],
    queryFn: () => apiClient.getEmployeePayrollStats(),
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

export const useEmployeeStats = () => {
  return useQuery({
    queryKey: ['employeeStats'],
    queryFn: () => apiClient.getEmployeeStats(),
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

// ==================== TRANSACTIONS ====================

export const useTransactions = (
  params?: { page?: number; limit?: number; type?: string; status?: string },
  options?: UseQueryOptions<{ data: Transaction[]; total: number }, AxiosError>
) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => apiClient.getTransactions(params),
    staleTime: 10000, // 10 seconds - shorter for transactions
    refetchInterval: 30000, // Re-fetch every 30 seconds
    ...options,
  });
};

export const useTransactionById = (id: string, options?: UseQueryOptions<Transaction, AxiosError>) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => apiClient.getTransactionById(id),
    staleTime: 10000,
    ...options,
  });
};

export const useTransactionStats = () => {
  return useQuery({
    queryKey: ['transactionStats'],
    queryFn: () => apiClient.getTransactionStats(),
    staleTime: 10000,
    refetchInterval: 30000,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (transaction: Partial<Transaction>) =>
      apiClient.createTransaction(transaction),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionStats'] });
    },
  });
};

export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.updateTransactionStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.setQueryData(['transaction', data.id], data);
    },
  });
};

// ==================== RESOURCES ====================

export const useResources = (
  params?: { page?: number; limit?: number; status?: string; department?: string },
  options?: UseQueryOptions<{ data: Resource[]; total: number }, AxiosError>
) => {
  return useQuery({
    queryKey: ['resources', params],
    queryFn: () => apiClient.getResources(params),
    staleTime: 20000, // 20 seconds
    refetchInterval: 30000, // Re-fetch every 30 seconds
    ...options,
  });
};

export const useResourceById = (id: string, options?: UseQueryOptions<Resource, AxiosError>) => {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: () => apiClient.getResourceById(id),
    staleTime: 20000,
    ...options,
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Resource> }) =>
      apiClient.updateResource(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.setQueryData(['resource', data.id], data);
    },
  });
};

export const useResourceStats = () => {
  return useQuery({
    queryKey: ['resourceStats'],
    queryFn: () => apiClient.getResourceStats(),
    staleTime: 20000,
    refetchInterval: 30000,
  });
};

// ==================== SETTINGS ====================

export const useSettings = (options?: UseQueryOptions<Settings, AxiosError>) => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => apiClient.getSettings(),
    staleTime: 60000, // 60 seconds - settings don't change frequently
    ...options,
  });
};

export const useUpdateCompanyInfo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<Settings>) =>
      apiClient.updateCompanyInfo(updates),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
    },
  });
};

export const useUpdatePayrollCycle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cycle, day }: { cycle: string; day?: number }) =>
      apiClient.updatePayrollCycle(cycle, day),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
    },
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notifications: Partial<Settings>) =>
      apiClient.updateNotificationSettings(notifications),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
    },
  });
};

export const useUpdateYieldSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (percentage: number) =>
      apiClient.updateYieldSettings(percentage),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
    },
  });
};

export const useUpdateAllSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: Partial<Settings>) =>
      apiClient.updateAllSettings(settings),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
    },
  });
};
