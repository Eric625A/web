import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import {
  HomeOutlined,
  ShopOutlined,
  ShoppingOutlined,
  SwapOutlined
} from '@ant-design/icons';
import HomePage from './pages/HomePage';
import WarehousePage from './pages/WarehousePage';
import PurchasePage from './pages/PurchasePage';
import VersionPage from './pages/VersionPage';
import './App.css';

const { Header, Content, Footer } = Layout;

// 创建一个包装组件来处理路由状态
const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('home');

  useEffect(() => {
    // 根据当前路径更新选中的菜单项
    const path = location.pathname;
    if (path === '/') {
      setSelectedKey('home');
    } else if (path === '/warehouse') {
      setSelectedKey('warehouse');
    } else if (path === '/purchase') {
      setSelectedKey('purchase');
    } else if (path === '/software') {
      setSelectedKey('version');
    }
  }, [location]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
      onClick: () => navigate('/')
    },
    {
      key: 'warehouse',
      icon: <ShopOutlined />,
      label: '仓库管理',
      onClick: () => navigate('/warehouse')
    },
    {
      key: 'purchase',
      icon: <ShoppingOutlined />,
      label: '采购管理',
      onClick: () => navigate('/purchase')
    },
    {
      key: 'version',
      icon: <SwapOutlined />,
      label: '版本管理',
      onClick: () => navigate('/software')
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: colorBgContainer }}>
        <div className="demo-logo" />
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            marginTop: 24
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/warehouse" element={<WarehousePage />} />
            <Route path="/purchase" element={<PurchasePage />} />
            <Route path="/software" element={<VersionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        软件版本管理系统 ©{new Date().getFullYear()} Created by Your Company
      </Footer>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
