<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaiementOccasionelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('paiement_occasionels', function (Blueprint $table) {
            $table->id();
            $table->string("nom")->nullable();
            $table->string("prenom")->nullable();
            $table->longText("motif")->nullable();
            $table->integer("montant")->nullable();

            $table->foreignId("etablissement_id")->nullable()->constrained("etablissements")->cascadeOnDelete();

            $table->foreignId("annee_scolaire_id")->nullable()->constrained("annee_scolaires")->cascadeOnDelete();

            $table->enum("status",["ACTIF","ANNULE","VALIDE"])->default("ACTIF");

            $table->integer("niveauValidation")->default(1)->nullable();

            $table->string("numero_retrait")->nullable();

            $table->string("numero_depot")->nullable();

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
        Schema::dropIfExists('paiement_occasionels');
    }
}
