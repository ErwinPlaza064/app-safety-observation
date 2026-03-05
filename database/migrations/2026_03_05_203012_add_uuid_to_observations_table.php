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
            $table->uuid('uuid')->nullable()->unique()->after('id');
        });

        // Populate existing records with UUIDs
        \App\Models\Observation::all()->each(function ($observation) {
            $observation->uuid = (string) \Illuminate\Support\Str::uuid();
            $observation->save();
        });

        // Make it non-nullable after populating
        Schema::table('observations', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('observations', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
