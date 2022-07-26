<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    use HasFactory;

    protected $guarded=[];


    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function anneeScolaire()
    {
        return $this->belongsTo(Annee_scolaire::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function personnel()
    {
        return $this->belongsTo(User::class);
    }

    public function contratFonctions()
    {
        return $this->hasMany(Contrat_fonction::class);
    }
}
