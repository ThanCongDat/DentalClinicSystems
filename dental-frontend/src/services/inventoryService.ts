import { api } from '../lib/api';
import type { ApiResponse, StockLevelDTO, LowStockAlertDTO, ExpiringBatchDTO } from '../types';

export const inventoryService = {
  getLevels: (branchId: number) =>
    api.get<ApiResponse<StockLevelDTO[]>>(`/api/inventory/levels/${branchId}`),

  getAlerts: (branchId: number) =>
    api.get<ApiResponse<LowStockAlertDTO[]>>(`/api/inventory/alerts/${branchId}`),

  getExpiring: (branchId: number) =>
    api.get<ApiResponse<ExpiringBatchDTO[]>>(`/api/inventory/expiring/${branchId}`),

  receiveStock: (data: object) =>
    api.post<ApiResponse<boolean>>('/api/inventory/receive', data),

  deductStock: (emrProcedureId: number) =>
    api.post<ApiResponse<boolean>>(`/api/inventory/deduct/${emrProcedureId}`),
};
