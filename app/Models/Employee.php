<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends BaseModel
{
    protected $fillable = [
        'user_id',
        'department_id',
        'position_id',
        'first_name',
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
        'suffix'
    ];
}
