<?php

namespace App\Models;

use StartMVC\Model;

class LoginLog extends Model
{
    /**
     * 表名
     *
     * @var string
     */
    protected $table = 'login_logs';

    /**
     * 可批量赋值的属性
     *
     * @var array
     */
    protected $fillable = [
        'account_id',
        'ip_address',
        'device',
        'location',
        'status',
        'remark'
    ];

    /**
     * 自动转换的字段
     *
     * @var array
     */
    protected $casts = [
        'account_id' => 'integer',
        'status' => 'integer',
    ];

    /**
     * 获取与此登录日志关联的宽带账号
     *
     * @return \StartMVC\Database\Relations\BelongsTo
     */
    public function account()
    {
        return $this->belongsTo(BroadbandAccount::class, 'account_id');
    }

    /**
     * 获取状态文本
     *
     * @return string
     */
    public function getStatusTextAttribute()
    {
        $statusMap = [
            0 => '失败',
            1 => '成功'
        ];

        return $statusMap[$this->status] ?? '未知';
    }

    /**
     * 记录登录日志
     *
     * @param int $accountId
     * @param string $ipAddress
     * @param string $device
     * @param bool $status
     * @param string|null $remark
     * @return LoginLog
     */
    public static function record($accountId, $ipAddress, $device, $status, $remark = null)
    {
        // 尝试获取IP地址对应的地理位置
        $location = self::getLocationByIp($ipAddress);
        
        $log = new self();
        $log->account_id = $accountId;
        $log->ip_address = $ipAddress;
        $log->device = $device;
        $log->location = $location;
        $log->status = $status ? 1 : 0;
        $log->remark = $remark;
        $log->save();
        
        // 如果登录成功，更新账号的最后登录信息
        if ($status) {
            $account = BroadbandAccount::find($accountId);
            if ($account) {
                $account->last_login_time = date('Y-m-d H:i:s');
                $account->last_login_ip = $ipAddress;
                $account->save();
            }
        }
        
        return $log;
    }

    /**
     * 根据IP地址获取地理位置
     *
     * @param string $ip
     * @return string
     */
    private static function getLocationByIp($ip)
    {
        // 这里可以接入第三方IP地址库或API
        // 简单实现，仅作示例
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            if (strpos($ip, '192.168.') === 0 || $ip === '127.0.0.1') {
                return '内网IP';
            }
            
            // 这里可以接入第三方IP地址库或API
            // 例如：高德地图、百度地图、淘宝IP等API
            // 简单返回，实际项目中应该实现真正的IP地址查询
            return '未知地区';
        }
        
        return '无效IP';
    }
}