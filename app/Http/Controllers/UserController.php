<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Division;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

    public function index()
    {
        return Inertia::render('users/Index', [
            'users' => User::with(['roles', 'division'])->get(),
        ]);
    }
    
    public function create()
    {
        return Inertia::render('users/Create', [
            'roles' => Role::select('id', 'name')->get(),
            'divisions' => Division::select('id', 'name')->get(),
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('users/Edit', [
            'user' => $user->load('roles'),
            'roles' => Role::select('id', 'name')->get(),
            'divisions' => Division::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|exists:roles,name',
            'division_id' => 'required|exists:divisions,id',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'division_id' => $request->division_id,
        ]);

        $user->syncRoles([$request->role]);

        return redirect()
            ->route('users.index')
            ->with('success', 'User updated successfully.');
    }

}
