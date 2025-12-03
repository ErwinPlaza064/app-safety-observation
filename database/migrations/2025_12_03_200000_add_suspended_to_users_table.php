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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_suspended')->default(false)->after('is_ehs_manager')
                  ->comment('Indica si el usuario está suspendido temporalmente');
            $table->timestamp('suspended_at')->nullable()->after('is_suspended')
                  ->comment('Fecha en que fue suspendido');
            $table->string('suspension_reason')->nullable()->after('suspended_at')
                  ->comment('Razón de la suspensión');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_suspended', 'suspended_at', 'suspension_reason']);
        });
    }
};
