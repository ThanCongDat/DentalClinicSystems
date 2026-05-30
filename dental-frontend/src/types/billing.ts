export interface InvoiceItemResponse {
  description: string;
  toothNumber?: number;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  lineTotal: number;
}

export interface PaymentSummaryResponse {
  paymentMethod: string;
  amount: number;
  transactionRef?: string;
  paidAt: string;
}

export interface InvoiceResponse {
  id: number;
  invoiceNumber: string;
  patientName: string;
  doctorName: string;
  status: string;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  issuedDate: string;
  dueDate?: string;
  items: InvoiceItemResponse[];
  payments: PaymentSummaryResponse[];
}

// InvoiceDTO = lightweight list alias of InvoiceResponse (backend has no separate list DTO).
// branchName and taxAmount are NOT returned by the backend — removed to prevent silent bugs.
// TODO: add GET /api/invoices admin list endpoint in backend when needed.
export type InvoiceDTO = Pick<InvoiceResponse,
  'id' | 'invoiceNumber' | 'patientName' | 'doctorName' |
  'status' | 'subTotal' | 'discountAmount' | 'totalAmount' |
  'paidAmount' | 'remainingAmount' | 'issuedDate' | 'dueDate'
>;

export interface InsuranceClaimDTO {
  id: number;
  invoiceId: number;
  invoiceNumber: string;
  insurerName: string;
  policyNumber?: string;
  claimedAmount: number;
  approvedAmount: number;
  status: string;
  submittedDate?: string;
  approvedDate?: string;
  note?: string;
}

export interface CommissionDTO {
  id: number;
  doctorId: number;
  doctorName: string;
  invoiceId: number;
  invoiceNumber: string;
  commissionRate: number;
  commissionAmount: number;
  isPaid: boolean;
  paidAt?: string;
  note?: string;
  createdAt: string;
}
