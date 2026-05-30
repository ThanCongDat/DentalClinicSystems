import { api } from '../lib/api';
import type { ApiResponse, PagedResult, EMRSummaryDTO, EMRDetailDTO, EMRProcedureDTO, PrescriptionDTO, AttachmentDTO } from '../types';

export const emrService = {
  // EMR
  // Public patient self-lookup: GET /api/emr/lookup?patientCode=BN000001&phone=0901234567
  lookup: (params: { patientCode: string; phone: string }) =>
    api.get<object>('/api/emr/lookup', { params }),

  // Returns PagedResult<EMRSummaryDTO> directly (not wrapped in ApiResponse)
  getByPatient: (patientId: number) =>
    api.get<PagedResult<EMRSummaryDTO>>(`/api/emr/patients/${patientId}`),

  // Returns EMRDetailDTO directly (not wrapped in ApiResponse)
  getById: (id: number) =>
    api.get<EMRDetailDTO>(`/api/emr/${id}`),

  create: (data: object) =>
    api.post<ApiResponse<EMRDetailDTO>>('/api/emr', data),

  update: (id: number, data: object) =>
    api.put<ApiResponse<EMRDetailDTO>>(`/api/emr/${id}`, data),

  // Procedures
  addProcedure: (emrId: number, data: object) =>
    api.post<ApiResponse<EMRProcedureDTO>>(`/api/emr/${emrId}/procedures`, data),

  completeProcedure: (emrProcedureId: number) =>
    api.put<ApiResponse<boolean>>(`/api/emr/procedures/${emrProcedureId}/complete`),

  // Prescriptions
  createPrescription: (data: object) =>
    api.post<ApiResponse<PrescriptionDTO>>('/api/emr/prescriptions', data),

  // Vital signs
  upsertVitals: (emrId: number, data: object) =>
    api.put<ApiResponse<boolean>>(`/api/emr/${emrId}/vitals`, data),

  // Attachments
  addAttachment: (data: object) =>
    api.post<ApiResponse<AttachmentDTO>>('/api/emr/attachments', data),

  deleteAttachment: (attachmentId: number) =>
    api.delete<ApiResponse<boolean>>(`/api/emr/attachments/${attachmentId}`),
};
