<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apprenant_tarif extends Model
{
    use HasFactory;

    protected $table = 'apprenant_tarif';

    protected $guarded=[];


    public function anneeScolaire()
    {
        return $this->belongsTo(Annee_scolaire::class);
    }

    public function moisPayes()
    {
        return $this->hasMany(Mois_Paye::class);
    }

    public function tarif()
    {
        return $this->belongsTo(Tarif::class);
    }
    public function apprenant()
    {
        return $this->belongsTo(Apprenant::class);
    }
}
