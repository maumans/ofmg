<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id');
            $table->text('message')->nullable();
            $table->string('type')->nullable();
            $table->string('peerId')->nullable();
            $table->string('peerIdType')->nullable();
            $table->string('amount')->nullable();
            $table->string('currency')->nullable();
            $table->string('creationDate')->nullable();
            $table->string('posId')->nullable();
            $table->string('txnId')->nullable();
            $table->enum('status', ['PENDING', 'SUCCESS', 'FAILED'])->nullable();
            $table->string('item_model')->nullable();
            $table->string('item_key')->nullable();
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
        Schema::dropIfExists('transactions');
    }
}
