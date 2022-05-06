<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mois_Paye extends Model
{
    use HasFactory;

    protected $table = 'mois_payes';

    protected $guarded=[];


    public function mois()
    {
        return $this-> belongsTo(Mois::class);
    }

    public function apprenantTarif()
    {
        return $this-> belongsTo(Apprenant_tarif::class);
    }
}
