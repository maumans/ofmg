<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableContratChangeColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contrats', function (Blueprint $table) {
            //$table->dropForeign(['role_id']);
            $table->dropForeign(['etablissement_id']);
            $table->dropForeign(['user_id']);
            $table->dropForeign(['annee_scolaire_id']);

            //$table->foreignId("role_id")->nullable()->change()->constrained("roles")->cascadeOnDelete();
            $table->foreignId("etablissement_id")->nullable()->change()->constrained("etablissements")->cascadeOnDelete();
            $table->foreignId("user_id")->nullable()->change()->constrained("users")->cascadeOnDelete();
            $table->foreignId("annee_scolaire_id")->nullable()->change()->constrained("annee_scolaires")->cascadeOnDelete();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['contrat_id']);
            $table->foreignId("contrat_id")->change()->nullable()->constrained("contrats")->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contrats', function (Blueprint $table) {
            //
        });
    }
}
