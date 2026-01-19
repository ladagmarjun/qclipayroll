<?php

use App\Models\Division;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->foreignIdFor(Division::class)->after('id')->nullable();
            $table->string('employee_code')->unique()->after('phone')->nullable();
            $table->decimal('allowance', 10, 2)->nullable();
            $table->string('role')->nullable();
            $table->string('employment_type')->nullable();
            $table->string('employment_status')->nullable();
            $table->string('address')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('suffix')->nullable()->after('middle_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            //
        });
    }
};
