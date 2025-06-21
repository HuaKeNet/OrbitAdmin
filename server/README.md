# 宽带用户计时管理系统 - 后端

基于PHP StartMVC框架开发的宽带用户计时管理系统后端。

## 技术栈

- PHP 7.4+
- StartMVC框架
- MySQL 5.6+

## 目录结构

```
server/
├── app/                  # 应用目录
│   ├── controllers/      # 控制器
│   ├── models/           # 模型
│   ├── views/            # 视图
│   └── services/         # 服务层
├── config/               # 配置文件
├── public/               # 公共访问目录
├── routes/               # 路由配置
├── database/             # 数据库迁移和种子
└── vendor/               # Composer依赖
```

## 数据库设计

### 主要表结构

1. **用户表 (users)**
   - id: int (主键)
   - username: varchar(50) (用户名)
   - password: varchar(255) (密码哈希)
   - real_name: varchar(50) (真实姓名)
   - phone: varchar(20) (电话)
   - address: varchar(255) (地址)
   - id_card: varchar(18) (身份证)
   - status: tinyint (状态: 1=正常, 0=禁用)
   - created_at: timestamp (创建时间)
   - updated_at: timestamp (更新时间)

2. **宽带账号表 (broadband_accounts)**
   - id: int (主键)
   - user_id: int (用户ID，外键)
   - account: varchar(50) (宽带账号)
   - password: varchar(50) (宽带密码)
   - ip_address: varchar(15) (IP地址)
   - mac_address: varchar(17) (MAC地址)
   - package_id: int (套餐ID，外键)
   - start_time: timestamp (开始时间)
   - end_time: timestamp (结束时间)
   - status: tinyint (状态: 1=在线, 0=离线, 2=过期)
   - created_at: timestamp (创建时间)
   - updated_at: timestamp (更新时间)

3. **套餐表 (packages)**
   - id: int (主键)
   - name: varchar(50) (套餐名称)
   - price: decimal(10,2) (价格)
   - duration: int (时长，单位:天)
   - bandwidth: int (带宽，单位:Mbps)
   - description: text (描述)
   - status: tinyint (状态: 1=启用, 0=禁用)
   - created_at: timestamp (创建时间)
   - updated_at: timestamp (更新时间)

4. **设备表 (devices)**
   - id: int (主键)
   - name: varchar(100) (设备名称)
   - type: varchar(50) (设备类型)
   - model: varchar(50) (设备型号)
   - serial_number: varchar(50) (序列号)
   - purchase_date: date (购买日期)
   - warranty_period: int (保修期，单位:月)
   - supplier_id: int (供应商ID，外键)
   - status: tinyint (状态: 1=正常, 2=借出, 3=维修中, 4=报废)
   - location: varchar(100) (存放位置)
   - price: decimal(10,2) (价格)
   - qr_code: varchar(255) (二维码URL)
   - created_at: timestamp (创建时间)
   - updated_at: timestamp (更新时间)

5. **设备借用记录表 (device_loans)**
   - id: int (主键)
   - device_id: int (设备ID，外键)
   - user_id: int (借用人ID，外键)
   - loan_date: timestamp (借出时间)
   - expected_return_date: timestamp (预计归还时间)
   - actual_return_date: timestamp (实际归还时间)
   - status: tinyint (状态: 1=借出, 2=已归还)
   - notes: text (备注)
   - created_at: timestamp (创建时间)
   - updated_at: timestamp (更新时间)

6. **设备维修记录表 (device_repairs)**
   - id: int (主键)
   - device_id: int (设备ID，外键)
   - problem: text (问题描述)
   - repair_date: timestamp (送修时间)
   - completion_date: timestamp (完成时间)
   - cost: decimal(10,2) (维修费用)
   - status: tinyint (状态: 1=维修中, 2=已完成)
   - notes: text (备注)
   - created_at: timestamp (创建时间)
   - updated_at: timestamp (更新时间)

7. **供应商表 (suppliers)**
   - id: int (主键)
   - name: varchar(100) (供应商名称)
   - contact_person: varchar(50) (联系人)
   - phone: varchar(20) (电话)
   - email: varchar(100) (邮箱)
   - address: varchar(255) (地址)
   - status: tinyint (状态: 1=正常, 0=禁用)
   - created_at: timestamp (创建时间)
   - updated_at: timestamp (更新时间)

8. **采购订单表 (purchase_orders)**
   - id: int (主键)
   - order_number: varchar(50) (订单编号)
   - supplier_id: int (供应商ID，外键)
   - total_amount: decimal(10,2) (总金额)
   - order_date: timestamp (订单日期)
   - delivery_date: timestamp (交付日期)
   - status: tinyint (状态: 1=待处理, 2=已发货, 3=已完成)
   - notes: text (备注)
   - created_at: timestamp (创建时间)
   - updated_at: timestamp (更新时间)

9. **采购订单明细表 (purchase_order_items)**
   - id: int (主键)
   - order_id: int (订单ID，外键)
   - device_name: varchar(100) (设备名称)
   - device_type: varchar(50) (设备类型)
   - device_model: varchar(50) (设备型号)
   - quantity: int (数量)
   - unit_price: decimal(10,2) (单价)
   - created_at: timestamp (创建时间)
   - updated_at: timestamp (更新时间)

10. **业务员表 (salespeople)**
    - id: int (主键)
    - name: varchar(50) (姓名)
    - phone: varchar(20) (电话)
    - email: varchar(100) (邮箱)
    - commission_rate: decimal(5,2) (提成比例)
    - status: tinyint (状态: 1=正常, 0=禁用)
    - created_at: timestamp (创建时间)
    - updated_at: timestamp (更新时间)

