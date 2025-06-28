<?php

namespace App\Controllers;

use App\Models\User;
use App\Models\Device;
use App\Models\BroadbandAccount;
use App\Models\SalesRecord;
use App\Models\DeviceRepair;
use StartMVC\Controller;
use StartMVC\Http\Request;
use StartMVC\Http\Response;

class DashboardController extends Controller
{
    /**
     * 获取仪表盘统计数据
     *
     * @param Request $request
     * @return Response
     */
    public function statistics(Request $request)
    {
        // 用户统计
        $userTotal = User::count();
        $userActive = User::where('status', 1)->count();
        $userInactive = User::where('status', 0)->count();
        
        $now = date('Y-m-d H:i:s');
        $firstDayOfMonth = date('Y-m-01 00:00:00');
        $firstDayOfWeek = date('Y-m-d 00:00:00', strtotime('monday this week'));
        
        $userNewThisMonth = User::where('created_at', '>=', $firstDayOfMonth)
            ->where('created_at', '<=', $now)
            ->count();
            
        $userNewThisWeek = User::where('created_at', '>=', $firstDayOfWeek)
            ->where('created_at', '<=', $now)
            ->count();
            
        // 设备统计
        $deviceTotal = Device::count();
        $deviceNormal = Device::where('status', 1)->count();
        $deviceLoaned = Device::where('status', 2)->count();
        $deviceRepairing = Device::where('status', 3)->count();
        $deviceScrapped = Device::where('status', 4)->count();
        
        // 设备预警
        $warningDays = (int)$this->getSetting('device_warning_days', 30);
        $warningDate = date('Y-m-d', strtotime("+{$warningDays} days"));
        
        $deviceWarningsCount = Device::where('status', 1)
            ->where(function($query) use ($warningDate) {
                $query->whereRaw("DATE_ADD(purchase_date, INTERVAL warranty_period MONTH) <= ?", [$warningDate]);
            })
            ->count();
            
        // 销售统计
        $currentMonthStart = date('Y-m-01');
        $lastMonthStart = date('Y-m-01', strtotime('-1 month'));
        $lastMonthEnd = date('Y-m-t', strtotime('-1 month'));
        
        $currentMonthSales = SalesRecord::where('sale_date', '>=', $currentMonthStart)
            ->where('sale_date', '<=', $now)
            ->sum('amount');
            
        $lastMonthSales = SalesRecord::where('sale_date', '>=', $lastMonthStart)
            ->where('sale_date', '<=', $lastMonthEnd)
            ->sum('amount');
            
        $salesGrowth = $lastMonthSales > 0 
            ? round((($currentMonthSales - $lastMonthSales) / $lastMonthSales) * 100, 2)
            : 100;
            
        $totalCommission = SalesRecord::sum('commission');
        
        // 在线账号
        $activeAccounts = BroadbandAccount::where('status', 1)->count();
        
        // 即将到期账号
        $expiryDays = 7; // 7天内到期
        $expiryDate = date('Y-m-d H:i:s', strtotime("+{$expiryDays} days"));
        
        $expiringSoon = BroadbandAccount::where('end_time', '<=', $expiryDate)
            ->where('end_time', '>=', $now)
            ->where('status', 1)
            ->count();
            
        return $this->success([
            'users' => [
                'total' => $userTotal,
                'active' => $userActive,
                'inactive' => $userInactive,
                'newThisMonth' => $userNewThisMonth,
                'newThisWeek' => $userNewThisWeek
            ],
            'devices' => [
                'total' => $deviceTotal,
                'normal' => $deviceNormal,
                'loaned' => $deviceLoaned,
                'repairing' => $deviceRepairing,
                'scrapped' => $deviceScrapped,
                'warningCount' => $deviceWarningsCount
            ],
            'sales' => [
                'totalAmount' => SalesRecord::sum('amount'),
                'totalCommission' => $totalCommission,
                'monthlyGrowth' => $salesGrowth
            ],
            'activeAccounts' => $activeAccounts,
            'expiringSoon' => $expiringSoon,
            'deviceWarnings' => $deviceWarningsCount
        ]);
    }
    
    /**
     * 获取系统设置
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    private function getSetting($key, $default = null)
    {
        $setting = \App\Models\Setting::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }
    
    /**
     * 成功响应
     *
     * @param mixed $data
     * @param string $message
     * @param int $status
     * @return Response
     */
    protected function success($data, $message = '操作成功', $status = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $status);
    }
    
    /**
     * 错误响应
     *
     * @param string $message
     * @param int $status
     * @return Response
     */
    protected function error($message, $status = 400)
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], $status);
    }
}