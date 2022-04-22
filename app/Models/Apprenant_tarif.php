<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apprenant_tarif extends Model
{
    use HasFactory;

    protected $table = 'apprenant_tarif';

    protected $guarded=[];


    public function AnneeScolaire()
    {
        return $this->belongsTo(Annee_scolaire::class);
    }
}
