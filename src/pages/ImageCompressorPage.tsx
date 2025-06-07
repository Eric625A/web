import React, { useState, useRef } from 'react';
import { Layout, Button, Upload, message, Slider, Space, Row, Col, Typography, Card, InputNumber } from 'antd';
import { UploadOutlined, DownloadOutlined, FullscreenOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

const ImageCompressorPage: React.FC = () => {
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [compressedImageSrc, setCompressedImageSrc] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.8);
  const [originalFileSize, setOriginalFileSize] = useState<number | null>(null);
  const [compressedFileSize, setCompressedFileSize] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setOriginalFileSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = async () => {
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
          setCompressedImageSrc(URL.createObjectURL(blob));
          setCompressedFileSize(blob.size);
          message.success('图片压缩成功！');
        } else {
          message.error('图片压缩失败。');
        }
      },
      'image/jpeg',
      quality
    );
  };

  const handleDownload = () => {
    if (!compressedImageSrc) {
      message.error('请先压缩图片！');
      return;
    }
    const link = document.createElement('a');
    link.href = compressedImageSrc;
    link.download = `compressed_image_${(quality * 100).toFixed(0)}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(compressedImageSrc);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Content style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>图片压缩工具</Title>
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
                  <Text>压缩质量 ({Math.round(quality * 100)}%):</Text>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={quality}
                    onChange={setQuality}
                    tooltip={{ formatter: (value?: number) => value !== undefined ? `${Math.round(value * 100)}%` : '' }}
                  />
                  <Button
                    type="primary"
                    onClick={compressImage}
                    block
                    icon={<FullscreenOutlined rotate={90} />}
                  >
                    开始压缩
                  </Button>
                </Space>
              )}
            </Card>

            {originalImageSrc && (
              <Card title="原始图片" style={{ marginBottom: 24 }}>
                <img src={originalImageSrc} alt="原始图片" ref={imageRef} style={{ maxWidth: '100%', display: 'block' }} />
                {originalFileSize && <Text type="secondary">大小: {(originalFileSize / 1024).toFixed(2)} KB</Text>}
              </Card>
            )}
          </Col>

          <Col xs={24} md={12}>
            <Card title="压缩预览" style={{ marginBottom: 24, minHeight: 300, display: 'flex', flexDirection: 'column' }}>
              {compressedImageSrc ? (
                <img src={compressedImageSrc} alt="压缩后图片" style={{ maxWidth: '100%', flexGrow: 1, objectFit: 'contain' }} />
              ) : (
                <Text type="secondary">压缩后的图片将在此处预览。</Text>
              )}
              {compressedFileSize && (
                <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
                  <Text type="secondary">压缩后大小: {(compressedFileSize / 1024).toFixed(2)} KB</Text>
                  {originalFileSize && (originalFileSize > 0) && (
                    <Text type="success">压缩率: {((1 - compressedFileSize / originalFileSize) * 100).toFixed(2)}%</Text>
                  )}
                </Space>
              )}
            </Card>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              disabled={!compressedImageSrc}
              block
              size="large"
            >
              下载压缩图片
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ImageCompressorPage; 