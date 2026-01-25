<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeGovernmentDeduction extends Model
{
    protected $fillable = [
        'employee_id',
        'government_deduction_id',
        'monthly_amount',
        'start_date',
        'end_date',
        'is_active'
    ];
    
    public function deduction()
    {
        return $this->belongsTo(GovernmentDeduction::class);
    }
}
