import React, { useState, useRef } from 'react';
import { Layout, Button, Upload, message, Slider, Space, Row, Col, Typography, Card } from 'antd';
import { UploadOutlined, DownloadOutlined, RotateRightOutlined } from '@ant-design/icons';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const { Content } = Layout;
const { Title, Text } = Typography;

const ImageCropperPage: React.FC = () => {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop controlled so the input can update it.
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop({ unit: 'px', width, height, x: 0, y: 0 });
    }
  };

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

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  };

  const handleDownload = async () => {
    if (!completedCrop || !imgRef.current) {
      message.error('请先选择并裁剪图片！');
      return;
    }

    const image = imgRef.current;
    const croppedImageBlob = await getCroppedImg(image, completedCrop, 'cropped-image.png');

    if (croppedImageBlob) {
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

  const handleRotate = () => {
    setRotate((prev) => (prev + 90) % 360);
  };

  React.useEffect(() => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const pixelRatio = window.devicePixelRatio;

      canvas.width = completedCrop.width * pixelRatio;
      canvas.height = completedCrop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

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

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Content style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>图片裁剪工具</Title>
        <Row gutter={[24, 24]}>
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