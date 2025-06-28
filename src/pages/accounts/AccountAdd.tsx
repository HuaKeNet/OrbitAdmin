import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, DatePicker, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const AccountAdd: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  // 获取套餐和用户列表
  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);
      try {
        const [packagesResponse, usersResponse] = await Promise.all([
          axios.get('/api/packages', { params: { status: 1, limit: 100 } }),
          axios.get('/api/users', { params: { status: 1, limit: 100 } })
        ]);
        
        setPackages(packagesResponse.data.data);
        setUsers(usersResponse.data.data);
      } catch (error) {
        message.error('获取数据失败');
        console.error('获取数据失败:', error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, []);

  // 处理套餐选择变化
  const handlePackageChange = (value: number) => {
    const selectedPkg = packages.find(pkg => pkg.id === value);
    setSelectedPackage(selectedPkg);
    
    // 如果已经选择了开始时间，自动计算结束时间
    const startDate = form.getFieldValue('start_time');
    if (startDate && selectedPkg) {
      const endDate = dayjs(startDate).add(selectedPkg.duration, 'day');
      form.setFieldsValue({ end_time: endDate });
    }
  };

  // 处理开始时间变化
  const handleStartDateChange = (date: any) => {
    // 如果已经选择了套餐，自动计算结束时间
    if (date && selectedPackage) {
      const endDate = dayjs(date).add(selectedPackage.duration, 'day');
      form.setFieldsValue({ end_time: endDate });
    }
  };

  // 表单提交处理
  const handleSubmit = async (values: any) => {
    setLoading(true);
    
    // 格式化日期
    const formattedValues = {
      ...values,
      start_time: values.start_time.format('YYYY-MM-DD'),
      end_time: values.end_time.format('YYYY-MM-DD'),
    };
    
    try {
      const response = await axios.post('/api/accounts', formattedValues);
      message.success('宽带账号添加成功');
      
      // 显示账号和密码信息
      Modal.success({
        title: '宽带账号创建成功',
        content: (
          <div>
            <p>账号: {response.data.data.account}</p>
            <p>密码: {response.data.data.password}</p>
            <p>请记录并告知用户</p>
          </div>
        ),
        onOk: () => navigate('/accounts')
      });
    } catch (error: any) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || '添加宽带账号失败');
      } else {
        message.error('添加宽带账号失败');
      }
      console.error('添加宽带账号失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card title="添加宽带账号" bordered={false}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ 
          status: 1,
          start_time: dayjs()
        }}
      >
        <Form.Item
          name="user_id"
          label="用户"
          rules={[{ required: true, message: '请选择用户' }]}
        >
          <Select 
            placeholder="请选择用户" 
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {users.map(user => (
              <Option key={user.id} value={user.id}>
                {user.real_name} ({user.phone})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="package_id"
          label="套餐"
          rules={[{ required: true, message: '请选择套餐' }]}
        >
          <Select 
            placeholder="请选择套餐" 
            onChange={handlePackageChange}
          >
            {packages.map(pkg => (
              <Option key={pkg.id} value={pkg.id}>
                {pkg.name} (¥{pkg.price} / {pkg.duration}天 / {pkg.bandwidth}Mbps)
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="start_time"
          label="开始时间"
          rules={[{ required: true, message: '请选择开始时间' }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            onChange={handleStartDateChange}
          />
        </Form.Item>

        <Form.Item
          name="end_time"
          label="结束时间"
          rules={[{ required: true, message: '请选择结束时间' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择状态">
            <Option value={1}>正常</Option>
            <Option value={0}>禁用</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="remark"
          label="备注"
        >
          <Input.TextArea rows={3} placeholder="请输入备注信息" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            添加
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate('/accounts')}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

// 导入Modal组件
import { Modal } from 'antd';

export default AccountAdd;