<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // You can use model factories or create users manually
        User::create([
            'name' => 'Admin',
            'email' => 'admin@consentprotect.com',
            'password' => bcrypt('password'), // Make sure to hash passwords
            'is_admin' => true,
        ]);
        User::create([
            'name' => 'Elias Emmanuel',
            'email' => 'elias.emmanuel@push.bike',
            'password' => bcrypt('password'), // Make sure to hash passwords
        ]);

        // If you have a factory set up, you could also use:
        // User::factory()->count(10)->create();
    }
}
