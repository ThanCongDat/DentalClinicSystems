export interface TreatmentPlanItemDTO {
  id: number;
  procedureId: number;
  procedureName: string;
  toothNumber?: number;
  sortOrder: number;
  status: string;
  estimatedPrice: number;
  actualPrice: number;
  notes?: string;
  plannedDate?: string;
  completedDate?: string;
  completedByEmrId?: number;
}

export interface TreatmentPlanSummaryDTO {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  title: string;
  status: string;
  totalEstimatedCost: number;
  totalPaidAmount: number;
  totalItems: number;
  completedItems: number;
  createdAt: string;
}

export interface TreatmentPlanDetailDTO extends TreatmentPlanSummaryDTO {
  description?: string;
  completedAt?: string;
  items: TreatmentPlanItemDTO[];
}
