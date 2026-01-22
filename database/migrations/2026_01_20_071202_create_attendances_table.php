<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();

            $table->foreignId('employee_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->time('time_in')->nullable();
            $table->time('time_out')->nullable();

            $table->date('attendance_date');

            $table->time('time_in_actual')->nullable();
            $table->time('time_out_actual')->nullable();

            $table->integer('late_minutes')->default(0);
            $table->integer('undertime_minutes')->default(0);
            $table->integer('overtime_minutes')->default(0);
            $table->integer('break_time_minutes')->default(0);
            $table->integer('total_minutes')->default(0);

            $table->text('remarks')->nullable();
            $table->string('status')->default('Present');
            $table->timestamps();

            $table->unique(
                ['employee_id', 'attendance_date'],
                'employee_attendance_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
