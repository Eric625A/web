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
  Popconfirm,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  InboxOutlined, 
  ExportOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import * as ExcelJS from 'exceljs';

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

// 模拟库存数据
const initialInventoryData: MaterialItem[] = [
  {
    key: '1',
    materialId: 'M001',
    name: 'FUC-主板',
    quantity: 1,
    status: 'normal',
    lastUpdate: '2024-02-20'
  },
  {
    key: '2',
    materialId: 'M002',
    name: 'FUC-接口板',
    quantity: 1,
    status: 'normal',
    lastUpdate: '2024-02-20'
  },
  {
    key: '3',
    materialId: 'M003',
    name: 'FUC-灯板',
    quantity: 1,
    status: 'normal',
    lastUpdate: '2024-02-20'
  },
  {
    key: '4',
    materialId: 'M004',
    name: 'FUC-上盖',
    quantity: 15,
    status: 'normal',
    lastUpdate: '2024-02-20'
  },
  {
    key: '5',
    materialId: 'M005',
    name: 'FUC-底壳',
    quantity: 15,
    status: 'normal',
    lastUpdate: '2024-02-20'
  }
];

interface MaterialItem {
  key: string;
  materialId: string;
  name: string;
  quantity: number;
  status: 'normal' | 'warning' | 'abnormal';
  lastUpdate: string;
  abnormalReason?: string;
}

interface ShipmentRecord {
  key: string;
  sn: string;
  productName: string;
  pn: string;
  mainBoardId: string;
  shipmentDate: string;
  operator: string;
  remark?: string;
}

