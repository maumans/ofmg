import React, {useEffect, useState} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";

function ValidationOk({auth,error}) {

    const [loader,setLoader]=useState(true)

    axios.post(route("url.callback")).then((response)=>{
        console.log(response)
        setLoader(false)
    })
    .catch(function (error) {
        console.log(error);
    });

    return (
        <AdminPanel auth={auth} error={error} active={"salaire"} sousActive={"validationSalaire"}>

            {
                loader ?

                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
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
