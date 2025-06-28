import React, { useState } from 'react';
import { Card, Upload, Button, message, Alert, Table, Tabs, Space, Divider } from 'antd';
import { UploadOutlined, DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import type { ImportResult } from '../../types';
import axios from 'axios';

const { TabPane } = Tabs;

const UserImportExport: React.FC = () => {
  const [importLoading, setImportLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('import');

  // 处理文件上传前的检查
  const beforeUpload = (file: RcFile) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                    file.type === 'application/vnd.ms-excel' ||
                    file.name.endsWith('.xlsx') ||
                    file.name.endsWith('.xls') ||
                    file.name.endsWith('.csv');
    
    if (!isExcel) {
      message.error('只能上传Excel或CSV文件!');
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小不能超过2MB!');
    }
    
    return isExcel && isLt2M;
  };

  // 处理文件上传
  const handleUpload: UploadProps['customRequest'] = async (options) => {
    setImportLoading(true);
    setImportResult(null);
    
    const { file } = options;
    const formData = new FormData();
    formData.append('file', file as Blob);
    
    try {
      const response = await axios.post('/api/users/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setImportResult(response.data.data);
      
      if (response.data.data.success === response.data.data.total) {
        message.success(`成功导入 ${response.data.data.success} 条用户数据`);
      } else {
        message.warning(`导入完成，成功: ${response.data.data.success}，失败: ${response.data.data.failed}`);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || '导入用户数据失败');
      } else {
        message.error('导入用户数据失败');
      }
      console.error('导入用户数据失败:', error);
    } finally {
      setImportLoading(false);
    }
  };

  // 处理导出
  const handleExport = async () => {
    setExportLoading(true);
    try {
      const response = await axios.get('/api/users/export', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('用户数据导出成功');
    } catch (error) {
      message.error('导出用户数据失败');
      console.error('导出用户数据失败:', error);
    } finally {
      setExportLoading(false);
    }
  };

  // 下载导入模板
  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get('/api/users/import-template', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_import_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('导入模板下载成功');
    } catch (error) {
      message.error('下载导入模板失败');
      console.error('下载导入模板失败:', error);
    }
  };

  // 导入错误表格列
  const errorColumns = [
    {
      title: '行号',
      dataIndex: 'row',
      key: 'row',
    },
    {
      title: '错误信息',
      dataIndex: 'message',
      key: 'message',
    },
  ];

  return (
    <Card title="用户数据导入导出" bordered={false}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="导入用户" key="import">
          <Alert
            message="导入说明"
            description={
              <div>
                <p>1. 请使用Excel或CSV格式的文件进行导入，文件大小不超过2MB</p>
                <p>2. 文件内容必须包含：用户名、密码、真实姓名、电话、身份证号、地址等信息</p>
                <p>3. 可以下载导入模板，按照模板格式填写数据后再导入</p>
                <p>4. 导入过程中如有错误，系统会显示详细的错误信息</p>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button 
              icon={<FileExcelOutlined />} 
              onClick={handleDownloadTemplate}
            >
              下载导入模板
            </Button>
            
            <Divider />
            
            <Upload
              name="file"
              accept=".xlsx,.xls,.csv"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={handleUpload}
            >
              <Button 
                icon={<UploadOutlined />} 
                loading={importLoading}
                type="primary"
              >
                选择文件并上传
              </Button>
            </Upload>
            
            {importResult && (
              <div style={{ marginTop: 16 }}>
                <Alert
                  message="导入结果"
                  description={
                    <div>
                      <p>总记录数: {importResult.total}</p>
                      <p>成功导入: {importResult.success}</p>
                      <p>导入失败: {importResult.failed}</p>
                    </div>
                  }
                  type={importResult.failed > 0 ? "warning" : "success"}
                  showIcon
                />
                
                {importResult.errors && importResult.errors.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <h3>错误详情:</h3>
                    <Table
                      columns={errorColumns}
                      dataSource={importResult.errors}
                      rowKey="row"
                      size="small"
                      pagination={false}
                    />
                  </div>
                )}
              </div>
            )}
          </Space>
        </TabPane>
        
        <TabPane tab="导出用户" key="export">
          <Alert
            message="导出说明"
            description={
              <div>
                <p>1. 导出的文件为Excel格式，包含所有用户的基本信息</p>
                <p>2. 导出的数据不包含敏感信息，如密码等</p>
                <p>3. 可以将导出的文件用于数据备份或其他系统的数据迁移</p>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={exportLoading}
            onClick={handleExport}
          >
            导出全部用户数据
          </Button>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default UserImportExport;