<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Overtime extends Model
{
    protected $fillable = [
        'employee_id',
        'date_from',
        'date_to',
        'minutes_duration',
        'remarks',
        'status',
        'payroll_id',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
