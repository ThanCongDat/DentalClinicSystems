import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Row, Col, Card, Statistic, DatePicker, Table, Typography, Tabs, Alert } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { reportService } from '../services/reportService';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function ReportsPage() {
  const [range, setRange] = useState({
    from: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    to:   dayjs().format('YYYY-MM-DD'),
  });

  const { data: revenue, isError: revenueError } = useQuery({
    queryKey: ['revenue', range],
    queryFn:  () => reportService.getRevenue(range).then((r) => r.data),
  });

  const { data: stats, isError: statsError } = useQuery({
    queryKey: ['appt-stats', range],
    queryFn:  () => reportService.getAppointmentStats(range).then((r) => r.data),
  });

  const items = [
    {
      key: 'revenue',
      label: 'Doanh thu',
      children: (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            {[
              { title: 'Tổng doanh thu', value: revenue?.totalRevenue, prefix: <DollarOutlined /> },
              { title: 'Đã thu', value: revenue?.totalPaid, prefix: <DollarOutlined /> },
              { title: 'Còn nợ', value: revenue?.totalDebt, prefix: <DollarOutlined /> },
              { title: 'Số hóa đơn', value: revenue?.totalInvoices },
            ].map((s, i) => (
              <Col xs={24} sm={12} lg={6} key={i}>
                <Card>
                  <Statistic
                    title={s.title}
                    value={s.value ?? 0}
                    prefix={s.prefix}
                    formatter={(v) => typeof v === 'number' ? v.toLocaleString('vi-VN') : String(v)}
                    suffix={s.prefix ? 'đ' : undefined}
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <Card title="Theo bác sĩ">
            <Table
              dataSource={revenue?.byDoctor ?? []}
              rowKey="doctorId"
              size="small"
              pagination={false}
              columns={[
                { title: 'Bác sĩ', dataIndex: 'doctorName' },
                { title: 'Hóa đơn', dataIndex: 'invoiceCount', align: 'right' as const },
                { title: 'Doanh thu', dataIndex: 'revenue', align: 'right' as const, render: (v: number) => v.toLocaleString('vi-VN') + 'đ' },
              ]}
            />
          </Card>
        </>
      ),
    },
    {
      key: 'appointments',
      label: 'Lịch hẹn',
      children: (
        <Row gutter={[16, 16]}>
          {[
            { title: 'Tổng lịch', value: stats?.totalAppointments },
            { title: 'Hoàn thành', value: stats?.completed },
            { title: 'Hủy', value: stats?.cancelled },
            { title: 'Không đến', value: stats?.noShow },
            { title: 'Tỷ lệ HT', value: stats?.completionRate, suffix: '%' },
          ].map((s, i) => (
            <Col xs={24} sm={12} lg={4} key={i}>
              <Card>
                <Statistic title={s.title} value={s.value ?? 0} suffix={s.suffix} />
              </Card>
            </Col>
          ))}
        </Row>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Báo cáo</Title>
        <RangePicker
          value={[dayjs(range.from), dayjs(range.to)]}
          onChange={(dates) => {
            if (dates?.[0] && dates?.[1]) {
              setRange({ from: dates[0].format('YYYY-MM-DD'), to: dates[1].format('YYYY-MM-DD') });
            }
          }}
        />
      </div>
      {(revenueError || statsError) && (
        <Alert type="error" showIcon message="Không thể tải dữ liệu báo cáo. Vui lòng thử lại." style={{ marginBottom: 16 }} />
      )}
      <Tabs items={items} />
    </div>
  );
}
