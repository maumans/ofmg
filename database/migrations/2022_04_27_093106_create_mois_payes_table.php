<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMoisPayesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mois_payes', function (Blueprint $table) {
            $table->id();
            $table->integer("montant")->nullable();
            $table->foreignId("mois_id")->nullable()->constrained("mois")->cascadeOnDelete();
            $table->foreignId("apprenant_tarif_id")->nullable()->constrained("apprenant_tarif")->cascadeOnDelete();

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
        Schema::dropIfExists('mois_payes');
    }
}
