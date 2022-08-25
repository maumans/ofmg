<?php

namespace App\Http\Middleware;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FirstConnexion
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {

        //dd(Auth::user()->first_connexion);
        if(Auth::user()->first_connexion)
        {
            return redirect()->route("firstConnexion.reset-password",["email" => Auth::user()->email,"mois"=>false]);
        }
        else
        {
            return $next($request);
        }

    }
}
