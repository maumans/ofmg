import React, {useEffect, useState} from 'react';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    GridToolbar,
    useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';
import {Autocomplete, FormControl, InputLabel, MenuItem, Pagination, Select, TextField} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";

function Index(props) {

    const [apprenants,setApprenants] = useState();

    const {data,setData,post}=useForm({
        "libelle":"",
        "description":"",
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'prenom', headerName: 'PRENOM', width: 130 },
        { field: 'nom', headerName: 'NOM', width: 130 },
        { field: 'date_naissance', headerName: 'DATE DE NAISSANCE', width: 200 },
        { field: 'action', headerName: 'ACTION',width:400,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleShow(cellValues.row.id)} className={"p-2 text-white orangeBlueBackground"}>
                        Voir les details
                    </button>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white orangeBlueBackground"}>
                        modifier
                    </button>
                    <button onClick={()=>handleDelete(cellValues.row.id)} className={`bg-red-500 p-2 text-white`}>
                        supprimer
                    </button>
                </div>
            )
        },

    ];

    function handleDelete(id){
        confirm("Voulez-vous supprimer role") && Inertia.delete(route("etablissement.classe.destroy",[props.auth.user.id,id]),{preserveScroll:true})
    }

    function handleEdit(id){
        alert("EDIT"+id)
    }

    function handleShow(id){
        alert("SHOW"+id)
    }

    function handleSubmit(e)
    {
        e.preventDefault();

        post(route("etablissement.classe.store",props.auth.user.id),data)

    }

    useEffect(() => {
        setApprenants(props.classe.apprenants);
    },[props.classe.apprenants]);


    return (
        <AdminPanel auth={props.auth} error={props.error} active={"gestionCursus"} sousActive={"classe"}>
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl"}>
                       Apprenants de la {props.classe.libelle}
                    </div>

                    <div style={{width: '100%' }} className={"flex justify-center"}>
                        {
                            apprenants &&
                            <DataGrid
                                components={{
                                    Toolbar:GridToolbar,
                                }}
                                componentsProps={{
                                    columnMenu:{backgroundColor:"red",background:"yellow"},
                                }}
                                rows={apprenants}
                                columns={columns}
                               initialState={{
                                        pagination: {
                                            pageSize: 10,
                                        },
                                    }}
                                rowsPerPageOptions={[10,20,100]}
                                checkboxSelection
                                autoHeight
                            />
                        }
                    </div>
                </div>
            </div>
        </AdminPanel>
    );
}

export default Index;
