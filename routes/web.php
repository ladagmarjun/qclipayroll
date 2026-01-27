<?php

use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeGovernmentDeductionController;
use App\Http\Controllers\EmployeeLoanController;
use App\Http\Controllers\GovernmentDeductionController;
use App\Http\Controllers\OvertimeController;
use App\Http\Controllers\PayrollController;

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
    Route::post('payrolls/{id}/pay', [PayrollController::class, 'pay'])->name('payrolls.pay');
});

require __DIR__.'/settings.php';
