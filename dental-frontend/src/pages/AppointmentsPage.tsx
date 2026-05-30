import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table, Button, Input, Select, DatePicker, Space, Tag, Dropdown, message, Popconfirm, Typography, Alert
} from 'antd';
import {
  SearchOutlined, CheckCircleOutlined, CloseCircleOutlined,
  CheckOutlined, EllipsisOutlined, PlusOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { appointmentService } from '../services/appointmentService';
import type { AppointmentListDTO, PagedResult } from '../types';
import BookAppointmentModal from '../components/BookAppointmentModal';

const { Title } = Typography;

const statusColor: Record<string, string> = {
  Pending: 'orange', Confirmed: 'blue', Completed: 'green',
  Cancelled: 'red', NoShow: 'default',
};
const statusLabel: Record<string, string> = {
  Pending: 'Chờ xác nhận', Confirmed: 'Đã xác nhận',
  Completed: 'Hoàn thành', Cancelled: 'Đã hủy', NoShow: 'Không đến',
};

export default function AppointmentsPage() {
  const [filters, setFilters] = useState<Record<string, unknown>>({ page: 1, pageSize: 20 });
  const [bookOpen, setBookOpen] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery<PagedResult<AppointmentListDTO>>({
    queryKey: ['appointments', filters],
    queryFn:  () => appointmentService.getAll(filters).then((r) => r.data),
  });

  const mutConfirm  = useMutation({ mutationFn: (id: number) => appointmentService.confirm(id),  onSuccess: () => { message.success('Đã xác nhận'); qc.invalidateQueries({ queryKey: ['appointments'] }); } });
  const mutComplete = useMutation({ mutationFn: (id: number) => appointmentService.complete(id), onSuccess: () => { message.success('Đã hoàn thành'); qc.invalidateQueries({ queryKey: ['appointments'] }); } });
  const mutNoShow   = useMutation({ mutationFn: (id: number) => appointmentService.noShow(id),   onSuccess: () => { message.success('Đã đánh dấu không đến'); qc.invalidateQueries({ queryKey: ['appointments'] }); } });
  const mutCancel   = useMutation({ mutationFn: (id: number) => appointmentService.cancel(id, 'Hủy bởi nhân viên'), onSuccess: () => { message.success('Đã hủy'); qc.invalidateQueries({ queryKey: ['appointments'] }); } });

  const columns = [
    { title: 'Bệnh nhân', dataIndex: 'patientName', key: 'patientName' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Bác sĩ', dataIndex: 'doctorName', key: 'doctorName', render: (v: string) => v || '—' },
    { title: 'Chi nhánh', dataIndex: 'branchName', key: 'branchName' },
    {
      title: 'Ngày hẹn', key: 'date',
      render: (_: unknown, r: AppointmentListDTO) =>
        `${dayjs(r.appointmentDate).format('DD/MM/YYYY')} ${r.startTime.substring(0, 5)}`,
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (v: string) => <Tag color={statusColor[v]}>{statusLabel[v] ?? v}</Tag>,
    },
    {
      title: 'Hành động', key: 'actions',
      render: (_: unknown, r: AppointmentListDTO) => (
        <Dropdown
          menu={{
            items: [
              { key: 'confirm',  label: 'Xác nhận',    icon: <CheckCircleOutlined />, disabled: r.status !== 'Pending', onClick: () => mutConfirm.mutate(r.id) },
              { key: 'complete', label: 'Hoàn thành',  icon: <CheckOutlined />, disabled: !['Pending','Confirmed'].includes(r.status), onClick: () => mutComplete.mutate(r.id) },
              { key: 'noshow',   label: 'Không đến',   onClick: () => mutNoShow.mutate(r.id) },
              { type: 'divider' as const },
              { key: 'cancel',   label: <Popconfirm title="Hủy lịch hẹn?" onConfirm={() => mutCancel.mutate(r.id)}><CloseCircleOutlined /> Hủy</Popconfirm>, danger: true },
            ],
          }}
        >
          <Button icon={<EllipsisOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Lịch hẹn</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setBookOpen(true)}>Đặt lịch mới</Button>
      </div>

      <Space wrap style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm bệnh nhân / SĐT"
          prefix={<SearchOutlined />}
          style={{ width: 220 }}
          onPressEnter={(e) => setFilters((f) => ({ ...f, keyword: (e.target as HTMLInputElement).value, page: 1 }))}
          allowClear
          onChange={(e) => !e.target.value && setFilters((f) => ({ ...f, keyword: undefined }))}
        />
        <DatePicker
          placeholder="Chọn ngày"
          onChange={(d) => setFilters((f) => ({ ...f, date: d?.format('YYYY-MM-DD'), page: 1 }))}
        />
        <Select
          placeholder="Trạng thái"
          style={{ width: 160 }}
          allowClear
          onChange={(v) => setFilters((f) => ({ ...f, status: v, page: 1 }))}
          options={Object.entries(statusLabel).map(([v, l]) => ({ value: v, label: l }))}
        />
      </Space>

      {isError && (
        <Alert type="error" showIcon message="Không thể tải danh sách lịch hẹn. Vui lòng thử lại." style={{ marginBottom: 16 }} />
      )}

      <Table
        columns={columns}
        dataSource={data?.items ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current:  filters.page as number,
          pageSize: filters.pageSize as number,
          total:    data?.totalCount ?? 0,
          onChange: (p) => setFilters((f) => ({ ...f, page: p })),
          showTotal: (t) => `Tổng ${t} lịch hẹn`,
        }}
      />

      <BookAppointmentModal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        onSuccess={() => { setBookOpen(false); qc.invalidateQueries({ queryKey: ['appointments'] }); }}
      />
    </div>
  );
}
