import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table, Button, Tag, Typography, Space, Modal, Form, Input,
  DatePicker, InputNumber, message, Drawer, Descriptions, Select, Alert,
} from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { labOrderService } from '../services/labOrderService';
import { branchService, doctorService } from '../services/masterDataService';
import type { LabOrderDTO, BranchDTO, DoctorDTO } from '../types';

const { Title } = Typography;

const STATUS_COLOR: Record<string, string> = {
  Draft: 'default',
  Sent: 'processing',
  InProduction: 'blue',
  Received: 'cyan',
  Completed: 'green',
  Cancelled: 'error',
};

const STATUS_LABEL: Record<string, string> = {
  Draft: 'Nháp',
  Sent: 'Đã gửi',
  InProduction: 'Đang làm',
  Received: 'Đã nhận',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã hủy',
};

const NEXT_STATUS: Record<string, string> = {
  Draft: 'Sent',
  Sent: 'InProduction',
  InProduction: 'Received',
  Received: 'Completed',
};

const NEXT_LABEL: Record<string, string> = {
  Draft: 'Gửi labo',
  Sent: 'Bắt đầu sản xuất',
  InProduction: 'Đã nhận hàng',
  Received: 'Hoàn thành',
};

export default function LabOrdersPage() {
  const [page, setPage] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [detail, setDetail] = useState<LabOrderDTO | null>(null);
  const [form] = Form.useForm();
  const qc = useQueryClient();

  const { data: branches = [] } = useQuery<BranchDTO[]>({
    queryKey: ['branches'],
    queryFn: () => branchService.getAll().then((r) => r.data),
  });

  const { data: doctors = [] } = useQuery<DoctorDTO[]>({
    queryKey: ['doctors'],
    queryFn: () => doctorService.getAll().then((r) => r.data),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['lab-orders', page],
    queryFn: () => labOrderService.getAll(page, 15).then((r) => r.data),
  });

  const mutCreate = useMutation({
    mutationFn: (values: object) => labOrderService.create(values),
    onSuccess: (res) => {
      if (res.data.success) {
        message.success('Tạo đơn labo thành công');
        setOpenForm(false);
        form.resetFields();
        qc.invalidateQueries({ queryKey: ['lab-orders'] });
      } else {
        message.error(res.data.message);
      }
    },
    onError: () => message.error('Có lỗi xảy ra'),
  });

  const mutStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      labOrderService.updateStatus(id, { status }),
    onSuccess: () => {
      message.success('Cập nhật trạng thái thành công');
      qc.invalidateQueries({ queryKey: ['lab-orders'] });
    },
    onError: () => message.error('Có lỗi xảy ra'),
  });

  const mutDelete = useMutation({
    mutationFn: (id: number) => labOrderService.delete(id),
    onSuccess: (res) => {
      if (res.data.success) {
        message.success('Đã xóa đơn labo');
        qc.invalidateQueries({ queryKey: ['lab-orders'] });
      } else {
        message.error(res.data.message);
      }
    },
    onError: () => message.error('Không thể xóa đơn labo này'),
  });

  const columns = [
    { title: 'Số đơn', dataIndex: 'orderNumber', width: 180 },
    { title: 'Bệnh nhân', dataIndex: 'patientName' },
    { title: 'Bác sĩ', dataIndex: 'doctorName' },
    { title: 'Labo', dataIndex: 'labVendorName' },
    {
      title: 'Ngày giao dự kiến',
      dataIndex: 'expectedDeliveryDate',
      render: (v: string) => (v ? dayjs(v).format('DD/MM/YYYY') : '—'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (v: string) => <Tag color={STATUS_COLOR[v]}>{STATUS_LABEL[v] ?? v}</Tag>,
    },
    {
      title: 'Chi phí',
      dataIndex: 'labCost',
      align: 'right' as const,
      render: (v: number) => v?.toLocaleString('vi-VN') + ' ₫',
    },
    {
      title: '',
      render: (_: unknown, r: LabOrderDTO) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => setDetail(r)}>Chi tiết</Button>
          {NEXT_STATUS[r.status] && (
            <Button
              size="small"
              type="primary"
              onClick={() => mutStatus.mutate({ id: r.id, status: NEXT_STATUS[r.status] })}
            >
              {NEXT_LABEL[r.status]}
            </Button>
          )}
          {r.status === 'Draft' && (
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                Modal.confirm({
                  title: 'Xóa đơn labo?',
                  content: `Đơn ${r.orderNumber} sẽ bị xóa vĩnh viễn.`,
                  okText: 'Xóa',
                  okType: 'danger',
                  onOk: () => mutDelete.mutate(r.id),
                })
              }
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Đơn labo</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenForm(true)}>
          Tạo đơn labo
        </Button>
      </div>

      {isError && (
        <Alert type="error" showIcon message="Không thể tải danh sách đơn labo. Vui lòng thử lại." style={{ marginBottom: 16 }} />
      )}

      <Table
        dataSource={data?.items ?? []}
        rowKey="id"
        loading={isLoading}
        columns={columns}
        pagination={{
          current: page,
          pageSize: 15,
          total: data?.totalCount ?? 0,
          onChange: setPage,
          showSizeChanger: false,
          showTotal: (t) => `Tổng ${t} đơn`,
        }}
      />

      {/* Create form */}
      <Modal
        title="Tạo đơn labo mới"
        open={openForm}
        onCancel={() => { setOpenForm(false); form.resetFields(); }}
        onOk={() => form.submit()}
        confirmLoading={mutCreate.isPending}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={(v) => mutCreate.mutate(v)}>
          <Space style={{ width: '100%' }} styles={{ item: { flex: 1 } }}>
            <Form.Item name="branchId" label="Chi nhánh" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select
                options={branches.map((b) => ({ value: b.id, label: b.name }))}
                placeholder="Chọn chi nhánh"
              />
            </Form.Item>
            <Form.Item name="doctorId" label="Bác sĩ" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select
                options={doctors.map((d) => ({ value: d.id, label: d.fullName }))}
                placeholder="Chọn bác sĩ"
              />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} styles={{ item: { flex: 1 } }}>
            <Form.Item name="patientId" label="ID bệnh nhân" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
            <Form.Item name="labVendorId" label="ID labo đối tác" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} styles={{ item: { flex: 1 } }}>
            <Form.Item name="expectedDeliveryDate" label="Ngày giao dự kiến" style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} disabledDate={(d) => d.isBefore(dayjs(), 'day')} />
            </Form.Item>
            <Form.Item name="labCost" label="Chi phí (₫)" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={0} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
          </Space>
          <Form.Item name="instructions" label="Hướng dẫn kỹ thuật">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Title level={5}>Danh sách hạng mục</Title>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Space key={key} align="start" style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item name={[name, 'description']} rules={[{ required: true }]}>
                      <Input placeholder="Mô tả" style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name={[name, 'material']}>
                      <Input placeholder="Vật liệu" style={{ width: 100 }} />
                    </Form.Item>
                    <Form.Item name={[name, 'shade']}>
                      <Input placeholder="Màu VITA" style={{ width: 80 }} />
                    </Form.Item>
                    <Form.Item name={[name, 'quantity']}>
                      <InputNumber placeholder="SL" min={1} defaultValue={1} style={{ width: 60 }} />
                    </Form.Item>
                    <Form.Item name={[name, 'unitCost']}>
                      <InputNumber placeholder="Đơn giá" min={0} style={{ width: 110 }} />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>Xóa</Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block>+ Thêm hạng mục</Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Detail drawer */}
      <Drawer
        title={`Đơn labo: ${detail?.orderNumber}`}
        open={!!detail}
        onClose={() => setDetail(null)}
        width={520}
      >
        {detail && (
          <>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Chi nhánh">{detail.branchName}</Descriptions.Item>
              <Descriptions.Item label="Bệnh nhân">{detail.patientName}</Descriptions.Item>
              <Descriptions.Item label="Bác sĩ">{detail.doctorName}</Descriptions.Item>
              <Descriptions.Item label="Labo đối tác">{detail.labVendorName}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{dayjs(detail.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
              <Descriptions.Item label="Ngày giao dự kiến">
                {detail.expectedDeliveryDate ? dayjs(detail.expectedDeliveryDate).format('DD/MM/YYYY') : '—'}
              </Descriptions.Item>
              {detail.receivedDate && (
                <Descriptions.Item label="Ngày nhận thực tế">
                  {dayjs(detail.receivedDate).format('DD/MM/YYYY')}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Trạng thái">
                <Tag color={STATUS_COLOR[detail.status]}>{STATUS_LABEL[detail.status]}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Chi phí">{detail.labCost?.toLocaleString('vi-VN')} ₫</Descriptions.Item>
              {detail.instructions && (
                <Descriptions.Item label="Hướng dẫn KT">{detail.instructions}</Descriptions.Item>
              )}
              {detail.note && <Descriptions.Item label="Ghi chú">{detail.note}</Descriptions.Item>}
            </Descriptions>

            {detail.items.length > 0 && (
              <>
                <Title level={5} style={{ marginTop: 16 }}>Hạng mục</Title>
                <Table
                  dataSource={detail.items}
                  rowKey="id"
                  size="small"
                  pagination={false}
                  columns={[
                    { title: 'Mô tả', dataIndex: 'description' },
                    { title: 'Vật liệu', dataIndex: 'material', render: (v) => v || '—' },
                    { title: 'Màu', dataIndex: 'shade', render: (v) => v || '—' },
                    { title: 'SL', dataIndex: 'quantity', align: 'right' as const },
                    {
                      title: 'Đơn giá',
                      dataIndex: 'unitCost',
                      align: 'right' as const,
                      render: (v: number) => v?.toLocaleString('vi-VN'),
                    },
                  ]}
                />
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
}
