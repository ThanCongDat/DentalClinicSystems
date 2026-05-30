export interface LabOrderItemDTO {
  id: number;
  toothNumber?: number;
  description: string;
  material?: string;
  shade?: string;
  specialInstructions?: string;
  quantity: number;
  unitCost: number;
}

export interface LabOrderDTO {
  id: number;
  orderNumber: string;
  branchId: number;
  branchName: string;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  // .NET System.Text.Json camelCase: EMRId -> eMRId
  eMRId?: number;
  labVendorId: number;
  labVendorName: string;
  status: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  receivedDate?: string;
  labCost: number;
  instructions?: string;
  note?: string;
  createdAt: string;
  items: LabOrderItemDTO[];
}
