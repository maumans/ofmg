<?php

namespace Database\Seeders;

use App\Models\Cycle;
use App\Models\Niveau;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NiveauSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table("niveaux")->delete();

        $primaire=Cycle::where("libelle",'PRIMAIRE')->where("status",true,)->first();
        $college=Cycle::where("libelle",'COLLEGE')->where("status",true,)->first();
        $lycee=Cycle::where("libelle",'LYCEE')->where("status",true,)->first();
        $universite=Cycle::where("libelle",'UNIVERSITE')->where("status",true,)->first();

        if ($primaire)
        {
            Niveau::create([
                'libelle' =>'1ère année',
                "cycle_id" =>$primaire->id,
            ]);

            Niveau::create([
                'libelle' =>'2ème année',
                "cycle_id" =>$primaire->id,
            ]);

            Niveau::create([
                'libelle' =>'3ème année',
                "cycle_id" =>$primaire->id,
            ]);

            Niveau::create([
                'libelle' =>'4ème année',
                "cycle_id" =>$primaire->id,
            ]);

            Niveau::create([
                'libelle' =>'5ème année',
                "cycle_id" =>$primaire->id,
            ]);

            Niveau::create([
                'libelle' =>'6ème année',
                "cycle_id" =>$primaire->id,
            ]);

        }

        if ($college)
        {
            Niveau::create([
                'libelle' =>'7ère année',
                "cycle_id" =>$college->id,
            ]);

            Niveau::create([
                'libelle' =>'8ème année',
                "cycle_id" =>$college->id,
            ]);

            Niveau::create([
                'libelle' =>'9ème année',
                "cycle_id" =>$college->id,
            ]);

            Niveau::create([
                'libelle' =>'10ème année',
                "cycle_id" =>$college->id,
            ]);

        }

        if ($lycee)
        {
            Niveau::create([
                'libelle' =>'11ème année',
                "cycle_id" =>$lycee->id,
            ]);

            Niveau::create([
                'libelle' =>'12ème année',
                "cycle_id" =>$lycee->id,
            ]);

            Niveau::create([
                'libelle' =>'Terminale',
                "cycle_id" =>$lycee->id,
            ]);

        }

        if ($universite)
        {
            Niveau::create([
                'libelle' =>'Licence 1',
                "cycle_id" =>$universite->id,
            ]);

            Niveau::create([
                'libelle' =>'Licence 2',
                "cycle_id" =>$universite->id,
            ]);

            Niveau::create([
                'libelle' =>'Licence 3',
                "cycle_id" =>$universite->id,
            ]);

            Niveau::create([
                'libelle' =>'Master 1',
                "cycle_id" =>$universite->id,
            ]);

            Niveau::create([
                'libelle' =>'Master 2',
                "cycle_id" =>$universite->id,
            ]);

        }
    }
}
