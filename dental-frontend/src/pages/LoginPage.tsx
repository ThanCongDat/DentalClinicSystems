import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth  = useAuthStore((s) => s.setAuth);

  const onFinish = async (values: { tenantSlug: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await authService.login(values.tenantSlug, values.email, values.password);
      if (data.success && data.data) {
        const d = data.data;
        setAuth(d.accessToken, d.refreshToken, {
          userId: d.userId, fullName: d.fullName, email: d.email,
          tenantId: d.tenantId, tenantName: d.tenantName, roles: d.roles,
        });
        navigate('/dashboard');
      } else {
        message.error(data.message || 'Đăng nhập thất bại');
      }
    } catch {
      message.error('Không thể kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <MedicineBoxOutlined style={{ fontSize: 48, color: '#1677ff' }} />
          <Title level={3} style={{ marginTop: 8, marginBottom: 4 }}>DentalClinic</Title>
          <Text type="secondary">Hệ thống quản lý phòng khám nha khoa</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="tenantSlug"
            rules={[{ required: true, message: 'Nhập mã phòng khám' }]}
          >
            <Input prefix={<MedicineBoxOutlined />} placeholder="Mã phòng khám (slug)" size="large" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Nhập mật khẩu' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
