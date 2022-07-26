<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contrat_fonction extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }
    public function fonction()
    {
        return $this->belongsTo(Fonction::class);
    }
    public function anneeScolaire()
    {
        return $this->belongsTo(Annee_scolaire::class);
    }
    public function contrat()
    {
        return $this->belongsTo(Contrat::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contratFonctionMois()
    {
        return $this->hasMany(Contrat_fonction_mois::class);
    }
}
