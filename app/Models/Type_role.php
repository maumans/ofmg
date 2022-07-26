<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type_role extends Model
{
    use HasFactory;

    public function roles()
    {
        return $this->hasMany(Role::class);
    }
}
