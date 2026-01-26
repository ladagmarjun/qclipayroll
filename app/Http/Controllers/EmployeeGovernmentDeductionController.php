<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\EmployeeGovernmentDeduction;
use App\Models\GovernmentDeduction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeGovernmentDeductionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employeeGovernmentDeductions = EmployeeGovernmentDeduction::with(['employee', 'deduction'])->paginate(10);
        $governmentDeductions = GovernmentDeduction::get();
        $employees = Employee::all();
        return Inertia::render('employeegovernmentdeduction/Index', [
            'employeesdeductions' => $employeeGovernmentDeductions,
            'employees' => $employees,
            'governmentDeductions' => $governmentDeductions,
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

        $data = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'government_deduction_id' => 'required|exists:government_deductions,id',
            'monthly_amount' => 'required|numeric|min:0',
            'monthly_covered' => 'required|numeric|min:1',
            'start_date' => 'required|date',
            'apply_months' => 'required|array|min:1',
            'apply_months.*' => 'integer|between:1,12',
        ]);

        EmployeeGovernmentDeduction::create([
            'employee_id' => $data['employee_id'],
            'government_deduction_id' => $data['government_deduction_id'],
            'monthly_amount' => $data['monthly_amount'],
            'monthly_covered' => $data['monthly_covered'],
            'start_date' => $data['start_date'],
            'apply_months' => $request->apply_months,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Government deduction added successfully.');

    }

    /**
     * Display the specified resource.
     */
    public function show(EmployeeGovernmentDeduction $employeeGovernmentDeduction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EmployeeGovernmentDeduction $employeeGovernmentDeduction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EmployeeGovernmentDeduction $employeegovernmentdeduction)
    {
        if ($employeegovernmentdeduction) {

            $data = $request->validate([
                'employee_id' => 'required|exists:employees,id',
                'government_deduction_id' => 'required|exists:government_deductions,id',
                'monthly_amount' => 'required|numeric|min:0',
                'monthly_covered' => 'required|numeric|min:1',
                'start_date' => 'required|date',
                'apply_months' => 'required|array|min:1',
                'apply_months.*' => 'integer|between:1,12',
            ]);

            $employeegovernmentdeduction->update($data);

            return redirect()->back()->with('success', 'Government deduction updated successfully.');
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmployeeGovernmentDeduction $employeeGovernmentDeduction)
    {
        //
    }
}
