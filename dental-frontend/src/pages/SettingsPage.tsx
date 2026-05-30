import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, Table, Button, Modal, Form, Input, InputNumber, Select, message, Tag, Typography, Alert } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { branchService, doctorService } from '../services/masterDataService';
import type { BranchDTO, DoctorDTO } from '../types';

const { Title } = Typography;

function BranchesTab() {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BranchDTO | null>(null);
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery<BranchDTO[]>({
    queryKey: ['branches'],
    queryFn:  () => branchService.getAll().then((r) => r.data),
  });

  const mutSave = useMutation({
    mutationFn: (values: object) =>
      editing ? branchService.update(editing.id, values) : branchService.create(values),
    onSuccess: () => { message.success('Lưu thành công'); setOpen(false); qc.invalidateQueries({ queryKey: ['branches'] }); },
  });

  const openForm = (b?: BranchDTO) => { setEditing(b ?? null); form.setFieldsValue(b ?? {}); setOpen(true); };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={() => openForm()}>Thêm chi nhánh</Button>
      {isError && (
        <Alert type="error" showIcon message="Không thể tải danh sách chi nhánh. Vui lòng thử lại." style={{ marginBottom: 16 }} />
      )}
      <Table
        dataSource={data ?? []}
        rowKey="id"
        loading={isLoading}
        columns={[
          { title: 'Tên chi nhánh', dataIndex: 'name' },
          { title: 'Địa chỉ', dataIndex: 'address' },
          { title: 'SĐT', dataIndex: 'phone' },
          { title: 'Số bác sĩ', dataIndex: 'doctorCount', align: 'right' as const },
          { title: 'Trạng thái', dataIndex: 'isActive', render: (v: boolean) => <Tag color={v ? 'green' : 'default'}>{v ? 'Đang hoạt động' : 'Tạm dừng'}</Tag> },
          { title: '', render: (_: unknown, r: BranchDTO) => <Button icon={<EditOutlined />} size="small" onClick={() => openForm(r)} /> },
        ]}
      />
      <Modal title={editing ? 'Sửa chi nhánh' : 'Thêm chi nhánh'} open={open} onOk={() => form.submit()} onCancel={() => setOpen(false)}>
        <Form form={form} layout="vertical" onFinish={(v) => mutSave.mutate(v)}>
          <Form.Item name="name" label="Tên chi nhánh" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="phone" label="SĐT" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="mapEmbedUrl" label="Embed URL bản đồ"><Input /></Form.Item>
          {editing && <Form.Item name="isActive" label="Trạng thái"><Select options={[{ value: true, label: 'Hoạt động' }, { value: false, label: 'Tạm dừng' }]} /></Form.Item>}
        </Form>
      </Modal>
    </>
  );
}

function DoctorsTab() {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DoctorDTO | null>(null);
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery<DoctorDTO[]>({
    queryKey: ['doctors'],
    queryFn:  () => doctorService.getAll().then((r) => r.data),
  });

  const { data: branches } = useQuery<BranchDTO[]>({
    queryKey: ['branches'],
    queryFn:  () => branchService.getAll().then((r) => r.data),
  });

  const mutSave = useMutation({
    mutationFn: (values: object) =>
      editing ? doctorService.update(editing.id, values) : doctorService.create(values),
    onSuccess: () => { message.success('Lưu thành công'); setOpen(false); qc.invalidateQueries({ queryKey: ['doctors'] }); },
  });

  const openForm = (d?: DoctorDTO) => { setEditing(d ?? null); form.setFieldsValue(d ?? {}); setOpen(true); };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={() => openForm()}>Thêm bác sĩ</Button>
      {isError && (
        <Alert type="error" showIcon message="Không thể tải danh sách bác sĩ. Vui lòng thử lại." style={{ marginBottom: 16 }} />
      )}
      <Table
        dataSource={data ?? []}
        rowKey="id"
        loading={isLoading}
        columns={[
          { title: 'Họ tên', dataIndex: 'fullName' },
          { title: 'Chức danh', dataIndex: 'title' },
          { title: 'Chuyên môn', dataIndex: 'specialization', render: (v: string) => v || '—' },
          { title: 'Chi nhánh', dataIndex: 'branchName' },
          { title: 'Slot (phút)', dataIndex: 'slotDurationMinutes', align: 'right' as const },
          { title: 'Trạng thái', dataIndex: 'isActive', render: (v: boolean) => <Tag color={v ? 'green' : 'default'}>{v ? 'Đang làm' : 'Nghỉ'}</Tag> },
          { title: '', render: (_: unknown, r: DoctorDTO) => <Button icon={<EditOutlined />} size="small" onClick={() => openForm(r)} /> },
        ]}
      />
      <Modal title={editing ? 'Sửa bác sĩ' : 'Thêm bác sĩ'} open={open} onOk={() => form.submit()} onCancel={() => setOpen(false)}>
        <Form form={form} layout="vertical" onFinish={(v) => mutSave.mutate(v)}>
          <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="title" label="Chức danh" rules={[{ required: true }]}><Input placeholder="Bác sĩ, Thạc sĩ..." /></Form.Item>
          <Form.Item name="specialization" label="Chuyên môn"><Input /></Form.Item>
          <Form.Item name="licenseNumber" label="Số chứng chỉ hành nghề"><Input /></Form.Item>
          <Form.Item name="slotDurationMinutes" label="Thời gian mỗi slot (phút)"><InputNumber min={15} max={120} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="branchId" label="Chi nhánh" rules={[{ required: true }]}>
            <Select options={branches?.map((b) => ({ value: b.id, label: b.name }))} />
          </Form.Item>
          {editing && <Form.Item name="isActive" label="Trạng thái"><Select options={[{ value: true, label: 'Đang làm' }, { value: false, label: 'Nghỉ' }]} /></Form.Item>}
        </Form>
      </Modal>
    </>
  );
}

export default function SettingsPage() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Cài đặt hệ thống</Title>
      <Tabs
        items={[
          { key: 'branches', label: 'Chi nhánh', children: <BranchesTab /> },
          { key: 'doctors',  label: 'Bác sĩ',   children: <DoctorsTab /> },
        ]}
      />
    </div>
  );
}
