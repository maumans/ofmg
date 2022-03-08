<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarif extends Model
{
    use HasFactory;
    protected $guarded=[];

    public function niveau()
    {
        return $this->belongsTo(Niveau::class);
    }

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class);
    }

    public function typePaiement()
    {
        return $this->belongsTo(Type_paiement::class);
    }

    public function annee()
    {
        return $this->belongsTo(Annee::class);
    }
}
