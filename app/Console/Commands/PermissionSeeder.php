<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Command
{
    // Command signature
    protected $signature = 'permissions:seed';

    // Command description
    protected $description = 'Seed all default permissions into the database';

    public function handle()
    {
        // Define all your permissions here
        $permissions = [
            
            // Payroll
            'generate payroll',
            'view payroll',
            'delete payroll',

            // Roles & Permissions
            'manage roles',
            'manage permissions',

            // Users
            'create user',
            'edit user',
            'delete user',
            'view user',

            // Users
            'create attendace',
            'delete attendance',
            'view attendance',
            'view overtime',

            'government deduction',
            'schedule',
            'home',
            'view division',
            'view positions',
            'view departments',

            // employee
            'create employee',
            'edit employee',
            'view employee',
            'add salary',
            'add allowance',
            'view employee deduction',

            // payroll
            'generate payroll',
            'paid payroll',
            'cancel payroll',
            'print payroll',
            'view payroll earnings',
        ];

        $bar = $this->output->createProgressBar(count($permissions));
        $bar->start();

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
            $bar->advance();
        }

        $bar->finish();
        $this->info("\nPermissions seeded successfully!");
    }
}
