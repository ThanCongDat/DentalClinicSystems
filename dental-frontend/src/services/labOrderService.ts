import { api } from '../lib/api';
import type { ApiResponse, PagedResult, LabOrderDTO } from '../types';

export const labOrderService = {
  getAll: (page = 1, pageSize = 15, branchId?: number) =>
    api.get<PagedResult<LabOrderDTO>>('/api/lab-orders', { params: { page, pageSize, branchId } }),

  getById: (id: number) =>
    api.get<ApiResponse<LabOrderDTO>>(`/api/lab-orders/${id}`),

  create: (data: object) =>
    api.post<ApiResponse<LabOrderDTO>>('/api/lab-orders', data),

  update: (id: number, data: {
    expectedDeliveryDate?: string;
    labCost?: number;
    instructions?: string;
    note?: string;
  }) => api.put<ApiResponse<LabOrderDTO>>(`/api/lab-orders/${id}`, data),

  updateStatus: (id: number, data: {
    status: string;
    receivedDate?: string;
    note?: string;
  }) => api.put<ApiResponse<LabOrderDTO>>(`/api/lab-orders/${id}/status`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<boolean>>(`/api/lab-orders/${id}`),
};
