<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApprenantTarifTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('apprenant_tarif', function (Blueprint $table) {
            $table->id();
            $table->foreignId('apprenant_id')->constrained("apprenants")->cascadeOnDelete();
            $table->foreignId('tarif_id')->constrained("tarifs")->cascadeOnDelete();
            $table->integer("resteApayer")->nullable();
            $table->integer("nombreMois")->nullable();

            $table->foreignId('annee_scolaire_id')->nullable()->constrained("annee_scolaires");

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
        Schema::dropIfExists('apprenant_tarif');
    }
}
