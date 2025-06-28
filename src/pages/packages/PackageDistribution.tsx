import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Radio, Statistic, Table, Alert } from 'antd';
import { Pie, Column } from '@ant-design/charts';
import axios from 'axios';

interface PackageDistributionData {
  name: string;
  count: number;
  percentage: number;
}

interface UserPackageData {
  package_id: number;
  package_name: string;
  user_count: number;
}

const PackageDistribution: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [chartType, setChartType] = useState<string>('pie');
  const [distributionData, setDistributionData] = useState<PackageDistributionData[]>([]);
  const [userPackageData, setUserPackageData] = useState<UserPackageData[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // 获取套餐分布数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/packages/distribution');
        setDistributionData(response.data.distribution || []);
        setUserPackageData(response.data.userPackages || []);
      } catch (error) {
        console.error('获取套餐分布数据失败:', error);
        setError('获取套餐分布数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 饼图配置
  const pieConfig = {
    appendPadding: 10,
    data: distributionData,
    angleField: 'count',
    colorField: 'name',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };

  // 柱状图配置
  const columnConfig = {
    data: distributionData,
    xField: 'name',
    yField: 'count',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      name: { alias: '套餐名称' },
      count: { alias: '用户数量' },
    },
  };

  // 用户套餐表格列定义
  const columns = [
    {
      title: '套餐名称',
      dataIndex: 'package_name',
      key: 'package_name',
    },
    {
      title: '用户数量',
      dataIndex: 'user_count',
      key: 'user_count',
      sorter: (a: UserPackageData, b: UserPackageData) => a.user_count - b.user_count,
    },
    {
      title: '占比',
      key: 'percentage',
      render: (_, record: UserPackageData) => {
        const total = userPackageData.reduce((sum, item) => sum + item.user_count, 0);
        const percentage = total > 0 ? ((record.user_count / total) * 100).toFixed(2) : '0.00';
        return `${percentage}%`;
      },
    },
  ];

  // 计算统计数据
  const totalPackages = distributionData.length;
  const totalUsers = userPackageData.reduce((sum, item) => sum + item.user_count, 0);
  const mostPopularPackage = userPackageData.length > 0
    ? userPackageData.reduce((prev, current) => (prev.user_count > current.user_count ? prev : current))
    : null;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Card title="套餐分布" bordered={false}>
        <Alert message={error} type="error" showIcon />
      </Card>
    );
  }

  return (
    <Card title="套餐分布" bordered={false}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic title="套餐总数" value={totalPackages} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="用户总数" value={totalUsers} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="最受欢迎套餐" 
              value={mostPopularPackage?.package_name || '无数据'} 
              suffix={mostPopularPackage ? `(${mostPopularPackage.user_count}人)` : ''}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="套餐分布图表" 
        bordered={false}
        extra={
          <Radio.Group value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <Radio.Button value="pie">饼图</Radio.Button>
            <Radio.Button value="column">柱状图</Radio.Button>
          </Radio.Group>
        }
      >
        {distributionData.length > 0 ? (
          <div style={{ height: 400 }}>
            {chartType === 'pie' ? (
              <Pie {...pieConfig} />
            ) : (
              <Column {...columnConfig} />
            )}
          </div>
        ) : (
          <Alert message="暂无套餐分布数据" type="info" showIcon />
        )}
      </Card>

      <Card title="套餐用户详情" bordered={false} style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={userPackageData}
          rowKey="package_id"
          pagination={false}
        />
      </Card>
    </Card>
  );
};

export default PackageDistribution;