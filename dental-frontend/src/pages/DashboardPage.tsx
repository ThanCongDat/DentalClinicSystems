import { useQuery } from '@tanstack/react-query';
import { Row, Col, Card, Statistic, Table, Tag, Spin, Alert, Typography } from 'antd';
import { CalendarOutlined, TeamOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { reportService } from '../services/reportService';
import type { DashboardSummaryDTO } from '../types';

const { Title } = Typography;

const statusColor: Record<string, string> = {
  Pending: 'orange', Confirmed: 'blue', Completed: 'green',
  Cancelled: 'red', NoShow: 'default',
};

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery<DashboardSummaryDTO>({
    queryKey: ['dashboard'],
    queryFn:  () => reportService.getDashboard().then((r) => r.data),
    refetchInterval: 60_000,
  });

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  if (isError || !data) {
    return (
      <Alert
        type="error"
        showIcon
        message="Không thể tải dữ liệu tổng quan"
        description="Máy chủ không phản hồi. Vui lòng kiểm tra kết nối và thử lại."
        style={{ marginTop: 40 }}
      />
    );
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>Tổng quan hôm nay</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Lịch hẹn hôm nay"
              value={data.todayAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng bệnh nhân"
              value={data.totalPatients}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu hôm nay"
              value={data.revenueToday}
              prefix={<DollarOutlined />}
              suffix="đ"
              formatter={(v) => Number(v).toLocaleString('vi-VN')}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tồn kho sắp hết"
              value={data.lowStockItems}
              prefix={<WarningOutlined />}
              valueStyle={{ color: data.lowStockItems > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="Lịch hẹn gần đây">
            <Table
              dataSource={data.recentAppointments}
              rowKey="id"
              size="small"
              pagination={false}
              columns={[
                { title: 'Bệnh nhân', dataIndex: 'patientName' },
                { title: 'Bác sĩ', dataIndex: 'doctorName' },
                {
                  title: 'Ngày hẹn',
                  render: (_, r) =>
                    `${dayjs(r.appointmentDate).format('DD/MM/YYYY')} ${r.startTime.substring(0, 5)}`,
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  render: (v) => <Tag color={statusColor[v] ?? 'default'}>{v}</Tag>,
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Bác sĩ nổi bật (tháng này)">
            <Table
              dataSource={data.topDoctors}
              rowKey="doctorId"
              size="small"
              pagination={false}
              columns={[
                { title: 'Bác sĩ', dataIndex: 'doctorName' },
                { title: 'Lịch', dataIndex: 'appointmentCount', align: 'right' as const },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
