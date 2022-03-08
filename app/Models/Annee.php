<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Annee extends Model
{
    use HasFactory;

    public function mois()
    {
        return $this->belongsToMany(Mois::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function tarifs()
    {
        return $this->hasMany(Tarif::class);
    }
}

