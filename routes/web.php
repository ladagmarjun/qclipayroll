<?php

use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\OvertimeController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeLoanController;
use App\Http\Controllers\GovernmentDeductionController;
use App\Http\Controllers\EmployeeGovernmentDeductionController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('positions', PositionController::class);
    Route::resource('divisions', DivisionController::class);
    Route::resource('departments', DepartmentController::class);
    Route::resource('employees', EmployeeController::class);
    Route::resource('schedules', ScheduleController::class);
    Route::resource('attendances', AttendanceController::class);
    Route::resource('overtimes', OvertimeController::class);
    Route::resource('loanmanagements', EmployeeLoanController::class);
    Route::resource('governmentdeductions', GovernmentDeductionController::class);
    Route::resource('employeegovernmentdeductions', EmployeeGovernmentDeductionController::class);
    Route::resource('payrolls', PayrollController::class);

    Route::patch('/payrolls/{payroll}/paid', [PayrollController::class, 'markAsPaid'])
        ->name('payrolls.markPaid');

    Route::patch('/payrolls/{payroll}/cancel', [PayrollController::class, 'cancel'])
        ->name('payrolls.cancel');
    });

    Route::get('/payrolls/{payroll}/print', [PayrollController::class, 'export'])
        ->name('payrolls.print');

    Route::middleware(['auth', 'can:manage roles'])->group(function () {
        Route::get('/roles', [RolesController::class, 'index'])->name('roles.index');
        Route::post('/roles', [RolesController::class, 'store'])->name('roles.store');
        Route::patch('/roles/{role}', [RolesController::class, 'update'])->name('roles.update');
        Route::delete('/roles/{role}', [RolesController::class, 'destroy'])->name('roles.destroy');
    });

require __DIR__.'/settings.php';
