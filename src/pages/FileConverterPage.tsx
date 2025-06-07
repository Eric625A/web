import React, { useState, useRef } from 'react';
import { Layout, Button, message, Select, Space, Row, Col, Typography, Card } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const FileConverterPage: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('pdf'); // Default target format
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setOriginalFile(file);
      setConvertedFileUrl(null); // Clear converted file on new upload
      message.info(`文件 ${file.name} 已上传。`);
    }
  };

  const handleConvert = async () => {
    if (!originalFile) {
      message.error('请先上传文件！');
      return;
    }

    message.loading('正在转换文件...', 0);

    // TODO: 调用后端文件转换服务
    // 这里的实现是一个模拟，实际应替换为真实的后端 API 调用
    try {
      // 模拟文件转换成功，返回一个模拟的下载URL
      const simulatedConvertedUrl = `data:application/octet-stream;base64,${btoa('Simulated converted content for ' + originalFile.name)}`;
      setConvertedFileUrl(simulatedConvertedUrl);
      message.success(`文件转换为 ${targetFormat.toUpperCase()} 成功！`);
    } catch (error) {
      message.error('文件转换失败，请稍后再试。');
      console.error('File Conversion Error:', error);
    } finally {
      message.destroy(); // 移除加载提示
    }
  };

  const handleDownload = () => {
    if (!convertedFileUrl || !originalFile) {
      message.error('没有可下载的文件。');
      return;
    }

    const link = document.createElement('a');
    link.href = convertedFileUrl;
    const originalFileName = originalFile.name.split('.')[0];
    link.download = `${originalFileName}.${targetFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(convertedFileUrl);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Content style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>文件转换工具</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="上传文件与设置" style={{ marginBottom: 24 }}>
              <input type="file" onChange={onSelectFile} style={{ display: 'none' }} ref={fileInputRef} />
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => fileInputRef.current?.click()}
                block
              >
                选择文件
              </Button>

              {originalFile && (
                <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
                  <Text>已选择文件: {originalFile.name}</Text>
                  <Text>目标格式:</Text>
                  <Select
                    defaultValue="pdf"
                    style={{ width: '100%' }}
                    onChange={setTargetFormat}
                  >
                    <Option value="pdf">PDF</Option>
                    <Option value="docx">DOCX</Option>
                    <Option value="xlsx">XLSX</Option>
                    <Option value="pptx">PPTX</Option>
                    <Option value="txt">TXT</Option>
                  </Select>
                  <Button
                    type="primary"
                    onClick={handleConvert}
                    block
                    style={{ marginTop: 16 }}
                  >
                    开始转换
                  </Button>
                </Space>
              )}
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="转换结果" style={{ marginBottom: 24, minHeight: 300, display: 'flex', flexDirection: 'column' }}>
              {convertedFileUrl ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>文件已转换成功！</Text>
                  <Text type="secondary">点击下方按钮下载。</Text>
                </Space>
              ) : (
                <Text type="secondary">转换后的文件将在此处显示。</Text>
              )}
            </Card>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              disabled={!convertedFileUrl}
              block
              size="large"
            >
              下载转换后的文件
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default FileConverterPage; 