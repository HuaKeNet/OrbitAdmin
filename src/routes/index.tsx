import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Loading from '../components/Loading';

// 懒加载页面组件
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));

// 用户管理
const UserList = lazy(() => import('../pages/users/UserList'));
const UserAdd = lazy(() => import('../pages/users/UserAdd'));
const UserEdit = lazy(() => import('../pages/users/UserEdit'));
const UserImportExport = lazy(() => import('../pages/users/UserImportExport'));

// 套餐管理
const PackageList = lazy(() => import('../pages/packages/PackageList'));
const PackageDistribution = lazy(() => import('../pages/packages/PackageDistribution'));

// 设备仓库
const DeviceList = lazy(() => import('../pages/devices/DeviceList'));
const DeviceAdd = lazy(() => import('../pages/devices/DeviceAdd'));
const DeviceBatch = lazy(() => import('../pages/devices/DeviceBatch'));
const DeviceLoans = lazy(() => import('../pages/devices/DeviceLoans'));
const DeviceRepairs = lazy(() => import('../pages/devices/DeviceRepairs'));
const DeviceScrap = lazy(() => import('../pages/devices/DeviceScrap'));
const DeviceInventory = lazy(() => import('../pages/devices/DeviceInventory'));
const DeviceImportExport = lazy(() => import('../pages/devices/DeviceImportExport'));
const DeviceWarnings = lazy(() => import('../pages/devices/DeviceWarnings'));
const DeviceQrCode = lazy(() => import('../pages/devices/DeviceQrCode'));

// 供应商管理
const SupplierList = lazy(() => import('../pages/suppliers/SupplierList'));
const SupplierAdd = lazy(() => import('../pages/suppliers/SupplierAdd'));

// 采购订单管理
const PurchaseOrderList = lazy(() => import('../pages/purchase-orders/PurchaseOrderList'));
const PurchaseOrderAdd = lazy(() => import('../pages/purchase-orders/PurchaseOrderAdd'));

// 业务员管理
const SalespersonList = lazy(() => import('../pages/salespeople/SalespersonList'));
const SalesStatistics = lazy(() => import('../pages/salespeople/SalesStatistics'));

// 报表分析
const UserGrowthReport = lazy(() => import('../pages/reports/UserGrowthReport'));
const PackageDistributionReport = lazy(() => import('../pages/reports/PackageDistributionReport'));
const DeviceStatisticsReport = lazy(() => import('../pages/reports/DeviceStatisticsReport'));
const DeviceReport = lazy(() => import('../pages/reports/DeviceReport'));

// API管理
const ApiSettings = lazy(() => import('../pages/api/ApiSettings'));
const ApiKeys = lazy(() => import('../pages/api/ApiKeys'));
const ApiDocs = lazy(() => import('../pages/api/ApiDocs'));

// 邮件系统
const EmailSettings = lazy(() => import('../pages/email/EmailSettings'));

// 系统设置
const SystemSettings = lazy(() => import('../pages/settings/SystemSettings'));

// 错误页面
const NotFound = lazy(() => import('../pages/error/NotFound'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 仪表盘 */}
          <Route index element={<Dashboard />} />
          
          {/* 用户管理 */}
          <Route path="users" element={<UserList />} />
          <Route path="users/add" element={<UserAdd />} />
          <Route path="users/edit/:id" element={<UserEdit />} />
          <Route path="users/import-export" element={<UserImportExport />} />
          
          {/* 套餐管理 */}
          <Route path="packages" element={<PackageList />} />
          <Route path="packages/distribution" element={<PackageDistribution />} />
          
          {/* 设备仓库 */}
          <Route path="devices" element={<DeviceList />} />
          <Route path="devices/add" element={<DeviceAdd />} />
          <Route path="devices/batch" element={<DeviceBatch />} />
          <Route path="devices/loans" element={<DeviceLoans />} />
          <Route path="devices/repairs" element={<DeviceRepairs />} />
          <Route path="devices/scrap" element={<DeviceScrap />} />
          <Route path="devices/inventory" element={<DeviceInventory />} />
          <Route path="devices/import-export" element={<DeviceImportExport />} />
          <Route path="devices/warnings" element={<DeviceWarnings />} />
          <Route path="devices/qrcode" element={<DeviceQrCode />} />
          
          {/* 供应商管理 */}
          <Route path="suppliers" element={<SupplierList />} />
          <Route path="suppliers/add" element={<SupplierAdd />} />
          
          {/* 采购订单管理 */}
          <Route path="purchase-orders" element={<PurchaseOrderList />} />
          <Route path="purchase-orders/add" element={<PurchaseOrderAdd />} />
          
          {/* 业务员管理 */}
          <Route path="salespeople" element={<SalespersonList />} />
          <Route path="salespeople/statistics" element={<SalesStatistics />} />
          
          {/* 报表分析 */}
          <Route path="reports/user-growth" element={<UserGrowthReport />} />
          <Route path="reports/package-distribution" element={<PackageDistributionReport />} />
          <Route path="reports/device-statistics" element={<DeviceStatisticsReport />} />
          <Route path="reports/device" element={<DeviceReport />} />
          
          {/* API管理 */}
          <Route path="api/settings" element={<ApiSettings />} />
          <Route path="api/keys" element={<ApiKeys />} />
          <Route path="api/docs" element={<ApiDocs />} />
          
          {/* 邮件系统 */}
          <Route path="email/settings" element={<EmailSettings />} />
          
          {/* 系统设置 */}
          <Route path="settings" element={<SystemSettings />} />
          
          {/* 404页面 */}
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* 重定向到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;