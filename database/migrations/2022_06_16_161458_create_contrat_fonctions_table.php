<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContratFonctionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contrat_fonctionss', function (Blueprint $table) {
            $table->id();
            $table->integer('montant')->nullable();
            $table->enum('frequence',["HORAIRE","MENSUELLE"])->nullable();
            $table->foreignId("contrat_id")->nullable()->constrained("contrats");
            $table->foreignId("user_id")->nullable()->constrained("users");
            $table->foreignId("fonction_id")->nullable()->constrained("fonctions");
            $table->foreignId("annee_scolaire_id")->nullable()->constrained("annee_scolaires");
            $table->foreignId("cours_id")->nullable()->constrained("cours");
            $table->unique(array('contrat_id',"fonction_id","cours_id"));
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
        Schema::dropIfExists('contrat_fonctions');
    }
}
