<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departement extends Model
{
    use HasFactory;
    protected $guarded=[];

    public function niveaux()
    {
        return $this->hasMany(Niveau::class);
    }

    public function options()
    {
        return $this->hasMany(Option::class);
    }

}
