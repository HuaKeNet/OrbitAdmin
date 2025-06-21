<?php

namespace App\Controllers;

use App\Models\User;
use App\Models\BroadbandAccount;
use StartMVC\Controller;
use StartMVC\Http\Request;
use StartMVC\Http\Response;

class UserController extends Controller
{
    /**
     * 获取用户列表
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

        $query = User::query();

        if (!empty($search)) {
            $query->where('username', 'LIKE', "%{$search}%")
                ->orWhere('real_name', 'LIKE', "%{$search}%")
                ->orWhere('phone', 'LIKE', "%{$search}%");
        }

        if ($status !== null) {
            $query->where('status', $status);
        }

        $total = $query->count();
        $users = $query->offset(($page - 1) * $limit)
            ->limit($limit)
            ->orderBy('id', 'DESC')
            ->get();

        return $this->success([
            'data' => $users,
            'total' => $total,
            'page' => (int)$page,
            'limit' => (int)$limit,
            'totalPages' => ceil($total / $limit)
        ]);
    }

    /**
     * 获取单个用户信息
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function show(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->error('用户不存在', 404);
        }

        // 获取用户的宽带账号
        $accounts = BroadbandAccount::where('user_id', $id)
            ->with(['package'])
            ->get();

        $user->accounts = $accounts;

        return $this->success($user);
    }

    /**
     * 创建用户
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'username' => 'required|unique:users,username',
            'password' => 'required|min:6',
            'real_name' => 'required',
            'phone' => 'required',
            'address' => 'required',
            'id_card' => 'required'
        ]);

        $user = new User();
        $user->username = $request->input('username');
        $user->password = password_hash($request->input('password'), PASSWORD_DEFAULT);
        $user->real_name = $request->input('real_name');
        $user->phone = $request->input('phone');
        $user->address = $request->input('address');
        $user->id_card = $request->input('id_card');
        $user->status = $request->input('status', 1);
        $user->save();

        return $this->success($user, '用户创建成功', 201);
    }

    /**
     * 更新用户信息
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->error('用户不存在', 404);
        }

        $this->validate($request, [
            'username' => 'required|unique:users,username,' . $id,
            'real_name' => 'required',
            'phone' => 'required',
            'address' => 'required',
            'id_card' => 'required'
        ]);

        $user->username = $request->input('username');
        if ($request->has('password') && !empty($request->input('password'))) {
            $user->password = password_hash($request->input('password'), PASSWORD_DEFAULT);
        }
        $user->real_name = $request->input('real_name');
        $user->phone = $request->input('phone');
        $user->address = $request->input('address');
        $user->id_card = $request->input('id_card');
        $user->status = $request->input('status', $user->status);
        $user->save();

        return $this->success($user, '用户更新成功');
    }

    /**
     * 删除用户
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function destroy(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->error('用户不存在', 404);
        }

        // 检查用户是否有关联的宽带账号
        $accountCount = BroadbandAccount::where('user_id', $id)->count();
        if ($accountCount > 0) {
            return $this->error('该用户有关联的宽带账号，无法删除', 400);
        }

        $user->delete();

        return $this->success(null, '用户删除成功');
    }

    /**
     * 导入用户
     *
     * @param Request $request
     * @return Response
     */
    public function import(Request $request)
    {
        if (!$request->hasFile('file')) {
            return $this->error('请上传文件', 400);
        }

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();

        if ($extension !== 'csv' && $extension !== 'xlsx') {
            return $this->error('只支持CSV或XLSX格式的文件', 400);
        }

        // 处理文件上传和导入逻辑
        $path = $file->store('imports');

        // 假设这里有一个导入服务来处理导入逻辑
        $importService = new \App\Services\ImportService();
        $result = $importService->importUsers($path);

        return $this->success($result, '用户导入完成');
    }

    /**
     * 导出用户
     *
     * @param Request $request
     * @return Response
     */
    public function export(Request $request)
    {
        $search = $request->get('search', '');
        $status = $request->get('status', null);

        $query = User::query();

        if (!empty($search)) {
            $query->where('username', 'LIKE', "%{$search}%")
                ->orWhere('real_name', 'LIKE', "%{$search}%")
                ->orWhere('phone', 'LIKE', "%{$search}%");
        }

        if ($status !== null) {
            $query->where('status', $status);
        }

        $users = $query->orderBy('id', 'DESC')->get();

        // 假设这里有一个导出服务来处理导出逻辑
        $exportService = new \App\Services\ExportService();
        $file = $exportService->exportUsers($users);

        return response()->download($file, 'users.xlsx');
    }

    /**
     * 获取用户统计数据
     *
     * @param Request $request
     * @return Response
     */
    public function statistics(Request $request)
    {
        $total = User::count();
        $active = User::where('status', 1)->count();
        $inactive = User::where('status', 0)->count();

        $now = date('Y-m-d H:i:s');
        $firstDayOfMonth = date('Y-m-01 00:00:00');
        $firstDayOfWeek = date('Y-m-d 00:00:00', strtotime('monday this week'));

        $newThisMonth = User::where('created_at', '>=', $firstDayOfMonth)
            ->where('created_at', '<=', $now)
            ->count();

        $newThisWeek = User::where('created_at', '>=', $firstDayOfWeek)
            ->where('created_at', '<=', $now)
            ->count();

        return $this->success([
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive,
            'newThisMonth' => $newThisMonth,
            'newThisWeek' => $newThisWeek
        ]);
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