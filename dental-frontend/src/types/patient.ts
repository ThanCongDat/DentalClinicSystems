export interface PatientAllergyDTO {
  id: number;
  allergyType: string;
  allergenName: string;
  severity: string;
  reactionDescription?: string;
  isActive: boolean;
}

export interface PatientDTO {
  id: number;
  patientCode: string;
  fullName: string;
  phone: string;
  email?: string;
  // .NET System.Text.Json camelCase: DOB -> dOB
  dOB?: string;
  gender: string;
  address?: string;
  bloodType?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  totalAppointments: number;
  lastVisit?: string;
  allergies: PatientAllergyDTO[];
}

export interface RecallDTO {
  id: number;
  patientId: number;
  patientName: string;
  recallType: string;
  status: string;
  dueDate: string;
  completedDate?: string;
  note?: string;
  createdAt: string;
}

export interface ConsentDTO {
  id: number;
  consentType: string;
  isConsented: boolean;
  consentedAt: string;
  revokedAt?: string;
  witnessName?: string;
  note?: string;
}
