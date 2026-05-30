export interface DoctorDTO {
  id: number;
  fullName: string;
  title: string;
  specialization?: string;
  licenseNumber?: string;
  avatarUrl?: string;
  slotDurationMinutes: number;
  branchId: number;
  branchName: string;
  isActive: boolean;
}

export interface DoctorBranchDTO {
  branchId: number;
  branchName: string;
  isActive: boolean;
  effectiveFrom?: string;
  slotDurationMinutes?: number;
}

export interface BranchDTO {
  id: number;
  name: string;
  address: string;
  phone: string;
  mapEmbedUrl?: string;
  isActive: boolean;
  doctorCount: number;
}

export interface ProcedureCategoryDTO {
  id: number;
  name: string;
  description?: string;
  procedureCount: number;
}

export interface ProcedureDTO {
  id: number;
  name: string;
  code?: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  defaultPrice: number;
  defaultDurationMinutes: number;
  isActive: boolean;
}

export interface ServiceCategoryDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  serviceCount: number;
}

export interface ServiceDTO {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  slug: string;
  thumbnail?: string;
  content?: string;
}
