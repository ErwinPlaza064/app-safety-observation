<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {
        Schema::table('observations', function (Blueprint $table) {
            $table->unsignedBigInteger('area_id')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('observations', function (Blueprint $table) {
            $table->unsignedBigInteger('area_id')->nullable(false)->change();
        });
    }
};
