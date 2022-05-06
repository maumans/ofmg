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
            $table->string('prenom')->nullable();
            $table->string('nom')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('adresse')->nullable();

            $table->enum('titre',["Celibataire", "Mme","Mlle","M"])->nullable();
            $table->enum('situation_matrimoniale',["Celibataire", "Marié","Divorcé","veuf","Concubin"])->nullable();
            $table->date("date_naissance")->nullable();
            $table->string("telephone")->unique()->nullable();
            $table->string("telephone2")->nullable();
            $table->string("telephone3")->nullable();
            $table->enum("status",["Actif",["Inactif"]])->default("Actif");

            $table->boolean("first_connexion")->default(true);
            $table->date("password_change_date")->nullable();


            $table->foreignId("commune_id")->nullable()->constrained("communes")->cascadeOnDelete();
            $table->foreignId("ville_id")->nullable()->constrained("villes")->cascadeOnDelete();
            $table->foreignId("tuteur_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->foreignId("admin_id")->nullable()->constrained("users")->cascadeOnDelete();

            ///ID du User Admin de l'etablissement

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
