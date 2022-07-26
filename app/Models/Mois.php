<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mois extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function MoisPaye()
    {
        return $this->hasMany(Mois_Paye::class);
    }

    public function salaires()
    {
        return $this->hasMany(Salaire::class);
    }

    public function contratFonctionMois()
    {
        return $this->hasMany(Contrat_fonction_mois::class);
    }


}
