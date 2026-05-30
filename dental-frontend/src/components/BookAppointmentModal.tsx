import { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { appointmentService } from '../services/appointmentService';
import { branchService, doctorService } from '../services/masterDataService';
import type { BranchDTO, DoctorDTO } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookAppointmentModal({ open, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<number>();
  const [selectedDoctor, setSelectedDoctor] = useState<number>();
  const [selectedDate, setSelectedDate] = useState<string>();

  const { data: branches } = useQuery<BranchDTO[]>({
    queryKey: ['branches'],
    queryFn:  () => branchService.getAll().then((r) => r.data),
    enabled: open,
  });

  const { data: doctors } = useQuery<DoctorDTO[]>({
    queryKey: ['doctors', selectedBranch],
    queryFn:  () => doctorService.getAll(selectedBranch).then((r) => r.data),
    enabled: open,
  });

  const { data: slots } = useQuery<string[]>({
    queryKey: ['slots', selectedDoctor, selectedDate],
    queryFn: () => {
      if (!selectedDoctor || !selectedDate) return Promise.resolve([]);
      return appointmentService.getSlots(selectedDoctor, selectedDate).then((r) => r.data);
    },
    enabled: !!selectedDoctor && !!selectedDate,
  });

  const onFinish = async (values: Record<string, unknown>) => {
    setLoading(true);
    try {
      const { data } = await appointmentService.book({
        ...values,
        appointmentDate: dayjs(values.appointmentDate as string).format('YYYY-MM-DD'),
        startTime:       (values.startTime as string),
      });
      if (data.success) {
        message.success('Đặt lịch thành công!');
        form.resetFields();
        onSuccess();
      } else {
        message.error(data.message);
      }
    } catch {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Đặt lịch hẹn mới"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="branchId" label="Chi nhánh" rules={[{ required: true }]}>
          <Select
            options={branches?.filter((b) => b.isActive).map((b) => ({ value: b.id, label: b.name }))}
            onChange={setSelectedBranch}
            placeholder="Chọn chi nhánh"
          />
        </Form.Item>
        <Form.Item name="doctorId" label="Bác sĩ" rules={[{ required: true }]}>
          <Select
            options={doctors?.filter((d) => d.isActive).map((d) => ({ value: d.id, label: `${d.title} ${d.fullName}` }))}
            onChange={setSelectedDoctor}
            placeholder="Chọn bác sĩ"
          />
        </Form.Item>
        <Form.Item name="appointmentDate" label="Ngày hẹn" rules={[{ required: true }]}>
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={(d) => d.isBefore(dayjs(), 'day')}
            onChange={(d) => setSelectedDate(d?.format('YYYY-MM-DD'))}
          />
        </Form.Item>
        {slots && slots.length > 0 && (
          <Form.Item name="startTime" label="Khung giờ" rules={[{ required: true }]}>
            <Select
              options={slots.map((s) => ({ value: s, label: s }))}
              placeholder="Chọn giờ"
            />
          </Form.Item>
        )}
        <Form.Item name="patientName" label="Tên bệnh nhân" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="chiefComplaint" label="Lý do khám">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={2} />
        </Form.Item>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>Đặt lịch</Button>
        </div>
      </Form>
    </Modal>
  );
}
