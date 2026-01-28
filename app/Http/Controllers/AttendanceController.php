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
    public function index(Request $request)
    {
        $query = Attendance::with('employee', 'schedule');

        if (isset($request->employeeId) && $request->employeeId != "") {
            $query = $query->where('employee_id', $request->employeeId);
        }
        
        $attendances = $query->paginate(20)
            ->withQueryString();
        $employees = Employee::with('schedules.schedule')->get();

        return inertia('attendance/Index', [
            'attendances' => $attendances,
            'employees' => $employees,
            'filters' => [
                'employeeId' => $request->employeeId,
            ],
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

            $actualTimeIn = strtotime($attendanceData['date'] . ' ' . $attendanceData['time_in']);
            $actualTimeOut = strtotime($attendanceData['date'] . ' ' . $attendanceData['time_out']);

            $workedMinutes = 0;
            
            if ($schedule && $actualTimeIn && $actualTimeOut) {

                $scheduledTimeIn = strtotime($attendanceData['date'] . ' ' . $schedule->time_in);
                $scheduledTimeOut = strtotime($attendanceData['date'] . ' ' . $schedule->time_out);

                // Start time: later of scheduled or actual (prevents early-in abuse)
                $startTime = max($actualTimeIn, $scheduledTimeIn);

                // End time: earlier of actual or scheduled (caps overtime)
                $endTime = min($actualTimeOut, $scheduledTimeOut);

                if ($endTime > $startTime) {
                    $workedMinutes = ($endTime - $startTime) / 60;
                }
            }

            $breakTimeMinutes = (int) ($attendanceData['breaktime_minutes'] ?? 0);

            if ($schedule) {
                $scheduledTimeIn = strtotime($attendanceData['date'] . ' ' . $schedule->time_in);
                $scheduledTimeOut = strtotime($attendanceData['date'] . ' ' . $schedule->time_out);

                if ($actualTimeIn > $scheduledTimeIn) {
                    $late = ($actualTimeIn - $scheduledTimeIn) / 60;
                }

                if ($actualTimeOut < $scheduledTimeOut) {
                    $undertime = ($scheduledTimeOut - $actualTimeOut) / 60;
                }
            }

            $totalMinutes =
                $workedMinutes
                - $breakTimeMinutes
                + (int) ($attendanceData['overtime'] ?? 0);

            $totalMinutes = max(0, (int) $totalMinutes);

            Attendance::create([
                'employee_id' => $attendanceData['employee_id'],
                'attendance_date' => $attendanceData['date'],
                
                'time_in' => $schedule->time_in,
                'time_out' => $schedule->time_out,

                'time_in_actual' => $attendanceData['time_in'],
                'time_out_actual' => $attendanceData['time_out'],

                'late_minutes' => (int) $late,
                'undertime_minutes' => (int) $undertime,
                'overtime_minutes' => (int) ($attendanceData['overtime'] ?? 0),

                'break_time_minutes' => $breakTimeMinutes,
                'total_minutes' => $totalMinutes,

                'remarks' => $attendanceData['remarks'] ?? null,
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
        $attendance->delete();

        return redirect()->back()->with('success', 'Successfully deleted');
    }
}
