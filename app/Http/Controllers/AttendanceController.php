<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Schedule;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attendances = Attendance::with('employee')->paginate(10);
        $employees = Employee::with('schedules.schedule')->get();

        return inertia('attendance/Index', [
            'attendances' => $attendances,
            'employees' => $employees,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        foreach ($request->attendances as $attendanceData) {
            $late = 0;
            $undertime = 0;

            $schedule = Schedule::find($attendanceData['schedule_id']);

            if ($schedule) {
                $scheduledTimeIn = strtotime($attendanceData['date'] . ' ' . $schedule->time_in);
                $actualTimeIn = strtotime($attendanceData['date'] . ' ' . $attendanceData['time_in']);

                if ($actualTimeIn > $scheduledTimeIn) {
                    $late = ($actualTimeIn - $scheduledTimeIn) / 60;
                }

                $scheduledTimeOut = strtotime($attendanceData['date'] . ' ' . $schedule->time_out);
                $actualTimeOut = strtotime($attendanceData['date'] . ' ' . $attendanceData['time_out']);

                if ($actualTimeOut < $scheduledTimeOut) {
                    $undertime = ($scheduledTimeOut - $actualTimeOut) / 60;
                }
            }

            Attendance::create([
                'employee_id' => $attendanceData['employee_id'],
                'schedule_id' => $attendanceData['schedule_id'],
                'attendance_date' => $attendanceData['date'],
                'time_in_actual' => $attendanceData['time_in'],
                'time_out_actual' => $attendanceData['time_out'],
                'overtime_minutes' => $attendanceData['overtime'],
                'late_minutes' => $late,
                'undertime_minutes' => $undertime,
                'status' => 'Created',
            ]);
        }

        return redirect()->back()->with('success', 'Attendance record added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendance $attendance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attendance $attendance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        //
    }
}
