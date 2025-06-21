// 通用分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 用户类型
export interface User {
  id: number;
  username: string;
  real_name: string;
  phone: string;
  id_card: string;
  address: string;
  status: number;
  created_at: string;
  updated_at: string;
  accounts?: BroadbandAccount[];
}

// 套餐类型
export interface Package {
  id: number;
  name: string;
  price: number;
  duration: number;
  bandwidth: number;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// 宽带账号类型
export interface BroadbandAccount {
  id: number;
  user_id: number;
  package_id: number;
  account: string;
  start_time: string;
  end_time: string;
  status: number;
  last_login_time: string | null;
  last_login_ip: string | null;
  remark: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  package?: Package;
  login_logs?: LoginLog[];
}

// 登录日志类型
export interface LoginLog {
  id: number;
  account_id: number;
  ip_address: string;
  device: string;
  location: string;
  status: number;
  remark: string | null;
  created_at: string;
}

// 设备类型
export interface Device {
  id: number;
  name: string;
  model: string;
  serial_number: string;
  mac_address: string;
  status: number;
  location: string;
  remark: string | null;
  created_at: string;
  updated_at: string;
}

// 业务员类型
export interface Agent {
  id: number;
  name: string;
  phone: string;
  id_card: string;
  address: string;
  status: number;
  commission_rate: number;
  remark: string | null;
  created_at: string;
  updated_at: string;
}

// 业务员业绩类型
export interface AgentPerformance {
  agent_id: number;
  agent_name: string;
  total_users: number;
  total_accounts: number;
  total_revenue: number;
  commission: number;
  period: string;
}

// 收入报表类型
export interface RevenueReport {
  date: string;
  total: number;
  new_users: number;
  renewals: number;
}

// 用户增长报表类型
export interface UserGrowthReport {
  date: string;
  new_users: number;
  total_users: number;
}

// 套餐分布报表类型
export interface PackageDistribution {
  name: string;
  count: number;
  percentage: number;
}

// 导入结果类型
export interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors?: Array<{
    row: number;
    message: string;
  }>;
}

// 系统设置类型
export interface SystemSettings {
  site_name: string;
  site_logo: string;
  admin_email: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_encryption: string;
  backup_enabled: boolean;
  backup_frequency: string;
  backup_retention: number;
}

// 管理员类型
export interface Admin {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  status: number;
  last_login_time: string | null;
  last_login_ip: string | null;
  created_at: string;
  updated_at: string;
}

// 操作日志类型
export interface OperationLog {
  id: number;
  admin_id: number;
  admin_name: string;
  action: string;
  ip_address: string;
  user_agent: string;
  details: string;
  created_at: string;
}

// 系统日志类型
export interface SystemLog {
  id: number;
  level: string;
  message: string;
  context: string;
  created_at: string;
}

// 仪表盘统计类型
export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_accounts: number;
  active_accounts: number;
  expiring_accounts: number;
  expired_accounts: number;
  total_revenue: number;
  monthly_revenue: number;
}

// 备份记录类型
export interface BackupRecord {
  id: number;
  filename: string;
  size: number;
  created_at: string;
  created_by: string;
  status: string;
}

// 认证响应类型
export interface AuthResponse {
  token: string;
  token_type: string;
  expires_in: number;
  user: Admin;
}

// 宽带认证响应类型
export interface BroadbandAuthResponse {
  success: boolean;
  message: string;
  data?: {
    account: string;
    user_name: string;
    package_name: string;
    start_time: string;
    end_time: string;
    session_id?: string;
  };
}