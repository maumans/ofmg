<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
            $table->string("code")->nullable();
            $table->string("nom")->nullable();
            $table->foreignId("type_etablissement_id")->constrained("type_etablissements")->cascadeOnDelete();
            $table->foreignId("commune_id")->nullable()->constrained("communes")->cascadeOnDelete();
            $table->foreignId("ville_id")->nullable()->constrained("villes")->cascadeOnDelete();
            $table->timestamps();
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
