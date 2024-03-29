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
            $table->enum('frequence',['MENSUELLE',"TRIMESTRIELLE","SEMESTRIELLE","ANNUELLE"])->nullable();
            $table->integer('echeance')->nullable();
            $table->boolean('obligatoire')->default(false);
            $table->foreignId("niveau_id")->nullable()->constrained("niveaux")->cascadeOnDelete();
            $table->foreignId("classe_id")->nullable()->constrained("classes")->cascadeOnDelete();
            $table->foreignId("etablissement_id")->nullable()->constrained("etablissements")->cascadeOnDelete();
            $table->foreignId("type_paiement_id")->nullable()->constrained("type_paiements")->cascadeOnDelete();
            $table->foreignId("annee_scolaire_id")->nullable()->constrained("annee_scolaires")->cascadeOnDelete();
            //$table->unique(array("etablissement_id",'classe_id',"type_paiement_id",'annee_scolaire_id'));
            $table->integer('nombreMois')->nullable();
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
        Schema::dropIfExists('tarifs');
    }
}
