// React 核心库和 hooks
import React, { useState, useRef } from 'react';
// Ant Design UI 组件库
import { Layout, Button, Upload, message, Slider, Space, Row, Col, Typography, Card } from 'antd';
// Ant Design 图标组件
import { UploadOutlined, DownloadOutlined, RotateRightOutlined } from '@ant-design/icons';
// 图片裁剪组件及其类型定义
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
// 裁剪组件样式
import 'react-image-crop/dist/ReactCrop.css';

// 解构 Ant Design 组件
const { Content } = Layout;
const { Title, Text } = Typography;

// 图片裁剪页面组件
const ImageCropperPage: React.FC = () => {
  // 状态管理
  const [src, setSrc] = useState<string | null>(null); // 图片源
  const [crop, setCrop] = useState<Crop>(); // 裁剪区域
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>(); // 完成裁剪的区域
  const imgRef = useRef<HTMLImageElement>(null); // 图片元素引用
  const previewCanvasRef = useRef<HTMLCanvasElement>(null); // 预览画布引用
  const [scale, setScale] = useState(1); // 缩放比例
  const [rotate, setRotate] = useState(0); // 旋转角度
  const [aspect, setAspect] = useState<number | undefined>(undefined); // 裁剪框宽高比

  // 处理文件选择
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // 重置裁剪区域
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // 处理图片加载完成
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop({ unit: 'px', width, height, x: 0, y: 0 });
    }
  };

  // 获取裁剪后的图片
  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop, fileName: string): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return Promise.resolve(null);
    }

    // 在画布上绘制裁剪后的图片
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // 将画布内容转换为 Blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  };

  // 处理下载裁剪后的图片
  const handleDownload = async () => {
    if (!completedCrop || !imgRef.current) {
      message.error('请先选择并裁剪图片！');
      return;
    }

    const image = imgRef.current;
    const croppedImageBlob = await getCroppedImg(image, completedCrop, 'cropped-image.png');

    if (croppedImageBlob) {
      // 创建下载链接并触发下载
      const url = URL.createObjectURL(croppedImageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cropped-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      message.error('无法生成裁剪图片。');
    }
  };

  // 处理图片旋转
  const handleRotate = () => {
    setRotate((prev) => (prev + 90) % 360);
  };

  // 更新预览画布
  React.useEffect(() => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      // 计算缩放比例和设备像素比
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const pixelRatio = window.devicePixelRatio;

      // 设置画布尺寸和变换
      canvas.width = completedCrop.width * pixelRatio;
      canvas.height = completedCrop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      // 在预览画布上绘制裁剪后的图片
      const crop = completedCrop;
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }
  }, [completedCrop]);

  // 渲染页面
  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Content style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>图片裁剪工具</Title>
        <Row gutter={[24, 24]}>
          {/* 左侧：上传和裁剪区域 */}
          <Col xs={24} md={12}>
            <Card title="上传图片" style={{ marginBottom: 24 }}>
              <input type="file" accept="image/*" onChange={onSelectFile} />
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                style={{ marginTop: 16 }}
              >
                选择图片
              </Button>
              {src && (
                <Space style={{ marginTop: 24, display: 'block' }}>
                  <Button onClick={handleRotate} icon={<RotateRightOutlined />}>旋转 90°</Button>
                  <Slider
                    min={0}
                    max={360}
                    step={1}
                    value={rotate}
                    onChange={setRotate}
                    tooltip={{ formatter: (value) => `${value}°` }}
                    style={{ width: 120, marginLeft: 20 }}
                  />
                </Space>
              )}
            </Card>

            {src && (
              <Card title="裁剪区域" style={{ marginBottom: 24 }}>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  style={{ maxWidth: '100%' }}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={src}
                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </Card>
            )}
          </Col>
          {/* 右侧：预览和下载区域 */}
          <Col xs={24} md={12}>
            <Card title="预览" style={{ marginBottom: 24, minHeight: 300 }}>
              {completedCrop && (
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    width: completedCrop.width,
                    height: completedCrop.height,
                    border: '1px solid #eee',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                />
              )}
              {!completedCrop && <Text type="secondary">裁剪区域预览将显示在此处。</Text>}
            </Card>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              disabled={!completedCrop}
              block
              size="large"
            >
              下载裁剪图片
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ImageCropperPage;