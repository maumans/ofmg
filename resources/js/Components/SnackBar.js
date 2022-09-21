import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, AlertTitle, Snackbar} from "@mui/material";

function SnackBar(props) {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        props.success ? setOpen(true) : setOpen(false);
    },[props.success])

    useEffect(() => {
        props.error ? setOpen(true) : setOpen(false);
    },[props.error])

    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical:"top", horizontal:"right" }}
                color={"success"}
                open={open}
                autoHideDuration={2000}
                onClose={()=>{
                    props.update && props.update()
                    setOpen(false);
                }}
            >
                <Alert className={"text-2xl"}  onClose={()=>{
                    props.update && props.update()
                    setOpen(false)
                }} severity={props.success?"success":"error"} sx={{ width: '100%' }}>
                    <AlertTitle>
                        {props.success ? "Succès":"Erreur"}

                    </AlertTitle>
                    <strong className="text-2xl p-5">
                        {props.success ? props.success:props.error}
                    </strong>
                </Alert>
            </Snackbar>
        </div>
    );
}

export default SnackBar;
