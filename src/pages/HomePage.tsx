import React from 'react';
import { Layout, Menu, Card, Row, Col, Typography, Space, Button } from 'antd';
import { 
  AppstoreOutlined, 
  CodeOutlined, 
  FileTextOutlined, 
  ShoppingCartOutlined, 
  InboxOutlined, 
  SettingOutlined,
  ShoppingOutlined,
  ShopOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const modules = [
  {
    icon: <AppstoreOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    title: '产品介绍',
    desc: '产品概述、特点和技术规格',
    btn: '查看详情',
    path: '/product'
  },
  {
    icon: <CodeOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    title: '软件版本',
    desc: '版本管理和更新日志',
    btn: '查看详情',
    path: '/software'
  },
  {
    icon: <FileTextOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    title: '硬件文档',
    desc: '原理图、PCB和BOM清单',
    btn: '查看详情',
    path: '/hardware'
  },
  {
    icon: <ShoppingCartOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    title: '物料采购',
    desc: '采购管理和供应商信息',
    btn: '查看详情',
    path: '/purchase'
  },
  {
    icon: <InboxOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    title: '仓库管理',
    desc: '库存管理和出入库记录',
    btn: '查看详情',
    path: '/warehouse'
  },
  {
    icon: <SettingOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    title: '系统管理',
    desc: '用户权限和系统设置',
    btn: '查看详情',
    path: '/system'
  }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path, { replace: true });
  };

  const tools = [
    {
      title: '仓库管理',
      icon: <ShopOutlined style={{ fontSize: '32px' }} />,
      description: '管理仓库库存、物料和成品',
      path: '/warehouse'
    },
    {
      title: '采购管理',
      icon: <ShoppingOutlined style={{ fontSize: '32px' }} />,
      description: '管理物料采购和供应商',
      path: '/purchase'
    },
    {
      title: '版本管理',
      icon: <SwapOutlined style={{ fontSize: '32px' }} />,
      description: '管理软件版本和更新',
      path: '/software'
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <div style={{ marginLeft: 24, fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>FUC</div>
          <Menu mode="horizontal" defaultSelectedKeys={['home']} style={{ flex: 1, border: 'none' }}>
            <Menu.Item key="home">
              <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item key="product">
              <Link to="/product">产品</Link>
            </Menu.Item>
            <Menu.Item key="document">
              <Link to="/document">文档</Link>
            </Menu.Item>
            <Menu.Item key="system">
              <Link to="/system">系统</Link>
            </Menu.Item>
          </Menu>
        </div>
      </Header>
      <Content>
        {/* 欢迎横幅区域 */}
        <div style={{ 
          background: 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)', 
          padding: '48px 0', 
          textAlign: 'center',
          color: '#fff'
        }}>
          <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>FUC产品管理系统</Title>
          <Text style={{ fontSize: 18 }}>高效管理，智能协同</Text>
        </div>

        {/* 功能模块卡片区域 */}
        <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 24px' }}>
          <Row gutter={[24, 24]}>
            {modules.map((module) => (
              <Col xs={24} sm={12} md={8} key={module.title}>
                <Card 
                  hoverable 
                  style={{ 
                    borderRadius: 8,
                    textAlign: 'center',
                    height: '100%'
                  }}
                >
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    {module.icon}
                    <Title level={4} style={{ margin: 0 }}>{module.title}</Title>
                    <Text type="secondary">{module.desc}</Text>
                    <Button type="primary" block>
                      <Link to={module.path} style={{ color: '#fff' }}>{module.btn}</Link>
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* 快捷入口区域 */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 40px' }}>
          <Card>
            <Row gutter={24}>
              <Col span={8}>
                <Title level={5}>最近访问</Title>
                <Text type="secondary">暂无访问记录</Text>
              </Col>
              <Col span={8}>
                <Title level={5}>待办事项</Title>
                <Text type="secondary">暂无待办事项</Text>
              </Col>
              <Col span={8}>
                <Title level={5}>系统公告</Title>
                <Text type="secondary">暂无系统公告</Text>
              </Col>
            </Row>
          </Card>
        </div>

        <div style={{ padding: '24px' }}>
          <Title level={2} style={{ marginBottom: '24px' }}>系统工具</Title>
          <Row gutter={[16, 16]}>
            {tools.map((tool, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card 
                  hoverable 
                  style={{ height: '100%', cursor: 'pointer' }}
                  styles={{ body: { textAlign: 'center' } }}
                  onClick={() => handleNavigation(tool.path)}
                >
                  <div style={{ marginBottom: '16px' }}>{tool.icon}</div>
                  <Title level={4} style={{ margin: '0 0 8px 0' }}>{tool.title}</Title>
                  <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{tool.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <Space split={<span>|</span>}>
          <span>版权信息</span>
          <span>使用条款</span>
          <span>隐私政策</span>
          <span>联系方式</span>
        </Space>
      </Footer>
    </Layout>
  );
};

export default HomePage; 