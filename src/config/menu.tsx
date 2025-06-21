import React from 'react';
import {
  HomeOutlined,
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TeamOutlined,
  BarChartOutlined,
  ApiOutlined,
  MailOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { MenuItem } from '../types';

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: '首页',
    icon: <HomeOutlined />,
    path: '/'
  },
  {
    key: 'users',
    label: '用户管理',
    icon: <UserOutlined />,
    children: [
      {
        key: 'user-list',
        label: '用户列表',
        path: '/users'
      },
      {
        key: 'user-add',
        label: '添加用户',
        path: '/users/add'
      },
      {
        key: 'user-import-export',
        label: '导入导出',
        path: '/users/import-export'
      }
    ]
  },
  {
    key: 'packages',
    label: '套餐管理',
    icon: <ShoppingOutlined />,
    children: [
      {
        key: 'package-list',
        label: '套餐列表',
        path: '/packages'
      },
      {
        key: 'package-distribution',
        label: '套餐分布',
        path: '/packages/distribution'
      }
    ]
  },
  {
    key: 'devices',
    label: '设备仓库',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: 'device-list',
        label: '设备列表',
        path: '/devices'
      },
      {
        key: 'device-add',
        label: '添加设备',
        path: '/devices/add'
      },
      {
        key: 'device-batch',
        label: '批量操作',
        path: '/devices/batch'
      },
      {
        key: 'device-loans',
        label: '设备借用管理',
        path: '/devices/loans'
      },
      {
        key: 'device-repairs',
        label: '维修管理',
        path: '/devices/repairs'
      },
      {
        key: 'device-scrap',
        label: '报废管理',
        path: '/devices/scrap'
      },
      {
        key: 'device-inventory',
        label: '设备盘点',
        path: '/devices/inventory'
      },
      {
        key: 'device-import-export',
        label: '导入导出',
        path: '/devices/import-export'
      },
      {
        key: 'device-warnings',
        label: '设备预警系统',
        path: '/devices/warnings'
      },
      {
        key: 'device-qrcode',
        label: '设备二维码管理',
        path: '/devices/qrcode'
      },
      {
        key: 'supplier-list',
        label: '供应商列表',
        path: '/suppliers'
      },
      {
        key: 'supplier-add',
        label: '添加供应商',
        path: '/suppliers/add'
      },
      {
        key: 'purchase-orders',
        label: '采购订单列表',
        path: '/purchase-orders'
      },
      {
        key: 'purchase-order-add',
        label: '创建采购订单',
        path: '/purchase-orders/add'
      }
    ]
  },
  {
    key: 'salespeople',
    label: '业务员管理',
    icon: <TeamOutlined />,
    children: [
      {
        key: 'salesperson-list',
        label: '业务员列表',
        path: '/salespeople'
      },
      {
        key: 'sales-statistics',
        label: '业务统计',
        path: '/salespeople/statistics'
      }
    ]
  },
  {
    key: 'reports',
    label: '报表分析',
    icon: <BarChartOutlined />,
    children: [
      {
        key: 'user-growth-report',
        label: '用户增长报表',
        path: '/reports/user-growth'
      },
      {
        key: 'package-distribution-report',
        label: '套餐分布报表',
        path: '/reports/package-distribution'
      },
      {
        key: 'device-statistics-report',
        label: '设备统计',
        path: '/reports/device-statistics'
      },
      {
        key: 'device-report',
        label: '设备报表',
        path: '/reports/device'
      }
    ]
  },
  {
    key: 'api',
    label: 'API管理',
    icon: <ApiOutlined />,
    children: [
      {
        key: 'api-settings',
        label: 'API设置',
        path: '/api/settings'
      },
      {
        key: 'api-keys',
        label: 'API密钥管理',
        path: '/api/keys'
      },
      {
        key: 'api-docs',
        label: 'API文档',
        path: '/api/docs'
      }
    ]
  },
  {
    key: 'email',
    label: '邮件系统',
    icon: <MailOutlined />,
    children: [
      {
        key: 'email-settings',
        label: '邮件系统设置',
        path: '/email/settings'
      }
    ]
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: <SettingOutlined />,
    children: [
      {
        key: 'system-settings',
        label: '系统设置',
        path: '/settings'
      }
    ]
  }
];

export default menuItems;