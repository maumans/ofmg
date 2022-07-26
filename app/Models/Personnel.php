<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Personnel extends Model
{
    use HasFactory;

    protected $guarded=[];

    /*
    public function fonctions()
    {
        return $this->belongsToMany(Fonction::class);
    }
    */

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }

    public function salaires()
    {
        return $this->hasMany(Salaire::class);
    }

    public function contrats()
    {
        return $this->hasMany(Contrat::class);
    }
}
