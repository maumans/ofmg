<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apprenant extends Model
{
    use HasFactory;
    protected $guarded=[];

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function tarifs()
    {
        return $this->belongsToMany(Tarif::class)->withPivot("id","resteApayer","nombreMois");
    }

    public function tuteurs()
    {
        return $this->belongsToMany(User::class,"apprenant_tuteur","tuteur_id","apprenant_id");
    }

    public function apprenantTarif()
    {
        return $this->hasMany(Apprenant_tarif::class);
    }
}
