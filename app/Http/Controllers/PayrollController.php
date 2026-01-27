<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Inertia\Inertia;
use App\Models\Payroll;
use App\Models\Employee;
use App\Models\Overtime;
use App\Models\PayrollDeduction;
use App\Models\PayrollItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PayrollController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payrolls = Payroll::get();
        return Inertia::render('payroll/Index', [
            'payrolls' => $payrolls
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
        $request->validate([
            'period_start' => 'required|date',
            'period_end'   => 'required|date|after_or_equal:period_start',
            'pay_date'     => 'required|date',
            'apply_deductions' => 'required|boolean',
        ]);

        DB::transaction(function () use ($request) {

            $payroll = Payroll::create([
                'payroll_code' => 'PR-' . now()->format('YmdHis'),
                'period_start' => $request->period_start,
                'period_end'   => $request->period_end,
                'pay_date'     => $request->pay_date,
                'status'       => 'draft',
                'apply_deductions' => $request->apply_deductions,
            ]);

            $employees = Employee::whereIn('employment_status', ['probationary', 'regular', 'casual'])->get();
            
            $dateFrom = Carbon::parse($request->period_start);
            $dateTo = Carbon::parse($request->period_end);
            foreach ($employees as $employee) {

                $basicSalary = $employee->salary;

                $dailySalary = $basicSalary;
                $standardHoursPerDay = 8;
                $salaryPerHour = $dailySalary / $standardHoursPerDay;
                $salaryPerMinute = $salaryPerHour / 60;

                $totalAttendanceMinutes = Attendance::where('employee_id', $employee->id)
                    ->where('status', 'Created')
                    ->whereBetween('attendance_date', [$dateFrom, $dateTo])
                    ->sum('total_minutes');

                $totalAttendanceOvertime = Attendance::where('employee_id', $employee->id)
                    ->where('status', 'Created')
                    ->whereBetween('attendance_date', [$dateFrom, $dateTo])
                    ->sum('overtime_minutes');

                $approvedOTMinutes = Overtime::where('employee_id', $employee->id)
                    ->where('status', 'Pending')
                    ->whereBetween('date_from', [$dateFrom, $dateTo])
                    ->sum('minutes_duration');

                $totalAttendance = $totalAttendanceMinutes - $totalAttendanceOvertime;
                $totalOvertime = $approvedOTMinutes + $totalAttendanceOvertime;
                $attendancePay = ($totalAttendance) * $salaryPerMinute;
                $overtimePay = ($totalOvertime) * ($salaryPerMinute);

                $grossPay = $attendancePay + $overtimePay;

                $totalDeductions = 0;

                if ($totalAttendanceMinutes > 0 || $approvedOTMinutes >0 ) {
                    $payrollItem = PayrollItem::create([
                        'payroll_id' => $payroll->id,
                        'employee_id' => $employee->id,
                        'basic_salary' => $basicSalary,
                        'total_attendance' => $totalAttendance,
                        'total_overtime' => $overtimePay,
                        'gross_pay'        => round($grossPay, 2),
                        'total_deductions' => round($totalDeductions, 2),
                        'net_pay'          => round($grossPay, 2),
                    ]);

                    $totalDeductions = 0;

                    if ($request->boolean('apply_deductions')) {
                        $totalDeductions = $this->calculateDeductions(
                            $employee,
                            $payrollItem, 
                            Carbon::parse($payroll->payroll_date)
                        );
                    }

                    $netPay = max(0, $grossPay - $totalDeductions);

                    $payrollItem->update([
                        'total_deductions' => round($totalDeductions, 2),
                        'net_pay'          => round($netPay, 2),
                    ]);
                }
            }
        });

        return redirect()->route('payrolls.index')
            ->with('success', 'Payroll generated successfully.');

    }

    private function calculateDeductions(
        Employee $employee,
        PayrollItem $payrollItem,
        Carbon $payrollDate
        ): float
    {
        $deductions = 0;
        
        $payrollMonth = (int) $payrollDate->format('n');

        foreach ($employee->governmentDeductions as $deduction) {

            if (! $deduction->is_active) continue;

            if ($deduction->start_date > $payrollDate) continue;

            if ($deduction->end_date && $deduction->end_date < $payrollDate) continue;  

            if (! in_array($payrollMonth, $deduction->apply_months)) continue;

            $amount = $deduction->monthly_amount * $deduction->monthly_covered;

            PayrollDeduction::create([
                'payroll_item_id' => $payrollItem->id,
                'type'             => $deduction->governmentDeduction->name,
                'amount'           => $amount,
                'source'           => $deduction->deduction->code,
            ]);

            $totalDeductions += $amount;
        }

        if ($employee->loan_balance > 0) {
            $deductions += min($employee->loan_monthly, $employee->loan_balance);
        }

        return $deductions;
    }

    /**
     * Display the specified resource.
     */
    public function show(Payroll $payroll)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payroll $payroll)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payroll $payroll)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payroll $payroll)
    {
        //
    }
}
