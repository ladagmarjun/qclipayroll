<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
    
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function earnings(): HasMany
    {
        return $this->hasMany(PayrollEarning::class);
    }
    
    public function deductions(): HasMany
    {
        return $this->hasMany(PayrollDeduction::class);
    }
}
