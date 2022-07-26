<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contrat_fonction_mois extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function mois()
    {
        return $this->belongsTo(Mois::class);
    }

    public function contratFonction()
    {
        return $this->belongsTo(Contrat_fonction::class);
    }

    public function personnel()
    {
        return $this->belongsTo(User::class);
    }
}
