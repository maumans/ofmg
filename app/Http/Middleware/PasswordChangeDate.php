<?php

namespace App\Http\Middleware;

use App\Models\User;
use Carbon\CarbonPeriod;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class PasswordChangeDate
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
        $date=CarbonPeriod::create(Auth::user()->password_change_date,"1 month",Carbon::now());

        if($date->count()>=3)
        {
            return redirect()->route("firstConnexion.reset-password",["login" => Auth::user()->login,"mois"=>true]);
        }
        else
        {
            return $next($request);
        }

    }
}
