import { api } from '../lib/api';
import type { DashboardSummaryDTO } from '../types';

export const reportService = {
  getDashboard: (branchId?: number) =>
    api.get<DashboardSummaryDTO>('/api/reports/dashboard', { params: { branchId } }),

  getRevenue: (params: object) =>
    api.get('/api/reports/revenue', { params }),

  getAppointmentStats: (params: object) =>
    api.get('/api/reports/appointments', { params }),
};
