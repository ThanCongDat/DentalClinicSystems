import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import PatientsPage from '../PatientsPage';
import { patientService } from '../../services/patientService';
import type { PatientDTO, PagedResult, PatientAllergyDTO } from '../../types';

vi.mock('../../services/patientService', () => ({
  patientService: { search: vi.fn(), delete: vi.fn() },
}));

vi.mock('../../components/PatientFormModal', () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="patient-form-modal">Modal</div> : null,
}));

const allergy: PatientAllergyDTO = {
  id: 1, allergyType: 'Drug', allergenName: 'Penicillin', severity: 'Cao', isActive: true,
};

const patientA: PatientDTO = {
  id: 1, patientCode: 'BN000001', fullName: 'Nguyen Van A',
  phone: '0901234567', gender: 'Male', totalAppointments: 5, allergies: [allergy],
};

const patientB: PatientDTO = {
  id: 2, patientCode: 'BN000002', fullName: 'Tran Thi B',
  phone: '0902222222', gender: 'Female', totalAppointments: 0, allergies: [],
};

const mockPaged: PagedResult<PatientDTO> = {
  items: [patientA, patientB], totalCount: 2, page: 1, pageSize: 20,
  totalPages: 1, hasPrev: false, hasNext: false,
};

function wrap(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => vi.clearAllMocks());

describe('PatientsPage — hien thi danh sach benh nhan', () => {
  it('render ten benh nhan trong bang', async () => {
    vi.mocked(patientService.search).mockResolvedValue({ data: mockPaged } as never);
    wrap(<PatientsPage />);
    await waitFor(() => {
      expect(screen.getByText('Nguyen Van A')).toBeInTheDocument();
      expect(screen.getByText('Tran Thi B')).toBeInTheDocument();
    });
  });

  it('render ma benh nhan va SDT dung', async () => {
    vi.mocked(patientService.search).mockResolvedValue({ data: mockPaged } as never);
    wrap(<PatientsPage />);
    await waitFor(() => {
      expect(screen.getByText('BN000001')).toBeInTheDocument();
      expect(screen.getByText('0901234567')).toBeInTheDocument();
    });
  });

  it('goi patientService.search khi mount', async () => {
    vi.mocked(patientService.search).mockResolvedValue({ data: mockPaged } as never);
    wrap(<PatientsPage />);
    await waitFor(() => expect(patientService.search).toHaveBeenCalledTimes(1));
  });
});

describe('PatientsPage — Drawer chi tiet va hien thi allergies', () => {
  it('hien thi Penicillin (Cao) khi benh nhan co di ung', async () => {
    vi.mocked(patientService.search).mockResolvedValue({ data: mockPaged } as never);
    wrap(<PatientsPage />);
    await waitFor(() => screen.getByText('Nguyen Van A'));
    // Click ten benh nhan de mo Drawer
    fireEvent.click(screen.getByText('Nguyen Van A'));
    await waitFor(() => {
      expect(screen.getByText(/Penicillin/)).toBeInTheDocument();
      expect(screen.getByText(/Cao/)).toBeInTheDocument();
    });
  });

  it('hien thi dan khi benh nhan khong co di ung', async () => {
    vi.mocked(patientService.search).mockResolvedValue({ data: mockPaged } as never);
    wrap(<PatientsPage />);
    await waitFor(() => screen.getByText('Tran Thi B'));
    fireEvent.click(screen.getByText('Tran Thi B'));
    await waitFor(() => {
      expect(screen.getByTestId('drawer')).toBeInTheDocument();
      // allergies.length === 0 -> hien thi '—'
      const drawerText = screen.getByTestId('drawer').textContent;
      expect(drawerText).toContain('—');
    });
  });
});

describe('PatientsPage — mo form tao benh nhan moi', () => {
  it('hien thi PatientFormModal khi click Them benh nhan', async () => {
    vi.mocked(patientService.search).mockResolvedValue({ data: mockPaged } as never);
    wrap(<PatientsPage />);
    await waitFor(() => screen.getByText('BN000001'));
    const addBtns = screen.getAllByRole('button');
    const addBtn = addBtns.find((b) => b.textContent?.includes('nh\u00e2n'));
    expect(addBtn).toBeDefined();
    fireEvent.click(addBtn!);
    await waitFor(() => expect(screen.getByTestId('patient-form-modal')).toBeInTheDocument());
  });
});

describe('PatientsPage — hien thi ngay sinh dung voi truong dOB', () => {
  it('hien thi ngay sinh khi PatientDTO.dOB co gia tri', async () => {
    const patientWithDOB: PatientDTO = {
      ...patientA,
      dOB: '1990-05-15',
    };
    const pagedWithDOB: PagedResult<PatientDTO> = {
      ...mockPaged,
      items: [patientWithDOB],
    };
    vi.mocked(patientService.search).mockResolvedValue({ data: pagedWithDOB } as never);
    wrap(<PatientsPage />);
    await waitFor(() => screen.getByText('Nguyen Van A'));
    fireEvent.click(screen.getByText('Nguyen Van A'));
    await waitFor(() => {
      const drawer = screen.getByTestId('drawer');
      // dOB -> formatted as DD/MM/YYYY
      expect(drawer.textContent).toContain('15/05/1990');
    });
  });

  it('hien thi dan khi dOB khong co', async () => {
    vi.mocked(patientService.search).mockResolvedValue({ data: mockPaged } as never);
    wrap(<PatientsPage />);
    await waitFor(() => screen.getByText('Nguyen Van A'));
    fireEvent.click(screen.getByText('Nguyen Van A'));
    await waitFor(() => {
      const drawer = screen.getByTestId('drawer');
      // No dOB -> shows em-dash
      expect(drawer.textContent).toMatch(/—/);
    });
  });
});

describe('PatientsPage — xu ly loi API', () => {
  it('hien thi Alert loi khi patientService.search that bai', async () => {
    vi.mocked(patientService.search).mockRejectedValue(new Error('Network Error'));
    wrap(<PatientsPage />);
    await waitFor(() => {
      expect(screen.getByTestId('alert-error')).toBeInTheDocument();
    });
  });

  it('khong hien thi Alert loi khi fetch thanh cong', async () => {
    vi.mocked(patientService.search).mockResolvedValue({ data: mockPaged } as never);
    wrap(<PatientsPage />);
    await waitFor(() => screen.getByText('Nguyen Van A'));
    expect(screen.queryByTestId('alert-error')).not.toBeInTheDocument();
  });
});
