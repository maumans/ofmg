<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContratsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contrats', function (Blueprint $table) {
            $table->id();
            $table->boolean("actif")->default(true);
            $table->foreignId("etablissement_id")->nullable()->constrained("etablissements")->cascadeOnDelete();
            $table->foreignId("user_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->foreignId("annee_scolaire_id")->nullable()->constrained("annee_scolaires")->cascadeOnDelete();
            $table->date("dateDebut")->nullable();
            $table->date("dateFin")->nullable();
            $table->enum("frequence",['HORAIRE',"MENSUELLE","AUCUN"])->nullable();
            $table->integer("montantHoraire")->nullable();
            $table->integer("montantMensuel")->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId("contrat_id")->nullable()->constrained("contrats")->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId("contrat_id");
        });
        Schema::dropIfExists('contrats');
    }
}
