<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaiementGlobalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('paiement_globals', function (Blueprint $table) {
            $table->id();
            $table->integer("montant")->nullable();
            $table->foreignId("etablissement_id")->nullable()->constrained("etablissements");
            $table->string("transaction_status")->nullable();
            $table->string("numero_retrait")->nullable();
            $table->string("numero_depot")->nullable();
            $table->foreignId("tuteur_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->foreignId("transaction_id")->nullable()->constrained("transactions")->cascadeOnDelete();
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
        Schema::dropIfExists('paiement_globals');
    }
}
