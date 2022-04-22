import React, {useState} from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import {Link} from '@inertiajs/inertia-react';

import {createTheme, ThemeProvider} from '@mui/material/styles';
import {frFR} from '@mui/material/locale';
import {frFR as dgfrFR} from '@mui/x-data-grid';


const theme = createTheme(
    {
        typography: {
            "fontFamily": `"BioRhyme", sans-serif`,
            "fontSize": 14,
            "fontWeightLight": 300,
            "fontWeightRegular": 400,
            "fontWeightMedium": 500
        },
        palette: {
            primary: {main: '#1976d2'},
        },
    },
    frFR,
    dgfrFR
);


export default function Authenticated({auth, header, children}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <ThemeProvider theme={theme}>
            <div className="min-h-screen bg-gray-100 z-40">
                <nav className="bg-white fixed w-full z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="shrink-0 flex items-center">
                                    <Link href="/">
                                        <div className={"text-3xl font-bold text-orange-400"}>
                                           E-School
                                        </div>
                                    </Link>
                                </div>

                                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                    <NavLink href={route('welcome')} active={route().current('welcome')}>
                                        Accueil
                                    </NavLink>
                                    {

                                        auth?.tuteur &&
                                        <NavLink href={route('tuteur.paiement.index',[auth?.user.id])} active={route().current('tuteur.paiement.index') || route().current('tuteur.paiement.search')}>
                                            Paiement
                                        </NavLink>
                                    }

                                    {
                                        !auth.user &&
                                       <>
                                           <NavLink href={route('login')} className="text-sm text-gray-700 underline">
                                               Connexion
                                           </NavLink>

                                           <NavLink href={route('register')} className="ml-4 text-sm text-gray-700 underline">
                                               Inscription
                                           </NavLink>
                                       </>
                                    }
                                    {

                                        auth?.admin &&
                                        <NavLink href={route('admin.user.index', auth.user?.id)}
                                                 active={route().current().split('.')[0] === "admin"}>
                                            Administration
                                        </NavLink>
                                    }
                                    {

                                        auth?.etablissement &&
                                        <NavLink href={route('etablissement.index', auth.user?.id)}
                                                 active={route().current().split('.')[0] === "etablissement"}>
                                            Gestion de l'etablissement
                                        </NavLink>
                                    }
                                </div>
                            </div>

                            <div className="hidden sm:flex sm:items-center sm:ml-6">
                                <div className="ml-3 relative">
                                    {
                                        auth.user ?
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        {auth?.user?.prenom + " " + auth?.user?.nom}

                                                        <svg
                                                            className="ml-2 -mr-0.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                                </Dropdown.Trigger>

                                                <Dropdown.Content>
                                                    <Dropdown.Link href={route('logout')} method="post"
                                                                   as="button">
                                                        Deconnexion
                                                    </Dropdown.Link>
                                                </Dropdown.Content>
                                            </Dropdown>
                                            :
                                            <>
                                                {
                                                    auth?.tuteur &&
                                                    <Link href={route('paiement.index')} className="text-sm text-white">
                                                        paiement
                                                    </Link>
                                                }

                                                <Link href={route('login')} className="text-sm text-white">
                                                    connexion
                                                </Link>

                                                <Link href={route('register')}
                                                      className="ml-4 text-sm text-white">
                                                    Inscription
                                                </Link>
                                            </>
                                    }
                                </div>
                            </div>



                            <div className="-mr-2 flex items-center sm:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink href={route('welcome')} active={route().current('welcome')}>
                                Accueil
                            </ResponsiveNavLink>
                        </div>

                        {
                            auth.user
                                ?
                                <div className="pt-4 pb-1 border-t border-gray-200">
                                    <div className="px-4">
                                        <div className="font-medium text-base text-gray-800">{auth?.user?.prenom+" ".auth?.user?.nom}</div>
                                        <div className="font-medium text-sm text-gray-500">{auth?.user?.email}</div>
                                    </div>

                                    <div className="mt-3 space-y-1">
                                        <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                            Deconnexion
                                        </ResponsiveNavLink>
                                    </div>
                                </div>
                                :
                                <div className={"z-20"}>
                                    {
                                        auth?.tuteur &&
                                        <ResponsiveNavLink href={route('paiement.index')} as="button">
                                            Paiement
                                        </ResponsiveNavLink>
                                    }

                                    {

                                        auth?.admin &&
                                        <ResponsiveNavLink href={route('admin.user.index', auth.user?.id)}
                                                 active={route().current().split('.')[0] === "admin"} as="button">
                                            Administration
                                        </ResponsiveNavLink>
                                    }
                                    {

                                        auth?.etablissement &&
                                        <ResponsiveNavLink href={route('etablissement.index', auth.user?.id)}
                                                 active={route().current().split('.')[0] === "etablissement"} as="button">
                                            Gestion de l'etablissement
                                        </ResponsiveNavLink>
                                    }
                                    <ResponsiveNavLink href={route('login')} as="button">
                                        Connexion
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('register')} as="button">
                                        Inscription
                                    </ResponsiveNavLink>
                                </div>


                        }
                    </div>
                </nav>

                <main style={{paddingTop: 64}}>
                    {children}
                </main>
            </div>
        </ThemeProvider>

    );
}
