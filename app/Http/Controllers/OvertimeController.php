<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Employee;
use App\Models\Overtime;
use Illuminate\Http\Request;
use App\Http\Resources\OvertimeResource;

class OvertimeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Overtime::with('employee');

        if (isset($request->employeeId) && $request->employeeId != "") {
            $query = $query->where('employee_id', $request->employeeId);
        }
        
        $overtimes =   $query->where('status', 'Pending')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Overtimes/Index', [
            'overtimes' => OvertimeResource::collection($overtimes),
            'employees' => Employee::select('id', 'first_name', 'last_name')->get(),
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
            'date_from' => 'required|date',
            'date_to' => 'required|date|after:date_from',
            'remarks' => 'nullable|string',
        ]);

        $minutes = Carbon::parse($data['date_from'])
            ->diffInMinutes(Carbon::parse($data['date_to']));

        Overtime::create([
            ...$data,
            'minutes_duration' => $minutes,
            'status' => 'Pending',
        ]);

        return redirect()->back()->with('success', 'Overtime added');
    }

    /**
     * Display the specified resource.
     */
    public function show(Overtime $overtime)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Overtime $overtime)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Overtime $overtime)
    {
        $data = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date_from' => 'required|date',
            'date_to' => 'required|date|after:date_from',
            'remarks' => 'nullable|string',
            'status' => 'required|string',
        ]);

        $minutes = Carbon::parse($data['date_from'])
            ->diffInMinutes(Carbon::parse($data['date_to']));

        $overtime->update([
            'employee_id' => $data['employee_id'],
            'date_from' => $data['date_from'],
            'date_to' => $data['date_to'],
            'minutes_duration' => $minutes,
            'remarks' => $data['remarks'],
            'status' => $data['status'],
        ]);

        return redirect()->route('overtimes.index')->with('success', 'Overtime updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Overtime $overtime)
    {
        //
    }
}
