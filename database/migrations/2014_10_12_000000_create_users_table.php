<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('prenom');
            $table->string('nom');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            $table->enum('titre',["Celibataire", "Mme","Mlle","M"])->nullable();
            $table->enum('situationMatrimoniale',["Celibataire", "Marié","Divorcé","veuf","Concubin"])->nullable();
            $table->date("date_naissance")->nullable();
            $table->string("telephone_personnel")->nullable();
            $table->string("telephone_domicile")->nullable();

            $table->foreignId("commune_id")->nullable()->constrained("communes")->cascadeOnDelete();
            $table->foreignId("ville_id")->nullable()->constrained("villes")->cascadeOnDelete();
            $table->foreignId("tuteur_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->foreignId("admin_id")->nullable()->constrained("users")->cascadeOnDelete();

            $table->longText("commentaire")->nullable();

            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
