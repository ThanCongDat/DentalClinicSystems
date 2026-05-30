export interface RecentAppointmentDTO {
  id: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  startTime: string;
  status: string;
}

export interface TopDoctorDTO {
  doctorId: number;
  doctorName: string;
  appointmentCount: number;
  revenue: number;
}

export interface DashboardSummaryDTO {
  todayAppointments: number;
  pendingAppointments: number;
  totalPatients: number;
  newPatientsThisMonth: number;
  revenueToday: number;
  revenueThisMonth: number;
  lowStockItems: number;
  pendingLabOrders: number;
  recentAppointments: RecentAppointmentDTO[];
  topDoctors: TopDoctorDTO[];
}
