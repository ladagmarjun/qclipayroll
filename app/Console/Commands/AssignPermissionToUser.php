<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Spatie\Permission\Models\Permission;

class AssignPermissionToUser extends Command
{
    // Command signature
    // Example usage: php artisan permission:assign 1 "generate payroll"
    protected $signature = 'permission:assign {user_id} {permission_name}';

    protected $description = 'Assign a specific permission to a user by ID';

    public function handle()
    {
        $userId = $this->argument('user_id');
        $permissionName = $this->argument('permission_name');

        // Find user
        $user = User::find($userId);

        if (!$user) {
            $this->error("User with ID {$userId} not found.");
            return 1;
        }

        // Check if permission exists
        $permission = Permission::firstOrCreate(['name' => $permissionName]);

        // Assign permission to user
        $user->givePermissionTo($permission);

        $this->info("Permission '{$permissionName}' assigned to user ID {$userId} successfully!");
    }
}
