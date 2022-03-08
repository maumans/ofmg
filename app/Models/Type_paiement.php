<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type_paiement extends Model
{
    use HasFactory;
    protected $guarded=[];

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    public function tarifs()
    {
        return $this->hasMany(Tarif::class);
    }
}
