import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Input, Select, Tag, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { User, PaginatedResponse } from '../../types';
import axios from 'axios';

const { Option } = Select;

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  
  // 获取用户列表
  const fetchUsers = async (page = 1, pageSize = 10, searchValue = search, statusValue = status) => {
    setLoading(true);
    try {
      const response = await axios.get<PaginatedResponse<User>>('/api/users', {
        params: {
          page,
          limit: pageSize,
          search: searchValue,
          status: statusValue !== '' ? statusValue : undefined,
        },
      });
      
      setUsers(response.data.data);
      setPagination({
        current: response.data.page,
        pageSize: response.data.limit,
        total: response.data.total,
      });
    } catch (error) {
      message.error('获取用户列表失败');
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 处理表格变化
  const handleTableChange = (pagination: any) => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

  // 处理搜索
  const handleSearch = () => {
    fetchUsers(1, pagination.pageSize);
  };

  // 处理删除用户
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？此操作不可恢复。',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await axios.delete(`/api/users/${id}`);
          message.success('用户删除成功');
          fetchUsers(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error('删除用户失败');
          console.error('删除用户失败:', error);
        }
      },
    });
  };

  // 处理导出
  const handleExport = async () => {
    try {
      const response = await axios.get('/api/users/export', {
        params: {
          search,
          status: status !== '' ? status : undefined,
        },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      message.error('导出用户失败');
      console.error('导出用户失败:', error);
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
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '真实姓名',
      dataIndex: 'real_name',
      key: 'real_name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '正常' : '禁用'}
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
      render: (_, record: User) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(`/users/edit/${record.id}`)}
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
    <Card title="用户列表" bordered={false}>
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索用户名/姓名/电话"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
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
          </Select>
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={() => {
            setSearch('');
            setStatus('');
            fetchUsers(1, pagination.pageSize, '', '');
          }}>
            重置
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/users/add')}
          >
            添加用户
          </Button>
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            导出
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={users}
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

export default UserList;