<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Crudfy\OmB2b\Interfaces\IHasTransaction;
use Crudfy\OmB2b\Traits\HasTransaction;

class Transaction extends Model
{
    use HasFactory;
    protected $guarded =[];

    public function paiementGlobal()
    {
        return $this->hasOne(PaiementGlobal::class);
    }
}
