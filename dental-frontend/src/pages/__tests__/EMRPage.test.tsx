import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import EMRPage from '../EMRPage';
import { emrService } from '../../services/emrService';
import { doctorService } from '../../services/masterDataService';
import type { EMRSummaryDTO, EMRDetailDTO, PagedResult } from '../../types';

vi.mock('../../services/emrService', () => ({
  emrService: {
    getByPatient: vi.fn(),
    getById:      vi.fn(),
    create:       vi.fn(),
    createPrescription: vi.fn(),
  },
}));

vi.mock('../../services/masterDataService', () => ({
  doctorService: { getAll: vi.fn() },
}));

const mockSummary: EMRSummaryDTO = {
  id: 1, patientId: 10, patientName: 'Nguyen Van A', patientCode: 'BN000001',
  doctorId: 5, doctorName: 'BS. Tran B', diagnosis: 'Sau rang',
  createdAt: '2026-05-01T08:00:00Z',
};

const mockDetail: EMRDetailDTO = {
  ...mockSummary, procedures: [], prescriptions: [], attachments: [],
};

const mockPaged: PagedResult<EMRSummaryDTO> = {
  items: [mockSummary], totalCount: 1, page: 1, pageSize: 10,
  totalPages: 1, hasPrev: false, hasNext: false,
};

function wrap(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(doctorService.getAll).mockResolvedValue({ data: [] } as never);
});

describe('EMRPage — Alert khi khong co patientId', () => {
  it('hien thi huong dan nhap ID benh nhan khi moi vao trang', async () => {
    wrap(<EMRPage />);
    await waitFor(() => {
      expect(screen.getByTestId('alert-info')).toBeInTheDocument();
      expect(screen.getByText(/Nhap ID benh nhan/i)).toBeInTheDocument();
    });
  });

  it('khong goi emrService.getByPatient khi chua co patientId', async () => {
    wrap(<EMRPage />);
    await waitFor(() => screen.getByTestId('alert-info'));
    expect(emrService.getByPatient).not.toHaveBeenCalled();
  });
});

describe('EMRPage — load danh sach EMR theo patientId', () => {
  it('goi getByPatient va hien thi ten benh nhan trong bang', async () => {
    vi.mocked(emrService.getByPatient).mockResolvedValue({ data: mockPaged } as never);
    wrap(<EMRPage />);

    const input = screen.getByPlaceholderText(/Loc theo ID benh nhan/i);
    fireEvent.change(input, { target: { value: '10' } });

    await waitFor(() => expect(emrService.getByPatient).toHaveBeenCalledWith(10));
    await waitFor(() => expect(screen.getByText('Nguyen Van A')).toBeInTheDocument());
  });

  it('hien thi chan doan trong bang', async () => {
    vi.mocked(emrService.getByPatient).mockResolvedValue({ data: mockPaged } as never);
    wrap(<EMRPage />);
    fireEvent.change(screen.getByPlaceholderText(/Loc theo ID benh nhan/i), { target: { value: '10' } });
    await waitFor(() => expect(screen.getByText('Sau rang')).toBeInTheDocument());
  });

  it('hien thi Alert error khi API that bai', async () => {
    vi.mocked(emrService.getByPatient).mockRejectedValue(new Error('Network error'));
    wrap(<EMRPage />);
    fireEvent.change(screen.getByPlaceholderText(/Loc theo ID benh nhan/i), { target: { value: '10' } });
    await waitFor(() => expect(screen.getByTestId('alert-error')).toBeInTheDocument());
  });
});

describe('EMRPage — mo modal tao ho so', () => {
  it('mo modal khi click nut Tao ho so', async () => {
    wrap(<EMRPage />);
    await waitFor(() => screen.getByTestId('alert-info'));
    const btns = screen.getAllByRole('button');
    const createBtn = btns.find((b) => b.textContent?.includes('Tao ho so'));
    expect(createBtn).toBeDefined();
    fireEvent.click(createBtn!);
    await waitFor(() => expect(screen.getByTestId('modal')).toBeInTheDocument());
  });
});

describe('EMRPage — xem chi tiet ho so', () => {
  it('goi getById va hien thi Drawer khi bam Xem', async () => {
    vi.mocked(emrService.getByPatient).mockResolvedValue({ data: mockPaged } as never);
    vi.mocked(emrService.getById).mockResolvedValue({ data: mockDetail } as never);
    wrap(<EMRPage />);

    fireEvent.change(screen.getByPlaceholderText(/Loc theo ID benh nhan/i), { target: { value: '10' } });
    await waitFor(() => screen.getByText('Nguyen Van A'));

    const btns = screen.getAllByRole('button');
    const xemBtn = btns.find((b) => b.textContent?.includes('Xem'));
    expect(xemBtn).toBeDefined();
    fireEvent.click(xemBtn!);

    await waitFor(() => expect(emrService.getById).toHaveBeenCalledWith(1));
    await waitFor(() => expect(screen.getByTestId('drawer')).toBeInTheDocument());
  });
});

describe('EMRPage — InputNumber luon o trang thai controlled', () => {
  it('khong phat sinh canh bao uncontrolled khi chua nhap patientId', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    wrap(<EMRPage />);
    await waitFor(() => screen.getByTestId('alert-info'));
    const uncontrolledWarning = consoleSpy.mock.calls.find((args) =>
      typeof args[0] === 'string' && args[0].includes('uncontrolled input to be controlled')
    );
    expect(uncontrolledWarning).toBeUndefined();
    consoleSpy.mockRestore();
  });
});
