<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'division_id',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PayrollItem::class);
    }

    public function deductions(): HasMany
    {
        return $this->hasMany(PayrollDeduction::class);
    }

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

}
