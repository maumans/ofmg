<?php

namespace App\Models;

use Crudfy\OmB2b\Interfaces\IHasTransaction;

use Crudfy\OmB2b\Traits\HasTransaction;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model implements iHasTransaction
{
    use HasFactory,HasTransaction;
    protected $guarded=[];

    protected $appends= ["resteApayer"];

    protected $resteApayer;

    public function getResteApayerAttribute(){
        return $this->resteApayer;
    }
    public function setResteApayerAttribute($resteApayer){
        $this->resteApayer = $resteApayer;
    }

    public function typePaiement()
    {
        return $this->belongsTo(Type_paiement::class);
    }

    public function modePaiement()
    {
        return $this->belongsTo(Mode_paiement::class);
    }

    public function apprenant()
    {
        return $this->belongsTo(Apprenant::class);
    }

    public function tuteur()
    {
        return $this->belongsTo(User::class);
    }

    public function personnel()
    {
        return $this->belongsTo(User::class);
    }

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }

    public function etablissementUser()
    {
        return $this->belongsTo(User::class,"etablissementUser_id");
    }

    public function tarif()
    {
        return $this->belongsTo(Tarif::class);
    }

    public function paiementGlobal()
    {
        return $this->belongsTo(PaiementGlobal::class);
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
