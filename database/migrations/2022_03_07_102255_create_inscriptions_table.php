<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInscriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->string("montant")->nullable();
            $table->foreignId("annee_scolaire_id")->nullable()->constrained("annee_scolaires")->cascadeOnDelete();
            $table->foreignId("apprenant_id")->nullable()->constrained("apprenants")->cascadeOnDelete();
            $table->foreignId("niveau_id")->nullable()->constrained("niveaux")->cascadeOnDelete();
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
        Schema::dropIfExists('inscriptions');
    }
}
