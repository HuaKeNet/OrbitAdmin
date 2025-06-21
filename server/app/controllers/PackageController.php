<?php

namespace App\Controllers;

use App\Models\Package;
use App\Models\BroadbandAccount;
use StartMVC\Controller;
use StartMVC\Http\Request;
use StartMVC\Http\Response;

class PackageController extends Controller
{
    /**
     * 获取套餐列表
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

        $query = Package::query();

        if (!empty($search)) {
            $query->where('name', 'LIKE', "%{$search}%");
        }

        if ($status !== null) {
            $query->where('status', $status);
        }

        $total = $query->count();
        $packages = $query->offset(($page - 1) * $limit)
            ->limit($limit)
            ->orderBy('id', 'DESC')
            ->get();

        return $this->success([
            'data' => $packages,
            'total' => $total,
            'page' => (int)$page,
            'limit' => (int)$limit,
            'totalPages' => ceil($total / $limit)
        ]);
    }

    /**
     * 获取单个套餐信息
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function show(Request $request, $id)
    {
        $package = Package::find($id);

        if (!$package) {
            return $this->error('套餐不存在', 404);
        }

        return $this->success($package);
    }

    /**
     * 创建套餐
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|unique:packages,name',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'bandwidth' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'status' => 'required|in:0,1'
        ]);

        $package = new Package();
        $package->name = $request->input('name');
        $package->price = $request->input('price');
        $package->duration = $request->input('duration');
        $package->bandwidth = $request->input('bandwidth');
        $package->description = $request->input('description');
        $package->status = $request->input('status', 1);
        $package->save();

        return $this->success($package, '套餐创建成功', 201);
    }

    /**
     * 更新套餐信息
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        $package = Package::find($id);

        if (!$package) {
            return $this->error('套餐不存在', 404);
        }

        $this->validate($request, [
            'name' => 'required|unique:packages,name,' . $id,
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'bandwidth' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'status' => 'required|in:0,1'
        ]);

        $package->name = $request->input('name');
        $package->price = $request->input('price');
        $package->duration = $request->input('duration');
        $package->bandwidth = $request->input('bandwidth');
        $package->description = $request->input('description');
        $package->status = $request->input('status');
        $package->save();

        return $this->success($package, '套餐更新成功');
    }

    /**
     * 删除套餐
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function destroy(Request $request, $id)
    {
        $package = Package::find($id);

        if (!$package) {
            return $this->error('套餐不存在', 404);
        }

        // 检查套餐是否有关联的宽带账号
        $accountCount = BroadbandAccount::where('package_id', $id)->count();
        if ($accountCount > 0) {
            return $this->error('该套餐有关联的宽带账号，无法删除', 400);
        }

        $package->delete();

        return $this->success(null, '套餐删除成功');
    }

    /**
     * 获取套餐分布数据
     *
     * @param Request $request
     * @return Response
     */
    public function distribution(Request $request)
    {
        // 获取所有套餐
        $packages = Package::all();
        
        // 获取每个套餐的用户数量
        $userPackages = [];
        $distributionData = [];
        
        foreach ($packages as $package) {
            $userCount = BroadbandAccount::where('package_id', $package->id)->count();
            
            $userPackages[] = [
                'package_id' => $package->id,
                'package_name' => $package->name,
                'user_count' => $userCount
            ];
            
            $distributionData[] = [
                'name' => $package->name,
                'count' => $userCount,
                'percentage' => 0 // 先初始化为0，后面计算
            ];
        }
        
        // 计算百分比
        $totalUsers = array_sum(array_column($userPackages, 'user_count'));
        
        if ($totalUsers > 0) {
            foreach ($distributionData as &$item) {
                $item['percentage'] = round(($item['count'] / $totalUsers) * 100, 2);
            }
        }
        
        return $this->success([
            'distribution' => $distributionData,
            'userPackages' => $userPackages,
            'totalUsers' => $totalUsers
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