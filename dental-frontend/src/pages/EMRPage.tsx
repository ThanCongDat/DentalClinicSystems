import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table, Button, Typography, Space, Modal, Form, Input, Select,
  message, Drawer, Descriptions, Tabs, Tag, InputNumber, Alert,
} from 'antd';
import { PlusOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { emrService } from '../services/emrService';
import { doctorService } from '../services/masterDataService';
import type { EMRSummaryDTO, EMRDetailDTO, DoctorDTO } from '../types';

const { Title } = Typography;

export default function EMRPage() {
  const [patientId, setPatientId] = useState<number | undefined>();
  const [detail, setDetail] = useState<EMRDetailDTO | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm] = Form.useForm();
  const [prescriptionForm] = Form.useForm();
  const [openPrescription, setOpenPrescription] = useState(false);
  const [activeEMRId, setActiveEMRId] = useState<number | null>(null);
  const qc = useQueryClient();

  const { data: doctors = [] } = useQuery<DoctorDTO[]>({
    queryKey: ['doctors'],
    queryFn: () => doctorService.getAll().then((r) => r.data),
  });

  // Requires a patientId — no "list all EMRs" admin endpoint exists on the backend.
  // /api/emr/lookup is a public patient self-lookup (patientCode + phone), not admin listing.
  const { data: emrs = [], isLoading, isError } = useQuery<EMRSummaryDTO[]>({
    queryKey: ['emr-list', patientId],
    enabled: !!patientId,
    queryFn: () =>
      emrService.getByPatient(patientId!).then((r) => r.data?.items ?? []),
  });

  const mutCreate = useMutation({
    mutationFn: (values: object) => emrService.create(values),
    onSuccess: (res) => {
      if (res.data?.success) {
        message.success('Tao ho so benh an thanh cong');
        setOpenCreate(false);
        createForm.resetFields();
        qc.invalidateQueries({ queryKey: ['emr-list'] });
      } else {
        message.error(res.data?.message ?? 'Co loi xay ra');
      }
    },
    onError: () => message.error('Co loi xay ra'),
  });

  const mutPrescription = useMutation({
    mutationFn: (values: object) => emrService.createPrescription(values),
    onSuccess: (res) => {
      if (res.data?.success) {
        message.success('Da them don thuoc');
        setOpenPrescription(false);
        prescriptionForm.resetFields();
        if (activeEMRId) loadDetail(activeEMRId);
      } else {
        message.error(res.data?.message ?? 'Co loi xay ra');
      }
    },
    onError: () => message.error('Co loi xay ra'),
  });

  const loadDetail = async (id: number) => {
    try {
      // GET /api/emr/{id} returns EMRDetailDTO directly (not wrapped in ApiResponse)
      const res = await emrService.getById(id);
      if (res.data) setDetail(res.data);
    } catch {
      message.error('Khong the tai chi tiet ho so benh an');
    }
  };

  const columns = [
    {
      title: 'Ngay kham',
      dataIndex: 'createdAt',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY HH:mm'),
      width: 160,
    },
    { title: 'Benh nhan', dataIndex: 'patientName' },
    { title: 'Ma BN', dataIndex: 'patientCode', width: 110 },
    { title: 'Bac si', dataIndex: 'doctorName' },
    { title: 'Ly do kham', dataIndex: 'chiefComplaint', render: (v: string) => v || '—' },
    {
      title: 'Chan doan',
      dataIndex: 'diagnosis',
      ellipsis: true,
    },
    {
      title: '',
      render: (_: unknown, r: EMRSummaryDTO) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => loadDetail(r.id)}
        >
          Xem
        </Button>
      ),
      width: 80,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Ho so benh an</Title>
        <Space>
          <InputNumber
            placeholder="Loc theo ID benh nhan"
            style={{ width: 200 }}
            min={1}
            value={patientId ?? null}
            onChange={(v) => setPatientId(v ?? undefined)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenCreate(true)}>
            Tao ho so
          </Button>
        </Space>
      </div>

      {!patientId && (
        <Alert type="info" showIcon message="Nhap ID benh nhan de xem danh sach ho so benh an." style={{ marginBottom: 16 }} />
      )}

      {isError && (
        <Alert type="error" showIcon message="Khong the tai danh sach ho so benh an. Vui long thu lai." style={{ marginBottom: 16 }} />
      )}

      <Table
        dataSource={emrs}
        rowKey="id"
        loading={isLoading}
        columns={columns}
        pagination={{ pageSize: 20, showTotal: (t) => `Tong ${t} ho so` }}
      />

      {/* Create EMR */}
      <Modal
        title="Tao ho so benh an"
        open={openCreate}
        onCancel={() => { setOpenCreate(false); createForm.resetFields(); }}
        onOk={() => createForm.submit()}
        confirmLoading={mutCreate.isPending}
        width={640}
      >
        <Form form={createForm} layout="vertical" onFinish={(v) => mutCreate.mutate(v)}>
          <Space style={{ width: '100%' }} styles={{ item: { flex: 1 } }}>
            <Form.Item name="patientId" label="ID benh nhan" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
            <Form.Item name="doctorId" label="Bac si" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select
                options={doctors.map((d) => ({ value: d.id, label: d.fullName }))}
                placeholder="Chon bac si"
              />
            </Form.Item>
          </Space>
          <Form.Item name="appointmentId" label="ID lich hen">
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item name="chiefComplaint" label="Ly do kham">
            <Input />
          </Form.Item>
          <Form.Item name="diagnosis" label="Chan doan" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="treatmentNotes" label="Ghi chu dieu tri">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail drawer */}
      <Drawer
        title={
          <Space>
            <FileTextOutlined />
            Ho so benh an — {detail?.patientName}
          </Space>
        }
        open={!!detail}
        onClose={() => setDetail(null)}
        width={640}
        extra={
          <Button
            type="primary"
            onClick={() => {
              setActiveEMRId(detail?.id ?? null);
              setOpenPrescription(true);
            }}
          >
            + Don thuoc
          </Button>
        }
      >
        {detail && (
          <Tabs
            items={[
              {
                key: 'info',
                label: 'Thong tin',
                children: (
                  <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Ngay kham">
                      {dayjs(detail.createdAt).format('DD/MM/YYYY HH:mm')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Benh nhan">{detail.patientName} ({detail.patientCode})</Descriptions.Item>
                    <Descriptions.Item label="Bac si">{detail.doctorName}</Descriptions.Item>
                    <Descriptions.Item label="Ly do kham">{detail.chiefComplaint || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Chan doan">{detail.diagnosis}</Descriptions.Item>
                    {detail.treatmentNotes && (
                      <Descriptions.Item label="Ghi chu dieu tri">{detail.treatmentNotes}</Descriptions.Item>
                    )}
                    {detail.warrantyCode && (
                      <Descriptions.Item label="Ma bao hanh">{detail.warrantyCode}</Descriptions.Item>
                    )}
                    {detail.vitalSigns && (
                      <Descriptions.Item label="Sinh hieu">
                        HA: {detail.vitalSigns.bPSystolic}/{detail.vitalSigns.bPDiastolic} mmHg
                        {detail.vitalSigns.heartRate && ` | Mach: ${detail.vitalSigns.heartRate} lan/phut`}
                        {detail.vitalSigns.temperature && ` | Nhiet: ${detail.vitalSigns.temperature}°C`}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                ),
              },
              {
                key: 'procedures',
                label: `Thu thuat (${detail.procedures.length})`,
                children: (
                  <Table
                    dataSource={detail.procedures}
                    rowKey="id"
                    size="small"
                    pagination={false}
                    columns={[
                      { title: 'Thu thuat', dataIndex: 'procedureName' },
                      {
                        title: 'Don gia thuc te',
                        dataIndex: 'actualPrice',
                        align: 'right' as const,
                        render: (v: number) => v?.toLocaleString('vi-VN') ?? '—',
                      },
                      { title: 'Ghi chu', dataIndex: 'note', render: (v) => v || '—' },
                      {
                        title: 'Trang thai',
                        dataIndex: 'isCompleted',
                        render: (v: boolean) => (
                          <Tag color={v ? 'green' : 'orange'}>{v ? 'Hoan thanh' : 'Chua xong'}</Tag>
                        ),
                      },
                    ]}
                  />
                ),
              },
              {
                key: 'prescriptions',
                label: `Don thuoc (${detail.prescriptions.length})`,
                children: detail.prescriptions.map((rx) => (
                  <div key={rx.id} style={{ marginBottom: 16, padding: 12, border: '1px solid #f0f0f0', borderRadius: 6 }}>
                    <div style={{ marginBottom: 8, color: '#888' }}>
                      Bac si: {rx.doctorName} — {dayjs(rx.createdAt).format('DD/MM/YYYY')}
                      {rx.validUntil && ` — Het han: ${dayjs(rx.validUntil).format('DD/MM/YYYY')}`}
                    </div>
                    <Table
                      dataSource={rx.items}
                      rowKey="medicineName"
                      size="small"
                      pagination={false}
                      columns={[
                        { title: 'Thuoc', dataIndex: 'medicineName' },
                        { title: 'Lieu luong', dataIndex: 'dosage' },
                        { title: 'Tan suat', dataIndex: 'frequency' },
                        { title: 'So ngay', dataIndex: 'durationDays', align: 'right' as const },
                      ]}
                    />
                  </div>
                )),
              },
              {
                key: 'attachments',
                label: `Dinh kem (${detail.attachments.length})`,
                children: (
                  <Table
                    dataSource={detail.attachments}
                    rowKey="id"
                    size="small"
                    pagination={false}
                    columns={[
                      { title: 'Ten file', dataIndex: 'fileName' },
                      { title: 'Loai', dataIndex: 'attachmentType' },
                      {
                        title: 'Ngay tai',
                        dataIndex: 'uploadedAt',
                        render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
                      },
                      {
                        title: '',
                        render: (_: unknown, a: { fileUrl: string; fileName: string }) => (
                          <a href={a.fileUrl} target="_blank" rel="noreferrer">Xem</a>
                        ),
                      },
                    ]}
                  />
                ),
              },
            ]}
          />
        )}
      </Drawer>

      {/* Add prescription */}
      <Modal
        title="Them don thuoc"
        open={openPrescription}
        onCancel={() => { setOpenPrescription(false); prescriptionForm.resetFields(); }}
        onOk={() => prescriptionForm.submit()}
        confirmLoading={mutPrescription.isPending}
        width={700}
      >
        <Form
          form={prescriptionForm}
          layout="vertical"
          onFinish={(v) => mutPrescription.mutate({ ...v, emrId: activeEMRId })}
        >
          <Form.Item name="doctorId" label="Bac si ke don" rules={[{ required: true }]}>
            <Select options={doctors.map((d) => ({ value: d.id, label: d.fullName }))} />
          </Form.Item>
          <Form.Item name="validUntil" label="Han su dung don">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="note" label="Ghi chu">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Title level={5}>Thuoc</Title>
          <Form.List name="items" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Space key={key} align="start" style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item name={[name, 'medicineName']} rules={[{ required: true }]}>
                      <Input placeholder="Ten thuoc" style={{ width: 160 }} />
                    </Form.Item>
                    <Form.Item name={[name, 'dosage']} rules={[{ required: true }]}>
                      <Input placeholder="Lieu luong" style={{ width: 100 }} />
                    </Form.Item>
                    <Form.Item name={[name, 'frequency']} rules={[{ required: true }]}>
                      <Input placeholder="Tan suat" style={{ width: 120 }} />
                    </Form.Item>
                    <Form.Item name={[name, 'durationDays']}>
                      <InputNumber placeholder="So ngay" min={1} defaultValue={1} style={{ width: 80 }} />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)} disabled={fields.length === 1}>Xoa</Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block>+ Them thuoc</Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}
