import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../../lib/api';
import { patientService } from '../patientService';
import type { PatientDTO, RecallDTO, ConsentDTO, PagedResult } from '../../types';

vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockPatient: PatientDTO = {
  id: 1,
  patientCode: 'BN000001',
  fullName: 'Nguyen Van A',
  phone: '0901234567',
  gender: 'Male',
  totalAppointments: 3,
  allergies: [],
};

const mockPaged: PagedResult<PatientDTO> = {
  items: [mockPatient],
  totalCount: 1,
  page: 1,
  pageSize: 20,
  totalPages: 1,
  hasPrev: false,
  hasNext: false,
};

const mockRecall: RecallDTO = {
  id: 1,
  patientId: 1,
  patientName: 'Nguyen Van A',
  recallType: 'Checkup',
  status: 'Pending',
  dueDate: '2026-06-01',
  createdAt: '2026-05-01T00:00:00Z',
};

const mockConsent: ConsentDTO = {
  id: 1,
  consentType: 'Treatment',
  isConsented: true,
  consentedAt: '2026-05-01T00:00:00Z',
};

beforeEach(() => vi.clearAllMocks());

describe('patientService.search', () => {
  it('goi GET /api/patients va tra ve PagedResult', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPaged });
    const res = await patientService.search({ keyword: 'Nguyen' });
    expect(api.get).toHaveBeenCalledWith('/api/patients', {
      params: { keyword: 'Nguyen' },
    });
    expect(res.data?.items).toHaveLength(1);
    expect(res.data?.items[0].patientCode).toBe('BN000001');
  });
});

describe('patientService.getById', () => {
  it('tra ve PatientDTO truc tiep (khong co ApiResponse wrapper)', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockPatient });
    const res = await patientService.getById(1);
    expect(api.get).toHaveBeenCalledWith('/api/patients/1');
    expect(res.data?.fullName).toBe('Nguyen Van A');
  });
});

describe('patientService.getRecalls', () => {
  it('tra ve List<RecallDTO> truc tiep — khong co ApiResponse wrapper', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [mockRecall] });
    const res = await patientService.getRecalls(1);
    expect(api.get).toHaveBeenCalledWith('/api/patients/1/recalls');
    // Backend tra ve mang truc tiep, khong phai ApiResponse
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data?.[0].recallType).toBe('Checkup');
  });

  it('tra ve mang rong neu khong co recall', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
    const res = await patientService.getRecalls(99);
    expect(res.data).toHaveLength(0);
  });
});

describe('patientService.getConsents', () => {
  it('tra ve List<ConsentDTO> truc tiep — khong co ApiResponse wrapper', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [mockConsent] });
    const res = await patientService.getConsents(1);
    expect(api.get).toHaveBeenCalledWith('/api/patients/1/consents');
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data?.[0].consentType).toBe('Treatment');
  });
});

describe('patientService.create', () => {
  it('goi POST /api/patients', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true, data: mockPatient } });
    const payload = { fullName: 'Nguyen Van B', phone: '0901111111', gender: 'Female' };
    const res = await patientService.create(payload);
    expect(api.post).toHaveBeenCalledWith('/api/patients', payload);
    expect(res.data?.success).toBe(true);
  });
});

describe('patientService.delete', () => {
  it('goi DELETE /api/patients/{id}', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({ data: { success: true } });
    await patientService.delete(1);
    expect(api.delete).toHaveBeenCalledWith('/api/patients/1');
  });
});

describe('patientService — PatientDTO.dOB field name (camelCase cua DOB)', () => {
  it('getById tra ve doi tuong voi truong dOB thay vi dob', async () => {
    const patient: PatientDTO = {
      id: 1, patientCode: 'BN000001', fullName: 'Test',
      phone: '0900000001', gender: 'Male',
      dOB: '1990-01-15',
      totalAppointments: 0, allergies: [],
    };
    vi.mocked(api.get).mockResolvedValue({ data: patient });
    const result = await patientService.getById(1);
    const p = result.data as PatientDTO;
    // dOB (not dob) phai co gia tri
    expect(p.dOB).toBe('1990-01-15');
    // dob khong ton tai
    expect((p as unknown as Record<string, unknown>)["dob"]).toBeUndefined();
  });
});
