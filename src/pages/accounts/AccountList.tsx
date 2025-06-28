import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Input, Select, Tag, Modal, message, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import type { BroadbandAccount, PaginatedResponse } from '../../types';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AccountList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<BroadbandAccount[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  // 获取宽带账号列表
  const fetchAccounts = async (
    page = 1, 
    pageSize = 10, 
    searchValue = search, 
    statusValue = status,
    packageId = selectedPackage,
    dateRangeValue = dateRange
  ) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: pageSize,
      };

      if (searchValue) {
        params.search = searchValue;
      }

      if (statusValue) {
        params.status = statusValue;
      }

      if (packageId) {
        params.package_id = packageId;
      }

      if (dateRangeValue) {
        params.start_date = dateRangeValue[0];
        params.end_date = dateRangeValue[1];
      }

      const response = await axios.get<PaginatedResponse<BroadbandAccount>>('/api/accounts', {
        params
      });
      
      setAccounts(response.data.data);
      setPagination({
        current: response.data.page,
        pageSize: response.data.limit,
        total: response.data.total,
      });
    } catch (error) {
      message.error('获取宽带账号列表失败');
      console.error('获取宽带账号列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取套餐列表
  const fetchPackages = async () => {
    try {
      const response = await axios.get('/api/packages', {
        params: {
          limit: 100,
          status: 1
        }
      });
      setPackages(response.data.data);
    } catch (error) {
      console.error('获取套餐列表失败:', error);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchPackages();
  }, []);

  // 处理表格变化
  const handleTableChange = (pagination: any) => {
    fetchAccounts(pagination.current, pagination.pageSize);
  };

  // 处理搜索
  const handleSearch = () => {
    fetchAccounts(1, pagination.pageSize);
  };

  // 处理删除账号
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个宽带账号吗？此操作不可恢复。',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await axios.delete(`/api/accounts/${id}`);
          message.success('宽带账号删除成功');
          fetchAccounts(pagination.current, pagination.pageSize);
        } catch (error: any) {
          if (error.response && error.response.data && error.response.data.message) {
            message.error(error.response.data.message);
          } else {
            message.error('删除宽带账号失败');
          }
          console.error('删除宽带账号失败:', error);
        }
      },
    });
  };

  // 处理重置密码
  const handleResetPassword = (id: number) => {
    Modal.confirm({
      title: '确认重置密码',
      content: '确定要重置这个宽带账号的密码吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
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
          fetchAccounts(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error('重置密码失败');
          console.error('重置密码失败:', error);
        }
      },
    });
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dates ? dateStrings : null);
  };

  // 重置搜索条件
  const resetFilters = () => {
    setSearch('');
    setStatus('');
    setSelectedPackage('');
    setDateRange(null);
    fetchAccounts(1, pagination.pageSize, '', '', '', null);
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
      title: '账号',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '用户',
      key: 'user',
      render: (_, record: BroadbandAccount) => (
        <Link to={`/users/edit/${record.user?.id}`}>
          {record.user?.real_name || '未知用户'}
        </Link>
      ),
    },
    {
      title: '套餐',
      key: 'package',
      render: (_, record: BroadbandAccount) => (
        record.package?.name || '未知套餐'
      ),
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        let color = 'green';
        let text = '正常';
        
        switch (status) {
          case 0:
            color = 'red';
            text = '禁用';
            break;
          case 1:
            color = 'green';
            text = '正常';
            break;
          case 2:
            color = 'orange';
            text = '即将到期';
            break;
          case 3:
            color = 'red';
            text = '已到期';
            break;
          default:
            color = 'blue';
            text = '未知';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_, record: BroadbandAccount) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/accounts/view/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/accounts/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Button
            type="default"
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => handleResetPassword(record.id)}
          >
            重置密码
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="宽带账号列表" bordered={false}>
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索账号"
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
            <Option value="1">正常</Option>
            <Option value="0">禁用</Option>
            <Option value="2">即将到期</Option>
            <Option value="3">已到期</Option>
          </Select>
          <Select
            placeholder="套餐"
            style={{ width: 150 }}
            value={selectedPackage}
            onChange={(value) => setSelectedPackage(value)}
            allowClear
          >
            {packages.map(pkg => (
              <Option key={pkg.id} value={pkg.id.toString()}>{pkg.name}</Option>
            ))}
          </Select>
          <RangePicker 
            onChange={handleDateRangeChange}
            value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
            placeholder={['开始日期', '结束日期']}
          />
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={resetFilters}>
            重置
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/accounts/add')}
          >
            添加账号
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={accounts}
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
  );
};

export default AccountList;