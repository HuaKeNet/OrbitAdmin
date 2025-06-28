import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Input, Select, Tag, Modal, message, Form, InputNumber, Drawer } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Package, PaginatedResponse } from '../../types';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const PackageList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  
  // 获取套餐列表
  const fetchPackages = async (page = 1, pageSize = 10, searchValue = search, statusValue = status) => {
    setLoading(true);
    try {
      const response = await axios.get<PaginatedResponse<Package>>('/api/packages', {
        params: {
          page,
          limit: pageSize,
          search: searchValue,
          status: statusValue !== '' ? statusValue : undefined,
        },
      });
      
      setPackages(response.data.data);
      setPagination({
        current: response.data.page,
        pageSize: response.data.limit,
        total: response.data.total,
      });
    } catch (error) {
      message.error('获取套餐列表失败');
      console.error('获取套餐列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // 处理表格变化
  const handleTableChange = (pagination: any) => {
    fetchPackages(pagination.current, pagination.pageSize);
  };

  // 处理搜索
  const handleSearch = () => {
    fetchPackages(1, pagination.pageSize);
  };

  // 处理删除套餐
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个套餐吗？此操作不可恢复。',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await axios.delete(`/api/packages/${id}`);
          message.success('套餐删除成功');
          fetchPackages(pagination.current, pagination.pageSize);
        } catch (error: any) {
          if (error.response && error.response.data && error.response.data.message) {
            message.error(error.response.data.message);
          } else {
            message.error('删除套餐失败');
          }
          console.error('删除套餐失败:', error);
        }
      },
    });
  };

  // 打开添加/编辑抽屉
  const showDrawer = (pkg: Package | null = null) => {
    setEditingPackage(pkg);
    form.resetFields();
    
    if (pkg) {
      form.setFieldsValue({
        name: pkg.name,
        price: pkg.price,
        duration: pkg.duration,
        bandwidth: pkg.bandwidth,
        description: pkg.description,
        status: pkg.status,
      });
    } else {
      form.setFieldsValue({ status: 1 });
    }
    
    setDrawerVisible(true);
  };

  // 关闭抽屉
  const closeDrawer = () => {
    setDrawerVisible(false);
    setEditingPackage(null);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setFormLoading(true);
      
      if (editingPackage) {
        // 更新套餐
        await axios.put(`/api/packages/${editingPackage.id}`, values);
        message.success('套餐更新成功');
      } else {
        // 添加套餐
        await axios.post('/api/packages', values);
        message.success('套餐添加成功');
      }
      
      closeDrawer();
      fetchPackages(pagination.current, pagination.pageSize);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message);
      } else if (!error.response) {
        // 表单验证错误
        console.error('表单验证失败:', error);
      } else {
        message.error(editingPackage ? '更新套餐失败' : '添加套餐失败');
        console.error(editingPackage ? '更新套餐失败:' : '添加套餐失败:', error);
      }
    } finally {
      setFormLoading(false);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '套餐名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '价格(元)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '时长(天)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '带宽(Mbps)',
      dataIndex: 'bandwidth',
      key: 'bandwidth',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record: Package) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showDrawer(record)}
          >
            编辑
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card title="套餐列表" bordered={false}>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索套餐名称"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="状态"
              style={{ width: 120 }}
              value={status}
              onChange={(value) => setStatus(value)}
              allowClear
            >
              <Option value="1">启用</Option>
              <Option value="0">禁用</Option>
            </Select>
            <Button type="primary" onClick={handleSearch}>
              搜索
            </Button>
            <Button onClick={() => {
              setSearch('');
              setStatus('');
              fetchPackages(1, pagination.pageSize, '', '');
            }}>
              重置
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showDrawer()}
            >
              添加套餐
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={packages}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>
      
      <Drawer
        title={editingPackage ? '编辑套餐' : '添加套餐'}
        width={500}
        onClose={closeDrawer}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={handleSubmit} type="primary" loading={formLoading}>
              提交
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="套餐名称"
            rules={[{ required: true, message: '请输入套餐名称' }]}
          >
            <Input placeholder="请输入套餐名称" />
          </Form.Item>
          
          <Form.Item
            name="price"
            label="价格(元)"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              precision={2}
              style={{ width: '100%' }}
              placeholder="请输入价格"
            />
          </Form.Item>
          
          <Form.Item
            name="duration"
            label="时长(天)"
            rules={[{ required: true, message: '请输入时长' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="请输入时长，单位：天"
            />
          </Form.Item>
          
          <Form.Item
            name="bandwidth"
            label="带宽(Mbps)"
            rules={[{ required: true, message: '请输入带宽' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="请输入带宽，单位：Mbps"
            />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} placeholder="请输入套餐描述" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default PackageList;