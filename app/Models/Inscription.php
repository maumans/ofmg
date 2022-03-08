<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscription extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function annee()
    {
        return $this->belongsTo(Annee::class);
    }

    public function apprenant()
    {
        return $this->belongsTo(Apprenant::class);
    }

    public function niveau()
    {
        return $this->belongsTo(Niveau::class);
    }

}
