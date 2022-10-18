<?php

namespace Crudfy\OmB2b;

use Crudfy\OmB2b\Commands\OmB2BCommand;
use Illuminate\Support\ServiceProvider;
require_once __DIR__.'/helpers.php';

class OmB2bServiceProvider extends ServiceProvider
{
    /**
     * Perform post-registration booting of services.
     *
     * @return void
     */
    public function boot(): void
    {
        // $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'crudfy');
        // $this->loadViewsFrom(__DIR__.'/../resources/views', 'crudfy');
        // $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        // $this->loadRoutesFrom(__DIR__.'/routes.php');

        // Publishing is only necessary when using the CLI.
        if ($this->app->runningInConsole()) {
            $this->bootForConsole();
        }

        config()->set('logging.channels.om-b2b', [
            'driver' => 'daily',
            'path' => storage_path('logs/om-b2b.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'days' => 336,
        ]);
    }

    /**
     * Register any package services.
     *
     * @return void
     */
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/om-b2b.php', 'om-b2b');
        $this->mergeConfigFrom(__DIR__.'/../config/om-b2b-db.php', 'om-b2b-db');

        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        // Register the service the package provides.
        $this->app->singleton('om-b2b', function ($app) {
            return new OmB2b;
        });
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return ['om-b2b'];
    }

    /**
     * Console-specific booting.
     *
     * @return void
     */
    protected function bootForConsole(): void
    {
        // Publishing the configuration file.
        $this->publishes([
            __DIR__.'/../config/om-b2b.php' => config_path('om-b2b.php'),
        ], 'om-b2b.config');

        // Publishing the views.
        /*$this->publishes([
            __DIR__.'/../resources/views' => base_path('resources/views/vendor/crudfy'),
        ], 'om-b2b.views');*/

        // Publishing assets.
        /*$this->publishes([
            __DIR__.'/../resources/assets' => public_path('vendor/crudfy'),
        ], 'om-b2b.views');*/

        // Publishing the translation files.
        /*$this->publishes([
            __DIR__.'/../resources/lang' => resource_path('lang/vendor/crudfy'),
        ], 'om-b2b.views');*/

        // Registering package commands.
         $this->commands([OmB2BCommand::class]);

        // Publishing the migrations.
        $this->publishes([
            __DIR__.'/../database/migrations' => base_path('database/migrations'),
        ], 'om-b2b.migrations');

        // Publishing the migrations.
        $this->publishes([
            __DIR__.'/Models' => app_path('Models'),
        ], 'crudfy-om-b2b.models');
    }
}
