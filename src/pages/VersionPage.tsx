import React, { useState } from 'react';
import { Layout, Card, Table, Tag, Button, Space, Modal, Typography, Row, Col, Select, Divider, Upload, Form, Input, message } from 'antd';
import { DownloadOutlined, InfoCircleOutlined, SwapOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Version {
  key: string;
  version: string;
  releaseDate: string;
  status: 'latest' | 'history';
  description: string;
  downloadUrl: string;
  compatibility: string;
  changes: string[];
}

const initialVersions: Version[] = [
  {
    key: '1',
    version: 'v1.0.0',
    releaseDate: '2024-03-20',
    status: 'latest',
    description: '正式发布版本',
    downloadUrl: '/downloads/v1.0.0',
    compatibility: '支持 Windows 10/11, macOS 10.15+',
    changes: [
      '新增核心功能',
      '优化用户界面',
      '修复已知问题'
    ]
  },
  {
    key: '2',
    version: 'v0.9.0',
    releaseDate: '2024-03-15',
    status: 'history',
    description: '测试版本',
    downloadUrl: '/downloads/v0.9.0',
    compatibility: '支持 Windows 10/11, macOS 10.15+',
    changes: [
      '功能测试',
      '性能优化',
      'Bug修复'
    ]
  },
  {
    key: '3',
    version: 'v0.8.0',
    releaseDate: '2024-03-10',
    status: 'history',
    description: '测试版本',
    downloadUrl: '/downloads/v0.8.0',
    compatibility: '支持 Windows 10/11, macOS 10.15+',
    changes: [
      '初始功能实现',
      '基础界面设计',
      '核心功能开发'
    ]
  }
];

const VersionPage: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [version1, setVersion1] = useState<string>('');
  const [version2, setVersion2] = useState<string>('');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const columns = [
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
      render: (text: string, record: Version) => (
        <Space>
          {text}
          {record.status === 'latest' && <Tag color="green">最新</Tag>}
        </Space>
      )
    },
    {
      title: '发布日期',
      dataIndex: 'releaseDate',
      key: 'releaseDate'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'latest' ? 'green' : 'default'}>
          {status === 'latest' ? '最新' : '历史'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Version) => (
        <Space>
          <Button 
            type="primary" 
            icon={<InfoCircleOutlined />}
            onClick={() => setSelectedVersion(record)}
          >
            详情
          </Button>
          <Button 
            icon={<DownloadOutlined />}
            href={record.downloadUrl}
          >
            下载
          </Button>
        </Space>
      )
    }
  ];

  const handleCompare = () => {
    if (version1 && version2) {
      setCompareModalVisible(true);
    } else {
      Modal.warning({
        title: '请选择要比较的版本',
        content: '请选择两个不同的版本来进行比较'
      });
    }
  };

  const handleUpload = async () => {
    try {
      const values = await uploadForm.validateFields();
      console.log('Upload values:', values);
      // TODO: 实现文件上传逻辑
      message.success('上传成功');
      setUploadModalVisible(false);
      uploadForm.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('Upload validation failed:', error);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isZip = file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
    if (!isZip) {
      message.error('只能上传 ZIP 文件！');
    }
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      message.error('文件大小不能超过 100MB！');
    }
    return isZip && isLt100M;
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title="版本列表"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setUploadModalVisible(true)}
              >
                上传新版本
              </Button>
            }
          >
            <Table 
              columns={columns} 
              dataSource={initialVersions}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="版本比较">
            <Space>
              <Select
                style={{ width: 200 }}
                placeholder="选择第一个版本"
                onChange={setVersion1}
              >
                {initialVersions.map(v => (
                  <Option key={v.version} value={v.version}>{v.version}</Option>
                ))}
              </Select>
              <Select
                style={{ width: 200 }}
                placeholder="选择第二个版本"
                onChange={setVersion2}
              >
                {initialVersions.map(v => (
                  <Option key={v.version} value={v.version}>{v.version}</Option>
                ))}
              </Select>
              <Button 
                type="primary" 
                icon={<SwapOutlined />}
                onClick={handleCompare}
              >
                比较版本
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title="版本详情"
        open={!!selectedVersion}
        onCancel={() => setSelectedVersion(null)}
        footer={[
          <Button key="download" type="primary" href={selectedVersion?.downloadUrl}>
            下载
          </Button>,
          <Button key="close" onClick={() => setSelectedVersion(null)}>
            关闭
          </Button>
        ]}
      >
        {selectedVersion && (
          <>
            <Title level={4}>{selectedVersion.version}</Title>
            <Text type="secondary">发布日期：{selectedVersion.releaseDate}</Text>
            <Divider />
            <Title level={5}>更新说明</Title>
            <ul>
              {selectedVersion.changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
            <Divider />
            <Title level={5}>兼容性说明</Title>
            <Text>{selectedVersion.compatibility}</Text>
          </>
        )}
      </Modal>

      <Modal
        title="版本比较"
        open={compareModalVisible}
        onCancel={() => setCompareModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCompareModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title={version1}>
              <ul>
                {initialVersions.find(v => v.version === version1)?.changes.map((change, index) => (
                  <li key={index}>{change}</li>
                ))}
              </ul>
            </Card>
          </Col>
          <Col span={12}>
            <Card title={version2}>
              <ul>
                {initialVersions.find(v => v.version === version2)?.changes.map((change, index) => (
                  <li key={index}>{change}</li>
                ))}
              </ul>
            </Card>
          </Col>
        </Row>
      </Modal>

      <Modal
        title="上传新版本"
        open={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false);
          uploadForm.resetFields();
          setFileList([]);
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setUploadModalVisible(false);
            uploadForm.resetFields();
            setFileList([]);
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpload}>
            上传
          </Button>
        ]}
      >
        <Form
          form={uploadForm}
          layout="vertical"
        >
          <Form.Item
            name="version"
            label="版本号"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="例如：v1.0.0" />
          </Form.Item>
          <Form.Item
            name="description"
            label="版本描述"
            rules={[{ required: true, message: '请输入版本描述' }]}
          >
            <TextArea rows={4} placeholder="请输入版本描述" />
          </Form.Item>
          <Form.Item
            name="compatibility"
            label="兼容性说明"
            rules={[{ required: true, message: '请输入兼容性说明' }]}
          >
            <TextArea rows={2} placeholder="例如：支持 Windows 10/11, macOS 10.15+" />
          </Form.Item>
          <Form.Item
            name="changes"
            label="更新说明"
            rules={[{ required: true, message: '请输入更新说明' }]}
          >
            <TextArea rows={4} placeholder="请输入更新说明，每行一条" />
          </Form.Item>
          <Form.Item
            name="file"
            label="上传文件"
            rules={[{ required: true, message: '请上传文件' }]}
          >
            <Upload
              beforeUpload={beforeUpload}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VersionPage; 