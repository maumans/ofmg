<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PassportUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user=User::create([
            'nom' => 'OFMG',
            'prenom' => 'ORANGE',
            'login' => 'ussd',
            'password' => Hash::make('amadouDiallo1234')
        ]);

        $success['token'] = $user->createToken('authToken')->accessToken;
        $user->currentToken = $success['token'];
        $user->save();
    }
}
