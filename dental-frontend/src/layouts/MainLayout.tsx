import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined, CalendarOutlined, TeamOutlined,
  FileTextOutlined, ShoppingOutlined, BarChartOutlined,
  SettingOutlined, MedicineBoxOutlined, LogoutOutlined, UserOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, ExperimentOutlined,
  HeartOutlined, GiftOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/dashboard',    icon: <DashboardOutlined />,   label: 'Tổng quan' },
  { key: '/appointments', icon: <CalendarOutlined />,    label: 'Lịch hẹn' },
  { key: '/patients',     icon: <TeamOutlined />,        label: 'Bệnh nhân' },
  { key: '/emr',          icon: <HeartOutlined />,       label: 'Hồ sơ bệnh án' },
  { key: '/billing',      icon: <FileTextOutlined />,    label: 'Hóa đơn' },
  { key: '/inventory',    icon: <ShoppingOutlined />,    label: 'Kho vật tư' },
  { key: '/lab-orders',   icon: <ExperimentOutlined />,  label: 'Đơn labo' },
  { key: '/crm',          icon: <GiftOutlined />,        label: 'CRM' },
  { key: '/reports',      icon: <BarChartOutlined />,    label: 'Báo cáo' },
  { key: '/settings',     icon: <SettingOutlined />,     label: 'Cài đặt' },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { token } = theme.useToken();
  const user      = useAuthStore((s) => s.user);
  const logout    = useAuthStore((s) => s.logout);

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Tài khoản' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true,
      onClick: () => { logout(); navigate('/login'); } },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light"
        style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.06)' }}>
        <div style={{
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          overflow: 'hidden', padding: '0 16px',
        }}>
          <MedicineBoxOutlined style={{ fontSize: 24, color: token.colorPrimary }} />
          {!collapsed && (
            <span style={{ marginLeft: 8, fontWeight: 700, fontSize: 16, color: token.colorPrimary }}>
              DentalClinic
            </span>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header style={{
          padding: '0 16px', background: token.colorBgContainer,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={{ items: userMenuItems }}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar size="small" icon={<UserOutlined />} />
              {user && <span>{user.fullName}</span>}
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: 24, padding: 24, background: token.colorBgContainer, borderRadius: token.borderRadius }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
