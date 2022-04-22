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

    public function niveau()
    {
        return $this->belongsTo(Niveau::class);
    }

    public function tarifs()
    {
        return $this->belongsToMany(Tarif::class)->withPivot("resteApayer","nombreMois");
    }

    public function tuteurs()
    {
        return $this->belongsToMany(User::class,"apprenant_tuteur","apprenant_id","tuteur_id");
    }
}
