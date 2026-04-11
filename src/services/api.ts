import axiosInstance from './axiosInstance';

// Employee API
export const employeeAPI = {
  getAll: (params?: { skip?: number; limit?: number }) =>
    axiosInstance.get('/employees', { params }),
  
  getById: (id: string) =>
    axiosInstance.get(`/employees/${id}`),
  
  create: (data: any) =>
    axiosInstance.post('/employees', data),
  
  update: (id: string, data: any) =>
    axiosInstance.put(`/employees/${id}`, data),
  
  delete: (id: string) =>
    axiosInstance.delete(`/employees/${id}`),
  
  updateStatus: (id: string, status: string) =>
    axiosInstance.patch(`/employees/${id}/status`, { status }),
  
  getPayrollSummary: (id: string) =>
    axiosInstance.get(`/employees/${id}/payroll`),
};

// Resource API
export const resourceAPI = {
  getAll: (params?: { skip?: number; limit?: number }) =>
    axiosInstance.get('/resources', { params }),
  
  getById: (id: string) =>
    axiosInstance.get(`/resources/${id}`),
  
  create: (data: any) =>
    axiosInstance.post('/resources', data),
  
  update: (id: string, data: any) =>
    axiosInstance.put(`/resources/${id}`, data),
  
  delete: (id: string) =>
    axiosInstance.delete(`/resources/${id}`),
};

// Transaction API
export const transactionAPI = {
  getAll: (params?: { skip?: number; limit?: number }) =>
    axiosInstance.get('/transactions', { params }),
  
  getById: (id: string) =>
    axiosInstance.get(`/transactions/${id}`),
  
  create: (data: any) =>
    axiosInstance.post('/transactions', data),
  
  search: (params?: any) =>
    axiosInstance.get('/transactions/search', { params }),
};

// Settings API
export const settingsAPI = {
  get: () =>
    axiosInstance.get('/settings'),
  
  update: (data: any) =>
    axiosInstance.put('/settings', data),
};

// AI Config API
export const aiConfigAPI = {
  getAll: (params?: { skip?: number; limit?: number }) =>
    axiosInstance.get('/ai-config', { params }),
  
  get: () =>
    axiosInstance.get('/ai-config'),
  
  create: (data: any) =>
    axiosInstance.post('/ai-config', data),
  
  update: (data: any) =>
    axiosInstance.put('/ai-config', data),
  
  updateLayout: (data: any) =>
    axiosInstance.patch('/ai-config/layout', data),
  
  updateWidgets: (data: any) =>
    axiosInstance.put('/ai-config/widgets', data),
  
  addWidget: (widget: any) =>
    axiosInstance.post('/ai-config/widgets', widget),
  
  updateWidget: (widgetId: string, data: any) =>
    axiosInstance.patch(`/ai-config/widgets/${widgetId}`, data),
  
  deleteWidget: (widgetId: string) =>
    axiosInstance.delete(`/ai-config/widgets/${widgetId}`),
  
  publish: () =>
    axiosInstance.patch('/ai-config/publish', {}),
  
  deactivate: () =>
    axiosInstance.patch('/ai-config/deactivate', {}),
};

// Authentication API
export const authAPI = {
  getLoginMessage: (walletAddress: string) =>
    axiosInstance.post('/auth/login-message', { walletAddress }),
  
  walletLogin: (data: any) =>
    axiosInstance.post('/auth/wallet-login', data),
  
  refreshToken: (refreshToken: string) =>
    axiosInstance.post('/auth/refresh-token', { refreshToken }),
};
