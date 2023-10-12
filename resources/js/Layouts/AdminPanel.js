import React, {useEffect} from 'react';
import Authenticated from "@/Layouts/Authenticated";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import {Divider} from "@mui/material";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Collapse, ListItemButton} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {Link} from "@inertiajs/inertia-react";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import { fr } from "date-fns/locale";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const drawerWidth = 240;

function ResponsiveDrawer(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const [open, setOpen] = React.useState("");

    useEffect(() => {
        props.active && setOpen(props.active);
    },[props.active])

    const handleClick = (id) => {
        open===id?setOpen(""):setOpen(id)
    };

    /*useEffect(() => {
        (props.sousActive==="liste" || props.sousActive==="inscrire") && handleClick("inscription")
    },[props.sousActive])*/

    const drawerEtablissementUser = (
        <List
            className={"orangeOrangeBackground h-full overflow-y-auto"}
            sx={{width: '100%',color:"white",paddingTop:8,backgroundColor:"#FF7900" }}
            component="nav"
        >
            <Link href={route("etablissement.index",props.auth.user.id)}>
                <ListItemButton sx={props.active==="vue"?{backgroundColor:"#bc5610",color:"white"}:null}>
                    <ListItemText primary="Vue d'ensemble"/>
                </ListItemButton>
            </Link>

            <Divider component="li" />
            {
                (props.auth.etablissement || props.auth.directeur)
                    &&
                    <>
                        <Link href={route("etablissement.anneeScolaire.index",props.auth.user.id)}>
                            <ListItemButton sx={props.active==="anneeScolaire"?{backgroundColor:"#bc5610",color:"white"}:null}>
                                <ListItemText primary="Annees Scolaires" />
                            </ListItemButton>
                        </Link>

                        {/*<Divider component="li" />

                        <ListItemButton sx={props.active==="contrat" ?{backgroundColor:"#bc5610",color:"white"}:null} onClick={()=>handleClick("contrat")}>
                            <ListItemText primary="Contrats"/>
                            {(open==="contrat" || props.active==="contrat") ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={open==="contrat"}>
                            <List component="div" disablePadding>
                                <Link href={route("etablissement.contrat.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="listeContrat"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Liste" />
                                    </ListItemButton>
                                </Link>

                                <Divider component="li"/>

                                <Link href={route("etablissement.contrat.create",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="creerContrat"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Créer" />
                                    </ListItemButton>
                                </Link>
                            </List>
                        </Collapse>*/}

                        {/*<Divider component="li" />

                        <Link href={route("etablissement.classe.index",props.auth.user.id)}>
                            <ListItemButton sx={props.active==="classe"?{backgroundColor:"#bc5610",color:"white"}:null}>
                                <ListItemText primary="Classes"/>
                            </ListItemButton>
                        </Link>*/}

                        {/*<Divider component="li" />
                        <Link href={route("etablissement.tarif.index",props.auth.user.id)}>
                            <ListItemButton sx={props.active==="Service" ?{backgroundColor:"#bc5610",color:"white"}:null}>
                                <ListItemText primary="Services"/>
                            </ListItemButton>
                        </Link>*/}

                    </>
            }

            {
                (props.auth.etablissement || props.auth.comptable)
                &&
                    <>
                        <ListItemButton sx={props.active==="fraisScolaires" ?{backgroundColor:"#bc5610",color:"white"}:null} onClick={()=>handleClick("fraisScolaires")}>
                            <ListItemText primary="Frais scolaires"/>
                            {(open==="fraisScolaires" || props.active==="fraisScolaires") ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={open==="fraisScolaires"}>

                            <Link href={route("etablissement.tarif.create",props.auth.user.id)}>
                                <ListItemButton sx={props.sousActive==="typeFraisAjout" ?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                    <ListItemText primary="Ajout type de frais"/>
                                </ListItemButton>
                            </Link>
                            <Divider component="li" />

                            <List component="div" disablePadding>
                                <Link href={route("etablissement.paiement.create",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="paiementFraisScolaires"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Déclaration paiement cash" />
                                    </ListItemButton>
                                </Link>

                                <Divider component="li"/>

                                <Link href={route("etablissement.paiement.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="listePaiementFraisScolaires"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Historique des paiements" />
                                    </ListItemButton>
                                </Link>
                            </List>
                        </Collapse>

                        <Divider component="li" />

                        {/*<ListItemButton sx={props.active==="inscription" ?{backgroundColor:"#bc5610",color:"white"}:null} onClick={()=>handleClick("inscription")}>
                            <ListItemText primary="Inscriptions"/>
                            {(open==="inscription" || props.active==="inscription") ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={open==="inscription"}>
                            <List component="div" disablePadding>
                                <Link href={route("etablissement.inscription.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="listeInscripton"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Liste" />
                                    </ListItemButton>
                                </Link>

                                <Divider component="li"/>

                                <Link href={route("etablissement.inscription.create",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="inscrire"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Inscrire" />
                                    </ListItemButton>
                                </Link>
                            </List>
                        </Collapse>

                        <Divider component="li"/>*/}

                        <ListItemButton sx={props.active==="gestionCursus" ?{backgroundColor:"#bc5610",color:"white"}:null} onClick={()=>handleClick("gestionCursus")}>
                            <ListItemText primary="Gestion du cursus"/>
                            {(open==="gestionCursus" || props.active==="gestionCursus") ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={open==="gestionCursus"}>
                            <List component="div" disablePadding>

                                <Link href={route("etablissement.classe.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="classe"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Classe"/>
                                    </ListItemButton>
                                </Link>

                                <Divider component="li"/>

                                <Link href={route("etablissement.inscription.create",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="inscrire"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Inscription" />
                                    </ListItemButton>
                                </Link>

                                <Divider component="li"/>

                                <Link href={route("etablissement.reinscription.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="reinscription"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Réinscription" />
                                    </ListItemButton>
                                </Link>

                                <Divider component="li"/>

                                <Link href={route("etablissement.inscription.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="listeInscription"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Liste des apprenants" />
                                    </ListItemButton>
                                </Link>

                                <Divider component="li"/>

                                <Link href={route("etablissement.tuteur.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="tuteur"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Tuteur" />
                                    </ListItemButton>
                                </Link>
                            </List>
                        </Collapse>

                        <Divider component="li"/>

                        <ListItemButton sx={props.active==="personnel" ?{backgroundColor:"#bc5610",color:"white"}:null} onClick={()=>handleClick("personnel")}>
                            <ListItemText primary="Gestion du personnel"/>
                            {(open==="personnel" || props.active==="personnel") ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={open==="personnel"}>
                            <List component="div" disablePadding>

                                <Link href={route("etablissement.personnel.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="listePersonnel"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Employés" />
                                    </ListItemButton>
                                </Link>
                            </List>

                            <Divider component="li"/>

                            <Link href={route("etablissement.contrat.create",props.auth.user.id)}>
                                <ListItemButton sx={props.sousActive==="creerContrat"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                    <ListItemText primary="Ajout employé" />
                                </ListItemButton>
                            </Link>

                            <Divider component="li"/>

                            <List component="div" disablePadding>

                                <Link href={route("etablissement.personnel.horaire.index",[props.auth.user.id])}>
                                    <ListItemButton sx={props.sousActive==="gestionHoraire"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Gestion horaire" />
                                    </ListItemButton>
                                </Link>
                            </List>


                        </Collapse>


                        <Divider component="li"/>

                        <ListItemButton sx={props.active==="salaire" ?{backgroundColor:"#bc5610",color:"white"}:null} onClick={()=>handleClick("salaire")}>
                            <ListItemText primary="Salaires"/>
                            {(open==="salaire" || props.active==="salaire") ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={open==="salaire"}>
                            <List component="div" disablePadding>
                                <Link href={route("etablissement.personnel.paiement.salaire",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="paiementSalaire"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Paiement des salaires" />
                                    </ListItemButton>
                                </Link>

                                <Divider component="li"/>

                                {
                                    (props.auth.user.niveauValidation ===2 || props.auth.etablissement)
                                        &&
                                    <>
                                        <Link href={route("etablissement.personnel.paiement.validationSalaire",props.auth.user.id)}>
                                            <ListItemButton sx={props.sousActive==="validationSalaire"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                                <ListItemText primary="Validation des paiements" />
                                            </ListItemButton>
                                        </Link>
                                        <Divider component="li"/>
                                    </>
                                }

                                <Link href={route("etablissement.personnel.paiement.historique",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="paiementHistorique"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Historique des paiements" />
                                    </ListItemButton>
                                </Link>
                            </List>
                        </Collapse>

                        <Divider component="li"/>

                        <ListItemButton sx={props.active==="rapport" ?{backgroundColor:"#bc5610",color:"white"}:null} onClick={()=>handleClick("rapport")}>
                            <ListItemText primary="Rapport"/>
                            {(open==="rapport" || props.active==="rapport") ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={open==="rapport"}>
                            <List component="div" disablePadding>
                                <Link href={route("etablissement.tarif.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="typeFraisListe"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Liste frais scolaire" />
                                    </ListItemButton>
                                </Link>

                                <Divider component="li"/>

                                <Link href={route("etablissement.scolarite.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="listePaiementScolarite"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Liste paiement scolarité" />
                                    </ListItemButton>
                                </Link>
                                <Link href={route("etablissement.personnel.paiement.ListePaiementRapport",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="listePaiement"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Liste paiement salaires" />
                                    </ListItemButton>
                                </Link>
                            </List>
                        </Collapse>
                        <Divider component="li"/>

                        <ListItemButton sx={props.active==="paramètrage" ?{backgroundColor:"#bc5610",color:"white"}:null} onClick={()=>handleClick("paramètrage")}>
                            <ListItemText primary="Paramètrage"/>
                            {(open==="paramètrage" || props.active==="paramètrage") ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>

                        <Collapse in={open==="paramètrage"}>
                            <List component="div" disablePadding>
                                <List component="div" disablePadding>

                                    <Link href={route("etablissement.fonction.index",props.auth.user.id)}>
                                        <ListItemButton sx={props.sousActive==="fonction"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                            <ListItemText primary="Fonctions" />
                                        </ListItemButton>
                                    </Link>
                                </List>

                                <Divider component="li"/>

                                <Link href={route("etablissement.cycle.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="cycle"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Cycles" />
                                    </ListItemButton>
                                </Link>

                                <Divider component="li"/>

                                <Link href={route("etablissement.departement.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="Département"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Départements" />
                                    </ListItemButton>
                                </Link>

                                <Divider component="li"/>

                                <Link href={route("etablissement.option.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="option"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Options" />
                                    </ListItemButton>
                                </Link>


                                <Divider component="li"/>

                                <Link href={route("etablissement.matiere.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="matiere"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Matières" />
                                    </ListItemButton>
                                </Link>

                                <Divider component="li"/>

                                <Link href={route("etablissement.niveau.index",props.auth.user.id)}>
                                    <ListItemButton sx={props.sousActive==="niveau"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                        <ListItemText primary="Niveaux" />
                                    </ListItemButton>
                                </Link>

                            </List>
                        </Collapse>
                    </>

            }


        </List>
    )

    const drawer = (
            <List
                className={"orangeOrangeBackground h-full overflow-y-auto"}
                sx={{color:"white",paddingTop:8 }}
                component="nav"
            >
                <Link href={route("admin.user.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="utilisateur" ?{backgroundColor:"#bc5610",color:"white"}:{backgroundColor:"#bc5610"}}>
                        <ListItemText primary="Utilisateurs" />
                    </ListItemButton>
                </Link>
                <Divider  component="li" />
                <Link href={route("admin.role.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="role" ?{backgroundColor:"#bc5610",color:"white"}:null}>
                        <ListItemText primary="Roles" />
                    </ListItemButton>
                </Link>
                <Divider  component="li"/>
                <Link href={route("admin.modePaiement.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="modePaiement" ?{backgroundColor:"#bc5610",color:"white"}:null}>
                        <ListItemText primary="Mode de paiement"/>
                    </ListItemButton>
                </Link>
                <Divider  component="li"/>
                <Link href={route("admin.codeNumero.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="codeNumero" ?{backgroundColor:"#bc5610",color:"white"}:null}>
                        <ListItemText primary="Code numero"/>
                    </ListItemButton>
                </Link>
                <Divider  component="li" />
                <Link href={route("admin.etablissement.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="etablissement" ?{backgroundColor:"#bc5610",color:"white"}:null}>
                        <ListItemText primary="Etablissements" />
                    </ListItemButton>
                </Link>
                <Divider  component="li" />
                <Link href={route("admin.typePaiement.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="typePaiement" ?{backgroundColor:"#bc5610",color:"white"}:null}>
                        <ListItemText primary="Type de frais" />
                    </ListItemButton>
                </Link>
                <Divider component="li" />
                <ListItemButton sx={props.active==="adresse" ?{backgroundColor:"#bc5610",color:"white"}:null} onClick={()=>handleClick("adresse")}>
                    <ListItemText primary="Adresses" />
                    {open=== "adresse" ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open=== "adresse"} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link href={route("admin.fonction.index",props.auth.user.id)}>
                            <ListItemButton sx={props.active==="fonction" ?{backgroundColor:"#bc5610",color:"white"}:null}>
                                <ListItemText primary="Fonctions"/>
                            </ListItemButton>
                        </Link>
                        <Divider  component="li"/>

                        <Link href={route("admin.region.index",props.auth.user.id)}>
                            <ListItemButton sx={props.sousActive==="region"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                <ListItemText primary="Regions" />
                            </ListItemButton>
                        </Link>
                        <Divider component="li" />
                        <Link href={route("admin.ville.index",props.auth.user.id)}>
                            <ListItemButton sx={props.sousActive==="ville"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                <ListItemText primary="Villes" />
                            </ListItemButton>
                        </Link>
                        <Divider component="li" />
                        <Link href={route("admin.commune.index",props.auth.user.id)}>
                            <ListItemButton sx={props.sousActive==="commune"?{color:"#e1c9bd",pl:4}:{pl:4}}>
                                <ListItemText primary="Communes" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>
                <Divider component="li" />
                <Link href={route("admin.cycle.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="cycle" ?{backgroundColor:"#bc5610",color:"white"}:null}>
                        <ListItemText primary="Cycles" />
                    </ListItemButton>
                </Link>
                <Divider  component="li" />
                <Link href={route("admin.niveau.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="niveau" ?{backgroundColor:"#bc5610",color:"white"}:null}>
                        <ListItemText primary="Niveaux" />
                    </ListItemButton>
                </Link>
                <Divider  component="li" />
                <Link href={route("admin.departement.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="departement" ?{backgroundColor:"#bc5610",color:"white"}:null}>
                        <ListItemText primary="Départements" />
                    </ListItemButton>
                </Link>
                <Divider  component="li"/>
                <Link href={route("admin.option.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="option" ?{backgroundColor:"#bc5610",color:"white"}:null}>
                        <ListItemText primary="Options"/>
                    </ListItemButton>
                </Link>
            </List>
    );

    function currentDrawer()
    {
        if(props.auth.admin || props.auth.ofmg)
        {
            return drawer
        }
        else if(props.auth.etablissement || props.auth.comptable || props.auth.directeur)
        {
            return drawerEtablissementUser
        }

    }

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    display: { xs: 'block', md: 'none' },
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    marginTop:"64px",
                    backgroundColor:"#FF7900",
                    zIndex:20
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Administration
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {currentDrawer()}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,zIndex:1 },
                    }}
                    open
                >
                    {currentDrawer()}
                </Drawer>
            </Box>
            <Box
                className={"bg-gray-100 min-h-screen flex flex-col justify-between"}
                component="main"
                sx={{flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                <Toolbar sx={{display: { xs: 'block', md: 'none'}}} />
                <div>
                    {props.children}
                </div>
                {/*<div className={'text-center'}>
                    <span>
                        Copyright © 2022, by Addvalis Enterprise
                    </span>
                </div>*/}
            </Box>
        </Box>
    );
}
function AdminPanel(props) {
    return (
        <LocalizationProvider adapterLocale={fr} dateAdapter={AdapterDateFns}>
            <Authenticated
                auth={props.auth}
                errors={props.errors}
            >
                <ResponsiveDrawer
                    auth={props.auth}
                    errors={props.errors}
                    active={props.active}
                    sousActive={props.sousActive}
                >
                    {props.children}
                </ResponsiveDrawer>


            </Authenticated>
        </LocalizationProvider>

    );
}


export default AdminPanel;
