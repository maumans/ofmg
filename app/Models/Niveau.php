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


    public function classes()
    {
        return $this->hasMany(Classe::class);
    }

    public function cycle()
    {
        return $this->belongsTo(Cycle::class);
    }

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function options()
    {
        return $this->belongsToMany(Option::class);
    }
}
