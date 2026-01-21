<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'employee_id',
        'schedule_id',
        'attendance_date',
        'time_in_actual',
        'time_out_actual',
        'late_minutes',
        'undertime_minutes',
        'overtime_minutes',
        'status',
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
