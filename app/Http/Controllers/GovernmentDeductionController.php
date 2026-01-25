<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\GovernmentDeduction;

class GovernmentDeductionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $governmentDeductions = GovernmentDeduction::paginate(10);

        return Inertia::render('governementdeduction/Index', [
            'governmentDeductions' => $governmentDeductions
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
            'name' => 'required|string|max:255',
            'code' => 'nullable|string',
        ]);

        GovernmentDeduction::create($request->all());

        return redirect()->back()->with('success', 'Government Deduction created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(GovernmentDeduction $governmentDeduction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GovernmentDeduction $governmentDeduction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GovernmentDeduction $governmentdeduction)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string',
        ]);

        $governmentdeduction->update($request->all());

        return redirect()->back()->with('success', 'Government Deduction updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GovernmentDeduction $governmentDeduction)
    {
        //
    }
}
