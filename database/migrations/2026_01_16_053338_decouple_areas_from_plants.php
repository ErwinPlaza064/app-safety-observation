<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Merge duplicate areas by name
        $areas = DB::table('areas')->get();
        $grouped = $areas->groupBy(fn($a) => trim(strtolower($a->name)));

        foreach ($grouped as $name => $group) {
            if ($group->count() > 1) {
                $master = $group->first();
                $others = $group->slice(1);
                $otherIds = $others->pluck('id')->toArray();

                // Update users
                DB::table('users')
                    ->whereIn('area_id', $otherIds)
                    ->update(['area_id' => $master->id]);

                // Update observations
                DB::table('observations')
                    ->whereIn('area_id', $otherIds)
                    ->update(['area_id' => $master->id]);

                // Delete duplicates
                DB::table('areas')->whereIn('id', $otherIds)->delete();
            }
        }

        // 2. Remove plant_id column and constraints
        Schema::table('areas', function (Blueprint $table) {
            // Drop foreign key if it exists
            $table->dropForeign(['plant_id']);
            // Drop unique index if it exists (usually it was name_plant_id)
            // We'll try to drop it safely
            try {
                $table->dropUnique(['plant_id', 'name']);
            } catch (\Exception $e) {
                // Ignore if not exists
            }

            $table->dropColumn('plant_id');

            // Add global unique constraint on name
            $table->unique('name');
        });
    }

    public function down(): void
    {
        Schema::table('areas', function (Blueprint $table) {
            $table->dropUnique(['name']);
            $table->unsignedBigInteger('plant_id')->nullable()->after('id');
            $table->foreign('plant_id')->references('id')->on('plants')->onDelete('cascade');
            $table->unique(['plant_id', 'name']);
        });
    }
};
