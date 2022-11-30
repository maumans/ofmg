<?php

namespace Crudfy\OmB2b\Traits;

use App\Models\Transaction;

trait HasTransaction
{

    public function cashin() {
        if (omb2b()->canMakeTransaction('cashin', $this)) {
            omb2b()->cashinAndSave(
                [
                    'amount' => $this->amount,
                    'transactionId' => $this->transactionId,
                    'number' => (string)$this->depotNumber,
                    "posId" => 's1wCRuT',
                ],
            );
        }
        else {
            omb2b()->log("Transaction cashin déjà effectué", 'alert');
        }

    }

    public function cashout() {
        if (omb2b()->canMakeTransaction('cashout', $this)) {
            omb2b()->cashoutAndSave(
                [
                    'amount' => $this->amount,
                    'transactionId' => $this->transactionId,
                    'number' => (string)$this->retraitNumber,
                    "posId" => 's1wCRuT',
                ],
                $this
            );
        }
        else {
            omb2b()->log("Transaction cashout déjà effectué", 'alert');
        }
    }

    public function transactions() {
        return $this->hasMany(Transaction::class, 'item_key', 'id')
            ->where('item_model', get_class($this));
    }
}
