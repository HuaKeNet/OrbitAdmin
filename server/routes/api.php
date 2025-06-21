<?php

use StartMVC\Router;

/**
 * API路由配置
 */

// 仪表盘
Router::get('/api/dashboard/statistics', 'DashboardController@statistics');

// 用户管理
Router::get('/api/users', 'UserController@index');
Router::get('/api/users/{id}', 'UserController@show');
Router::post('/api/users', 'UserController@store');
Router::put('/api/users/{id}', 'UserController@update');
Router::delete('/api/users/{id}', 'UserController@destroy');
Router::post('/api/users/import', 'UserController@import');
Router::get('/api/users/export', 'UserController@export');
Router::get('/api/users/statistics', 'UserController@statistics');

// 套餐管理
Router::get('/api/packages', 'PackageController@index');
Router::get('/api/packages/{id}', 'PackageController@show');
Router::post('/api/packages', 'PackageController@store');
Router::put('/api/packages/{id}', 'PackageController@update');
Router::delete('/api/packages/{id}', 'PackageController@destroy');
Router::get('/api/packages/distribution', 'PackageController@distribution');

// 宽带账号管理
Router::get('/api/broadband-accounts', 'BroadbandAccountController@index');
Router::get('/api/broadband-accounts/{id}', 'BroadbandAccountController@show');
Router::post('/api/broadband-accounts', 'BroadbandAccountController@store');
Router::put('/api/broadband-accounts/{id}', 'BroadbandAccountController@update');
Router::delete('/api/broadband-accounts/{id}', 'BroadbandAccountController@destroy');
Router::put('/api/broadband-accounts/{id}/status', 'BroadbandAccountController@updateStatus');
Router::get('/api/broadband-accounts/expiring', 'BroadbandAccountController@expiring');

// 设备管理
Router::get('/api/devices', 'DeviceController@index');
Router::get('/api/devices/{id}', 'DeviceController@show');
Router::post('/api/devices', 'DeviceController@store');
Router::put('/api/devices/{id}', 'DeviceController@update');
Router::delete('/api/devices/{id}', 'DeviceController@destroy');
Router::post('/api/devices/import', 'DeviceController@import');
Router::get('/api/devices/export', 'DeviceController@export');
Router::get('/api/devices/{id}/qrcode', 'DeviceController@generateQrCode');
Router::get('/api/devices/warnings', 'DeviceController@warnings');
Router::post('/api/devices/batch', 'DeviceController@batchOperation');
Router::get('/api/devices/inventory', 'DeviceController@inventory');

// 设备借用管理
Router::get('/api/device-loans', 'DeviceLoanController@index');
Router::get('/api/device-loans/{id}', 'DeviceLoanController@show');
Router::post('/api/device-loans', 'DeviceLoanController@store');
Router::put('/api/device-loans/{id}/return', 'DeviceLoanController@returnDevice');

// 设备维修管理
Router::get('/api/device-repairs', 'DeviceRepairController@index');
Router::get('/api/device-repairs/{id}', 'DeviceRepairController@show');
Router::post('/api/device-repairs', 'DeviceRepairController@store');
Router::put('/api/device-repairs/{id}/complete', 'DeviceRepairController@complete');

// 供应商管理
Router::get('/api/suppliers', 'SupplierController@index');
Router::get('/api/suppliers/{id}', 'SupplierController@show');
Router::post('/api/suppliers', 'SupplierController@store');
Router::put('/api/suppliers/{id}', 'SupplierController@update');
Router::delete('/api/suppliers/{id}', 'SupplierController@destroy');

// 采购订单管理
Router::get('/api/purchase-orders', 'PurchaseOrderController@index');
Router::get('/api/purchase-orders/{id}', 'PurchaseOrderController@show');
Router::post('/api/purchase-orders', 'PurchaseOrderController@store');
Router::put('/api/purchase-orders/{id}', 'PurchaseOrderController@update');
Router::delete('/api/purchase-orders/{id}', 'PurchaseOrderController@destroy');
Router::put('/api/purchase-orders/{id}/status', 'PurchaseOrderController@updateStatus');

// 业务员管理
Router::get('/api/salespeople', 'SalespersonController@index');
Router::get('/api/salespeople/{id}', 'SalespersonController@show');
Router::post('/api/salespeople', 'SalespersonController@store');
Router::put('/api/salespeople/{id}', 'SalespersonController@update');
Router::delete('/api/salespeople/{id}', 'SalespersonController@destroy');
Router::get('/api/salespeople/{id}/statistics', 'SalespersonController@statistics');

// 业务记录管理
Router::get('/api/sales-records', 'SalesRecordController@index');
Router::get('/api/sales-records/{id}', 'SalesRecordController@show');
Router::post('/api/sales-records', 'SalesRecordController@store');
Router::put('/api/sales-records/{id}', 'SalesRecordController@update');
Router::delete('/api/sales-records/{id}', 'SalesRecordController@destroy');

// 报表分析
Router::get('/api/reports/user-growth', 'ReportController@userGrowth');
Router::get('/api/reports/package-distribution', 'ReportController@packageDistribution');
Router::get('/api/reports/device-statistics', 'ReportController@deviceStatistics');
Router::get('/api/reports/device', 'ReportController@deviceReport');

// API密钥管理
Router::get('/api/api-keys', 'ApiKeyController@index');
Router::get('/api/api-keys/{id}', 'ApiKeyController@show');
Router::post('/api/api-keys', 'ApiKeyController@store');
Router::put('/api/api-keys/{id}', 'ApiKeyController@update');
Router::delete('/api/api-keys/{id}', 'ApiKeyController@destroy');

// 系统设置
Router::get('/api/settings', 'SettingController@index');
Router::put('/api/settings', 'SettingController@update');
Router::get('/api/settings/email', 'SettingController@getEmailSettings');
Router::put('/api/settings/email', 'SettingController@updateEmailSettings');