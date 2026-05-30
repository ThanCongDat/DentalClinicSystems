import { api } from '../lib/api';
import type { ApiResponse, MembershipCardDTO, PointTransactionDTO, FeedbackDTO, CustomerTagDTO, NewsDTO } from '../types';

// ── Membership & Points ───────────────────────────────────────
export const membershipService = {
  getCard: (patientId: number) =>
    api.get<ApiResponse<MembershipCardDTO>>(`/api/crm/patients/${patientId}/membership`),

  getPointHistory: (cardId: number) =>
    api.get<ApiResponse<PointTransactionDTO[]>>(`/api/crm/cards/${cardId}/points`),

  redeemPoints: (cardId: number, points: number, note: string) =>
    api.post<ApiResponse<boolean>>(`/api/crm/cards/${cardId}/redeem`, { points, note }),

  earnFromInvoice: (invoiceId: number) =>
    api.post<ApiResponse<boolean>>(`/api/crm/invoices/${invoiceId}/earn-points`),
};

// ── Customer Feedback ─────────────────────────────────────────
export const feedbackService = {
  getAll:  (params?: object) => api.get<ApiResponse<FeedbackDTO[]>>('/api/crm/feedback', { params }),
  getById: (id: number) => api.get<ApiResponse<FeedbackDTO>>(`/api/crm/feedback/${id}`),
  create:  (data: object) => api.post<ApiResponse<FeedbackDTO>>('/api/crm/feedback', data),
  update:  (id: number, data: object) => api.put<ApiResponse<FeedbackDTO>>(`/api/crm/feedback/${id}`, data),
  delete:  (id: number) => api.delete<ApiResponse<boolean>>(`/api/crm/feedback/${id}`),
};

// ── Customer Tags ─────────────────────────────────────────────
export const tagService = {
  getAll:  () => api.get<ApiResponse<CustomerTagDTO[]>>('/api/crm/tags'),
  create:  (data: object) => api.post<ApiResponse<CustomerTagDTO>>('/api/crm/tags', data),
  update:  (id: number, data: object) => api.put<ApiResponse<CustomerTagDTO>>(`/api/crm/tags/${id}`, data),
  delete:  (id: number) => api.delete<ApiResponse<boolean>>(`/api/crm/tags/${id}`),
  assign:  (patientId: number, tagId: number) =>
    api.post<ApiResponse<boolean>>('/api/crm/tags/assign', { patientId, tagId }),
  unassign: (patientId: number, tagId: number) =>
    api.delete<ApiResponse<boolean>>(`/api/crm/tags/assign/${patientId}/${tagId}`),
  getByPatient: (patientId: number) =>
    api.get<ApiResponse<CustomerTagDTO[]>>(`/api/crm/tags/patient/${patientId}`),
};

// ── News / Content ────────────────────────────────────────────
export const newsService = {
  getAll:    (params?: object) => api.get<ApiResponse<NewsDTO[]>>('/api/content/news', { params }),
  getBySlug: (slug: string) => api.get<ApiResponse<NewsDTO>>(`/api/content/news/${slug}`),
  create:    (data: object) => api.post<ApiResponse<NewsDTO>>('/api/content/news', data),
  update:    (id: number, data: object) => api.put<ApiResponse<NewsDTO>>(`/api/content/news/${id}`, data),
  delete:    (id: number) => api.delete<ApiResponse<boolean>>(`/api/content/news/${id}`),
};
