import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Spin, Table, Tag, Divider, Alert } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { EditOutlined, ReloadOutlined, RollbackOutlined } from '@ant-design/icons';
import axios from 'axios';
import { BroadbandAccount, LoginLog } from '../../types';

const AccountView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [account, setAccount] = useState<BroadbandAccount | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 获取账号详情
  useEffect(() => {
    const fetchAccount = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/accounts/${id}`);
        setAccount(response.data.data);
      } catch (error) {
        console.error('获取账号信息失败:', error);
        setError('获取账号信息失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [id]);

  // 处理重置密码
  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`/api/accounts/${id}/reset-password`);
      Modal.success({
        title: '密码重置成功',
        content: (
          <div>
            <p>新密码: {response.data.data.password}</p>
            <p>请记录并告知用户</p>
          </div>
        ),
      });
    } catch (error) {
      message.error('重置密码失败');
      console.error('重置密码失败:', error);
    }
  };

  // 登录日志表格列定义
  const columns = [
    {
      title: '登录时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip_address',
      key: 'ip_address',
    },
    {
      title: '设备',
      dataIndex: 'device',
      key: 'device',
      ellipsis: true,
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Card title="账号详情" bordered={false}>
        <Alert message={error} type="error" showIcon />
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button type="primary" onClick={() => navigate('/accounts')}>
            返回列表
          </Button>
        </div>
      </Card>
    );
  }

  if (!account) {
    return (
      <Card title="账号详情" bordered={false}>
        <Alert message="未找到账号信息" type="warning" showIcon />
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button type="primary" onClick={() => navigate('/accounts')}>
            返回列表
          </Button>
        </div>
      </Card>
    );
  }

  // 计算账号状态
  let statusText = '未知';
  let statusColor = '';
  
  switch (account.status) {
    case 0:
      statusText = '禁用';
      statusColor = 'red';
      break;
    case 1:
      statusText = '正常';
      statusColor = 'green';
      break;
    case 2:
      statusText = '即将到期';
      statusColor = 'orange';
      break;
    case 3:
      statusText = '已到期';
      statusColor = 'red';
      break;
  }

  return (
    <Card
      title="账号详情"
      bordered={false}
      extra={
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/accounts/edit/${id}`)}
            style={{ marginRight: 8 }}
          >
            编辑
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleResetPassword}
            style={{ marginRight: 8 }}
          >
            重置密码
          </Button>
          <Button
            icon={<RollbackOutlined />}
            onClick={() => navigate('/accounts')}
          >
            返回
          </Button>
        </div>
      }
    >
      <Descriptions title="基本信息" bordered>
        <Descriptions.Item label="账号">{account.account}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusColor}>{statusText}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">{account.created_at}</Descriptions.Item>
        <Descriptions.Item label="开始时间">{account.start_time}</Descriptions.Item>
        <Descriptions.Item label="结束时间">{account.end_time}</Descriptions.Item>
        <Descriptions.Item label="最后登录时间">
          {account.last_login_time || '从未登录'}
        </Descriptions.Item>
        <Descriptions.Item label="最后登录IP">
          {account.last_login_ip || '无记录'}
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          {account.remark || '无备注'}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions title="用户信息" bordered>
        <Descriptions.Item label="用户名">{account.user?.username}</Descriptions.Item>
        <Descriptions.Item label="真实姓名">{account.user?.real_name}</Descriptions.Item>
        <Descriptions.Item label="电话">{account.user?.phone}</Descriptions.Item>
        <Descriptions.Item label="身份证号">{account.user?.id_card}</Descriptions.Item>
        <Descriptions.Item label="地址" span={2}>
          {account.user?.address}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions title="套餐信息" bordered>
        <Descriptions.Item label="套餐名称">{account.package?.name}</Descriptions.Item>
        <Descriptions.Item label="价格">¥{account.package?.price}</Descriptions.Item>
        <Descriptions.Item label="时长">{account.package?.duration}天</Descriptions.Item>
        <Descriptions.Item label="带宽">{account.package?.bandwidth}Mbps</Descriptions.Item>
        <Descriptions.Item label="描述" span={2}>
          {account.package?.description || '无描述'}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Card title="登录日志" bordered={false}>
        {account.login_logs && account.login_logs.length > 0 ? (
          <Table
            columns={columns}
            dataSource={account.login_logs}
            rowKey="id"
            pagination={false}
          />
        ) : (
          <Alert message="暂无登录记录" type="info" showIcon />
        )}
      </Card>
    </Card>
  );
};

// 导入Modal和message组件
import { Modal, message } from 'antd';

export default AccountView;