<?php

use StartMVC\Route;

// 认证相关路由
Route::post('/auth/login', 'AuthController@login');
Route::post('/auth/logout', 'AuthController@logout')->middleware('auth');
Route::get('/auth/user', 'AuthController@user')->middleware('auth');
Route::post('/auth/refresh', 'AuthController@refresh')->middleware('auth');
Route::post('/auth/change-password', 'AuthController@changePassword')->middleware('auth');

// 仪表盘相关路由
Route::get('/dashboard/stats', 'DashboardController@stats')->middleware('auth');
Route::get('/dashboard/recent-accounts', 'DashboardController@recentAccounts')->middleware('auth');
Route::get('/dashboard/expiring-accounts', 'DashboardController@expiringAccounts')->middleware('auth');
Route::get('/dashboard/login-statistics', 'DashboardController@loginStatistics')->middleware('auth');

// 用户相关路由
Route::get('/users', 'UserController@index')->middleware('auth');
Route::get('/users/{id}', 'UserController@show')->middleware('auth');
Route::post('/users', 'UserController@store')->middleware('auth');
Route::put('/users/{id}', 'UserController@update')->middleware('auth');
Route::delete('/users/{id}', 'UserController@destroy')->middleware('auth');
Route::get('/users/export', 'UserController@export')->middleware('auth');
Route::post('/users/import', 'UserController@import')->middleware('auth');
Route::get('/users/import-template', 'UserController@importTemplate')->middleware('auth');

// 套餐相关路由
Route::get('/packages', 'PackageController@index')->middleware('auth');
Route::get('/packages/{id}', 'PackageController@show')->middleware('auth');
Route::post('/packages', 'PackageController@store')->middleware('auth');
Route::put('/packages/{id}', 'PackageController@update')->middleware('auth');
Route::delete('/packages/{id}', 'PackageController@destroy')->middleware('auth');
Route::get('/packages/distribution', 'PackageController@distribution')->middleware('auth');

// 宽带账号相关路由
Route::get('/accounts', 'AccountController@index')->middleware('auth');
Route::get('/accounts/{id}', 'AccountController@show')->middleware('auth');
Route::post('/accounts', 'AccountController@store')->middleware('auth');
Route::put('/accounts/{id}', 'AccountController@update')->middleware('auth');
Route::delete('/accounts/{id}', 'AccountController@destroy')->middleware('auth');
Route::post('/accounts/{id}/reset-password', 'AccountController@resetPassword')->middleware('auth');
Route::get('/accounts/statistics', 'AccountController@statistics')->middleware('auth');

// 设备相关路由
Route::get('/devices', 'DeviceController@index')->middleware('auth');
Route::get('/devices/{id}', 'DeviceController@show')->middleware('auth');
Route::post('/devices', 'DeviceController@store')->middleware('auth');
Route::put('/devices/{id}', 'DeviceController@update')->middleware('auth');
Route::delete('/devices/{id}', 'DeviceController@destroy')->middleware('auth');
Route::post('/devices/{id}/generate-qrcode', 'DeviceController@generateQrcode')->middleware('auth');
Route::get('/devices/export', 'DeviceController@export')->middleware('auth');
Route::post('/devices/import', 'DeviceController@import')->middleware('auth');
Route::get('/devices/import-template', 'DeviceController@importTemplate')->middleware('auth');

// 业务员相关路由
Route::get('/agents', 'AgentController@index')->middleware('auth');
Route::get('/agents/{id}', 'AgentController@show')->middleware('auth');
Route::post('/agents', 'AgentController@store')->middleware('auth');
Route::put('/agents/{id}', 'AgentController@update')->middleware('auth');
Route::delete('/agents/{id}', 'AgentController@destroy')->middleware('auth');
Route::get('/agents/{id}/performance', 'AgentController@performance')->middleware('auth');

// 报表相关路由
Route::get('/reports/revenue', 'ReportController@revenue')->middleware('auth');
Route::get('/reports/user-growth', 'ReportController@userGrowth')->middleware('auth');
Route::get('/reports/package-distribution', 'ReportController@packageDistribution')->middleware('auth');
Route::get('/reports/agent-performance', 'ReportController@agentPerformance')->middleware('auth');
Route::get('/reports/export', 'ReportController@export')->middleware('auth');

// 系统设置相关路由
Route::get('/settings', 'SettingController@index')->middleware('auth');
Route::put('/settings', 'SettingController@update')->middleware('auth');
Route::post('/settings/backup', 'SettingController@backup')->middleware('auth');
Route::get('/settings/backup-list', 'SettingController@backupList')->middleware('auth');
Route::post('/settings/restore', 'SettingController@restore')->middleware('auth');

// 管理员相关路由
Route::get('/admins', 'AdminController@index')->middleware('auth');
Route::get('/admins/{id}', 'AdminController@show')->middleware('auth');
Route::post('/admins', 'AdminController@store')->middleware('auth');
Route::put('/admins/{id}', 'AdminController@update')->middleware('auth');
Route::delete('/admins/{id}', 'AdminController@destroy')->middleware('auth');
Route::post('/admins/{id}/reset-password', 'AdminController@resetPassword')->middleware('auth');

// 日志相关路由
Route::get('/logs/operation', 'LogController@operation')->middleware('auth');
Route::get('/logs/login', 'LogController@login')->middleware('auth');
Route::get('/logs/system', 'LogController@system')->middleware('auth');

// 宽带认证API（供外部系统调用）
Route::post('/auth/broadband', 'BroadbandAuthController@authenticate');
Route::post('/auth/broadband/logout', 'BroadbandAuthController@logout');
Route::get('/auth/broadband/check', 'BroadbandAuthController@check');