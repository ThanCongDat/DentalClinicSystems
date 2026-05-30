import { api } from '../lib/api';
import type { ApiResponse, TreatmentPlanSummaryDTO, TreatmentPlanDetailDTO } from '../types';

export const treatmentPlanService = {
  create: (data: object) =>
    api.post<ApiResponse<TreatmentPlanDetailDTO>>('/api/treatment-plans', data),

  getById: (id: number) =>
    api.get<ApiResponse<TreatmentPlanDetailDTO>>(`/api/treatment-plans/${id}`),

  getByPatient: (patientId: number) =>
    api.get<ApiResponse<TreatmentPlanSummaryDTO[]>>(`/api/treatment-plans/patient/${patientId}`),

  addItem: (planId: number, data: object) =>
    api.post<ApiResponse<boolean>>(`/api/treatment-plans/${planId}/items`, data),

  updateItemStatus: (itemId: number, data: object) =>
    api.put<ApiResponse<boolean>>(`/api/treatment-plans/items/${itemId}/status`, data),

  updateStatus: (planId: number, data: { status: string }) =>
    api.put<ApiResponse<boolean>>(`/api/treatment-plans/${planId}/status`, data),
};
