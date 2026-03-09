<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('last_login_at')->nullable()->after('remember_token')
                ->comment('Última vez que el usuario inició sesión (persistente)');
        });

        // Poblar last_login_at con la última actividad actual de sessions si existe
        DB::statement("
            UPDATE users
            SET last_login_at = (
                SELECT FROM_UNIXTIME(MAX(sessions.last_activity))
                FROM sessions
                WHERE sessions.user_id = users.id
            )
            WHERE EXISTS (
                SELECT 1 FROM sessions WHERE sessions.user_id = users.id
            )
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('last_login_at');
        });
    }
};
