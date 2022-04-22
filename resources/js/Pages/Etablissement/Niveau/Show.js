import React, {useEffect, useState} from 'react';
import {DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector} from '@mui/x-data-grid';
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
                    <button onClick={()=>handleShow(cellValues.row.id)} className={"p-2 text-white bg-blue-400"}>
                        Voir les details
                    </button>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white bg-blue-700"}>
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
        confirm("Voulez-vous supprimer role") && Inertia.delete(route("etablissement.niveau.destroy",[props.auth.user.id,id]),{preserveScroll:true})
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

        post(route("etablissement.niveau.store",props.auth.user.id),data)

    }

    useEffect(() => {
        setApprenants(props.niveau.apprenants);
    },[props.niveau.apprenants]);


    return (
        <AdminPanel auth={props.auth} error={props.error} >
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl"}>
                       Liste des eleves de la {props.niveau.description}
                    </div>

                    {
                        /*

                                            <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5"}>

                        <div className={"gap-4 grid md:grid-cols-3 grid-cols-1 items-center"}>
                            <div>
                                <TextField  name={"libelle"} label={"libelle"} value={data.libelle} onChange={(e)=>setData("libelle",e.target.value)}/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.libelle}</div>
                            </div>
                            <div>
                                <TextField  name={"description"} label={"description"} value={data.description} onChange={(e)=>setData("description",e.target.value)}/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.description}</div>
                            </div>
                            <div>
                                <button className={"p-3 text-white bg-green-600 rounded"} type={"submit"}>
                                    Valider
                                </button>
                            </div>
                        </div>

                    </form>

                         */
                    }

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            apprenants &&
                            <DataGrid
                                componentsProps={{
                                    columnMenu:{backgroundColor:"red",background:"yellow"},
                                }}
                                rows={apprenants}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
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
