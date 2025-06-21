import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Alert, Spin, List } from 'antd';
import {
  UserOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  RiseOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import axios from 'axios';
import { DashboardStatistics, User, Device, BroadbandAccount, DeviceWarning } from '../../types';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [deviceWarnings, setDeviceWarnings] = useState<DeviceWarning[]>([]);
  const [expiringAccounts, setExpiringAccounts] = useState<BroadbandAccount[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [packageDistribution, setPackageDistribution] = useState<any[]>([]);

  // 获取仪表盘数据
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 获取统计数据
      const statsResponse = await axios.get<DashboardStatistics>('/api/dashboard/statistics');
      setStats(statsResponse.data);

      // 获取最近添加的用户
      const recentUsersResponse = await axios.get<User[]>('/api/users', {
        params: { limit: 5, page: 1, sort: 'created_at', order: 'desc' }
      });
      setRecentUsers(recentUsersResponse.data.data || []);

      // 获取设备预警
      const deviceWarningsResponse = await axios.get<DeviceWarning[]>('/api/devices/warnings');
      setDeviceWarnings(deviceWarningsResponse.data);

      // 获取即将到期的宽带账号
      const expiringAccountsResponse = await axios.get<BroadbandAccount[]>('/api/broadband-accounts/expiring');
      setExpiringAccounts(expiringAccountsResponse.data);

      // 获取用户增长数据
      const userGrowthResponse = await axios.get('/api/reports/user-growth');
      setUserGrowthData(userGrowthResponse.data);

      // 获取套餐分布数据
      const packageDistributionResponse = await axios.get('/api/reports/package-distribution');
      setPackageDistribution(packageDistributionResponse.data.distribution);
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 用户增长图表配置
  const userGrowthConfig = {
    data: userGrowthData,
    xField: 'date',
    yField: 'count',
    seriesField: 'type',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  // 套餐分布图表配置
  const packageDistributionConfig = {
    appendPadding: 10,
    data: packageDistribution,
    angleField: 'count',
    colorField: 'name',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={stats?.users.total || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={stats?.devices.total || 0}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线账号"
              value={stats?.activeAccounts || 0}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备预警"
              value={stats?.deviceWarnings || 0}
              valueStyle={{ color: stats?.deviceWarnings ? '#cf1322' : '#3f8600' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="用户增长趋势" bordered={false}>
            {userGrowthData.length > 0 ? (
              <Line {...userGrowthConfig} />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>暂无数据</div>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="套餐分布" bordered={false}>
            {packageDistribution.length > 0 ? (
              <Pie {...packageDistributionConfig} />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>暂无数据</div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="最近添加的用户" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={recentUsers}
              renderItem={(user) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<UserOutlined />}
                    title={user.real_name}
                    description={`用户名: ${user.username} | 电话: ${user.phone} | 添加时间: ${user.created_at}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="设备预警" bordered={false}>
            {deviceWarnings.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={deviceWarnings}
                renderItem={(warning) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<WarningOutlined style={{ color: '#cf1322' }} />}
                      title={warning.device.name}
                      description={`${warning.warningType === 'warranty' ? '保修到期' : '需要维护'} | 剩余天数: ${warning.daysRemaining}`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Alert message="暂无设备预警" type="success" showIcon />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="即将到期的宽带账号" bordered={false}>
            <Table
              dataSource={expiringAccounts}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: '账号',
                  dataIndex: 'account',
                  key: 'account',
                },
                {
                  title: '用户',
                  dataIndex: ['user', 'real_name'],
                  key: 'user_name',
                },
                {
                  title: '套餐',
                  dataIndex: ['package', 'name'],
                  key: 'package_name',
                },
                {
                  title: '到期时间',
                  dataIndex: 'end_time',
                  key: 'end_time',
                },
                {
                  title: '剩余天数',
                  key: 'days_remaining',
                  render: (_, record) => {
                    const endDate = new Date(record.end_time);
                    const today = new Date();
                    const diffTime = endDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays;
                  },
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;