export interface AppointmentListDTO {
  id: number;
  patientName: string;
  phone: string;
  patientId?: number;
  doctorId?: number;
  doctorName?: string;
  branchId: number;
  branchName: string;
  appointmentDate: string;
  startTime: string;
  endTime?: string;
  chiefComplaint?: string;
  status: string;
  createdAt: string;
}
