<?php

namespace Database\Seeders;

use App\Models\Type_etablissement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TypeEtablissementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table("type_etablissements")->delete();

        Type_etablissement::create([
            "libelle"=>"université"
        ]);

        Type_etablissement::create([
            "libelle"=>"ecole"
        ]);
    }
}
