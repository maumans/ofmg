<?php

namespace App\Models;

use Crudfy\OmB2b\Interfaces\IHasTransaction;
use Crudfy\OmB2b\Traits\HasTransaction;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement_occasionnel extends Model implements iHasTransaction
{
    use HasFactory,HasTransaction;

    protected $guarded=[];

    protected $appends= ['transactionCurrentId'];

    protected $transactionCurrentId;

    public function getTransactionCurrentIdAttribute(){
        return Transaction::where('item_key', $this->id)->where('item_model', get_class($this))->first()? Transaction::where('item_key', $this->id)->where('item_model', get_class($this))->first()->transactionId : null;
    }

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }

    public function anneeScolaire()
    {
        return $this->belongsTo(Annee_scolaire::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function getTransactionIdAttribute()
    {
        // TODO: Implement getTransactionIdAttribute() method.

        return uniqid()."sch";
    }

    public function getDepotNumberAttribute()
    {
        // TODO: Implement getOmNumberAttribute() method.

        return $this->numero_depot;
    }

    public function getRetraitNumberAttribute()
    {
        // TODO: Implement getOmNumberAttribute() method.

        return $this->numero_retrait;
    }

    public function getAmountAttribute()
    {
        // TODO: Implement getAmountAttribute() method.
        return $this->montant;
    }

    public function getAddToTransactionAttribute()
    {
        // TODO: Implement getAddToTransactionAttribute() method.
        return [];
    }

    public function getPosIdAttribute()
    {
        return $this->etablissement->posId;
    }

    public function getOmNumberAttribute()
    {
        // TODO: Implement getOmNumberAttribute() method.
    }
}
