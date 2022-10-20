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
            "login"=>"adminMau",
            "email"=>"admin@gmail.com",
            "titre"=>"M",
            "situation_matrimoniale"=>"Celibataire",
            'password' => Hash::make("12345678"),
            "date_naissance"=>Date::create(1997,5,9),
            "telephone"=>"621993863",

        ]);

        $user->roles()->syncWithoutDetaching(Role::where("libelle", "admin")->first());

        $user=User::create([
            "prenom"=>"amadou",
            "nom"=>"diallo",
            "login"=>"amadouDiallo",
            "email"=>"ad@gmail.com",
            "situation_matrimoniale"=>"Marié",
            "date_naissance"=>Date::create(1980,2,7),
            'password' => Hash::make("12345678"),
            "telephone"=>"622457854",

        ]);

        $user->roles()->syncWithoutDetaching(Role::where("libelle", "admin")->first());


    }
}
