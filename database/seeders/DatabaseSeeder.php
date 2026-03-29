<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $admin = User::updateOrCreate(
            ['email' => 'shahadat.islm.du1@gmail.com'],
            [
                'name' => 'Shahadat Islam',
                'password' => \Illuminate\Support\Facades\Hash::make('sH@h#dat@du1X'),
                'email_verified_at' => now(),
            ]
        );

        // Assign the SuperAdmin role to the admin user
        $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'SuperAdmin']);
        $admin->assignRole($role);
    }
}
