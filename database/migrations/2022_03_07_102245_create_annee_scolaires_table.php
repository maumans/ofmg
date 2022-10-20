<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class  CreateAnneeScolairesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('annee_scolaires', function (Blueprint $table) {
            $table->id();
            $table->date("dateDebut")->nullable();
            $table->date("dateFin")->nullable();
            $table->boolean('actif')->default(true)->nullable();
            $table->foreignId('etablissement_id')->nullable()->constrained("etablissements");
            $table->timestamps();

        });

        Schema::table('etablissements',function(Blueprint $table){
            $table->foreignId("annee_encours_id")->nullable()->constrained("annee_scolaires")->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('etablissements', function (Blueprint $table) {
            $table->dropConstrainedForeignId("annee_encours_id");
        });

        Schema::dropIfExists('annee_scolaires');
    }
}
