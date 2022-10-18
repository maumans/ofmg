# OmB2b

[![Latest Version on Packagist][ico-version]][link-packagist]
[![Total Downloads][ico-downloads]][link-downloads]
[![Build Status][ico-travis]][link-travis]
[![StyleCI][ico-styleci]][link-styleci]

Ce package permet d'utiliser l'API B2B de Orange Money très facilement

## Installation

A travers Composer 
####  Ajouter le code suivant dans votre fichier composer.json

```
"repositories": [
    {
        "type": "vcs",
        "url":  "git@github.com:crudfy/om-b2b.git"
    }
]
```
En suite intaller la package avec la commande suivante:
``` bash
$ composer require crudfy/om-b2b
```

## Usage
### Etape 1: 
Entrer la commande suivante pour ajouter le fichier de configuration  omb-b2b.php dans 
le dossier config de votre projet
```
php artisan om-b2b:install
```
## Change log

Please see the [changelog](changelog.md) for more information on what has changed recently.

## Testing

``` bash
$ composer test
```

## Contributing

Please see [contributing.md](contributing.md) for details and a todolist.

## Security

If you discover any security related issues, please email author@email.com instead of using the issue tracker.

## Credits

- [Author Name][link-author]
- [All Contributors][link-contributors]

## License

MIT. Please see the [license file](license.md) for more information.

[ico-version]: https://img.shields.io/packagist/v/crudfy/om-b2b.svg?style=flat-square
[ico-downloads]: https://img.shields.io/packagist/dt/crudfy/om-b2b.svg?style=flat-square
[ico-travis]: https://img.shields.io/travis/crudfy/om-b2b/master.svg?style=flat-square
[ico-styleci]: https://styleci.io/repos/12345678/shield

[link-packagist]: https://packagist.org/packages/crudfy/om-b2b
[link-downloads]: https://packagist.org/packages/crudfy/om-b2b
[link-travis]: https://travis-ci.org/crudfy/om-b2b
[link-styleci]: https://styleci.io/repos/12345678
[link-author]: https://github.com/crudfy
[link-contributors]: ../../contributors
