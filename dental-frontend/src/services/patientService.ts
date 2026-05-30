import { api } from '../lib/api';
import type { ApiResponse, PagedResult, PatientDTO, PatientAllergyDTO, RecallDTO, ConsentDTO } from '../types';

export const patientService = {
  search: (params: {
    keyword?: string; phone?: string; patientCode?: string; page?: number; pageSize?: number;
  }) => api.get<PagedResult<PatientDTO>>('/api/patients', { params }),

  getById: (id: number) =>
    api.get<PatientDTO>(`/api/patients/${id}`),

  create: (data: object) =>
    api.post<ApiResponse<PatientDTO>>('/api/patients', data),

  update: (id: number, data: object) =>
    api.put<ApiResponse<PatientDTO>>(`/api/patients/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<boolean>>(`/api/patients/${id}`),

  // Allergies
  addAllergy: (patientId: number, data: object) =>
    api.post<ApiResponse<PatientAllergyDTO>>(`/api/patients/${patientId}/allergies`, data),

  updateAllergy: (allergyId: number, data: object) =>
    api.put<ApiResponse<PatientAllergyDTO>>(`/api/patients/allergies/${allergyId}`, data),

  deleteAllergy: (allergyId: number) =>
    api.delete<ApiResponse<boolean>>(`/api/patients/allergies/${allergyId}`),

  // Recalls — backend returns List<RecallDTO> directly (no ApiResponse wrapper)
  getRecalls: (patientId: number) =>
    api.get<RecallDTO[]>(`/api/patients/${patientId}/recalls`),

  createRecall: (data: object) =>
    api.post<ApiResponse<RecallDTO>>('/api/patients/recalls', data),

  updateRecallStatus: (recallId: number, data: object) =>
    api.put<ApiResponse<boolean>>(`/api/patients/recalls/${recallId}/status`, data),

  // Consents — backend returns List<ConsentDTO> directly (no ApiResponse wrapper)
  getConsents: (patientId: number) =>
    api.get<ConsentDTO[]>(`/api/patients/${patientId}/consents`),

  createConsent: (data: object) =>
    api.post<ApiResponse<ConsentDTO>>('/api/patients/consents', data),
};
