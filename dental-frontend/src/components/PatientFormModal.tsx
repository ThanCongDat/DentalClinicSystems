import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { patientService } from '../services/patientService';
import type { PatientDTO } from '../types';

interface Props {
  open: boolean;
  patient?: PatientDTO;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PatientFormModal({ open, patient, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        ...patient,
        dob: patient?.dOB ? dayjs(patient.dOB) : undefined,
        gender: patient?.gender ?? 'Other',
      });
    } else {
      form.resetFields();
    }
  }, [open, patient, form]);

  const onFinish = async (values: Record<string, unknown>) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        dob: values.dob ? dayjs(values.dob as string).format('YYYY-MM-DD') : undefined,
      };
      const { data } = patient
        ? await patientService.update(patient.id, payload)
        : await patientService.create(payload);

      if (data.success) {
        message.success(data.message);
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
      title={patient ? 'Sửa hồ sơ bệnh nhân' : 'Thêm bệnh nhân mới'}
      open={open}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="email" label="Email"><Input type="email" /></Form.Item>
        <Form.Item name="gender" label="Giới tính">
          <Select options={[
            { value: 'Male', label: 'Nam' },
            { value: 'Female', label: 'Nữ' },
            { value: 'Other', label: 'Khác' },
          ]} />
        </Form.Item>
        <Form.Item name="dob" label="Ngày sinh"><DatePicker style={{ width: '100%' }} /></Form.Item>
        <Form.Item name="address" label="Địa chỉ"><Input /></Form.Item>
        <Form.Item name="bloodType" label="Nhóm máu">
          <Select allowClear options={['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((v) => ({ value: v, label: v }))} />
        </Form.Item>
        <Form.Item name="allergies" label="Dị ứng"><Input.TextArea rows={2} /></Form.Item>
        <Form.Item name="emergencyContact" label="Người liên hệ khẩn cấp"><Input /></Form.Item>
        <Form.Item name="emergencyPhone" label="SĐT khẩn cấp"><Input /></Form.Item>
      </Form>
    </Modal>
  );
}
