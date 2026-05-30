export interface VitalSignsDTO {
  // .NET System.Text.Json camelCase: BPSystolic -> bPSystolic, BPDiastolic -> bPDiastolic
  bPSystolic?: number;
  bPDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  spO2?: number;
  weight?: number;
  height?: number;
  note?: string;
  recordedAt: string;
}

export interface EMRProcedureDTO {
  id: number;
  procedureId: number;
  procedureName: string;
  actualPrice?: number;
  note?: string;
  isCompleted: boolean;
}

export interface PrescriptionItemDTO {
  medicineName: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  instructions?: string;
}

export interface PrescriptionDTO {
  id: number;
  doctorName: string;
  note?: string;
  validUntil?: string;
  createdAt: string;
  items: PrescriptionItemDTO[];
}

export interface AttachmentDTO {
  id: number;
  attachmentType: string;
  fileName: string;
  fileUrl: string;
  contentType?: string;
  fileSizeBytes?: number;
  note?: string;
  uploadedAt: string;
}

export interface EMRSummaryDTO {
  id: number;
  patientId: number;
  patientName: string;
  patientCode: string;
  doctorId: number;
  doctorName: string;
  appointmentId?: number;
  chiefComplaint?: string;
  diagnosis: string;
  warrantyCode?: string;
  warrantyValidUntil?: string;
  createdAt: string;
}

export interface EMRDetailDTO extends EMRSummaryDTO {
  treatmentNotes?: string;
  vitalSigns?: VitalSignsDTO;
  procedures: EMRProcedureDTO[];
  prescriptions: PrescriptionDTO[];
  attachments: AttachmentDTO[];
}
