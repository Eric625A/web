import React, { useState, useRef } from 'react';
import { Layout, Button, message, Select, Space, Row, Col, Typography, Card } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const ImageConverterPage: React.FC = () => {
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [convertedImageSrc, setConvertedImageSrc] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('image/png');
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImageSrc(event.target?.result as string);
        setConvertedImageSrc(null); // Clear converted image on new upload
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImage = async () => {
    if (!originalImageSrc || !imageRef.current) {
      message.error('请先上传图片！');
      return;
    }

    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      message.error('Canvas context not available.');
      return;
    }

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setConvertedImageSrc(URL.createObjectURL(blob));
          message.success(`图片转换为 ${targetFormat.split('/')[1].toUpperCase()} 成功！`);
        } else {
          message.error('图片转换失败。');
        }
      },
      targetFormat,
      1 // Quality for image/jpeg or image/webp, for png it's ignored
    );
  };

  const handleDownload = () => {
    if (!convertedImageSrc) {
      message.error('请先转换图片！');
      return;
    }
    const link = document.createElement('a');
    link.href = convertedImageSrc;
    const extension = targetFormat.split('/')[1];
    link.download = `converted_image.${extension === 'jpeg' ? 'jpg' : extension}`; // Handle jpeg vs jpg
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(convertedImageSrc);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Content style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>图片转换工具</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="上传与设置" style={{ marginBottom: 24 }}>
              <input type="file" accept="image/*" onChange={onSelectFile} style={{ display: 'none' }} ref={fileInputRef} />
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => fileInputRef.current?.click()}
                block
              >
                选择图片
              </Button>

              {originalImageSrc && (
                <Space direction="vertical" style={{ width: '100%', marginTop: 24 }}>
                  <Text>目标格式:</Text>
                  <Select
                    defaultValue="image/png"
                    style={{ width: '100%' }}
                    onChange={setTargetFormat}
                  >
                    <Option value="image/png">PNG</Option>
                    <Option value="image/jpeg">JPG</Option>
                    <Option value="image/webp">WEBP</Option>
                  </Select>
                  <Button
                    type="primary"
                    onClick={convertImage}
                    block
                  >
                    开始转换
                  </Button>
                </Space>
              )}
            </Card>

            {originalImageSrc && (
              <Card title="原始图片" style={{ marginBottom: 24 }}>
                <img src={originalImageSrc} alt="原始图片" ref={imageRef} style={{ maxWidth: '100%', display: 'block' }} />
              </Card>
            )}
          </Col>

          <Col xs={24} md={12}>
            <Card title="转换预览" style={{ marginBottom: 24, minHeight: 300, display: 'flex', flexDirection: 'column' }}>
              {convertedImageSrc ? (
                <img src={convertedImageSrc} alt="转换后图片" style={{ maxWidth: '100%', flexGrow: 1, objectFit: 'contain' }} />
              ) : (
                <Text type="secondary">转换后的图片将在此处预览。</Text>
              )}
            </Card>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              disabled={!convertedImageSrc}
              block
              size="large"
            >
              下载转换图片
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ImageConverterPage; 