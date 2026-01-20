<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Division;
use App\Models\Employee;
use App\Models\Position;
use App\Models\Department;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = Employee::paginate(10);
        $employeeCode = 'EMP-' . str_pad(Employee::count() + 1, 5, '0', STR_PAD_LEFT);

        return Inertia::render('employee/Index', [
            'employees' => $employees,
            'divisions' => Division::all(),
            'departments' => Department::all(),
            'positions' => Position::all(),
            'employeeCode' => $employeeCode,
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
    public function store(StoreEmployeeRequest $request)
    {
        $email = $request->email;

        if ($email) {
            $existingUser = User::where('email', $email)->first();
            if ($existingUser) {
                // Handle the case where the user already exists
                // You might want to return an error or link the employee to this user
                return;
            }
        } else {
            $email = $request->first_name . '.' . $request->last_name . '@example.com';
        }
        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $email,
            'password' => bcrypt('123456789'),
        ]);

        $request->merge(['user_id' => $user->id]);
        Employee::create($request->all());

    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $employee->update($request->all());

        return redirect()->route('employees.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        //
    }
}
