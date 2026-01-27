<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    protected $fillable = [
        'payroll_code',
        'period_start',
        'period_end',
        'pay_date',
        'status',
        'apply_deductions',
        'paid_at',
    ];
}
