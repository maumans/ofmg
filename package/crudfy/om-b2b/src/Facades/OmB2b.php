<?php

namespace Crudfy\OmB2b\Facades;

use Illuminate\Support\Facades\Facade;

class OmB2b extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor(): string
    {
        return 'om-b2b';
    }
}
