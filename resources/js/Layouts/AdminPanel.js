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


const drawerWidth = 240;

function ResponsiveDrawer(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const [open, setOpen] = React.useState("");

    const handleClick = (id) => {
        open===id?setOpen(""):setOpen(id)
    };

    const drawerEtablissementUser = (
        <List
            className={"bg-orange-500"}
            sx={{width: '100%',height:"100%",color:"white",bgColor:"#ff7900",paddingTop:8 }}
            component="nav"
        >
            <Link href={route("etablissement.index",props.auth.user.id)}>
                <ListItemButton sx={props.active==="vue"?{backgroundColor:"#dd5800",color:"white"}:null}>
                    <ListItemText primary="Vue d'ensemble" />
                </ListItemButton>
            </Link>

            <Divider component="li" />
            <Link href={route("etablissement.anneeScolaire.index",props.auth.user.id)}>
                <ListItemButton sx={props.active==="anneeScolaire"?{backgroundColor:"#dd5800",color:"white"}:null}>
                    <ListItemText primary="Annees Scolaires" />
                </ListItemButton>
            </Link>

            <Divider component="li" />
            <Link href={route("etablissement.classe.index",props.auth.user.id)}>
                <ListItemButton sx={props.active==="classe"?{backgroundColor:"#dd5800",color:"white"}:null}>
                    <ListItemText primary="Classes" />
                </ListItemButton>
            </Link>
            <Divider component="li"/>

            <ListItemButton sx={props.active==="inscription" ?{backgroundColor:"#dd5800",color:"white"}:null} onClick={()=>handleClick("inscription")}>
                <ListItemText primary="Inscriptions"/>
                {open==="inscription" ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open==="inscription"} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <Link href={route("etablissement.inscription.index",props.auth.user.id)}>
                        <ListItemButton sx={props.sousActive==="liste"?{backgroundColor:"#dd5800",color:"white",pl:4}:{pl:4}}>
                            <ListItemText primary="Liste" />
                        </ListItemButton>
                    </Link>
                    <Divider component="li"/>
                    <Link href={route("etablissement.inscription.create",props.auth.user.id)}>
                        <ListItemButton sx={props.sousActive==="inscrire"?{backgroundColor:"#dd5800",color:"white",pl:4}:{pl:4}}>
                            <ListItemText primary="Inscrire" />
                        </ListItemButton>
                    </Link>
                </List>
            </Collapse>
            <Divider component="li" />
            <Link href={route("etablissement.tarif.index",props.auth.user.id)}>
                <ListItemButton sx={props.active==="Services" ?{backgroundColor:"#dd5800",color:"white"}:null}>
                    <ListItemText primary="Tarifs" />
                </ListItemButton>
            </Link>
            <Divider component="li" />
            <Link href={route("etablissement.paiement.create",props.auth.user.id)}>
                <ListItemButton sx={props.active==="paiement" ?{backgroundColor:"#dd5800",color:"white"}:null}>
                    <ListItemText primary="Paiements" />
                </ListItemButton>
            </Link>
        </List>
            )


    const drawer = (
            <List
                className={"bg-orange-500"}
                sx={{width: '100%',height:"100%",color:"white",bgColor:"#ff7900",paddingTop:8 }}
                component="nav"
            >
                <Link href={route("admin.user.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="utilisateur" ?{backgroundColor:"#dd5800",color:"white"}:null}>
                        <ListItemText primary="Utilisateurs" />
                    </ListItemButton>
                </Link>
                <Divider  component="li" />
                <Link href={route("admin.role.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="role" ?{backgroundColor:"#dd5800",color:"white"}:null}>
                        <ListItemText primary="Roles" />
                    </ListItemButton>
                </Link>
                <Divider  component="li" />
                <Link href={route("admin.etablissement.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="etablissement" ?{backgroundColor:"#dd5800",color:"white"}:null}>
                        <ListItemText primary="Etablissements" />
                    </ListItemButton>
                </Link>
                <Divider  component="li" />
                <Link href={route("admin.typePaiement.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="typePaiement" ?{backgroundColor:"#dd5800",color:"white"}:null}>
                        <ListItemText primary="Type de frais" />
                    </ListItemButton>
                </Link>
                <Divider component="li" />
                <ListItemButton sx={props.active==="adresse" ?{backgroundColor:"#dd5800",color:"white"}:null} onClick={()=>handleClick("adresse")}>
                    <ListItemText primary="Adresse" />
                    {open=== "adresse" ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open=== "adresse"} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link href={route("admin.region.index",props.auth.user.id)}>
                            <ListItemButton sx={props.sousActive==="region"?{backgroundColor:"#dd5800",color:"white",pl:4}:{pl:4}}>
                                <ListItemText primary="Regions" />
                            </ListItemButton>
                        </Link>
                        <Divider component="li" />
                        <Link href={route("admin.ville.index",props.auth.user.id)}>
                            <ListItemButton sx={props.sousActive==="ville"?{backgroundColor:"#dd5800",color:"white",pl:4}:{pl:4}}>
                                <ListItemText primary="Villes" />
                            </ListItemButton>
                        </Link>
                        <Divider component="li" />
                        <Link href={route("admin.commune.index",props.auth.user.id)}>
                            <ListItemButton sx={props.sousActive==="commune"?{backgroundColor:"#dd5800",color:"white",pl:4}:{pl:4}}>
                                <ListItemText primary="Communes" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>
                <Divider component="li" />
                <Link href={route("admin.cycle.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="cycle" ?{backgroundColor:"#dd5800",color:"white"}:null}>
                        <ListItemText primary="Cycles" />
                    </ListItemButton>
                </Link>
                <Divider  component="li" />
                <Link href={route("admin.niveau.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="niveau" ?{backgroundColor:"#dd5800",color:"white"}:null}>
                        <ListItemText primary="Niveaux" />
                    </ListItemButton>
                </Link>
                <Divider  component="li" />
                <Link href={route("admin.departement.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="departement" ?{backgroundColor:"#dd5800",color:"white"}:null}>
                        <ListItemText primary="Departements" />
                    </ListItemButton>
                </Link>
                <Divider  component="li"/>
                <Link href={route("admin.option.index",props.auth.user.id)}>
                    <ListItemButton sx={props.active==="option" ?{backgroundColor:"#dd5800",color:"white"}:null}>
                        <ListItemText primary="Options"/>
                    </ListItemButton>
                </Link>
            </List>
    );

    function currentDrawer()
    {
        if(props.auth.admin)
        {
            return drawer
        }
        else if(props.auth.etablissement)
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
                    backgroundColor:"#ff7900",
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
            <Box component="main" sx={{ flexGrow: 1}}>
                <Toolbar sx={{display: { xs: 'block', md: 'none'}}} />
                <div>
                    {props.children}
                </div>
            </Box>
        </Box>
    );
}
function AdminPanel(props) {
    return (
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
    );
}


export default AdminPanel;
