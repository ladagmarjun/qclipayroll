<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'employee_id',
        'time_in',
        'time_out',
        'attendance_date',
        'time_in_actual',
        'time_out_actual',
        'late_minutes',
        'undertime_minutes',
        'overtime_minutes',
        'break_time_minutes',
        'total_minutes',
        'remarks',
        'status',
        'payroll_id',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}
