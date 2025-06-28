<?php

namespace App\Controllers;

use App\Models\BroadbandAccount;
use App\Models\User;
use App\Models\Package;
use App\Models\LoginLog;
use StartMVC\Controller;
use StartMVC\Http\Request;
use StartMVC\Http\Response;
use StartMVC\Helpers\Str;

class AccountController extends Controller
{
    /**
     * 获取宽带账号列表
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 10);
        $search = $request->get('search', '');
        $status = $request->get('status', null);
        $packageId = $request->get('package_id', null);
        $startDate = $request->get('start_date', null);
        $endDate = $request->get('end_date', null);

        $query = BroadbandAccount::query()
            ->with(['user', 'package']);

        if (!empty($search)) {
            $query->where('account', 'LIKE', "%{$search}%");
        }

        if ($status !== null) {
            $query->where('status', $status);
        }

        if ($packageId !== null) {
            $query->where('package_id', $packageId);
        }

        if ($startDate !== null && $endDate !== null) {
            $query->whereBetween('end_time', [$startDate, $endDate]);
        }

        $total = $query->count();
        $accounts = $query->offset(($page - 1) * $limit)
            ->limit($limit)
            ->orderBy('id', 'DESC')
            ->get();

        return $this->success([
            'data' => $accounts,
            'total' => $total,
            'page' => (int)$page,
            'limit' => (int)$limit,
            'totalPages' => ceil($total / $limit)
        ]);
    }

    /**
     * 获取单个宽带账号信息
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function show(Request $request, $id)
    {
        $account = BroadbandAccount::with(['user', 'package'])->find($id);

        if (!$account) {
            return $this->error('宽带账号不存在', 404);
        }

        // 获取最近的登录记录
        $loginLogs = LoginLog::where('account_id', $id)
            ->orderBy('created_at', 'DESC')
            ->limit(10)
            ->get();

        $account->login_logs = $loginLogs;

        return $this->success($account);
    }

    /**
     * 创建宽带账号
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'user_id' => 'required|exists:users,id',
            'package_id' => 'required|exists:packages,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'status' => 'required|in:0,1',
            'remark' => 'nullable|string'
        ]);

        // 检查用户是否存在
        $user = User::find($request->input('user_id'));
        if (!$user) {
            return $this->error('用户不存在', 404);
        }

        // 检查套餐是否存在
        $package = Package::find($request->input('package_id'));
        if (!$package) {
            return $this->error('套餐不存在', 404);
        }

        // 生成账号和密码
        $account = $this->generateAccount();
        $password = $this->generatePassword();

        $broadbandAccount = new BroadbandAccount();
        $broadbandAccount->user_id = $request->input('user_id');
        $broadbandAccount->package_id = $request->input('package_id');
        $broadbandAccount->account = $account;
        $broadbandAccount->password = password_hash($password, PASSWORD_DEFAULT);
        $broadbandAccount->start_time = $request->input('start_time');
        $broadbandAccount->end_time = $request->input('end_time');
        $broadbandAccount->status = $request->input('status', 1);
        $broadbandAccount->remark = $request->input('remark');
        $broadbandAccount->save();

        // 返回账号和明文密码（仅在创建时返回）
        $broadbandAccount->password = $password;

        return $this->success($broadbandAccount, '宽带账号创建成功', 201);
    }

    /**
     * 更新宽带账号
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        $account = BroadbandAccount::find($id);

        if (!$account) {
            return $this->error('宽带账号不存在', 404);
        }

        $this->validate($request, [
            'user_id' => 'required|exists:users,id',
            'package_id' => 'required|exists:packages,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'status' => 'required|in:0,1',
            'remark' => 'nullable|string'
        ]);

        $account->user_id = $request->input('user_id');
        $account->package_id = $request->input('package_id');
        $account->start_time = $request->input('start_time');
        $account->end_time = $request->input('end_time');
        $account->status = $request->input('status');
        $account->remark = $request->input('remark');
        $account->save();

        return $this->success($account, '宽带账号更新成功');
    }

    /**
     * 删除宽带账号
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function destroy(Request $request, $id)
    {
        $account = BroadbandAccount::find($id);

        if (!$account) {
            return $this->error('宽带账号不存在', 404);
        }

        // 删除关联的登录日志
        LoginLog::where('account_id', $id)->delete();

        $account->delete();

        return $this->success(null, '宽带账号删除成功');
    }

    /**
     * 重置宽带账号密码
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function resetPassword(Request $request, $id)
    {
        $account = BroadbandAccount::find($id);

        if (!$account) {
            return $this->error('宽带账号不存在', 404);
        }

        // 生成新密码
        $password = $this->generatePassword();
        $account->password = password_hash($password, PASSWORD_DEFAULT);
        $account->save();

        return $this->success(['password' => $password], '密码重置成功');
    }

    /**
     * 获取账号统计信息
     *
     * @param Request $request
     * @return Response
     */
    public function statistics(Request $request)
    {
        // 总账号数
        $totalAccounts = BroadbandAccount::count();
        
        // 活跃账号数（状态为正常）
        $activeAccounts = BroadbandAccount::where('status', 1)->count();
        
        // 即将到期账号数（7天内到期）
        $expiringDate = date('Y-m-d', strtotime('+7 days'));
        $expiringAccounts = BroadbandAccount::where('end_time', '<=', $expiringDate)
            ->where('end_time', '>=', date('Y-m-d'))
            ->where('status', 1)
            ->count();
        
        // 已到期账号数
        $expiredAccounts = BroadbandAccount::where('end_time', '<', date('Y-m-d'))
            ->count();
        
        // 今日新增账号数
        $todayNewAccounts = BroadbandAccount::where('created_at', '>=', date('Y-m-d'))
            ->count();
        
        // 今日登录账号数
        $todayLoginAccounts = LoginLog::where('created_at', '>=', date('Y-m-d'))
            ->distinct('account_id')
            ->count('account_id');
        
        return $this->success([
            'total' => $totalAccounts,
            'active' => $activeAccounts,
            'expiring' => $expiringAccounts,
            'expired' => $expiredAccounts,
            'today_new' => $todayNewAccounts,
            'today_login' => $todayLoginAccounts
        ]);
    }

    /**
     * 生成唯一账号
     *
     * @return string
     */
    private function generateAccount()
    {
        $prefix = 'BB';
        $length = 8;
        
        do {
            $account = $prefix . Str::random($length, '0123456789');
            $exists = BroadbandAccount::where('account', $account)->exists();
        } while ($exists);
        
        return $account;
    }

    /**
     * 生成随机密码
     *
     * @return string
     */
    private function generatePassword()
    {
        return Str::random(8);
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