<?php

namespace crudfy\omB2b\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class OmB2BCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'om-b2b:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install Crudfy Orange Money B2B';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->warn("Installing OM B2B");
        Artisan::call('vendor:publish', ['--tag' => 'om-b2b.config']);
        $this->info("config published");//
        Artisan::call('vendor:publish', ['--tag' => 'om-b2b.migrations']);
        $this->info("migration published");
        Artisan::call('vendor:publish', ['--tag' => 'crudfy-om-b2b.models']);
        $this->info("models published");
        $this->info("OM B2B installed succeful");
    }
}
