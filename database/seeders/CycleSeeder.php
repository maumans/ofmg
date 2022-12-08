<?php

namespace Database\Seeders;

use App\Models\Cycle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CycleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('cycles')->delete();

        Cycle::create([
            "libelle" =>"Garderie",
        ]);

        Cycle::create([
            "libelle" =>"Maternelle",
        ]);

        Cycle::create([
            "libelle" =>"Primaire",
        ]);

        Cycle::create([
            "libelle" =>"Collège",
        ]);

        Cycle::create([
            "libelle" =>"Lycée",
        ]);

        Cycle::create([
            "libelle" =>"Université",
        ]);
    }
}
