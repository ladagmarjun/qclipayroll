<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Division;
use Illuminate\Http\Request;

class DivisionController extends Controller
{
    public function index()
    {
        $divisions = Division::paginate(10);

        return Inertia::render('division/Index', [
            'divisions' => $divisions
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Division::create($request->all());

        return redirect()->back()->with('success', 'Division created successfully.');
    }

    public function update(Request $request, Division $division)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $division->update($request->all());

        return redirect()->back()->with('success', 'Division updated successfully.');
    }
}
