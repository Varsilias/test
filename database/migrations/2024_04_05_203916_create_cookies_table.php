<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cookies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('website_id');
            $table->string('name');
            $table->string('provider')->nullable();
            $table->text('value');
            $table->string('category')->nullable();
            $table->string('type');
            $table->decimal('expiry', 30, 10);
            $table->text('path');
            $table->boolean('secure');
            $table->boolean('http_only');
            $table->timestamps();

            $table->foreign('website_id')
                ->references('id')->on('websites')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cookies');
    }
};
