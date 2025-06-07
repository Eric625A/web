import React, { useState, useRef } from 'react';
import { Layout, Button, message, Select, Space, Row, Col, Typography, Card, Input } from 'antd';
import { UploadOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const ImageToTextPage: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('zh-CN'); // Default to Chinese
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setRecognitionResult(null); // Clear previous result on new upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecognize = async () => {
    if (!imageSrc || !imageRef.current) {
      message.error('请先上传图片！');
      return;
    }

    message.loading('正在识别图片中的文字...', 0);

    // TODO: 调用后端 OCR 服务
    // 这里的实现是一个模拟，实际应替换为真实的后端 API 调用
    try {
      const response = await new Promise<string>((resolve) => {
        setTimeout(() => {
          // 模拟 OCR 结果
          const simulatedResult = `这是从图片中识别出来的模拟文本。当前识别语言：${selectedLanguage}。\n\n实际的OCR服务会在这里处理图片并返回文字。`;
          resolve(simulatedResult);
        }, 2000); // 模拟网络延迟
      });
      setRecognitionResult(response);
      message.success('文字识别成功！');
    } catch (error) {
      message.error('文字识别失败，请稍后再试。');
      console.error('OCR Error:', error);
    }
    message.destroy(); // 移除加载提示
  };

  const handleCopy = () => {
    if (recognitionResult) {
      navigator.clipboard.writeText(recognitionResult)
        .then(() => message.success('文本已复制到剪贴板！'))
        .catch(() => message.error('复制失败，请手动复制。'));
    } else {
      message.warning('没有可复制的文本。');
    }
  };

  const handleDownloadTxt = () => {
    if (recognitionResult) {
      const blob = new Blob([recognitionResult], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'recognized_text.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success('文本已导出为 TXT 文件！');
    } else {
      message.warning('没有可导出的文本。');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Content style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>图片转文字工具</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="上传图片与设置" style={{ marginBottom: 24 }}>
              <input type="file" accept="image/*" onChange={onSelectFile} style={{ display: 'none' }} ref={fileInputRef} />
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => fileInputRef.current?.click()}
                block
              >
                选择图片
              </Button>

              {imageSrc && (
                <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
                  <Text>识别语言:</Text>
                  <Select
                    defaultValue="zh-CN"
                    style={{ width: '100%' }}
                    onChange={setSelectedLanguage}
                  >
                    <Option value="zh-CN">中文</Option>
                    <Option value="en-US">英文</Option>
                    <Option value="auto">自动检测</Option>
                  </Select>
                  <Button
                    type="primary"
                    onClick={handleRecognize}
                    block
                  >
                    开始识别
                  </Button>
                </Space>
              )}
            </Card>

            {imageSrc && (
              <Card title="图片预览" style={{ marginBottom: 24 }}>
                <img src={imageSrc} alt="预览图片" ref={imageRef} style={{ maxWidth: '100%', display: 'block' }} />
              </Card>
            )}
          </Col>

          <Col xs={24} md={12}>
            <Card title="识别结果" style={{ marginBottom: 24, minHeight: 300, display: 'flex', flexDirection: 'column' }}>
              {recognitionResult ? (
                <Input.TextArea
                  value={recognitionResult}
                  autoSize={{ minRows: 10, maxRows: 20 }}
                  readOnly
                  style={{ flexGrow: 1, marginBottom: 16 }}
                />
              ) : (
                <Text type="secondary">识别出的文字将在此处显示。</Text>
              )}
            </Card>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                icon={<CopyOutlined />}
                onClick={handleCopy}
                disabled={!recognitionResult}
              >
                复制文本
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadTxt}
                disabled={!recognitionResult}
              >
                导出 TXT
              </Button>
              {/* TODO: 导出DOC等更多格式，可能需要后端支持 */}
            </Space>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ImageToTextPage; 