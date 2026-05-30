import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Input, Space, Typography, Drawer, Descriptions, Tag, Badge, Alert } from 'antd';
import { SearchOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { patientService } from '../services/patientService';
import type { PatientDTO, PagedResult } from '../types';
import PatientFormModal from '../components/PatientFormModal';

const { Title } = Typography;

export default function PatientsPage() {
  const [params, setParams]     = useState({ page: 1, pageSize: 20, keyword: '' });
  const [selected, setSelected] = useState<PatientDTO | null>(null);
  const [formOpen, setFormOpen] = useState<{ open: boolean; patient?: PatientDTO }>({ open: false });
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery<PagedResult<PatientDTO>>({
    queryKey: ['patients', params],
    queryFn:  () => patientService.search(params).then((r) => r.data),
  });

  const columns = [
    { title: 'Mã BN', dataIndex: 'patientCode', width: 100 },
    { title: 'Họ tên', dataIndex: 'fullName', render: (v: string, r: PatientDTO) => (
      <Button type="link" onClick={() => setSelected(r)}>{v}</Button>
    )},
    { title: 'SĐT', dataIndex: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', render: (v: string) => v === 'Male' ? 'Nam' : v === 'Female' ? 'Nữ' : 'Khác' },
    { title: 'Ngày sinh', dataIndex: 'dOB', render: (v: string) => v ? dayjs(v).format('DD/MM/YYYY') : '—' },
    { title: 'Tổng lịch', dataIndex: 'totalAppointments', align: 'right' as const },
    { title: 'Lần cuối khám', dataIndex: 'lastVisit', render: (v: string) => v ? dayjs(v).format('DD/MM/YYYY') : '—' },
    {
      title: '', key: 'actions',
      render: (_: unknown, r: PatientDTO) => (
        <Button size="small" onClick={() => setFormOpen({ open: true, patient: r })}>Sửa</Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Bệnh nhân</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormOpen({ open: true })}>Thêm bệnh nhân</Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tên, SĐT, mã bệnh nhân..."
          style={{ width: 300 }}
          value={params.keyword}
          onChange={(e) => setParams((p) => ({ ...p, keyword: e.target.value, page: 1 }))}
          allowClear
        />
      </Space>

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Không thể tải danh sách bệnh nhân. Vui lòng thử lại."
          style={{ marginBottom: 16 }}
          data-testid="alert-error"
        />
      )}

      <Table
        columns={columns}
        dataSource={data?.items ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current:  params.page,
          pageSize: params.pageSize,
          total:    data?.totalCount ?? 0,
          onChange: (p) => setParams((prev) => ({ ...prev, page: p })),
          showTotal: (t) => `Tổng ${t} bệnh nhân`,
        }}
      />

      {/* Patient detail drawer */}
      <Drawer
        title={<><UserOutlined /> {selected?.fullName}</>}
        open={!!selected}
        onClose={() => setSelected(null)}
        width={500}
        data-testid="drawer"
      >
        {selected && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã BN">{selected.patientCode}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{selected.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{selected.email || '—'}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{selected.gender === 'Male' ? 'Nam' : selected.gender === 'Female' ? 'Nữ' : 'Khác'}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{selected.dOB ? dayjs(selected.dOB).format('DD/MM/YYYY') : '—'}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{selected.address || '—'}</Descriptions.Item>
            <Descriptions.Item label="Nhóm máu"><Tag>{selected.bloodType || '—'}</Tag></Descriptions.Item>
            <Descriptions.Item label="Dị ứng">
              {selected.allergies.length > 0
                ? selected.allergies.map((a) => `${a.allergenName} (${a.severity})`).join(', ')
                : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Liên hệ khẩn">{selected.emergencyContact || '—'} {selected.emergencyPhone && `(${selected.emergencyPhone})`}</Descriptions.Item>
            <Descriptions.Item label="Tổng lịch hẹn"><Badge count={selected.totalAppointments} showZero /></Descriptions.Item>
            <Descriptions.Item label="Lần cuối khám">{selected.lastVisit ? dayjs(selected.lastVisit).format('DD/MM/YYYY') : '—'}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      <PatientFormModal
        open={formOpen.open}
        patient={formOpen.patient}
        onClose={() => setFormOpen({ open: false })}
        onSuccess={() => { setFormOpen({ open: false }); qc.invalidateQueries({ queryKey: ['patients'] }); }}
      />
    </div>
  );
}
