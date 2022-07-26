<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApprenantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('apprenants', function (Blueprint $table) {
            $table->id();
            $table->string("matricule")->nullable();
            $table->string("prenom")->nullable();
            $table->string("nom")->nullable();
            $table->string("lieu_naissance")->nullable();
            $table->enum("status",["actif","inactif"])->default("actif")->nullable();
            $table->date("date_naissance")->nullable();
            $table->foreignId("classe_id")->nullable()->constrained('classes')->cascadeOnDelete();
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
        Schema::dropIfExists('apprenants');
    }
}
