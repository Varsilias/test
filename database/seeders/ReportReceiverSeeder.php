<?php

namespace Database\Seeders;

use App\Models\ReportReceiver;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReportReceiverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ReportReceiver::create([
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'website_id' => 1,
            'active' => true,
        ]);

        ReportReceiver::create([
            'name' => 'Jane Doe',
            'email' => 'janedoe@example.com',
            'website_id' => 1,
            'active' => false,
        ]);
    }
}
