<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    protected $guarded=[];

    public function users()
    {
        return $this->belongsToMany(User::class)->with("roles");
    }

    public function contrats()
    {
        return $this->belongsToMany(Contrat::class);
    }

    public function typeRole()
    {
        return $this->belongsTo(Type_role::class);
    }
}
