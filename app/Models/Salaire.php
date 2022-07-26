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

    public function getTransactionIdAttribute()
    {
        // TODO: Implement getTransactionIdAttribute() method.

        return uniqid()."sch";
    }

    public function getOmNumberAttribute()
    {
        // TODO: Implement getOmNumberAttribute() method.
        if($this->numero_depot)
        {
            return $this->numero_depot;
        }
        else
        {
            return $this->numero_retrait;
        }
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
}
