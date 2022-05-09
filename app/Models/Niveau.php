<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Niveau extends Model
{
    use HasFactory;
    protected $guarded=[];


    //// A retirer

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function tarifs()
    {
        return $this->hasMany(Tarif::class);
    }

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }

    public function apprenants()
    {
        return $this->hasMany(Apprenant::class);
    }


    public function classes()
    {
        return $this->hasMany(Classe::class);
    }

    public function cycle()
    {
        return $this->belongsTo(Cycle::class);
    }
}
