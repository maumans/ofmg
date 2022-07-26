import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import {useState} from "react";

export default function ResponsiveModal  (buttonOpen, titre,contenu, buttonAction){
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return(
        <>
            <button onClick={handleClickOpen}>
                <buttonOpen/>
            </button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" >
                    {titre && titre}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        {contenu && contenu}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} >
                        Fermer
                    </Button>
                    <>
                        {buttonAction && buttonAction}
                    </>
                </DialogActions>
            </Dialog>
        </>
    )
}
