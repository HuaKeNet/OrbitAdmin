// 用户类型定义
export interface User {
  id: number;
  username: string;
  real_name: string;
  phone: string;
  address: string;
  id_card: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// 宽带账号类型定义
export interface BroadbandAccount {
  id: number;
  user_id: number;
  account: string;
  password: string;
  ip_address: string | null;
  mac_address: string | null;
  package_id: number;
  start_time: string;
  end_time: string;
  status: number;
  created_at: string;
  updated_at: string;
  user?: User;
  package?: Package;
}

// 套餐类型定义
export interface Package {
  id: number;
  name: string;
  price: number;
  duration: number;
  bandwidth: number;
  description: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

// 设备类型定义
export interface Device {
  id: number;
  name: string;
  type: string;
  model: string;
  serial_number: string;
  purchase_date: string;
  warranty_period: number;
  supplier_id: number;
  status: number;
  location: string;
  price: number;
  qr_code: string | null;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
}

// 设备借用记录类型定义
export interface DeviceLoan {
  id: number;
  device_id: number;
  user_id: number;
  loan_date: string;
  expected_return_date: string;
  actual_return_date: string | null;
  status: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  device?: Device;
  user?: User;
}

// 设备维修记录类型定义
export interface DeviceRepair {
  id: number;
  device_id: number;
  problem: string;
  repair_date: string;
  completion_date: string | null;
  cost: number;
  status: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  device?: Device;
}

// 供应商类型定义
export interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// 采购订单类型定义
export interface PurchaseOrder {
  id: number;
  order_number: string;
  supplier_id: number;
  total_amount: number;
  order_date: string;
  delivery_date: string | null;
  status: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
  items?: PurchaseOrderItem[];
}

// 采购订单明细类型定义
export interface PurchaseOrderItem {
  id: number;
  order_id: number;
  device_name: string;
  device_type: string;
  device_model: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
}

// 业务员类型定义
export interface Salesperson {
  id: number;
  name: string;
  phone: string;
  email: string;
  commission_rate: number;
  status: number;
  created_at: string;
  updated_at: string;
}

// 业务记录类型定义
export interface SalesRecord {
  id: number;
  salesperson_id: number;
  user_id: number;
  package_id: number;
  amount: number;
  commission: number;
  sale_date: string;
  created_at: string;
  updated_at: string;
  salesperson?: Salesperson;
  user?: User;
  package?: Package;
}

// API密钥类型定义
export interface ApiKey {
  id: number;
  name: string;
  api_key: string;
  permissions: string;
  status: number;
  created_at: string;
  updated_at: string;
  parsedPermissions?: Record<string, boolean>;
}

// 系统设置类型定义
export interface Setting {
  id: number;
  key: string;
  value: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// 分页响应类型定义
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 通用响应类型定义
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// 用户统计类型定义
export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  newThisWeek: number;
}

// 套餐统计类型定义
export interface PackageStatistics {
  total: number;
  active: number;
  inactive: number;
  distribution: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

// 设备统计类型定义
export interface DeviceStatistics {
  total: number;
  normal: number;
  loaned: number;
  repairing: number;
  scrapped: number;
  warningCount: number;
}

// 业务统计类型定义
export interface SalesStatistics {
  totalSales: number;
  totalCommission: number;
  monthlySales: Array<{
    month: string;
    amount: number;
    commission: number;
  }>;
}

// 设备预警类型定义
export interface DeviceWarning {
  device: Device;
  warningType: 'warranty' | 'maintenance';
  daysRemaining: number;
}

// 仪表盘统计类型定义
export interface DashboardStatistics {
  users: UserStatistics;
  devices: DeviceStatistics;
  sales: {
    totalAmount: number;
    totalCommission: number;
    monthlyGrowth: number;
  };
  activeAccounts: number;
  expiringSoon: number;
  deviceWarnings: number;
}

// 菜单项类型定义
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  path?: string;
}

// 表格列配置类型定义
export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  render?: (text: any, record: any) => React.ReactNode;
  sorter?: boolean | ((a: any, b: any) => number);
  filters?: Array<{ text: string; value: any }>;
  onFilter?: (value: any, record: any) => boolean;
  width?: number | string;
}

// 表单字段类型定义
export interface FormField {
  name: string;
  label: string;
  type: 'input' | 'textarea' | 'select' | 'number' | 'date' | 'radio' | 'checkbox';
  placeholder?: string;
  rules?: any[];
  options?: Array<{ label: string; value: any }>;
  disabled?: boolean;
  span?: number;
}

// 图表数据类型定义
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

// 文件上传响应类型定义
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

// 导入导出结果类型定义
export interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
}