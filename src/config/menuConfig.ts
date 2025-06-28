import { 
  DashboardOutlined, 
  UserOutlined, 
  AppstoreOutlined,
  WifiOutlined,
  LaptopOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  FileTextOutlined
} from '@ant-design/icons';

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ComponentType;
  children?: MenuItem[];
  path?: string;
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: DashboardOutlined,
    path: '/dashboard'
  },
  {
    key: 'users',
    label: '用户管理',
    icon: UserOutlined,
    children: [
      {
        key: 'users-list',
        label: '用户列表',
        path: '/users'
      },
      {
        key: 'users-add',
        label: '添加用户',
        path: '/users/add'
      },
      {
        key: 'users-import-export',
        label: '导入导出',
        path: '/users/import-export'
      }
    ]
  },
  {
    key: 'packages',
    label: '套餐管理',
    icon: AppstoreOutlined,
    children: [
      {
        key: 'packages-list',
        label: '套餐列表',
        path: '/packages'
      },
      {
        key: 'packages-distribution',
        label: '套餐分布',
        path: '/packages/distribution'
      }
    ]
  },
  {
    key: 'accounts',
    label: '宽带账号',
    icon: WifiOutlined,
    children: [
      {
        key: 'accounts-list',
        label: '账号列表',
        path: '/accounts'
      },
      {
        key: 'accounts-add',
        label: '添加账号',
        path: '/accounts/add'
      }
    ]
  },
  {
    key: 'devices',
    label: '设备管理',
    icon: LaptopOutlined,
    children: [
      {
        key: 'devices-list',
        label: '设备列表',
        path: '/devices'
      },
      {
        key: 'devices-add',
        label: '添加设备',
        path: '/devices/add'
      },
      {
        key: 'devices-import-export',
        label: '导入导出',
        path: '/devices/import-export'
      }
    ]
  },
  {
    key: 'agents',
    label: '业务员管理',
    icon: TeamOutlined,
    children: [
      {
        key: 'agents-list',
        label: '业务员列表',
        path: '/agents'
      },
      {
        key: 'agents-add',
        label: '添加业务员',
        path: '/agents/add'
      }
    ]
  },
  {
    key: 'reports',
    label: '报表分析',
    icon: BarChartOutlined,
    children: [
      {
        key: 'reports-revenue',
        label: '收入报表',
        path: '/reports/revenue'
      },
      {
        key: 'reports-user-growth',
        label: '用户增长',
        path: '/reports/user-growth'
      },
      {
        key: 'reports-package',
        label: '套餐分析',
        path: '/reports/package'
      },
      {
        key: 'reports-agent',
        label: '业务员业绩',
        path: '/reports/agent'
      }
    ]
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: SettingOutlined,
    children: [
      {
        key: 'settings-system',
        label: '系统参数',
        path: '/settings'
      },
      {
        key: 'settings-backup',
        label: '备份恢复',
        path: '/settings/backup-restore'
      },
      {
        key: 'settings-admins',
        label: '管理员',
        path: '/settings/admins'
      }
    ]
  },
  {
    key: 'logs',
    label: '日志管理',
    icon: FileTextOutlined,
    children: [
      {
        key: 'logs-operation',
        label: '操作日志',
        path: '/logs/operation'
      },
      {
        key: 'logs-login',
        label: '登录日志',
        path: '/logs/login'
      },
      {
        key: 'logs-system',
        label: '系统日志',
        path: '/logs/system'
      }
    ]
  }
];

export default menuItems;