import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Input, Select, Tag, Modal, message, Tooltip, Dropdown } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  DownloadOutlined,
  QrcodeOutlined,
  ExportOutlined,
  MoreOutlined,
  ToolOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Device, PaginatedResponse } from '../../types';
import axios from 'axios';

const { Option } = Select;

const DeviceList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<Device[]>([]);

  // 获取设备列表
  const fetchDevices = async (
    page = 1, 
    pageSize = 10, 
    searchValue = search, 
    statusValue = status,
    typeValue = type,
    locationValue = location
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

      if (typeValue) {
        params.type = typeValue;
      }

      if (locationValue) {
        params.location = locationValue;
      }

      const response = await axios.get<PaginatedResponse<Device>>('/api/devices', {
        params
      });
      
      setDevices(response.data.data);
      setPagination({
        current: response.data.page,
        pageSize: response.data.limit,
        total: response.data.total,
      });
    } catch (error) {
      message.error('获取设备列表失败');
      console.error('获取设备列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // 处理表格变化
  const handleTableChange = (pagination: any) => {
    fetchDevices(pagination.current, pagination.pageSize);
  };

  // 处理搜索
  const handleSearch = () => {
    fetchDevices(1, pagination.pageSize);
  };

  // 处理删除设备
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个设备吗？此操作不可恢复。',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await axios.delete(`/api/devices/${id}`);
          message.success('设备删除成功');
          fetchDevices(pagination.current, pagination.pageSize);
        } catch (error: any) {
          if (error.response && error.response.data && error.response.data.message) {
            message.error(error.response.data.message);
          } else {
            message.error('删除设备失败');
          }
          console.error('删除设备失败:', error);
        }
      },
    });
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的设备');
      return;
    }

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个设备吗？此操作不可恢复。`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await axios.post('/api/devices/batch-delete', { ids: selectedRowKeys });
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          setSelectedRows([]);
          fetchDevices(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error('批量删除失败');
          console.error('批量删除失败:', error);
        }
      },
    });
  };

  // 处理批量导出
  const handleBatchExport = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要导出的设备');
      return;
    }

    Modal.confirm({
      title: '确认导出',
      content: `确定要导出选中的 ${selectedRowKeys.length} 个设备信息吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await axios.post('/api/devices/export-selected', 
            { ids: selectedRowKeys },
            { responseType: 'blob' }
          );
          
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `devices_export_${new Date().toISOString().split('T')[0]}.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          
          message.success('导出成功');
        } catch (error) {
          message.error('导出失败');
          console.error('导出失败:', error);
        }
      },
    });
  };

  // 处理生成二维码
  const handleGenerateQrCode = (id: number) => {
    navigate(`/devices/qrcode/${id}`);
  };

  // 处理批量生成二维码
  const handleBatchGenerateQrCode = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要生成二维码的设备');
      return;
    }

    navigate(`/devices/qrcode/batch?ids=${selectedRowKeys.join(',')}`);
  };

  // 重置搜索条件
  const resetFilters = () => {
    setSearch('');
    setStatus('');
    setType('');
    setLocation('');
    fetchDevices(1, pagination.pageSize, '', '', '', '');
  };

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: Device[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    }
  };

  // 设备状态渲染
  const renderStatus = (status: number) => {
    let color = '';
    let text = '';
    
    switch (status) {
      case 1:
        color = 'green';
        text = '正常';
        break;
      case 2:
        color = 'blue';
        text = '借出';
        break;
      case 3:
        color = 'orange';
        text = '维修中';
        break;
      case 4:
        color = 'red';
        text = '报废';
        break;
      default:
        color = 'default';
        text = '未知';
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  // 操作菜单项
  const getActionMenu = (record: Device) => {
    return [
      {
        key: 'qrcode',
        label: (
          <a onClick={() => handleGenerateQrCode(record.id)}>
            生成二维码
          </a>
        ),
        icon: <QrcodeOutlined />
      },
      {
        key: 'repair',
        label: (
          <a onClick={() => navigate(`/devices/repair/${record.id}`)}>
            报修
          </a>
        ),
        icon: <ToolOutlined />
      },
      {
        key: 'loan',
        label: (
          <a onClick={() => navigate(`/devices/loan/${record.id}`)}>
            借出/归还
          </a>
        ),
        icon: <SwapOutlined />
      }
    ];
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
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '序列号',
      dataIndex: 'serial_number',
      key: 'serial_number',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: renderStatus,
    },
    {
      title: '购买日期',
      dataIndex: 'purchase_date',
      key: 'purchase_date',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record: Device) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(`/devices/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Dropdown menu={{ items: getActionMenu(record) }}>
            <Button size="small">
              <Space>
                更多
                <MoreOutlined />
              </Space>
            </Button>
          </Dropdown>
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
    <Card title="设备列表" bordered={false}>
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索设备名称/序列号"
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
            <Option value="2">借出</Option>
            <Option value="3">维修中</Option>
            <Option value="4">报废</Option>
          </Select>
          <Select
            placeholder="设备类型"
            style={{ width: 150 }}
            value={type}
            onChange={(value) => setType(value)}
            allowClear
          >
            <Option value="router">路由器</Option>
            <Option value="switch">交换机</Option>
            <Option value="modem">调制解调器</Option>
            <Option value="accessPoint">无线接入点</Option>
            <Option value="other">其他</Option>
          </Select>
          <Select
            placeholder="位置"
            style={{ width: 150 }}
            value={location}
            onChange={(value) => setLocation(value)}
            allowClear
          >
            <Option value="main_office">总部</Option>
            <Option value="branch_1">分支机构1</Option>
            <Option value="branch_2">分支机构2</Option>
            <Option value="warehouse">仓库</Option>
          </Select>
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={resetFilters}>
            重置
          </Button>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/devices/add')}
          >
            添加设备
          </Button>
          <Button
            icon={<ExportOutlined />}
            onClick={() => navigate('/devices/import-export')}
          >
            导入导出
          </Button>
          {selectedRowKeys.length > 0 && (
            <>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleBatchExport}
              >
                批量导出
              </Button>
              <Button
                icon={<QrcodeOutlined />}
                onClick={handleBatchGenerateQrCode}
              >
                批量生成二维码
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleBatchDelete}
              >
                批量删除
              </Button>
              <span style={{ marginLeft: 8 }}>
                已选择 <a>{selectedRowKeys.length}</a> 项
              </span>
            </>
          )}
        </Space>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={devices}
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

export default DeviceList;