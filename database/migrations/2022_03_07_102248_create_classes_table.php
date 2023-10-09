<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('libelle')->nullable();
            $table->string('code')->nullable();
            $table->string('description')->nullable();
            $table->foreignId("niveau_id")->nullable()->constrained("niveaux");
            $table->foreignId('etablissement_id')->nullable()->constrained("etablissements");
            $table->foreignId('option_id')->nullable()->constrained("options");
            $table->unique(array('etablissement_id',"libelle"));
            $table->boolean('status')->default(true);
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
        Schema::dropIfExists('classes');
    }
}
