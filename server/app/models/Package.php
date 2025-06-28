<?php

namespace App\Models;

use StartMVC\Model;

class Package extends Model
{
    /**
     * 表名
     *
     * @var string
     */
    protected $table = 'packages';

    /**
     * 可批量赋值的属性
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'price',
        'duration',
        'bandwidth',
        'description',
        'status'
    ];

    /**
     * 自动转换的字段
     *
     * @var array
     */
    protected $casts = [
        'price' => 'float',
        'duration' => 'integer',
        'bandwidth' => 'integer',
        'status' => 'integer',
    ];

    /**
     * 获取与此套餐关联的宽带账号
     *
     * @return \StartMVC\Database\Relations\HasMany
     */
    public function broadbandAccounts()
    {
        return $this->hasMany(BroadbandAccount::class, 'package_id');
    }
}