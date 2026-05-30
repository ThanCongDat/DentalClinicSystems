import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table, Button, Typography, Space, Tabs, Modal, Form, Input,
  InputNumber, message, Tag, Descriptions, Rate, Select, Switch, Alert,
} from 'antd';
import { PlusOutlined, StarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { membershipService, feedbackService, tagService, newsService } from '../services/crmService';
import type { MembershipCardDTO, FeedbackDTO, CustomerTagDTO, NewsDTO } from '../types';

const { Title } = Typography;

// ── Membership tab ────────────────────────────────────────────
function MembershipTab() {
  const [patientId, setPatientId] = useState<number | undefined>();
  const [card, setCard] = useState<MembershipCardDTO | null>(null);
  const [loadingCard, setLoadingCard] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [redeemForm] = Form.useForm();
  const qc = useQueryClient();

  const { data: history = [] } = useQuery({
    queryKey: ['point-history', card?.id],
    queryFn: () =>
      card ? membershipService.getPointHistory(card.id).then((r) => r.data?.data ?? []) : Promise.resolve([]),
    enabled: !!card,
  });

  const mutRedeem = useMutation({
    mutationFn: ({ points, note }: { points: number; note: string }) =>
      membershipService.redeemPoints(card!.id, points, note),
    onSuccess: (res) => {
      if (res.data?.success) {
        message.success('Đổi điểm thành công');
        setRedeemOpen(false);
        redeemForm.resetFields();
        if (patientId) fetchCard(patientId);
        qc.invalidateQueries({ queryKey: ['point-history'] });
      } else {
        message.error(res.data?.message ?? 'Có lỗi xảy ra');
      }
    },
    onError: () => message.error('Có lỗi xảy ra'),
  });

  const fetchCard = async (id: number) => {
    setLoadingCard(true);
    try {
      const res = await membershipService.getCard(id);
      setCard(res.data?.data ?? null);
      if (!res.data?.success) message.warning(res.data?.message ?? 'Không tìm thấy thẻ');
    } catch {
      message.error('Có lỗi khi tải thẻ thành viên');
    } finally {
      setLoadingCard(false);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <InputNumber
          placeholder="ID bệnh nhân"
          style={{ width: 160 }}
          min={1}
          value={patientId}
          onChange={(v) => setPatientId(v ?? undefined)}
        />
        <Button
          type="primary"
          onClick={() => patientId && fetchCard(patientId)}
          loading={loadingCard}
          disabled={!patientId}
        >
          Tra cứu
        </Button>
      </Space>

      {card && (
        <>
          <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Số thẻ">{card.cardNumber}</Descriptions.Item>
            <Descriptions.Item label="Hạng thành viên">
              <Tag color="gold">{card.tier?.name}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Điểm tích luỹ">{card.totalPoints.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Điểm khả dụng">
              <strong>{card.availablePoints.toLocaleString()}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cấp">{dayjs(card.issuedDate).format('DD/MM/YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={card.isActive ? 'green' : 'default'}>{card.isActive ? 'Đang hoạt động' : 'Đã khóa'}</Tag>
            </Descriptions.Item>
          </Descriptions>

          <Space style={{ marginBottom: 16 }}>
            <Button
              icon={<StarOutlined />}
              onClick={() => setRedeemOpen(true)}
              disabled={card.availablePoints <= 0}
            >
              Đổi điểm
            </Button>
          </Space>

          <Title level={5}>Lịch sử giao dịch</Title>
          <Table
            dataSource={history}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 10 }}
            columns={[
              {
                title: 'Ngày',
                dataIndex: 'createdAt',
                render: (v: string) => dayjs(v).format('DD/MM/YYYY HH:mm'),
                width: 160,
              },
              { title: 'Loại', dataIndex: 'transactionType' },
              {
                title: 'Điểm',
                dataIndex: 'points',
                align: 'right' as const,
                render: (v: number) => (
                  <span style={{ color: v > 0 ? '#52c41a' : '#ff4d4f', fontWeight: 600 }}>
                    {v > 0 ? '+' : ''}{v.toLocaleString()}
                  </span>
                ),
              },
              { title: 'Ghi chú', dataIndex: 'note', render: (v) => v || '—' },
            ]}
          />
        </>
      )}

      <Modal
        title="Đổi điểm thưởng"
        open={redeemOpen}
        onCancel={() => setRedeemOpen(false)}
        onOk={() => redeemForm.submit()}
        confirmLoading={mutRedeem.isPending}
      >
        <Form form={redeemForm} layout="vertical" onFinish={(v) => mutRedeem.mutate(v)}>
          <Form.Item name="points" label={`Số điểm muốn đổi (có thể dùng: ${card?.availablePoints ?? 0})`}
            rules={[
              { required: true },
              { type: 'number', max: card?.availablePoints, message: 'Không đủ điểm' },
            ]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú / Quyền lợi đổi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

// ── Feedback tab ──────────────────────────────────────────────
function FeedbackTab() {
  const [openCreate, setOpenCreate] = useState(false);
  const [form] = Form.useForm();
  const qc = useQueryClient();

  const { data: feedbacks = [], isLoading, isError } = useQuery<FeedbackDTO[]>({
    queryKey: ['feedbacks'],
    queryFn: () => feedbackService.getAll().then((r) => r.data?.data ?? []),
  });

  const mutCreate = useMutation({
    mutationFn: (v: object) => feedbackService.create(v),
    onSuccess: (res) => {
      if (res.data?.success) {
        message.success('Đã thêm đánh giá');
        setOpenCreate(false);
        form.resetFields();
        qc.invalidateQueries({ queryKey: ['feedbacks'] });
      } else {
        message.error(res.data?.message);
      }
    },
  });

  const mutDelete = useMutation({
    mutationFn: (id: number) => feedbackService.delete(id),
    onSuccess: () => {
      message.success('Đã xóa');
      qc.invalidateQueries({ queryKey: ['feedbacks'] });
    },
  });

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenCreate(true)}>
          Thêm đánh giá
        </Button>
      </Space>
      {isError && (
        <Alert type="error" showIcon message="Không thể tải danh sách đánh giá. Vui lòng thử lại." style={{ marginBottom: 16 }} />
      )}
      <Table
        dataSource={feedbacks}
        rowKey="id"
        loading={isLoading}
        columns={[
          { title: 'Khách hàng', dataIndex: 'customerName' },
          { title: 'Vai trò', dataIndex: 'role', render: (v) => v || '—' },
          {
            title: 'Đánh giá',
            dataIndex: 'rating',
            render: (v: number) => <Rate disabled defaultValue={v} />,
          },
          { title: 'Nội dung', dataIndex: 'content', ellipsis: true },
          {
            title: 'Nổi bật',
            dataIndex: 'isHighlighted',
            render: (v: boolean) => <Tag color={v ? 'gold' : 'default'}>{v ? 'Có' : 'Không'}</Tag>,
          },
          {
            title: '',
            render: (_: unknown, r: FeedbackDTO) => (
              <Button
                size="small"
                danger
                onClick={() =>
                  Modal.confirm({
                    title: 'Xóa đánh giá này?',
                    okType: 'danger',
                    okText: 'Xóa',
                    onOk: () => mutDelete.mutate(r.id),
                  })
                }
              >
                Xóa
              </Button>
            ),
          },
        ]}
      />

      <Modal
        title="Thêm đánh giá khách hàng"
        open={openCreate}
        onCancel={() => { setOpenCreate(false); form.resetFields(); }}
        onOk={() => form.submit()}
        confirmLoading={mutCreate.isPending}
      >
        <Form form={form} layout="vertical" onFinish={(v) => mutCreate.mutate(v)}>
          <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Vai trò">
            <Input placeholder="VD: Bệnh nhân điều trị răng sứ" />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="rating" label="Số sao" initialValue={5}>
            <Rate />
          </Form.Item>
          <Form.Item name="isHighlighted" label="Hiển thị nổi bật" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

// ── Tags tab ──────────────────────────────────────────────────
function TagsTab() {
  const [openCreate, setOpenCreate] = useState(false);
  const [form] = Form.useForm();
  const qc = useQueryClient();

  const { data: tags = [], isLoading, isError } = useQuery<CustomerTagDTO[]>({
    queryKey: ['tags'],
    queryFn: () => tagService.getAll().then((r) => r.data?.data ?? []),
  });

  const mutCreate = useMutation({
    mutationFn: (v: object) => tagService.create(v),
    onSuccess: (res) => {
      if (res.data?.success) {
        message.success('Đã tạo tag');
        setOpenCreate(false);
        form.resetFields();
        qc.invalidateQueries({ queryKey: ['tags'] });
      } else {
        message.error(res.data?.message);
      }
    },
  });

  const mutDelete = useMutation({
    mutationFn: (id: number) => tagService.delete(id),
    onSuccess: () => {
      message.success('Đã xóa tag');
      qc.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenCreate(true)}>
          Tạo tag
        </Button>
      </Space>
      {isError && (
        <Alert type="error" showIcon message="Không thể tải danh sách tag. Vui lòng thử lại." style={{ marginBottom: 16 }} />
      )}
      <Table
        dataSource={tags}
        rowKey="id"
        loading={isLoading}
        columns={[
          {
            title: 'Tag',
            dataIndex: 'name',
            render: (v: string, r: CustomerTagDTO) => <Tag color={r.color ?? 'blue'}>{v}</Tag>,
          },
          { title: 'Mô tả', dataIndex: 'description', render: (v) => v || '—' },
          { title: 'Số BN', dataIndex: 'patientCount', align: 'right' as const },
          {
            title: '',
            render: (_: unknown, r: CustomerTagDTO) => (
              <Button
                size="small"
                danger
                onClick={() =>
                  Modal.confirm({
                    title: `Xóa tag "${r.name}"?`,
                    okType: 'danger',
                    okText: 'Xóa',
                    onOk: () => mutDelete.mutate(r.id),
                  })
                }
              >
                Xóa
              </Button>
            ),
          },
        ]}
      />

      <Modal
        title="Tạo tag mới"
        open={openCreate}
        onCancel={() => { setOpenCreate(false); form.resetFields(); }}
        onOk={() => form.submit()}
        confirmLoading={mutCreate.isPending}
      >
        <Form form={form} layout="vertical" onFinish={(v) => mutCreate.mutate(v)}>
          <Form.Item name="name" label="Tên tag" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="color" label="Màu sắc">
            <Select
              options={[
                { value: 'blue', label: 'Xanh dương' },
                { value: 'green', label: 'Xanh lá' },
                { value: 'red', label: 'Đỏ' },
                { value: 'orange', label: 'Cam' },
                { value: 'purple', label: 'Tím' },
                { value: 'gold', label: 'Vàng' },
              ]}
              placeholder="Chọn màu"
            />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

// ── News tab ──────────────────────────────────────────────────
function NewsTab() {
  const [openCreate, setOpenCreate] = useState(false);
  const [form] = Form.useForm();
  const qc = useQueryClient();

  const { data: news = [], isLoading, isError } = useQuery<NewsDTO[]>({
    queryKey: ['news'],
    queryFn: () => newsService.getAll().then((r) => r.data?.data ?? []),
  });

  const mutCreate = useMutation({
    mutationFn: (v: object) => newsService.create(v),
    onSuccess: (res) => {
      if (res.data?.success) {
        message.success('Đã tạo bài viết');
        setOpenCreate(false);
        form.resetFields();
        qc.invalidateQueries({ queryKey: ['news'] });
      } else {
        message.error(res.data?.message);
      }
    },
  });

  const mutDelete = useMutation({
    mutationFn: (id: number) => newsService.delete(id),
    onSuccess: () => {
      message.success('Đã xóa');
      qc.invalidateQueries({ queryKey: ['news'] });
    },
  });

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenCreate(true)}>
          Tạo bài viết
        </Button>
      </Space>
      {isError && (
        <Alert type="error" showIcon message="Không thể tải danh sách bài viết. Vui lòng thử lại." style={{ marginBottom: 16 }} />
      )}
      <Table
        dataSource={news}
        rowKey="id"
        loading={isLoading}
        columns={[
          { title: 'Tiêu đề', dataIndex: 'title' },
          { title: 'Danh mục', dataIndex: 'category', render: (v) => v || '—' },
          {
            title: 'Ngày xuất bản',
            dataIndex: 'publishDate',
            render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
          },
          {
            title: 'Trạng thái',
            dataIndex: 'isPublished',
            render: (v: boolean) => <Tag color={v ? 'green' : 'default'}>{v ? 'Đã xuất bản' : 'Nháp'}</Tag>,
          },
          {
            title: '',
            render: (_: unknown, r: NewsDTO) => (
              <Button
                size="small"
                danger
                onClick={() =>
                  Modal.confirm({
                    title: 'Xóa bài viết này?',
                    okType: 'danger',
                    okText: 'Xóa',
                    onOk: () => mutDelete.mutate(r.id),
                  })
                }
              >
                Xóa
              </Button>
            ),
          },
        ]}
      />

      <Modal
        title="Tạo bài viết mới"
        open={openCreate}
        onCancel={() => { setOpenCreate(false); form.resetFields(); }}
        onOk={() => form.submit()}
        confirmLoading={mutCreate.isPending}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={(v) => mutCreate.mutate(v)}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug URL" rules={[{ required: true }]}>
            <Input placeholder="vd: rang-su-toan-su" />
          </Form.Item>
          <Form.Item name="category" label="Danh mục">
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item name="isPublished" label="Xuất bản ngay" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

// ── Main CRM page ─────────────────────────────────────────────
export default function CRMPage() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>CRM & Khách hàng thân thiết</Title>
      <Tabs
        items={[
          { key: 'membership', label: 'Thẻ thành viên', children: <MembershipTab /> },
          { key: 'feedback',   label: 'Đánh giá',       children: <FeedbackTab /> },
          { key: 'tags',       label: 'Tag khách hàng', children: <TagsTab /> },
          { key: 'news',       label: 'Tin tức',        children: <NewsTab /> },
        ]}
      />
    </div>
  );
}
