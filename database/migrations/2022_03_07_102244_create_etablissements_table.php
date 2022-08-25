<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Schema;

class CreateEtablissementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('etablissements', function (Blueprint $table) {
            $table->id();
            $table->string("code")->unique()->nullable();
            $table->string("nom")->nullable();
            $table->string("telephone")->unique()->nullable();

            $table->foreignId("type_etablissement_id")->nullable()->constrained("type_etablissements")->cascadeOnDelete();
            $table->foreignId("commune_id")->nullable()->constrained("communes")->cascadeOnDelete();
            $table->foreignId("ville_id")->nullable()->constrained("villes")->cascadeOnDelete();
            $table->foreignId("user_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::table('users',function(Blueprint $table){
            $table->foreignId("etablissement_id")->nullable()->constrained("etablissements")->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('etablissements');
    }
}
