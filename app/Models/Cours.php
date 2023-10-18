<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function contratFonctions()
    {
        return $this->hasMany(Contrat_fonction::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }

    public function personnel()
    {
        return $this->belongsTo(User::class,'cours_id');
    }
}
