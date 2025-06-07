import React from 'react';
import { Layout, Menu, Input, Button, Card, Row, Col, Typography, Space } from 'antd';
import { SearchOutlined, FileImageOutlined, CompressOutlined, SwapOutlined, ScissorOutlined, FontSizeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import '../App.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const tools = [
  {
    icon: <SwapOutlined style={{ fontSize: 32, color: '#2196F3' }} />,
    title: '文件转换',
    desc: '多格式文件互转',
    btn: '立即使用',
    path: '/file-converter' // Link to the File Converter Page
  },
  {
    icon: <CompressOutlined style={{ fontSize: 32, color: '#2196F3' }} />,
    title: '图片压缩',
    desc: '高效图片压缩',
    btn: '立即使用',
    path: '/image-compressor' // Link to the Image Compressor Page
  },
  {
    icon: <FileImageOutlined style={{ fontSize: 32, color: '#2196F3' }} />,
    title: '图片转换',
    desc: '图片格式转换',
    btn: '立即使用',
    path: '/image-converter' // Link to the Image Converter Page
  },
  {
    icon: <ScissorOutlined style={{ fontSize: 32, color: '#2196F3' }} />,
    title: '图片裁剪',
    desc: '自定义图片裁剪',
    btn: '立即使用',
    path: '/image-cropper' // Link to the Image Cropper Page (already done)
  },
  {
    icon: <FontSizeOutlined style={{ fontSize: 32, color: '#2196F3' }} />,
    title: '图片转文字',
    desc: '图片文字识别',
    btn: '立即使用',
    path: '/image-to-text' // Link to the Image To Text Page
  },
];

const HomePage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: 0 }}>
        <Menu mode="horizontal" defaultSelectedKeys={['home']} style={{ fontSize: 16 }}>
          <Menu.Item key="home">
            <Link to="/">首页</Link>
          </Menu.Item>
          <Menu.Item key="tools">
            <Link to="/tools">工具集</Link>
          </Menu.Item>
          <Menu.Item key="about">
            <Link to="/about">关于我们</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ background: '#F5F5F5', padding: '0 0 40px 0' }}>
        <div style={{ background: 'linear-gradient(90deg, #e3f0ff 0%, #fff 100%)', padding: '48px 0 32px 0', textAlign: 'center' }}>
          <Title level={2} style={{ color: '#222', fontWeight: 700, marginBottom: 8 }}>My Tools</Title> {/* 网站主标题 */}
          <Text style={{ fontSize: 18, color: '#666' }}>安全高效的文件与图片处理工具集</Text>
          <div style={{ margin: '32px auto 0', maxWidth: 520, display: 'flex', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', alignItems: 'center', padding: 8 }}>
            <Input.Group compact style={{ flex: 1 }}>
              <Input style={{ width: 120 }} defaultValue="全部" disabled />
              <Input style={{ width: 280 }} placeholder="搜索全站素材" allowClear />
            </Input.Group>
            <Button type="primary" icon={<SearchOutlined />} size="large" style={{ marginLeft: 8, background: '#FF9800', borderColor: '#FF9800' }}>搜索</Button>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', marginTop: 40 }}>
          <Title level={4} style={{ fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>常用工具</Title>
          <Row gutter={[24, 24]} justify="center">
            {tools.map((tool, idx) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={tool.title}>
                <Card hoverable style={{ borderRadius: 12, minHeight: 180, textAlign: 'center', boxShadow: '0 2px 8px #f0f1f2' }}>
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    {tool.icon}
                    <Text strong style={{ fontSize: 18 }}>{tool.title}</Text>
                    <Text type="secondary">{tool.desc}</Text>
                    <Button type="primary" block style={{ background: '#2196F3', borderColor: '#2196F3' }}>
                      <Link to={tool.path} style={{ color: '#fff' }}>{tool.btn}</Link>
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#fff', borderTop: '1px solid #f0f0f0', color: '#888' }}>
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