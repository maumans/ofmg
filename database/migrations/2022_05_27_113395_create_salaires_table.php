<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalairesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('salaires', function (Blueprint $table) {
            $table->id();
            $table->integer("montant");
            $table->string("motifAnnulation")->nullable();
            $table->enum("status",["ACTIF","ANNULE","VALIDE"])->default("ACTIF");
            $table->foreignId("personnel_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->foreignId("etablissement_id")->nullable()->constrained("etablissements")->cascadeOnDelete();
            $table->foreignId("annee_scolaire_id")->nullable()->constrained("annee_scolaires")->cascadeOnDelete();
            $table->foreignId("mois_id")->nullable()->constrained("mois")->cascadeOnDelete();
            $table->integer("niveauValidation")->default(1)->nullable();
            $table->foreignId("validateur1_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->foreignId("validateur2_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->string("numero_retrait")->nullable();
            $table->string("numero_depot")->nullable();
            $table->string("transaction_status")->nullable();
            $table->foreignId("transaction_id")->nullable()->constrained("transactions")->cascadeOnDelete();
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
        Schema::dropIfExists('salaires');
    }
}
