<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ville extends Model
{
    use HasFactory;
    protected $guarded=[];

    public function communes()
    {
        return $this->hasMany(Commune::class);
    }

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function etablissements()
    {
        return $this->hasMany(Etablissement::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
