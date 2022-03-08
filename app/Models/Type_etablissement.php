<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type_etablissement extends Model
{
    use HasFactory;
    protected $guarded=[];

    public function etablissements()
    {
        return $this->hasMany(Etablissement::class);
    }
}
