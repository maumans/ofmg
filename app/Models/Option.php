<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function niveaux()
    {
        return $this->belongsToMany(Niveau::class);
    }

    public function cycle()
    {
        return $this->belongsTo(Cycle::class);
    }

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function classes()
    {
        return $this->belongsToMany(Classe::class);
    }
}
