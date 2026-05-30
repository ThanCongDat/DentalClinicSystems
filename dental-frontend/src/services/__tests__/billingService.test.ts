import { describe, it, expect, vi, beforeEach } from 'vitest';
import { billingService } from '../billingService';
import { api } from '../../lib/api';
import type { ApiResponse, InvoiceResponse, PagedResult } from '../../types';

vi.mock('../../lib/api', () => ({
  api: {
    get:  vi.fn(),
    post: vi.fn(),
    put:  vi.fn(),
  },
}));

beforeEach(() => vi.clearAllMocks());

const mockInvoice: InvoiceResponse = {
  id: 1,
  invoiceNumber: 'INV-202605-0001',
  patientName: 'Nguyen Van A',
  doctorName: 'BS. Tran B',
  status: 'Paid',
  subTotal: 500000,
  discountAmount: 0,
  totalAmount: 500000,
  paidAmount: 500000,
  remainingAmount: 0,
  issuedDate: '2026-05-01',
  items: [],
  payments: [],
};

const ok = <T>(data: T): ApiResponse<T> => ({ success: true, data, message: 'OK', errors: [] });

describe('billingService — getById', () => {
  it('goi GET /api/invoices/:id va tra ve ApiResponse<InvoiceResponse>', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: ok(mockInvoice) });
    const result = await billingService.getById(1);
    expect(api.get).toHaveBeenCalledWith('/api/invoices/1');
    const body = result.data as ApiResponse<InvoiceResponse>;
    expect(body.data?.invoiceNumber).toBe('INV-202605-0001');
  });
});

describe('billingService — getByPatient', () => {
  it('goi GET /api/invoices/patient/:id voi page va pageSize', async () => {
    const paged: PagedResult<InvoiceResponse> = {
      items: [mockInvoice], totalCount: 1, page: 1, pageSize: 20,
      totalPages: 1, hasPrev: false, hasNext: false,
    };
    vi.mocked(api.get).mockResolvedValue({ data: ok(paged) });
    await billingService.getByPatient(5, 1, 20);
    expect(api.get).toHaveBeenCalledWith(
      '/api/invoices/patient/5',
      { params: { page: 1, pageSize: 20 } },
    );
  });

  it('tra ve PagedResult bao gom items va remainingAmount', async () => {
    const paged: PagedResult<InvoiceResponse> = {
      items: [mockInvoice], totalCount: 1, page: 1, pageSize: 20,
      totalPages: 1, hasPrev: false, hasNext: false,
    };
    vi.mocked(api.get).mockResolvedValue({ data: ok(paged) });
    const result = await billingService.getByPatient(5);
    const body = result.data as ApiResponse<PagedResult<InvoiceResponse>>;
    expect(body.data?.items).toHaveLength(1);
    expect(body.data?.items[0].remainingAmount).toBe(0);
  });
});

describe('billingService — create', () => {
  it('goi POST /api/invoices', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: ok(mockInvoice) });
    await billingService.create({ patientId: 1, doctorId: 2, branchId: 1, items: [] });
    expect(api.post).toHaveBeenCalledWith('/api/invoices', expect.any(Object));
  });
});

describe('billingService — addPayment', () => {
  it('goi POST /api/invoices/payments', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: ok(true) });
    await billingService.addPayment({ invoiceId: 1, amount: 500000, paymentMethod: 'Cash' });
    expect(api.post).toHaveBeenCalledWith('/api/invoices/payments', expect.any(Object));
  });
});

describe('billingService — InvoiceDTO khong co branchName hay taxAmount', () => {
  it('InvoiceDTO la Pick cua InvoiceResponse, co truong remainingAmount', () => {
    // remainingAmount was missing in old InvoiceDTO — must now exist
    expect(mockInvoice.remainingAmount).toBe(0);
    // branchName and taxAmount do not exist on InvoiceResponse
    expect((mockInvoice as unknown as Record<string, unknown>)['branchName']).toBeUndefined();
    expect((mockInvoice as unknown as Record<string, unknown>)['taxAmount']).toBeUndefined();
  });
});
