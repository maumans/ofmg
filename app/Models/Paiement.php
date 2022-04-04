<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;
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

    public function etablissementUser()
    {
        return $this->belongsTo(User::class,"etablissementUser_id");
    }

    public function tarif()
    {
        return $this->belongsTo(Tarif::class);
    }
}
