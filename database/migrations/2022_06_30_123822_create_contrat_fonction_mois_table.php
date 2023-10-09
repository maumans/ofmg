<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContratFonctionMoisTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contrat_fonction_mois', function (Blueprint $table) {
            $table->id();
            $table->integer("montant")->nullable();
            $table->integer("nombreHeures")->nullable();
            $table->integer("salaire")->nullable();
            $table->foreignId("mois_id")->nullable()->constrained("mois");
            $table->foreignId("contrat_fonction_id")->nullable()->constrained("contrat_fonctions");
            $table->foreignId("user_id")->nullable()->constrained("users");
            $table->boolean('status')->default(true);
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
        Schema::dropIfExists('contrat_fonction_mois');
    }
}
