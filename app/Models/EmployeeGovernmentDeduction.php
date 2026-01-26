<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeGovernmentDeduction extends Model
{
    protected $fillable = [
        'employee_id',
        'government_deduction_id',
        'monthly_amount',
        'monthly_covered',
        'start_date',
        'end_date',
        'is_active',
        'apply_months',
    ];
    
    protected $casts = [
        'apply_months' => 'array',
        'start_date' => 'date',
    ];
    
    public function deduction(): BelongsTo
    {
        return $this->belongsTo(GovernmentDeduction::class, 'government_deduction_id', 'id');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
