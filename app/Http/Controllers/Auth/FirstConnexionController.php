<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class FirstConnexionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function resetPassword($login,$mois=null)
    {
        return Inertia::render('Auth/FirstConnexion',["login"=>$login,"mois"=>$mois]);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'login' => 'required',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.


        User::where("login",$request->login)->first()->forceFill([
            'password' => Hash::make($request->password),
            "first_connexion"=>false,
            "password_change_date"=>Carbon::now()
        ])->save();

        // If the password was successfully reset, we will redirect the user back to
        // the application's home authenticated view. If there is an error we can
        // redirect them back to where they came from with their error message.

        return redirect()->route('login')->with('status',"Mot de passe modifié");
    }

}
