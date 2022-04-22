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

    public function etablissementEncours()
    {
        return $this->hasOne(Etablissement::class,"annee_scolaire_id");
    }

    public function tarifApprenantAnnee()
    {
        return $this->hasOne(Apprenant_tarif::class,"annee_scolaire_id");
    }


}
