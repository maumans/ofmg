<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mois extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function annees()
    {
        return $this->belongsToMany(Annee::class);
    }


}
