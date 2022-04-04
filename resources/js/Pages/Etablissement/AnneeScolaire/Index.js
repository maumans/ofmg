import React, {useEffect, useState} from 'react';
import {DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector} from '@mui/x-data-grid';
import {Autocomplete, FormControl, InputLabel, MenuItem, Pagination, Select, TextField} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Index(props) {

    const [anneeScolaires,setAnneeScolaires] = useState();

    const {data,setData,post}=useForm({
        "dateDebut":"",
        "dateFin":"",
    });

    const columns = [
        { field: 'id', headerName: 'ID', width:100 },
        { field: 'dateDebut', headerName: 'DATE DE DEBUT', width: 200 },
        { field: 'dateFin', headerName: 'DATE DE FIN', width: 200 },
        { field: 'action', headerName: 'ACTION',width:250,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white bg-blue-700 rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
                        <EditIcon/>
                    </button>
                    <button onClick={()=>handleDelete(cellValues.row.id)} className={`bg-red-500 p-2 text-white bg-red-700 rounded hover:text-red-700 hover:bg-white transition duration-500`}>
                        <DeleteIcon/>
                    </button>
                </div>
            )
        },

    ];

    function handleDelete(id){
        confirm("Voulez-vous supprimer cette anné scolaire") && Inertia.delete(route("etablissement.anneeScolaire.destroy",[props.auth.user.id,id]),{preserveScroll:true})
    }

    function handleEdit(id){

    }

    function handleShow(id){
        alert("SHOW"+id)
    }

    function handleSubmit(e)
    {
        e.preventDefault();

        post(route("etablissement.anneeScolaire.store",props.auth.user.id),data)

    }

    useEffect(() => {
        setAnneeScolaires(props.anneeScolaires);
    },[props.anneeScolaires]);



    return (
        <AdminPanel auth={props.auth} error={props.error} active={"anneeScolaire"}>
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl text-white bg-orange-400 rounded text-white p-2"}>
                        Gestions des annees scolaires
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5"}>
                        <div className={"border p-5 rounded space-y-5"}>
                            <div className={"text-lg font-bold"}>
                                Ajouter une année scolaire
                            </div>
                            <div className={"space-x-5 flex items-center"}>
                                <div>
                                    <div>Date de debut</div>
                                    <TextField inputProps={{type:"date"}}  name={"dateDebut"} value={data.dateDebut} onChange={(e)=>setData("dateDebut",e.target.value)}/>
                                    <div className={"flex my-2 text-red-600"}>{props.errors?.dateDebut}</div>
                                </div>
                                <div>
                                    <div>Date de fin</div>
                                    <TextField inputProps={{type:"date"}}  name={"dateFin"} value={data.dateFin} onChange={(e)=>setData("dateFin",e.target.value)}/>
                                    <div className={"flex my-2 text-red-600"}>{props.errors?.dateFin}</div>
                                </div>
                                <button className={"p-3 text-white bg-green-600 rounded"} type={"submit"}>
                                    Enregistrer
                                </button>
                            </div>
                        </div>



                    </form>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            anneeScolaires &&
                            <DataGrid
                                componentsProps={{
                                    columnMenu:{backgroundColor:"red",background:"yellow"},
                                }}
                                rows={anneeScolaires}
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
