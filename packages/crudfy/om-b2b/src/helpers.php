<?php

if (!function_exists('omb2b')) {
    function omb2b(): Crudfy\OmB2b\OmB2b {
        return app(Crudfy\OmB2b\OmB2b::class);
    }
}
