import React from 'react';
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

    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };


    const drawer = (
            <List
                className={"bg-orange-500"}
                sx={{width: '100%',height:"100%",color:"white",bgColor:"#ff7900" }}
                component="nav"
            >
                <Link href={route("admin.user.index",props.auth.user.id)}>
                    <ListItemButton>
                        <ListItemText primary="Utilisateurs" />
                    </ListItemButton>
                </Link>
                <Divider  component="li" />
                <Link href={route("admin.role.index",props.auth.user.id)}>
                    <ListItemButton>
                        <ListItemText primary="Roles" />
                    </ListItemButton>
                </Link>
                <Divider  component="li" />
                <Link href={route("admin.etablissement.index",props.auth.user.id)}>
                    <ListItemButton>
                        <ListItemText primary="Etablissements" />
                    </ListItemButton>
                </Link>
                <Divider  component="li" />
                <ListItemButton>
                    <ListItemText primary="Apprenants" />
                </ListItemButton>
                <Divider component="li" />
                <ListItemButton>
                    <ListItemText primary="Personnels" />
                </ListItemButton>
                <Divider component="li" />
                <ListItemButton>
                    <ListItemText primary="type d'operations" />
                </ListItemButton>
                <Divider component="li" />
                <ListItemButton>
                    <ListItemText primary="Tuteurs" />
                </ListItemButton>
                <Divider component="li" />
                <ListItemButton onClick={handleClick}>
                    <ListItemText primary="Adresse" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemText primary="Regions" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
    );

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
                    zIndex:1
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
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,zIndex:1 },
                    }}
                    open
                >
                    {drawer}
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
           >
               {props.children}
           </ResponsiveDrawer>


       </Authenticated>
    );
}


export default AdminPanel;
