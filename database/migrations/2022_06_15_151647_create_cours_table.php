<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cours', function (Blueprint $table) {
            $table->id();
            $table->integer('montant')->nullable();
            $table->enum('frequence',["HORAIRE","MENSUELLE"])->nullable();
            $table->foreignId("personnel_id")->nullable()->constrained("users");
            $table->foreignId("contrat_id")->nullable()->constrained("contrats");
            $table->foreignId("classe_id")->nullable()->constrained("classes");
            $table->foreignId("matiere_id")->nullable()->constrained("matieres");
            $table->foreignId("annee_scolaire_id")->nullable()->constrained("annee_scolaires");
            $table->unique(array('contrat_id',"classe_id","matiere_id","annee_scolaire_id"));
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
        Schema::dropIfExists('cours');
    }
}
