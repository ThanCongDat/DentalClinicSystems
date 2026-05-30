import { api } from '../lib/api';
import type { ApiResponse, AppointmentListDTO, PagedResult } from '../types';

export const appointmentService = {
  getAll: (params: object) =>
    api.get<PagedResult<AppointmentListDTO>>('/api/appointments', { params }),

  getById: (id: number) =>
    api.get(`/api/appointments/${id}`),

  getSlots: (doctorId: number, date: string) =>
    api.get('/api/appointments/slots', { params: { doctorId, date } }),

  book: (data: object) =>
    api.post<ApiResponse<object>>('/api/appointments', data),

  confirm: (id: number) =>
    api.put<ApiResponse<boolean>>(`/api/appointments/${id}/confirm`),

  complete: (id: number) =>
    api.put<ApiResponse<boolean>>(`/api/appointments/${id}/complete`),

  cancel: (id: number, reason: string) =>
    api.put<ApiResponse<boolean>>(`/api/appointments/${id}/cancel`, { reason }),

  noShow: (id: number) =>
    api.put<ApiResponse<boolean>>(`/api/appointments/${id}/no-show`),

  reschedule: (id: number, newDate: string, newStartTime: string, reason?: string) =>
    api.put<ApiResponse<boolean>>(`/api/appointments/${id}/reschedule`, { newDate, newStartTime, reason }),
};