const WarehousePage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isProductOutModalVisible, setIsProductOutModalVisible] = useState(false);
  const [isAbnormalModalVisible, setIsAbnormalModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'in' | 'out'>('out');
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [productOutForm] = Form.useForm();
  const [abnormalForm] = Form.useForm();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);
  const [inventoryData, setInventoryData] = useState<MaterialItem[]>(initialInventoryData);
  const [shipmentRecords, setShipmentRecords] = useState<ShipmentRecord[]>([]);

  // 计算每种物料的数量统计
  const materialStats = useMemo(() => {
    return MATERIAL_TYPES.map(type => {
      const items = inventoryData.filter(item => item.name === type.value);
      return {
        name: type.label,
        count: items.length,
        quantity: items.reduce((sum, item) => sum + item.quantity, 0)
      };
    });
  }, [inventoryData]);

  // 计算总库存数量
  const totalQuantity = useMemo(() => {
    return inventoryData.reduce((sum, item) => sum + item.quantity, 0);
  }, [inventoryData]);

  // 处理出库
  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);

      // 检查物料是否存在且数量充足
      const material = inventoryData.find(item => item.materialId === values.materialId);
      if (!material) {
        message.error('物料不存在');
        return;
      }
      if (material.quantity < values.quantity) {
        message.error('出库数量不能大于库存数量');
        return;
      }

      // 计算新的数量
      const newQuantity = material.quantity - values.quantity;
      if (newQuantity < 0) {
        message.error('出库后数量不能为负数');
        return;
      }

      // 更新库存数据
      setInventoryData(prevData => {
        return prevData.map(item => {
          if (item.materialId === values.materialId) {
            const newStatus: 'normal' | 'warning' | 'abnormal' = newQuantity < 10 ? 'warning' : 'normal';
            return {
              ...item,
              quantity: newQuantity,
              status: newStatus,
              lastUpdate: new Date().toISOString().split('T')[0]
            };
          }
          return item;
        });
      });

      message.success('出库成功');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  }, [form, inventoryData]);

  // 处理新增物料
  const handleAddMaterial = useCallback(async () => {
    try {
      const values = await addForm.validateFields();
      console.log('Add material values:', values);

      const newMaterial: MaterialItem = {
        key: Date.now().toString(),
        materialId: values.name === 'FUC-上盖' || values.name === 'FUC-底壳' 
          ? `${values.name}-${Date.now()}`
          : values.materialId,
        name: values.name,
        quantity: ['FUC-主板', 'FUC-接口板', 'FUC-灯板', 'FUC-cal'].includes(values.name) ? 1 : (values.quantity || 0),
        status: 'normal',
        lastUpdate: new Date().toISOString().split('T')[0]
      };

      setInventoryData(prevData => [...prevData, newMaterial]);
      message.success('新增物料成功');
      setIsAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      console.error('Add material form validation failed:', error);
    }
  }, [addForm]);

  // 检查是否需要禁用数量输入
  const isQuantityDisabled = useCallback((name: string) => {
    return ['FUC-主板', 'FUC-接口板', 'FUC-灯板', 'FUC-cal'].includes(name);
  }, []);

  // 处理物料名称变化
  const handleNameChange = useCallback((value: string) => {
    if (isQuantityDisabled(value)) {
      addForm.setFieldsValue({ quantity: 1 });
    } else {
      addForm.setFieldsValue({ quantity: undefined });
    }
  }, [addForm, isQuantityDisabled]);

  // 处理删除物料
  const handleDeleteMaterial = useCallback((record: MaterialItem) => {
    setInventoryData(prevData => {
      const newData = prevData.filter(item => item.materialId !== record.materialId);
      console.log('After delete inventory data:', newData);
      return newData;
    });
    message.success('删除物料成功');
  }, []);

  // 处理状态切换
  const handleStatusChange = useCallback((record: MaterialItem) => {
    setSelectedMaterial(record);
    setIsAbnormalModalVisible(true);
  }, []);

  // 处理异常原因提交
  const handleAbnormalSubmit = useCallback(async () => {
    try {
      const values = await abnormalForm.validateFields();
      console.log('Abnormal reason values:', values);

      setInventoryData(prevData => {
        return prevData.map(item => {
          if (item.materialId === selectedMaterial?.materialId) {
            return {
              ...item,
              status: 'abnormal',
              abnormalReason: values.reason,
              lastUpdate: new Date().toISOString().split('T')[0]
            };
          }
          return item;
        });
      });

      message.success('状态更新成功');
      setIsAbnormalModalVisible(false);
      abnormalForm.resetFields();
      setSelectedMaterial(null);
    } catch (error) {
      console.error('Abnormal form validation failed:', error);
    }
  }, [selectedMaterial, abnormalForm]);

  // 处理成品出货
  const handleProductOut = useCallback(async () => {
    try {
      const values = await productOutForm.validateFields();
      console.log('Product out values:', values);

      // 检查是否有足够的物料
      const mainBoard = inventoryData.find(item => 
        item.name === 'FUC-主板' && 
        item.status !== 'abnormal'
      );
      const interfaceBoard = inventoryData.find(item => 
        item.name === 'FUC-接口板' && 
        item.status !== 'abnormal'
      );
      const lightBoard = inventoryData.find(item => 
        item.name === 'FUC-灯板' && 
        item.status !== 'abnormal'
      );
      const topShell = inventoryData.find(item => 
        item.name === 'FUC-上盖' && 
        item.status !== 'abnormal'
      );
      const bottomShell = inventoryData.find(item => 
        item.name === 'FUC-底壳' && 
        item.status !== 'abnormal'
      );

      if (!mainBoard || !interfaceBoard || !lightBoard || !topShell || !bottomShell) {
        message.error('库存物料不足或存在异常物料，无法出货');
        return;
      }

      // 预先计算所有物料的新数量
      const newQuantities = {
        mainBoard: mainBoard.quantity - 1,
        interfaceBoard: interfaceBoard.quantity - 1,
        lightBoard: lightBoard.quantity - 1,
        topShell: topShell.quantity - 1,
        bottomShell: bottomShell.quantity - 1
      };

      // 检查是否有任何物料数量会变成负数
      if (newQuantities.mainBoard < 0) {
        message.error('主板库存不足');
        return;
      }
      if (newQuantities.interfaceBoard < 0) {
        message.error('接口板库存不足');
        return;
      }
      if (newQuantities.lightBoard < 0) {
        message.error('灯板库存不足');
        return;
      }
      if (newQuantities.topShell < 0) {
        message.error('上盖库存不足');
        return;
      }
      if (newQuantities.bottomShell < 0) {
        message.error('底壳库存不足');
        return;
      }

      // 更新库存数据
      setInventoryData(prevData => {
        return prevData.map(item => {
          if (item.materialId === mainBoard.materialId) {
            const newStatus: 'normal' | 'warning' | 'abnormal' = newQuantities.mainBoard < 10 ? 'warning' : 'normal';
            return {
              ...item,
              quantity: newQuantities.mainBoard,
              status: newStatus,
              lastUpdate: new Date().toISOString().split('T')[0]
            };
          }
          if (item.materialId === interfaceBoard.materialId) {
            const newStatus: 'normal' | 'warning' | 'abnormal' = newQuantities.interfaceBoard < 10 ? 'warning' : 'normal';
            return {
              ...item,
              quantity: newQuantities.interfaceBoard,
              status: newStatus,
              lastUpdate: new Date().toISOString().split('T')[0]
            };
          }
          if (item.materialId === lightBoard.materialId) {
            const newStatus: 'normal' | 'warning' | 'abnormal' = newQuantities.lightBoard < 10 ? 'warning' : 'normal';
            return {
              ...item,
              quantity: newQuantities.lightBoard,
              status: newStatus,
              lastUpdate: new Date().toISOString().split('T')[0]
            };
          }
          if (item.materialId === topShell.materialId) {
            const newStatus: 'normal' | 'warning' | 'abnormal' = newQuantities.topShell < 10 ? 'warning' : 'normal';
            return {
              ...item,
              quantity: newQuantities.topShell,
              status: newStatus,
              lastUpdate: new Date().toISOString().split('T')[0]
            };
          }
          if (item.materialId === bottomShell.materialId) {
            const newStatus: 'normal' | 'warning' | 'abnormal' = newQuantities.bottomShell < 10 ? 'warning' : 'normal';
            return {
              ...item,
              quantity: newQuantities.bottomShell,
              status: newStatus,
              lastUpdate: new Date().toISOString().split('T')[0]
            };
          }
          return item;
        });
      });

      // 添加出货记录
      const newShipmentRecord: ShipmentRecord = {
        key: Date.now().toString(),
        sn: values.sn,
        productName: values.productName,
        pn: values.pn,
        mainBoardId: values.mainBoardId,
        shipmentDate: values.shipmentDate.format('YYYY-MM-DD'),
        operator: values.operator,
        remark: values.remark
      };

      setShipmentRecords(prevRecords => [...prevRecords, newShipmentRecord]);

      message.success('成品出货成功');
      setIsProductOutModalVisible(false);
      productOutForm.resetFields();
    } catch (error) {
      console.error('Product out form validation failed:', error);
    }
  }, [inventoryData, productOutForm]);

  // 导出Excel
  const handleExportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('成品出库记录');

      // 设置表头
      worksheet.columns = [
        { header: '出库单号', key: 'id', width: 15 },
        { header: '产品名称', key: 'name', width: 15 },
        { header: '出库数量', key: 'quantity', width: 10 },
        { header: '出库日期', key: 'date', width: 15 },
        { header: '操作人', key: 'operator', width: 10 },
      ];

      // 添加数据
      shipmentRecords.forEach(record => {
        worksheet.addRow({
          id: record.key,
          name: record.productName,
          quantity: record.sn,
          date: record.shipmentDate,
          operator: record.operator
        });
      });

      // 设置表头样式
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // 生成Excel文件
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `成品出库记录_${new Date().toLocaleDateString()}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error('导出Excel失败');
    }
  };

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
      render: (status: string, record: MaterialItem) => {
        const statusConfig = {
          normal: { color: 'green', text: '正常' },
          warning: { color: 'orange', text: '预警' },
          abnormal: { color: 'red', text: '异常' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        
        return (
          <Tooltip title={status === 'abnormal' ? record.abnormalReason : undefined}>
            <Tag 
              color={config.color}
              style={{ cursor: status === 'normal' ? 'pointer' : 'default' }}
              onClick={() => status === 'normal' && handleStatusChange(record)}
            >
              {config.text}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: '库存数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MaterialItem) => (
        <Space size="middle">
          <Popconfirm
            title="删除物料"
            description="确定要删除这个物料吗？此操作不可恢复。"
            onConfirm={() => handleDeleteMaterial(record)}
            okText="确定"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Row gutter={[16, 16]}>
          {/* 库存统计卡片 */}
          <Col span={24}>
            <Card>
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title="总物料种类"
                    value={inventoryData.length}
                    prefix={<InboxOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="总库存数量"
                    value={totalQuantity}
                    prefix={<InboxOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="预警物料"
                    value={inventoryData.filter(item => item.status === 'warning').length}
                    prefix={<WarningOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="异常物料"
                    value={inventoryData.filter(item => item.status === 'abnormal').length}
                    prefix={<ExclamationCircleOutlined />}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* 操作按钮 */}
          <Col span={24}>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsAddModalVisible(true)}
              >
                新增物料
              </Button>
              <Button 
                type="primary" 
                icon={<ExportOutlined />}
                onClick={() => {
                  setModalType('out');
                  setIsModalVisible(true);
                }}
              >
                物料出库
              </Button>
              <Button 
                type="primary" 
                icon={<ShoppingCartOutlined />}
                onClick={() => setIsProductOutModalVisible(true)}
              >
                成品出货
              </Button>
            </Space>
          </Col>

          {/* 物料列表 */}
          <Col span={24}>
            <Card title="物料列表">
              <Table 
                columns={columns} 
                dataSource={inventoryData}
                pagination={false}
              />
            </Card>
          </Col>

          {/* 物料类型统计 */}
          <Col span={24}>
            <Card title="物料类型统计">
              <Row gutter={[16, 16]}>
                {materialStats.map(stat => (
                  <Col span={8} key={stat.name}>
                    <Card>
                      <Statistic
                        title={stat.name}
                        value={stat.quantity}
                        prefix={<InboxOutlined />}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          {/* 成品出货记录 */}
          <Col span={24}>
            <Card 
              title="成品出货记录"
              extra={
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />}
                  onClick={handleExportExcel}
                  disabled={shipmentRecords.length === 0}
                >
                  导出Excel
                </Button>
              }
            >
              <Table 
                columns={[
                  {
                    title: 'SN码',
                    dataIndex: 'sn',
                    key: 'sn',
                  },
                  {
                    title: '产品名称',
                    dataIndex: 'productName',
                    key: 'productName',
                  },
                  {
                    title: 'PN',
                    dataIndex: 'pn',
                    key: 'pn',
                  },
                  {
                    title: '主板物料编号',
                    dataIndex: 'mainBoardId',
                    key: 'mainBoardId',
                  },
                  {
                    title: '出货日期',
                    dataIndex: 'shipmentDate',
                    key: 'shipmentDate',
                  },
                  {
                    title: '操作人',
                    dataIndex: 'operator',
                    key: 'operator',
                  },
                  {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                  }
                ]}
                dataSource={shipmentRecords}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>

        {/* 出库弹窗 */}
        <Modal
          title="物料出库"
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          destroyOnClose={true}
        >
          <Form 
            form={form} 
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="materialId"
              label="物料编号"
              rules={[{ required: true, message: '请选择物料' }]}
            >
              <Select placeholder="请选择物料">
                {inventoryData.map(item => (
                  <Option key={item.materialId} value={item.materialId}>
                    {item.name} ({item.materialId})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="quantity"
              label="出库数量"
              rules={[
                { required: true, message: '请输入出库数量' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const materialId = getFieldValue('materialId');
                    const material = inventoryData.find(item => item.materialId === materialId);
                    if (material && value > material.quantity) {
                      return Promise.reject(new Error('出库数量不能大于库存数量'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input type="number" placeholder="请输入出库数量" />
            </Form.Item>
          </Form>
        </Modal>

        {/* 新增物料弹窗 */}
        <Modal
          title="新增物料"
          open={isAddModalVisible}
          onOk={handleAddMaterial}
          onCancel={() => {
            setIsAddModalVisible(false);
            addForm.resetFields();
          }}
          destroyOnClose={true}
        >
          <Form 
            form={addForm} 
            layout="vertical"
            onFinish={handleAddMaterial}
          >
            <Form.Item
              name="name"
              label="物料名称"
              rules={[{ required: true, message: '请选择物料名称' }]}
            >
              <Select
                placeholder="请选择物料名称"
                options={MATERIAL_TYPES}
                onChange={handleNameChange}
              />
            </Form.Item>
            <Form.Item
              name="materialId"
              label="物料编号"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const name = getFieldValue('name');
                    if (name === 'FUC-上盖' || name === 'FUC-底壳') {
                      return Promise.resolve();
                    }
                    if (!value) {
                      return Promise.reject(new Error('请输入物料编号'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input placeholder="请输入物料编号" />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="初始数量"
              rules={[
                { required: true, message: '请输入初始数量' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const name = getFieldValue('name');
                    if (isQuantityDisabled(name)) {
                      if (value !== 1) {
                        return Promise.reject(new Error('该物料数量必须为1'));
                      }
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input 
                type="number" 
                placeholder="请输入初始数量"
                disabled={isQuantityDisabled(addForm.getFieldValue('name'))}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* 成品出货弹窗 */}
        <Modal
          title="成品出货"
          open={isProductOutModalVisible}
          onOk={() => {
            productOutForm.submit();
          }}
          onCancel={() => {
            setIsProductOutModalVisible(false);
            productOutForm.resetFields();
          }}
          destroyOnClose={true}
        >
          <Form 
            form={productOutForm} 
            layout="vertical"
            onFinish={handleProductOut}
          >
            <Form.Item
              name="productName"
              label="产品名称"
              initialValue="FUC校准仪主体"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="pn"
              label="PN"
              initialValue="HXF-FFV-RS-VRF"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="sn"
              label="SN码"
              rules={[{ required: true, message: '请输入SN码' }]}
            >
              <Input placeholder="请输入SN码" />
            </Form.Item>
            <Form.Item
              name="mainBoardId"
              label="主板物料编号"
              rules={[{ required: true, message: '请选择主板物料编号' }]}
            >
              <Select placeholder="请选择主板物料编号">
                {inventoryData
                  .filter(item => item.name === 'FUC-主板' && item.status !== 'abnormal')
                  .map(item => (
                    <Option key={item.materialId} value={item.materialId}>
                      {item.materialId}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="shipmentDate"
              label="出货日期"
              rules={[{ required: true, message: '请选择出货日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="operator"
              label="操作人"
              rules={[{ required: true, message: '请输入操作人' }]}
            >
              <Input placeholder="请输入操作人" />
            </Form.Item>
            <Form.Item
              name="remark"
              label="备注"
            >
              <Input.TextArea placeholder="请输入备注信息" />
            </Form.Item>
          </Form>
        </Modal>

        {/* 异常原因弹窗 */}
        <Modal
          title="标记异常"
          open={isAbnormalModalVisible}
          onOk={handleAbnormalSubmit}
          onCancel={() => {
            setIsAbnormalModalVisible(false);
            abnormalForm.resetFields();
            setSelectedMaterial(null);
          }}
          destroyOnClose={true}
        >
          <Form 
            form={abnormalForm} 
            layout="vertical"
            onFinish={handleAbnormalSubmit}
          >
            <Form.Item
              name="reason"
              label="异常原因"
              rules={[{ required: true, message: '请输入异常原因' }]}
            >
              <Input.TextArea 
                placeholder="请输入异常原因" 
                rows={4}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default WarehousePage; 