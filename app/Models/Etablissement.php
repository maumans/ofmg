<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etablissement extends Model
{
    use HasFactory;
    protected $guarded=[];

    public function commune()
    {
        return $this->belongsTo(Commune::class);
    }

    public function commune()
    {
        return $this->belongsTo(Ville::class);
    }

    public function typePaiement()
    {
        return $this->belongsTo(Type_paiement::class);
    }

    public function tarifs()
    {
        return $this->hasMany(Tarif::class);
    }

    public function tuteurs()
    {
        return $this->hasMany(User::class,"tuteur_id");
    }
}
