<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fonction extends Model
{
    use HasFactory;

    protected $guarded=[];

    protected $appends= ["fonctions"];

    protected $fonctions;

    public function getFonctionsAttribute(){
        return $this->fonctions;
    }
    public function setFonctionAttribute($fonctions)
    {
        $this->fonctions = $fonctions;

    }

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }

    public function contratFonctions()
    {
        return $this->hasMany(Contrat_fonction::class);
    }
}
