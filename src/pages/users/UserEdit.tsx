import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { User } from '../../types';

const { Option } = Select;

const UserEdit: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  // 获取用户信息
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setUser(response.data.data);
        
        // 设置表单初始值
        form.setFieldsValue({
          username: response.data.data.username,
          real_name: response.data.data.real_name,
          phone: response.data.data.phone,
          id_card: response.data.data.id_card,
          address: response.data.data.address,
          status: response.data.data.status,
        });
      } catch (error) {
        message.error('获取用户信息失败');
        console.error('获取用户信息失败:', error);
        navigate('/users');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUser();
  }, [id, form, navigate]);

  // 表单提交处理
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await axios.put(`/api/users/${id}`, values);
      message.success('用户更新成功');
      navigate('/users');
    } catch (error: any) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || '更新用户失败');
      } else {
        message.error('更新用户失败');
      }
      console.error('更新用户失败:', error);
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
    <Card title="编辑用户" bordered={false}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, message: '用户名至少3个字符' },
            { max: 50, message: '用户名最多50个字符' }
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          extra="如不修改密码，请留空"
        >
          <Input.Password placeholder="请输入新密码，留空则不修改" />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label="确认密码"
          dependencies={['password']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!getFieldValue('password') || !value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不匹配'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请确认新密码" />
        </Form.Item>

        <Form.Item
          name="real_name"
          label="真实姓名"
          rules={[{ required: true, message: '请输入真实姓名' }]}
        >
          <Input placeholder="请输入真实姓名" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="电话"
          rules={[
            { required: true, message: '请输入电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
          ]}
        >
          <Input placeholder="请输入电话" />
        </Form.Item>

        <Form.Item
          name="id_card"
          label="身份证号"
          rules={[
            { required: true, message: '请输入身份证号' },
            { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号' }
          ]}
        >
          <Input placeholder="请输入身份证号" />
        </Form.Item>

        <Form.Item
          name="address"
          label="地址"
          rules={[{ required: true, message: '请输入地址' }]}
        >
          <Input.TextArea rows={3} placeholder="请输入地址" />
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

        {user && user.accounts && user.accounts.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h3>关联的宽带账号</h3>
            <ul>
              {user.accounts.map((account: any) => (
                <li key={account.id}>
                  账号: {account.account} | 
                  套餐: {account.package?.name || '未知'} | 
                  到期时间: {account.end_time}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            更新
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate('/users')}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserEdit;