import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, AlertTitle, Snackbar} from "@mui/material";

function SnackBar(props) {

    const [open, setOpen] = useState(false);
    /*
        const [error, setError] = useState(null)
        const [success, setSuccess] = useState(null)



        useEffect(() => {
            setError(props.error)
        },[props.error])

        useEffect(() => {
            setSuccess(props.success)
        },[props.success])

        useEffect(() => {
            success ? setOpen(true) : setOpen(false);
        },[success])

        useEffect(() => {
            error ? setOpen(true) : setOpen(false);
        },[error])

         */

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
                autoHideDuration={4000}
                onClose={()=>{
                    props.update && props.update()
                    setOpen(false);
                }}
            >
                <Alert className={"text-2xl"} variant="filled" onClose={()=>{
                    props.update && props.update()
                    setOpen(false)
                }} severity={props.success?"success":"error"} sx={{ width: '100%' }}>
                    <AlertTitle>{props.success?"Succès":"Erreur"}</AlertTitle>
                    <strong className="text-3xl p-5">
                        {props.success && props.success}
                        {props.error && props.error}
                    </strong>
                </Alert>
            </Snackbar>
        </div>
    );
}

export default SnackBar;
