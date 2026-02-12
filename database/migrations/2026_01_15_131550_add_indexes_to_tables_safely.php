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
        $this->addIndexIfMissing('observations', 'status');
        $this->addIndexIfMissing('observations', 'area_id');
        $this->addIndexIfMissing('observations', 'created_at');
        $this->addIndexIfMissing('observations', 'observation_date');

        $this->addIndexIfMissing('users', 'is_ehs_manager');
        $this->addIndexIfMissing('users', 'is_super_admin');
        $this->addIndexIfMissing('users', 'is_ehs_coordinator');
        $this->addIndexIfMissing('users', 'area');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $this->dropIndexIfExists('observations', 'status');
        $this->dropIndexIfExists('observations', 'area_id');
        $this->dropIndexIfExists('observations', 'created_at');
        $this->dropIndexIfExists('observations', 'observation_date');

        $this->dropIndexIfExists('users', 'is_ehs_manager');
        $this->dropIndexIfExists('users', 'is_super_admin');
        $this->dropIndexIfExists('users', 'is_ehs_coordinator');
        $this->dropIndexIfExists('users', 'area');
    }

    private function addIndexIfMissing($table, $column)
    {
        $indexName = "{$table}_{$column}_index";
        $schemaBuilder = Schema::getConnection()->getSchemaBuilder();

        $indexes = $schemaBuilder->getIndexes($table);
        $exists = collect($indexes)->contains('name', $indexName);

        if (!$exists) {
            Schema::table($table, function (Blueprint $tableObj) use ($column) {
                $tableObj->index($column);
            });
        }
    }

    private function dropIndexIfExists($table, $column)
    {
        $indexName = "{$table}_{$column}_index";
        $schemaBuilder = Schema::getConnection()->getSchemaBuilder();

        $indexes = $schemaBuilder->getIndexes($table);
        $exists = collect($indexes)->contains('name', $indexName);

        if ($exists) {
            Schema::table($table, function (Blueprint $tableObj) use ($column) {
                $tableObj->dropIndex([$column]);
            });
        }
    }
};
