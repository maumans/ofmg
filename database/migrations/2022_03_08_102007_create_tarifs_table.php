<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTarifsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tarifs', function (Blueprint $table) {
            $table->id();
            $table->integer('montant')->nullable();
            $table->enum('frequence',['MOIS',"SEMESTRE","AN"])->default("MOIS");
            $table->integer('echeance')->nullable();
            $table->foreignId("niveau_id")->nullable()->constrained("niveaux")->cascadeOnDelete();
            $table->foreignId("etablissement_id")->nullable()->constrained("etablissements")->cascadeOnDelete();
            $table->foreignId("type_paiement_id")->nullable()->constrained("type_paiements")->cascadeOnDelete();
            $table->foreignId("annee_id")->nullable()->constrained("annees")->cascadeOnDelete();
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
        Schema::dropIfExists('tarifs');
    }
}
