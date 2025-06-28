<?php

namespace App\Models;

use StartMVC\Model;

class BroadbandAccount extends Model
{
    /**
     * 表名
     *
     * @var string
     */
    protected $table = 'broadband_accounts';

    /**
     * 可批量赋值的属性
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'package_id',
        'account',
        'password',
        'start_time',
        'end_time',
        'status',
        'last_login_time',
        'last_login_ip',
        'remark'
    ];

    /**
     * 隐藏的属性
     *
     * @var array
     */
    protected $hidden = [
        'password'
    ];

    /**
     * 自动转换的字段
     *
     * @var array
     */
    protected $casts = [
        'user_id' => 'integer',
        'package_id' => 'integer',
        'status' => 'integer',
    ];

    /**
     * 获取与此宽带账号关联的用户
     *
     * @return \StartMVC\Database\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * 获取与此宽带账号关联的套餐
     *
     * @return \StartMVC\Database\Relations\BelongsTo
     */
    public function package()
    {
        return $this->belongsTo(Package::class, 'package_id');
    }

    /**
     * 获取与此宽带账号关联的登录日志
     *
     * @return \StartMVC\Database\Relations\HasMany
     */
    public function loginLogs()
    {
        return $this->hasMany(LoginLog::class, 'account_id');
    }

    /**
     * 获取状态文本
     *
     * @return string
     */
    public function getStatusTextAttribute()
    {
        $statusMap = [
            0 => '禁用',
            1 => '正常',
            2 => '即将到期',
            3 => '已到期'
        ];

        return $statusMap[$this->status] ?? '未知';
    }

    /**
     * 检查账号是否已到期
     *
     * @return bool
     */
    public function isExpired()
    {
        return strtotime($this->end_time) < time();
    }

    /**
     * 检查账号是否即将到期（7天内）
     *
     * @return bool
     */
    public function isExpiring()
    {
        $expiringDate = strtotime('+7 days');
        $endTime = strtotime($this->end_time);
        
        return $endTime <= $expiringDate && $endTime >= time();
    }

    /**
     * 更新账号状态
     *
     * @return void
     */
    public function updateStatus()
    {
        if ($this->isExpired()) {
            $this->status = 3; // 已到期
        } elseif ($this->isExpiring()) {
            $this->status = 2; // 即将到期
        }
        
        $this->save();
    }
}