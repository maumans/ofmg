<?php

namespace Database\Seeders;

use App\Models\Type_role;
use Illuminate\Database\Seeder;

class TypeRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Type_role::create([
            "libelle" =>"administration"
        ]);

        Type_role::create([
            "libelle" =>"etablissement"
        ]);

    }
}