11. **业务记录表 (sales_records)**
    - id: int (主键)
    - salesperson_id: int (业务员ID，外键)
    - user_id: int (用户ID，外键)
    - package_id: int (套餐ID，外键)
    - amount: decimal(10,2) (金额)
    - commission: decimal(10,2) (提成)
    - sale_date: timestamp (销售日期)
    - created_at: timestamp (创建时间)
    - updated_at: timestamp (更新时间)

12. **API密钥表 (api_keys)**
    - id: int (主键)
    - name: varchar(50) (名称)
    - api_key: varchar(64) (API密钥)
    - permissions: text (权限JSON)
    - status: tinyint (状态: 1=启用, 0=禁用)
    - created_at: timestamp (创建时间)
    - updated_at: timestamp (更新时间)

13. **系统设置表 (settings)**
    - id: int (主键)
    - key: varchar(50) (键名)
    - value: text (值)
    - description: varchar(255) (描述)
    - created_at: timestamp (创建时间)
    - updated_at: timestamp (更新时间)

## API接口设计

### 用户管理
- `GET /api/users` - 获取用户列表
- `GET /api/users/{id}` - 获取单个用户信息
- `POST /api/users` - 创建用户
- `PUT /api/users/{id}` - 更新用户信息
- `DELETE /api/users/{id}` - 删除用户
- `POST /api/users/import` - 导入用户
- `GET /api/users/export` - 导出用户

### 套餐管理
- `GET /api/packages` - 获取套餐列表
- `GET /api/packages/{id}` - 获取单个套餐信息
- `POST /api/packages` - 创建套餐
- `PUT /api/packages/{id}` - 更新套餐信息
- `DELETE /api/packages/{id}` - 删除套餐
- `GET /api/packages/distribution` - 获取套餐分布数据

### 宽带账号管理
- `GET /api/broadband-accounts` - 获取宽带账号列表
- `GET /api/broadband-accounts/{id}` - 获取单个宽带账号信息
- `POST /api/broadband-accounts` - 创建宽带账号
- `PUT /api/broadband-accounts/{id}` - 更新宽带账号信息
- `DELETE /api/broadband-accounts/{id}` - 删除宽带账号
- `PUT /api/broadband-accounts/{id}/status` - 更新宽带账号状态

### 设备管理
- `GET /api/devices` - 获取设备列表
- `GET /api/devices/{id}` - 获取单个设备信息
- `POST /api/devices` - 创建设备
- `PUT /api/devices/{id}` - 更新设备信息
- `DELETE /api/devices/{id}` - 删除设备
- `POST /api/devices/import` - 导入设备
- `GET /api/devices/export` - 导出设备
- `GET /api/devices/{id}/qrcode` - 获取设备二维码
- `GET /api/devices/warnings` - 获取设备预警信息

### 设备借用管理
- `GET /api/device-loans` - 获取设备借用记录列表
- `POST /api/device-loans` - 创建设备借用记录
- `PUT /api/device-loans/{id}/return` - 归还设备

### 设备维修管理
- `GET /api/device-repairs` - 获取设备维修记录列表
- `POST /api/device-repairs` - 创建设备维修记录
- `PUT /api/device-repairs/{id}/complete` - 完成设备维修

### 供应商管理
- `GET /api/suppliers` - 获取供应商列表
- `GET /api/suppliers/{id}` - 获取单个供应商信息
- `POST /api/suppliers` - 创建供应商
- `PUT /api/suppliers/{id}` - 更新供应商信息
- `DELETE /api/suppliers/{id}` - 删除供应商

### 采购订单管理
- `GET /api/purchase-orders` - 获取采购订单列表
- `GET /api/purchase-orders/{id}` - 获取单个采购订单信息
- `POST /api/purchase-orders` - 创建采购订单
- `PUT /api/purchase-orders/{id}` - 更新采购订单信息
- `DELETE /api/purchase-orders/{id}` - 删除采购订单
- `PUT /api/purchase-orders/{id}/status` - 更新采购订单状态

### 业务员管理
- `GET /api/salespeople` - 获取业务员列表
- `GET /api/salespeople/{id}` - 获取单个业务员信息
- `POST /api/salespeople` - 创建业务员
- `PUT /api/salespeople/{id}` - 更新业务员信息
- `DELETE /api/salespeople/{id}` - 删除业务员
- `GET /api/salespeople/{id}/statistics` - 获取业务员统计数据

### 报表分析
- `GET /api/reports/user-growth` - 获取用户增长报表
- `GET /api/reports/package-distribution` - 获取套餐分布报表
- `GET /api/reports/device-statistics` - 获取设备统计报表

### API密钥管理
- `GET /api/api-keys` - 获取API密钥列表
- `GET /api/api-keys/{id}` - 获取单个API密钥信息
- `POST /api/api-keys` - 创建API密钥
- `PUT /api/api-keys/{id}` - 更新API密钥信息
- `DELETE /api/api-keys/{id}` - 删除API密钥

### 系统设置
- `GET /api/settings` - 获取系统设置
- `PUT /api/settings` - 更新系统设置
- `GET /api/settings/email` - 获取邮件系统设置
- `PUT /api/settings/email` - 更新邮件系统设置

## 安装步骤

1. 克隆仓库
2. 安装依赖：`composer install`
3. 配置数据库连接
4. 运行数据库迁移：`php migrate.php`
5. 启动服务器