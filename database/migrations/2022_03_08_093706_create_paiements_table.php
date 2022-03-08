<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class  CreatePaiementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->integer("montant")->nullable();
            $table->foreignId("type_paiement_id")->constrained("type_paiements")->cascadeOnDelete();
            $table->foreignId("mode_paiement_id")->constrained("mode_paiements")->cascadeOnDelete();
            $table->foreignId("apprenant_id")->nullable()->constrained("apprenants")->cascadeOnDelete();
            $table->foreignId("tuteur_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->foreignId("personnel_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->foreignId("etablissement_id")->nullable()->constrained("users")->cascadeOnDelete();
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
        Schema::dropIfExists('paiements');
    }
}
