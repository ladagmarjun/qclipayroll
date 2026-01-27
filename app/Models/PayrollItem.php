<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollItem extends Model
{
    protected $fillable = [
        'payroll_id',
        'employee_id',
        'basic_salary',
        'gross_pay',
        'total_deductions',
        'total_attendance',
        'total_overtime',
        'net_pay',
        'total_attendance',
        'total_overtime',
    ];
}
