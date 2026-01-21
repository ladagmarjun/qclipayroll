<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends BaseModel
{
    protected $fillable = [
        'user_id',
        'department_id',
        'position_id',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'salary',
        'hired_at',
        'division_id',
        'employee_code',
        'allowance',
        'role',
        'employment_type',
        'employment_status',
        'address',
        'date_of_birth',
        'gender',
        'marital_status',
        'suffix',
        'phone',
    ];

    public function schedules(): HasMany
    {
        return $this->hasMany(EmployeeSchedule::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

}
