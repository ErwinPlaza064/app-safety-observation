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
        Schema::table('observations', function (Blueprint $table) {
            if (!Schema::hasColumn('observations', 'share_token')) {
                $table->string('share_token', 64)->nullable()->unique()->after('folio');
            }
            if (!Schema::hasColumn('observations', 'share_expires_at')) {
                $table->timestamp('share_expires_at')->nullable()->after('share_token');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('observations', function (Blueprint $table) {
            $table->dropColumn(['share_token', 'share_expires_at']);
        });
    }
};
