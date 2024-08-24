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
        Schema::create('scan_results', function (Blueprint $table) {
            $table->id(); // Primary auto-incrementing integer id
            $table->string('domainName'); // Equivalent to a VARCHAR
            $table->string('scanId'); // Equivalent to a VARCHAR
            $table->dateTime('scanTime'); // Datetime column
            $table->integer('pagesScanned'); // Integer column
            $table->json('cookies'); // JSON column
            $table->timestamps(); // Automatically adds created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scan_results');
    }
};
