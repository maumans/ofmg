<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Date;

class Etablissement extends Model
{

    use HasFactory;
    protected $guarded=[];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
    }

    public function setCodeAttribute()
    {
        $this->attributes["code"] = Date::now()->format('YmdHis');
    }

    public function commune()
    {
        return $this->belongsTo(Commune::class);
    }

    public function ville()
    {
        return $this->belongsTo(Ville::class);
    }

    public function typeEtablissement()
    {
        return $this->belongsTo(Type_etablissement::class);
    }

    public function tarifs()
    {
        return $this->hasMany(Tarif::class);
    }

    public function tuteurs()
    {
        return $this->hasMany(User::class,"tuteur_id");
    }

    public function admins()
    {
        return $this->hasMany(User::class);
    }

    public function niveaux()
    {
        return $this->hasMany(Niveau::class);
    }

    public function anneeScolaires()
    {
        return $this->hasMany(Annee_scolaire::class);
    }

    public function anneeEncours()
    {
        return $this->belongsTo(Annee_scolaire::class);
    }

    public function anneeScolaireIsDefined()
    {
        if($this->anneeEncours)
            return true;
        else return false;
    }


}
