<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOptionNiveauTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('option_niveau', function (Blueprint $table) {
            $table->id();
            $table->string("type")->nullable();
            $table->foreignId("option_id")->nullable()->constrained("options");
            $table->foreignId("niveau_id")->nullable()->constrained("niveaux");
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
        Schema::dropIfExists('option_niveau');
    }
}
