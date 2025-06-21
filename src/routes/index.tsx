import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from '../components/PrivateRoute';

// 懒加载页面组件
const Login = lazy(() => import('../pages/auth/Login'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));

// 用户管理
const UserList = lazy(() => import('../pages/users/UserList'));
const UserAdd = lazy(() => import('../pages/users/UserAdd'));
const UserEdit = lazy(() => import('../pages/users/UserEdit'));
const UserImportExport = lazy(() => import('../pages/users/UserImportExport'));

// 套餐管理
const PackageList = lazy(() => import('../pages/packages/PackageList'));
const PackageDistribution = lazy(() => import('../pages/packages/PackageDistribution'));

// 宽带账号管理
const AccountList = lazy(() => import('../pages/accounts/AccountList'));
const AccountAdd = lazy(() => import('../pages/accounts/AccountAdd'));
const AccountEdit = lazy(() => import('../pages/accounts/AccountEdit'));
const AccountView = lazy(() => import('../pages/accounts/AccountView'));

// 设备管理
const DeviceList = lazy(() => import('../pages/devices/DeviceList'));
const DeviceAdd = lazy(() => import('../pages/devices/DeviceAdd'));
const DeviceEdit = lazy(() => import('../pages/devices/DeviceEdit'));
const DeviceImportExport = lazy(() => import('../pages/devices/DeviceImportExport'));
const DeviceQrCode = lazy(() => import('../pages/devices/DeviceQrCode'));

// 业务员管理
const AgentList = lazy(() => import('../pages/agents/AgentList'));
const AgentAdd = lazy(() => import('../pages/agents/AgentAdd'));
const AgentEdit = lazy(() => import('../pages/agents/AgentEdit'));
const AgentPerformance = lazy(() => import('../pages/agents/AgentPerformance'));

// 报表分析
const RevenueReport = lazy(() => import('../pages/reports/RevenueReport'));
const UserGrowthReport = lazy(() => import('../pages/reports/UserGrowthReport'));
const PackageReport = lazy(() => import('../pages/reports/PackageReport'));
const AgentReport = lazy(() => import('../pages/reports/AgentReport'));

// 系统设置
const SystemSettings = lazy(() => import('../pages/settings/SystemSettings'));
const BackupRestore = lazy(() => import('../pages/settings/BackupRestore'));
const AdminList = lazy(() => import('../pages/settings/AdminList'));
const AdminAdd = lazy(() => import('../pages/settings/AdminAdd'));
const AdminEdit = lazy(() => import('../pages/settings/AdminEdit'));

// 日志管理
const OperationLog = lazy(() => import('../pages/logs/OperationLog'));
const LoginLog = lazy(() => import('../pages/logs/LoginLog'));
const SystemLog = lazy(() => import('../pages/logs/SystemLog'));

// 404页面
const NotFound = lazy(() => import('../pages/NotFound'));

// 加载中组件
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" />
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* 认证路由 */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="" element={<Navigate to="/auth/login" replace />} />
        </Route>

        {/* 主应用路由 */}
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* 用户管理 */}
          <Route path="users">
            <Route index element={<UserList />} />
            <Route path="add" element={<UserAdd />} />
            <Route path="edit/:id" element={<UserEdit />} />
            <Route path="import-export" element={<UserImportExport />} />
          </Route>

          {/* 套餐管理 */}
          <Route path="packages">
            <Route index element={<PackageList />} />
            <Route path="distribution" element={<PackageDistribution />} />
          </Route>

          {/* 宽带账号管理 */}
          <Route path="accounts">
            <Route index element={<AccountList />} />
            <Route path="add" element={<AccountAdd />} />
            <Route path="edit/:id" element={<AccountEdit />} />
            <Route path="view/:id" element={<AccountView />} />
          </Route>

          {/* 设备管理 */}
          <Route path="devices">
            <Route index element={<DeviceList />} />
            <Route path="add" element={<DeviceAdd />} />
            <Route path="edit/:id" element={<DeviceEdit />} />
            <Route path="import-export" element={<DeviceImportExport />} />
            <Route path="qrcode/:id" element={<DeviceQrCode />} />
          </Route>

          {/* 业务员管理 */}
          <Route path="agents">
            <Route index element={<AgentList />} />
            <Route path="add" element={<AgentAdd />} />
            <Route path="edit/:id" element={<AgentEdit />} />
            <Route path="performance/:id" element={<AgentPerformance />} />
          </Route>

          {/* 报表分析 */}
          <Route path="reports">
            <Route path="revenue" element={<RevenueReport />} />
            <Route path="user-growth" element={<UserGrowthReport />} />
            <Route path="package" element={<PackageReport />} />
            <Route path="agent" element={<AgentReport />} />
          </Route>

          {/* 系统设置 */}
          <Route path="settings">
            <Route index element={<SystemSettings />} />
            <Route path="backup-restore" element={<BackupRestore />} />
            <Route path="admins" element={<AdminList />} />
            <Route path="admins/add" element={<AdminAdd />} />
            <Route path="admins/edit/:id" element={<AdminEdit />} />
          </Route>

          {/* 日志管理 */}
          <Route path="logs">
            <Route path="operation" element={<OperationLog />} />
            <Route path="login" element={<LoginLog />} />
            <Route path="system" element={<SystemLog />} />
          </Route>
        </Route>

        {/* 404页面 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;