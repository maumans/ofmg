<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->delete();

        $user=User::create([
            "prenom"=>"maurice",
            "nom"=>"mansaré",
            "email"=>"admin@gmail.com",
            "titre"=>"M",
            "situation_matrimoniale"=>"Celibataire",
            'password' => Hash::make("29101997"),
            "date_naissance"=>Date::create(1997,5,9),
            "telephone"=>"621993863",

        ]);

        $user->roles()->syncWithoutDetaching(Role::where("libelle", "admin")->first());

        $user=User::create([
            "prenom"=>"amadou",
            "nom"=>"diallo",
            "email"=>"ad@gmail.com",
            "situation_matrimoniale"=>"Marié",
            "date_naissance"=>Date::create(1980,2,7),
            'password' => Hash::make("29101997"),
            "telephone"=>"622457854",

        ]);

        $user->roles()->syncWithoutDetaching(Role::where("libelle", "tuteur")->first());


        $user=User::create([
            "prenom"=>"gando",
            "nom"=>"diallo",
            "email"=>"gd@gmail.com",
            "situation_matrimoniale"=>"Concubin",
            'password' => Hash::make("29101997"),
            "telephone"=>"621213862",

        ]);

        $user->roles()->syncWithoutDetaching(Role::where("libelle", "ofmg")->first());

        $user=User::create([
            "prenom"=>"amadou",
            "nom"=>"bah",
            "email"=>"ab@gmail.com",
            'password' => Hash::make("29101997"),
            "date_naissance"=>Date::create(1993,9,2),
            "situation_matrimoniale"=>"Divorcé",
            "telephone"=>"621230960",

        ]);

        $user->roles()->syncWithoutDetaching(Role::where("libelle", "tuteur")->first());
    }
}
