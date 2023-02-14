import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from "@mui/icons-material/Delete";
import {FormControl, TextField} from "@mui/material";

import {useEffect, useState} from "react";
import NumericFormat from "react-number-format";
import {format} from "date-fns";

export default function MuiConfirmDialogDelete(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <button type={"button"} onClick={handleClickOpen} className={props.classDelete?props.classDelete:`p-2 text-white bg-red-700 rounded hover:text-red-700 hover:bg-white transition duration-500`}>
                {
                    props.icon ? props.icon :
                        <DeleteIcon/>
                }
            </button>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Suppression
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button type={"button"} onClick={handleClose}
                            className={"p-2 text-white bg-red-500 rounded hover:text-red-400 hover:bg-white transition duration-500"}
                    >
                        Annuler
                    </button>

                    <button type={"button"} onClick={()=>
                            {
                                setOpen(false);
                                props.handleAction()
                            }
                        } autoFocus
                            className={"p-2 text-white bg-blue-700 rounded hover:text-blue-700 hover:bg-white transition duration-500"}
                    >
                        Valider
                    </button>
                </DialogActions>
            </Dialog>
        </>
    );
}



const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumericFormat
            isAllowed={(values) => {
                const {floatValue} = values;
                return ((floatValue >= 0 &&  floatValue <= props.max) || floatValue === undefined);
            }}
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator={true}

            suffix={props.devise==="eur"?" €":props.devise==="usd"?" $":""

            }
        />
    );
});

export function MuiConfirmDialogInfo(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <button onClick={handleClickOpen} className={`p-2 text-white bg-blue-700 rounded hover:text-blue-700 hover:bg-white transition duration-500`}>
                {
                    props.buttonText
                }
            </button>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.titre}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button type={"button"} onClick={handleClose}
                            className={"p-2 text-white bg-red-500 rounded hover:text-red-400 hover:bg-white transition duration-500"}
                    >
                        Annuler
                    </button>

                    <button type={"button"} onClick={()=>
                    {
                        setOpen(false);
                        props.handleAction()
                    }
                    } autoFocus
                            className={"p-2 text-white bg-blue-700 rounded hover:text-blue-700 hover:bg-white transition duration-500"}
                    >
                        Valider
                    </button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export function MuiConfirmDialogForm(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    return (
        <>
            <button type={"button"} onClick={handleClickOpen} className={`p-2 text-white bg-blue-700 rounded hover:text-blue-700 hover:bg-white transition duration-500`}>
                {
                    props.buttonText
                }
            </button>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.titre}
                </DialogTitle>
                <DialogContent>
                    {
                        props.date &&
                        <div className={"py-5"}>
                            <FormControl className="font-bold w-full">
                                <TextField value={props.date} type={"date"} className={"w-full"} InputLabelProps={{shrink:true}} name="date" label={"Date de l'opération"} onChange={props.onHandleChangeDate} required/>
                                {/*<InputError message={errors.date}/>*/}
                            </FormControl>
                        </div>
                    }

                    <DialogContentText id="alert-dialog-description">
                        {props.message}
                    </DialogContentText>

                    <div className={"w-full mt-5"}>
                        <TextField
                            InputProps={{
                                inputComponent: NumberFormatCustom,
                                inputProps:{
                                    max:props.inputValue,
                                    name:"quantite"

                                },
                            }}
                            value={props.quantite}
                            defaultValue={props.inputValue}
                            className={"w-full"} label="Quantite" name="quantite" onChange={props.onHandleChange}/>
                    </div>
                </DialogContent>
                <DialogActions>
                    <button type={"button"} onClick={handleClose}
                            className={"p-2 text-white bg-red-500 rounded hover:text-red-400 hover:bg-white transition duration-500"}
                    >
                        Annuler
                    </button>

                    <button type={"button"} onClick={()=>
                    {
                        setOpen(false);
                        props.handleAction()
                    }
                    } autoFocus
                            className={"p-2 text-white bg-blue-700 rounded hover:text-blue-700 hover:bg-white transition duration-500"}
                    >
                        Valider
                    </button>
                </DialogActions>
            </Dialog>
        </>
    );
}
