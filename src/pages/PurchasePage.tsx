import React, { useState, useCallback, useMemo } from 'react';
import { 
  Layout, 
  Card, 
  Row, 
  Col, 
  Table, 
  Button, 
  Input, 
  Space, 
  Typography, 
  Statistic,
  Tag,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Divider,
  Tooltip
} from 'antd';
import { 
  ShoppingCartOutlined,
  InboxOutlined,
  DollarOutlined,
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  PhoneOutlined,
  HistoryOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// 物料类型定义
const MATERIAL_TYPES = [
  { value: 'FUC-主板', label: 'FUC-主板' },
  { value: 'FUC-接口板', label: 'FUC-接口板' },
  { value: 'FUC-灯板', label: 'FUC-灯板' },
  { value: 'FUC-上盖', label: 'FUC-上盖' },
  { value: 'FUC-底壳', label: 'FUC-底壳' }
];

// 供应商数据
const SUPPLIERS = [
  { id: 'S001', name: '供应商A', contact: '张三', phone: '13800138000' },
  { id: 'S002', name: '供应商B', contact: '李四', phone: '13800138001' },
  { id: 'S003', name: '供应商C', contact: '王五', phone: '13800138002' }
];

// 模拟采购数据
const initialPurchaseData: PurchaseItem[] = [
  {
    key: '1',
    materialId: 'M001',
    name: 'FUC-主板',
    status: '待采购' as const,
    supplier: '供应商A',
    quantity: 10,
    price: 1000,
    totalAmount: 10000,
    orderDate: '2024-02-20'
  },
  {
    key: '2',
    materialId: 'M002',
    name: 'FUC-接口板',
    status: '在途' as const,
    supplier: '供应商B',
    quantity: 20,
    price: 500,
    totalAmount: 10000,
    orderDate: '2024-02-19'
  }
];

interface PurchaseItem {
  key: string;
  materialId: string;
  name: string;
  status: '待采购' | '在途' | '已到货';
  supplier: string;
  quantity: number;
  price: number;
  totalAmount: number;
  orderDate: string;
}

const PurchasePage: React.FC = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false);
  const [purchaseData, setPurchaseData] = useState<PurchaseItem[]>(initialPurchaseData);
  const [form] = Form.useForm();
  const [supplierForm] = Form.useForm();

  // 计算采购概览数据
  const overviewData = useMemo(() => {
    return {
      pendingCount: purchaseData.filter(item => item.status === '待采购').length,
      inTransitCount: purchaseData.filter(item => item.status === '在途').length,
      monthlyAmount: purchaseData.reduce((sum, item) => sum + item.totalAmount, 0)
    };
  }, [purchaseData]);

  // 处理新增采购
  const handleAddPurchase = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const newPurchase: PurchaseItem = {
        key: Date.now().toString(),
        materialId: values.materialId,
        name: values.name,
        status: '待采购',
        supplier: values.supplier,
        quantity: values.quantity,
        price: values.price,
        totalAmount: values.quantity * values.price,
        orderDate: values.orderDate.format('YYYY-MM-DD')
      };

      setPurchaseData(prevData => [...prevData, newPurchase]);
      message.success('新增采购成功');
      setIsAddModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  }, [form]);

  // 处理新增供应商
  const handleAddSupplier = useCallback(async () => {
    try {
      const values = await supplierForm.validateFields();
      console.log('New supplier:', values);
      message.success('新增供应商成功');
      setIsSupplierModalVisible(false);
      supplierForm.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  }, [supplierForm]);

  // 表格列定义
  const columns = [
    {
      title: '物料编号',
      dataIndex: 'materialId',
      key: 'materialId',
    },
    {
      title: '物料名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          '待采购': { color: 'orange', text: '待采购' },
          '在途': { color: 'blue', text: '在途' },
          '已到货': { color: 'green', text: '已到货' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price}`
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${amount}`
    },
    {
      title: '采购日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PurchaseItem) => (
        <Space size="middle">
          <Button type="link" size="small">查看</Button>
          {record.status === '待采购' && (
            <Button type="link" size="small">采购</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Row gutter={[16, 16]}>
          {/* 采购概览 */}
          <Col span={24}>
            <Card>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="待采购数量"
                    value={overviewData.pendingCount}
                    prefix={<ShoppingCartOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="在途物料"
                    value={overviewData.inTransitCount}
                    prefix={<InboxOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="本月采购金额"
                    value={overviewData.monthlyAmount}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                    formatter={(value) => `¥${value}`}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 物料清单 */}
          <Col span={24}>
            <Card 
              title="物料清单"
              extra={
                <Space>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalVisible(true)}
                  >
                    新增采购
                  </Button>
                  <Button 
                    icon={<SearchOutlined />}
                  >
                    搜索
                  </Button>
                </Space>
              }
            >
              <Table 
                columns={columns} 
                dataSource={purchaseData}
                pagination={false}
              />
            </Card>
          </Col>

          {/* 供应商管理 */}
          <Col span={24}>
            <Card 
              title="供应商管理"
              extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setIsSupplierModalVisible(true)}
                >
                  新增供应商
                </Button>
              }
            >
              <Table 
                columns={[
                  {
                    title: '供应商编号',
                    dataIndex: 'id',
                    key: 'id',
                  },
                  {
                    title: '供应商名称',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: '联系人',
                    dataIndex: 'contact',
                    key: 'contact',
                  },
                  {
                    title: '联系电话',
                    dataIndex: 'phone',
                    key: 'phone',
                  },
                  {
                    title: '操作',
                    key: 'action',
                    render: () => (
                      <Space size="middle">
                        <Button type="link" size="small" icon={<PhoneOutlined />}>联系</Button>
                        <Button type="link" size="small" icon={<HistoryOutlined />}>历史</Button>
                      </Space>
                    ),
                  },
                ]}
                dataSource={SUPPLIERS}
                pagination={false}
              />
            </Card>
          </Col>

          {/* 采购记录 */}
          <Col span={24}>
            <Card 
              title="采购记录"
              extra={
                <Button 
                  icon={<ExportOutlined />}
                >
                  导出记录
                </Button>
              }
            >
              <Table 
                columns={[
                  {
                    title: '订单编号',
                    dataIndex: 'materialId',
                    key: 'materialId',
                  },
                  {
                    title: '采购日期',
                    dataIndex: 'orderDate',
                    key: 'orderDate',
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status: string) => {
                      const statusConfig = {
                        '待采购': { color: 'orange', text: '待采购' },
                        '在途': { color: 'blue', text: '在途' },
                        '已到货': { color: 'green', text: '已到货' }
                      };
                      const config = statusConfig[status as keyof typeof statusConfig];
                      return <Tag color={config.color}>{config.text}</Tag>;
                    }
                  },
                  {
                    title: '操作',
                    key: 'action',
                    render: () => (
                      <Button type="link" size="small" icon={<FileTextOutlined />}>查看详情</Button>
                    ),
                  },
                ]}
                dataSource={purchaseData}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>

        {/* 新增采购弹窗 */}
        <Modal
          title="新增采购"
          open={isAddModalVisible}
          onOk={handleAddPurchase}
          onCancel={() => {
            setIsAddModalVisible(false);
            form.resetFields();
          }}
          destroyOnClose={true}
        >
          <Form 
            form={form} 
            layout="vertical"
            onFinish={handleAddPurchase}
          >
            <Form.Item
              name="name"
              label="物料名称"
              rules={[{ required: true, message: '请选择物料名称' }]}
            >
              <Select
                placeholder="请选择物料名称"
                options={MATERIAL_TYPES}
              />
            </Form.Item>
            <Form.Item
              name="materialId"
              label="物料编号"
              rules={[{ required: true, message: '请输入物料编号' }]}
            >
              <Input placeholder="请输入物料编号" />
            </Form.Item>
            <Form.Item
              name="supplier"
              label="供应商"
              rules={[{ required: true, message: '请选择供应商' }]}
            >
              <Select placeholder="请选择供应商">
                {SUPPLIERS.map(supplier => (
                  <Option key={supplier.id} value={supplier.name}>
                    {supplier.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label="采购数量"
              rules={[{ required: true, message: '请输入采购数量' }]}
            >
              <Input type="number" placeholder="请输入采购数量" />
            </Form.Item>
            <Form.Item
              name="price"
              label="单价"
              rules={[{ required: true, message: '请输入单价' }]}
            >
              <Input type="number" placeholder="请输入单价" />
            </Form.Item>
            <Form.Item
              name="orderDate"
              label="采购日期"
              rules={[{ required: true, message: '请选择采购日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>

        {/* 新增供应商弹窗 */}
        <Modal
          title="新增供应商"
          open={isSupplierModalVisible}
          onOk={handleAddSupplier}
          onCancel={() => {
            setIsSupplierModalVisible(false);
            supplierForm.resetFields();
          }}
          destroyOnClose={true}
        >
          <Form 
            form={supplierForm} 
            layout="vertical"
            onFinish={handleAddSupplier}
          >
            <Form.Item
              name="name"
              label="供应商名称"
              rules={[{ required: true, message: '请输入供应商名称' }]}
            >
              <Input placeholder="请输入供应商名称" />
            </Form.Item>
            <Form.Item
              name="contact"
              label="联系人"
              rules={[{ required: true, message: '请输入联系人' }]}
            >
              <Input placeholder="请输入联系人" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="联系电话"
              rules={[{ required: true, message: '请输入联系电话' }]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default PurchasePage; 