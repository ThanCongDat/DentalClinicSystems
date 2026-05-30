import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Tag, Typography, Space, Select, Alert, Tabs } from 'antd';
import { WarningOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { inventoryService } from '../services/inventoryService';
import { branchService } from '../services/masterDataService';
import type { StockLevelDTO, LowStockAlertDTO, ExpiringBatchDTO, BranchDTO } from '../types';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function InventoryPage() {
  const [branchId, setBranchId] = useState<number | undefined>();

  const { data: branches = [] } = useQuery<BranchDTO[]>({
    queryKey: ['branches'],
    queryFn: () => branchService.getAll().then((r) => r.data),
  });

  const { data: levels, isLoading: loadingLevels, isError: levelsError } = useQuery<StockLevelDTO[]>({
    queryKey: ['inventory-levels', branchId],
    queryFn: () =>
      branchId
        ? inventoryService.getLevels(branchId).then((r) => r.data?.data ?? [])
        : Promise.resolve([]),
    enabled: !!branchId,
  });

  const { data: alerts = [] } = useQuery<LowStockAlertDTO[]>({
    queryKey: ['inventory-alerts', branchId],
    queryFn: () =>
      branchId
        ? inventoryService.getAlerts(branchId).then((r) => r.data?.data ?? [])
        : Promise.resolve([]),
    enabled: !!branchId,
  });

  const { data: expiring = [] } = useQuery<ExpiringBatchDTO[]>({
    queryKey: ['inventory-expiring', branchId],
    queryFn: () =>
      branchId
        ? inventoryService.getExpiring(branchId).then((r) => r.data?.data ?? [])
        : Promise.resolve([]),
    enabled: !!branchId,
  });

  const stockColumns = [
    { title: 'Mã', dataIndex: 'itemCode', width: 100, render: (v: string) => v || '—' },
    { title: 'Tên vật tư', dataIndex: 'itemName' },
    { title: 'Đơn vị', dataIndex: 'unit', width: 80 },
    {
      title: 'Tồn kho',
      key: 'qty',
      render: (_: unknown, r: StockLevelDTO) => (
        <span style={{ color: r.isLowStock ? '#ff4d4f' : undefined }}>
          {r.isLowStock && <WarningOutlined style={{ marginRight: 4 }} />}
          {r.quantity}
        </span>
      ),
    },
    { title: 'Ngưỡng đặt hàng', dataIndex: 'reorderPoint', align: 'right' as const },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: unknown, r: StockLevelDTO) => (
        <Tag color={r.isLowStock ? 'red' : 'green'}>{r.isLowStock ? 'Sắp hết' : 'Đủ hàng'}</Tag>
      ),
    },
  ];

  const expiringColumns = [
    { title: 'Tên vật tư', dataIndex: 'itemName' },
    { title: 'Số lô', dataIndex: 'batchNumber' },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiryDate',
      render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
    },
    { title: 'Còn lại', dataIndex: 'remainingQuantity', align: 'right' as const },
    { title: 'Đơn vị', dataIndex: 'unit', width: 80 },
    {
      title: 'Còn bao lâu',
      dataIndex: 'daysUntilExpiry',
      render: (d: number) => (
        <Tag color={d <= 7 ? 'red' : d <= 30 ? 'orange' : 'default'}>{d} ngày</Tag>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Kho vật tư</Title>
        <Select
          placeholder="Chọn chi nhánh"
          style={{ width: 220 }}
          value={branchId}
          onChange={setBranchId}
          options={branches.map((b) => ({ value: b.id, label: b.name }))}
        />
      </div>

      {!branchId && (
        <Alert type="info" showIcon message="Vui lòng chọn chi nhánh để xem tồn kho." />
      )}

      {branchId && (
        <>
          {levelsError && (
            <Alert type="error" showIcon message="Không thể tải dữ liệu tồn kho. Vui lòng thử lại." style={{ marginBottom: 16 }} />
          )}
          {alerts.length > 0 && (
            <Alert
              type="warning"
              showIcon
              message={`${alerts.length} vật tư sắp hết tồn kho`}
              style={{ marginBottom: 16 }}
            />
          )}
          <Tabs
            items={[
              {
                key: 'levels',
                label: 'Tồn kho',
                children: (
                  <Table
                    columns={stockColumns}
                    dataSource={levels ?? []}
                    rowKey="itemId"
                    loading={loadingLevels}
                    rowClassName={(r) => (r.isLowStock ? 'row-warning' : '')}
                    pagination={{ pageSize: 20, showTotal: (t) => `Tổng ${t} vật tư` }}
                  />
                ),
              },
              {
                key: 'expiring',
                label: (
                  <Space>
                    <ClockCircleOutlined />
                    Sắp hết hạn {expiring.length > 0 && `(${expiring.length})`}
                  </Space>
                ),
                children: (
                  <Table
                    columns={expiringColumns}
                    dataSource={expiring}
                    rowKey="batchId"
                    pagination={{ pageSize: 20 }}
                  />
                ),
              },
            ]}
          />
        </>
      )}
    </div>
  );
}
