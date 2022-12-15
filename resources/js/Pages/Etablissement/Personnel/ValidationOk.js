import React, {useEffect, useState} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {Backdrop, CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";

function ValidationOk({auth,error}) {

    const [open,setOpen]=useState(true)

    axios.post(route("url.callback")).then((response)=>{
        console.log(response)
        setOpen(false)
    })
    .catch(function (error) {
        console.log(error);
    });

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <AdminPanel auth={auth} error={error} active={"salaire"} sousActive={"validationSalaire"}>

            {
                open ?

                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={open}
                        onClick={handleClose}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    :
                    <div className="space-y-4 p-5">
                        <div className={"text-blue-600"}>
                            Paiement des salaires effectués avec succès
                        </div>

                        <div>
                            <button onClick={()=>Inertia.get(route("etablissement.personnel.paiement.historique",auth.user.id))} className={"my-4 p-2 text-white orangeVertBackground rounded hover:text-green-700 hover:bg-white transition duration-500"}>
                                Consulter l'historique
                            </button>
                        </div>
                    </div>
            }

        </AdminPanel>

        );
}

export default ValidationOk;
