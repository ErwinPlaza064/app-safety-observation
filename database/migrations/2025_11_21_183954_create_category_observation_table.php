<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('category_observation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('observation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->timestamp('created_at')->nullable();

            $table->unique(['observation_id', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_observation');
    }
};
