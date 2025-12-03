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
        Schema::table('areas', function (Blueprint $table) {
            $table->string('code', 20)->nullable()->unique()->after('name')
                  ->comment('Código único del área (ej: P3, P5, ADM)');
            $table->text('description')->nullable()->after('code')
                  ->comment('Descripción del área');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('areas', function (Blueprint $table) {
            $table->dropColumn(['code', 'description']);
        });
    }
};
