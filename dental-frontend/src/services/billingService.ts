import { api } from '../lib/api';
import type { ApiResponse, InvoiceDTO, InvoiceResponse, InsuranceClaimDTO, CommissionDTO, PagedResult } from '../types';

export const billingService = {
  // NOTE: backend has no GET /api/invoices admin list endpoint yet.
  // BillingPage uses this — will return 404 until backend adds the route.
  getAll: (params?: object) =>
    api.get<ApiResponse<PagedResult<InvoiceDTO>>>('/api/invoices/list', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<InvoiceResponse>>(`/api/invoices/${id}`),

  // Backend: GET /api/invoices/patient/{id} -> ApiResponse<PagedResult<InvoiceResponse>>
  getByPatient: (patientId: number, page = 1, pageSize = 20) =>
    api.get<ApiResponse<PagedResult<InvoiceResponse>>>(`/api/invoices/patient/${patientId}`, { params: { page, pageSize } }),

  create: (data: object) =>
    api.post<ApiResponse<InvoiceResponse>>('/api/invoices', data),

  // Payments
  addPayment: (data: object) =>
    api.post<ApiResponse<boolean>>('/api/invoices/payments', data),

  // Installment plans
  createInstallmentPlan: (data: object) =>
    api.post<ApiResponse<boolean>>('/api/invoices/installments', data),

  // Insurance claims
  createClaim: (data: object) =>
    api.post<ApiResponse<InsuranceClaimDTO>>('/api/invoices/claims', data),

  getClaim: (claimId: number) =>
    api.get<ApiResponse<InsuranceClaimDTO>>(`/api/invoices/claims/${claimId}`),

  getClaimsByInvoice: (invoiceId: number) =>
    api.get<ApiResponse<InsuranceClaimDTO[]>>(`/api/invoices/${invoiceId}/claims`),

  updateClaim: (claimId: number, data: object) =>
    api.put<ApiResponse<InsuranceClaimDTO>>(`/api/invoices/claims/${claimId}`, data),

  // Doctor commissions
  createCommission: (data: object) =>
    api.post<ApiResponse<CommissionDTO>>('/api/invoices/commissions', data),

  markCommissionPaid: (commissionId: number) =>
    api.put<ApiResponse<boolean>>(`/api/invoices/commissions/${commissionId}/paid`),

  getCommissionsByDoctor: (doctorId: number) =>
    api.get<ApiResponse<CommissionDTO[]>>(`/api/invoices/commissions/doctor/${doctorId}`),
};
