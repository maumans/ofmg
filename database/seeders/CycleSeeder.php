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
            "libelle" =>"GARDERIE",
        ]);

        Cycle::create([
            "libelle" =>"MATERNELLE",
        ]);

        Cycle::create([
            "libelle" =>"PRIMAIRE",
        ]);

        Cycle::create([
            "libelle" =>"COLLÈGE",
        ]);

        Cycle::create([
            "libelle" =>"LYCÉE",
        ]);

        Cycle::create([
            "libelle" =>"UNIVERSITÉ",
        ]);
    }
}
