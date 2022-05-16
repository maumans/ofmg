<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarif extends Model
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

    public function niveau()
    {
        return $this->belongsTo(Niveau::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }

    public function typePaiement()
    {
        return $this->belongsTo(Type_paiement::class);
    }

    public function anneeScolaire()
    {
        return $this->belongsTo(Annee_scolaire::class);
    }

    public function paiement()
    {
        return $this->hasMany(Paiement::class);
    }

    public function apprenants()
    {
        return $this->belongsToMany(Apprenant::class);
    }
}
