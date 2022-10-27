<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPostIdAndMsisdnToEtablissementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('etablissements', function (Blueprint $table) {
            $table->string("posId")->unique()->nullable();
            $table->string("msisdn")->unique()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('etablissements', function (Blueprint $table) {
            $table->dropColumn("posId");
            $table->dropColumn("msisdn");
        });
    }
}
