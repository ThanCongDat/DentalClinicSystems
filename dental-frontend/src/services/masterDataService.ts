import { api } from '../lib/api';
import type { ApiResponse, BranchDTO, DoctorDTO, DoctorBranchDTO, ProcedureCategoryDTO, ProcedureDTO, ServiceCategoryDTO, ServiceDTO } from '../types';

export const branchService = {
  getAll:  () => api.get<BranchDTO[]>('/api/branches'),
  getById: (id: number) => api.get<BranchDTO>(`/api/branches/${id}`),
  create:  (data: object) => api.post<ApiResponse<BranchDTO>>('/api/branches', data),
  update:  (id: number, data: object) => api.put<ApiResponse<BranchDTO>>(`/api/branches/${id}`, data),
  delete:  (id: number) => api.delete<ApiResponse<boolean>>(`/api/branches/${id}`),
};

export const doctorService = {
  getAll:  (branchId?: number) => api.get<DoctorDTO[]>('/api/doctors', { params: { branchId } }),
  getById: (id: number) => api.get<DoctorDTO>(`/api/doctors/${id}`),
  create:  (data: object) => api.post<ApiResponse<DoctorDTO>>('/api/doctors', data),
  update:  (id: number, data: object) => api.put<ApiResponse<DoctorDTO>>(`/api/doctors/${id}`, data),
  delete:  (id: number) => api.delete<ApiResponse<boolean>>(`/api/doctors/${id}`),
  upsertSchedules: (doctorId: number, schedules: object[]) =>
    api.put<ApiResponse<boolean>>(`/api/doctors/${doctorId}/schedules`, schedules),
  addLeave: (data: object) => api.post<ApiResponse<boolean>>('/api/doctors/leaves', data),
  getBranches: (doctorId: number) =>
    api.get<ApiResponse<DoctorBranchDTO[]>>(`/api/doctors/${doctorId}/branches`),
  assignBranch: (doctorId: number, data: object) =>
    api.post<ApiResponse<boolean>>(`/api/doctors/${doctorId}/branches`, data),
  removeBranch: (doctorId: number, branchId: number) =>
    api.delete<ApiResponse<boolean>>(`/api/doctors/${doctorId}/branches/${branchId}`),
};

export const procedureService = {
  getCategories:    () => api.get<ApiResponse<ProcedureCategoryDTO[]>>('/api/procedures/categories'),
  createCategory:   (data: object) => api.post<ApiResponse<ProcedureCategoryDTO>>('/api/procedures/categories', data),
  updateCategory:   (id: number, data: object) => api.put<ApiResponse<ProcedureCategoryDTO>>(`/api/procedures/categories/${id}`, data),
  getAll:   (params?: object) => api.get<ApiResponse<ProcedureDTO[]>>('/api/procedures', { params }),
  getById:  (id: number) => api.get<ApiResponse<ProcedureDTO>>(`/api/procedures/${id}`),
  create:   (data: object) => api.post<ApiResponse<ProcedureDTO>>('/api/procedures', data),
  update:   (id: number, data: object) => api.put<ApiResponse<ProcedureDTO>>(`/api/procedures/${id}`, data),
  delete:   (id: number) => api.delete<ApiResponse<boolean>>(`/api/procedures/${id}`),
};

export const serviceCategoryService = {
  getAll:  () => api.get<ApiResponse<ServiceCategoryDTO[]>>('/api/master/service-categories'),
  getById: (id: number) => api.get<ApiResponse<ServiceCategoryDTO>>(`/api/master/service-categories/${id}`),
  create:  (data: object) => api.post<ApiResponse<ServiceCategoryDTO>>('/api/master/service-categories', data),
  update:  (id: number, data: object) => api.put<ApiResponse<ServiceCategoryDTO>>(`/api/master/service-categories/${id}`, data),
  delete:  (id: number) => api.delete<ApiResponse<boolean>>(`/api/master/service-categories/${id}`),
};

export const clinicServiceService = {
  getAll:    (params?: object) => api.get<ApiResponse<ServiceDTO[]>>('/api/master/services', { params }),
  getBySlug: (slug: string) => api.get<ApiResponse<ServiceDTO>>(`/api/master/services/${slug}`),
  create:    (data: object) => api.post<ApiResponse<ServiceDTO>>('/api/master/services', data),
  update:    (id: number, data: object) => api.put<ApiResponse<ServiceDTO>>(`/api/master/services/${id}`, data),
  delete:    (id: number) => api.delete<ApiResponse<boolean>>(`/api/master/services/${id}`),
};
