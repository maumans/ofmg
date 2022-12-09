<?php

namespace App\Models;

use Crudfy\OmB2b\Interfaces\IHasTransaction;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Crudfy\OmB2b\Traits\HasTransaction;
use Illuminate\Database\Eloquent\Model;

class Salaire extends Model implements iHasTransaction
{
    use HasFactory,HasTransaction;

    protected $guarded=[];

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }

    public function anneeScolaire()
    {
        return $this->belongsTo(Annee_scolaire::class);
    }

    public function personnel()
    {
        return $this->belongsTo(User::class,"personnel_id");
    }

    public function mois()
    {
        return $this->belongsTo(Mois::class);
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
