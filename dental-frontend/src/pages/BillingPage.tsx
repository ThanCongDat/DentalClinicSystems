import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Tag, Button, Input, Select, Space, Typography, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { billingService } from '../services/billingService';
import type { ApiResponse, InvoiceDTO, PagedResult } from '../types';

const { Title } = Typography;

const statusColor: Record<string, string> = {
  Draft: 'default', Issued: 'blue', PartiallyPaid: 'orange',
  Paid: 'green', Cancelled: 'red', Refunded: 'purple',
};
const statusLabel: Record<string, string> = {
  Draft: 'Nháp', Issued: 'Đã xuất', PartiallyPaid: 'Trả một phần',
  Paid: 'Đã thanh toán', Cancelled: 'Đã hủy', Refunded: 'Hoàn tiền',
};

export default function BillingPage() {
  const [params, setParams] = useState({ page: 1, pageSize: 20 });

  const { data, isLoading, isError } = useQuery<PagedResult<InvoiceDTO>>({
    queryKey: ['invoices', params],
    // billingService.getAll returns ApiResponse<PagedResult<InvoiceDTO>>
    queryFn: () =>
      billingService.getAll(params).then((r) => (r.data as ApiResponse<PagedResult<InvoiceDTO>>).data!),
  });

  const columns = [
    { title: 'Số hóa đơn', dataIndex: 'invoiceNumber', width: 150 },
    { title: 'Bệnh nhân', dataIndex: 'patientName' },
    { title: 'Bác sĩ', dataIndex: 'doctorName' },
    { title: 'Ngày xuất', dataIndex: 'issuedDate', render: (v: string) => dayjs(v).format('DD/MM/YYYY') },
    {
      title: 'Tổng tiền', dataIndex: 'totalAmount', align: 'right' as const,
      render: (v: number) => v.toLocaleString('vi-VN') + 'đ',
    },
    {
      title: 'Đã trả', dataIndex: 'paidAmount', align: 'right' as const,
      render: (v: number) => v.toLocaleString('vi-VN') + 'đ',
    },
    {
      title: 'Còn lại', dataIndex: 'remainingAmount', align: 'right' as const,
      render: (v: number) =>
        v > 0 ? <span style={{ color: '#f5222d' }}>{v.toLocaleString('vi-VN') + 'đ'}</span> : '—',
    },
    {
      title: 'Trạng thái', dataIndex: 'status',
      render: (v: string) => <Tag color={statusColor[v]}>{statusLabel[v] ?? v}</Tag>,
    },
    {
      title: '', key: 'actions',
      render: (_: unknown, r: InvoiceDTO) => (
        <Button size="small" href={`/billing/${r.id}`}>Chi tiết</Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Hóa đơn & Thanh toán</Title>

      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Số hóa đơn / tên bệnh nhân"
          style={{ width: 280 }}
          allowClear
        />
        <Select
          placeholder="Trạng thái"
          style={{ width: 160 }}
          allowClear
          onChange={(v) => setParams((p) => ({ ...p, status: v, page: 1 } as typeof p))}
          options={Object.entries(statusLabel).map(([v, l]) => ({ value: v, label: l }))}
        />
      </Space>

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Không thể tải danh sách hóa đơn. Vui lòng thử lại."
          style={{ marginBottom: 16 }}
        />
      )}

      <Table
        columns={columns}
        dataSource={data?.items ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: params.page,
          pageSize: params.pageSize,
          total: data?.totalCount ?? 0,
          onChange: (p) => setParams((prev) => ({ ...prev, page: p })),
          showTotal: (t) => `Tổng ${t} hóa đơn`,
        }}
      />
    </div>
  );
}
