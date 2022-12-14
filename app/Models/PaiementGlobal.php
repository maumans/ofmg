<?php

namespace App\Models;

use Crudfy\OmB2b\Traits\HasTransaction;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaiementGlobal extends Model
{
    use HasFactory,HasTransaction;

    protected $guarded=[];

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }

    public function tuteur()
    {
        return $this->belongsTo(User::class);
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
