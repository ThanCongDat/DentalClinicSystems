import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../../lib/api';
import { emrService } from '../emrService';
import type { EMRSummaryDTO, EMRDetailDTO, PagedResult } from '../../types';

vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockSummary: EMRSummaryDTO = {
  id: 1,
  patientId: 10,
  patientName: 'Nguyen Van A',
  patientCode: 'BN000001',
  doctorId: 5,
  doctorName: 'BS. Tran B',
  diagnosis: 'Sau rang',
  createdAt: '2026-05-01T08:00:00Z',
};

const mockDetail: EMRDetailDTO = {
  ...mockSummary,
  procedures: [],
  prescriptions: [],
  attachments: [],
};

const mockPaged: PagedResult<EMRSummaryDTO> = {
  items: [mockSummary],
  totalCount: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  hasPrev: false,
  hasNext: false,
};

beforeEach(() => vi.clearAllMocks());

describe('emrService.getByPatient', () => {
  it('goi dung endpoint va tra ve PagedResult', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPaged });
    const res = await emrService.getByPatient(10);
    expect(api.get).toHaveBeenCalledWith('/api/emr/patients/10');
    expect(res.data?.items).toHaveLength(1);
    expect(res.data?.items[0].patientCode).toBe('BN000001');
  });

  it('tra ve items rong neu data null', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: null });
    const res = await emrService.getByPatient(99);
    expect(res.data?.items ?? []).toHaveLength(0);
  });
});

describe('emrService.getById', () => {
  it('goi dung endpoint va tra ve EMRDetailDTO', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockDetail });
    const res = await emrService.getById(1);
    expect(api.get).toHaveBeenCalledWith('/api/emr/1');
    expect(res.data?.patientName).toBe('Nguyen Van A');
    expect(res.data?.procedures).toEqual([]);
    expect(res.data?.prescriptions).toEqual([]);
  });

  it('tra ve null neu EMR khong ton tai', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: null });
    const res = await emrService.getById(999);
    expect(res.data).toBeNull();
  });
});

describe('emrService.lookup', () => {
  it('goi dung endpoint voi patientCode va phone', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: {} });
    await emrService.lookup({ patientCode: 'BN000001', phone: '0901234567' });
    expect(api.get).toHaveBeenCalledWith('/api/emr/lookup', {
      params: { patientCode: 'BN000001', phone: '0901234567' },
    });
  });
});

describe('emrService.create', () => {
  it('goi POST /api/emr voi data dung', async () => {
    const payload = { patientId: 10, doctorId: 5, diagnosis: 'Viem loi' };
    vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true, data: mockDetail } });
    const res = await emrService.create(payload);
    expect(api.post).toHaveBeenCalledWith('/api/emr', payload);
    expect(res.data?.success).toBe(true);
  });
});

describe('emrService.createPrescription', () => {
  it('goi POST /api/emr/prescriptions', async () => {
    const payload = { emrId: 1, doctorId: 5, items: [] };
    vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } });
    await emrService.createPrescription(payload);
    expect(api.post).toHaveBeenCalledWith('/api/emr/prescriptions', payload);
  });
});

describe('emrService.completeProcedure', () => {
  it('goi PUT dung endpoint', async () => {
    vi.mocked(api.put).mockResolvedValueOnce({ data: { success: true } });
    await emrService.completeProcedure(42);
    expect(api.put).toHaveBeenCalledWith('/api/emr/procedures/42/complete');
  });
});

describe('emrService.deleteAttachment', () => {
  it('goi DELETE dung endpoint', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({ data: { success: true } });
    await emrService.deleteAttachment(7);
    expect(api.delete).toHaveBeenCalledWith('/api/emr/attachments/7');
  });
});
