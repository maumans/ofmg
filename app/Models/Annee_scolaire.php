<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Annee_scolaire extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function tarifs()
    {
        return $this->hasMany(Tarif::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }
}
