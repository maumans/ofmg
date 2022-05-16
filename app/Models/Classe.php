<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    use HasFactory;
    protected $guarded=[];
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

    public function niveau()
    {
        return $this->belongsTo(Niveau::class);
    }

    public function option()
    {
       return $this->belongsTo(Option::class);
    }

}
