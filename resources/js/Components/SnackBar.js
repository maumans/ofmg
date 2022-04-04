import React, {useEffect, useState} from 'react';
import {Snackbar} from "@mui/material";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function SnackBar(props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        props.success ? setOpen(true) : setOpen(false);
    },[props.success])

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={()=>setOpen(false)}>
                UNDO
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={()=>setOpen(false)}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div>

            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={()=>setOpen(false)}
                message="Note archived"
                action={action}
            />
        </div>
    );
}

export default SnackBar;
