import React, {useEffect, useState} from 'react';
import {DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector} from '@mui/x-data-grid';
import {Autocomplete, FormControl, InputLabel, MenuItem, Pagination, Select, TextField} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";

function Index(props) {

    const [roles,setRoles] = useState();

    const {data,setData,post}=useForm({
        "libelle":"",
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'libelle', headerName: 'LIBELLE', width: 130 },
        { field: 'action', headerName: 'ACTION',width:250,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
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
        confirm("Voulez-vous supprimer role") && Inertia.delete(route("admin.role.destroy",[props.auth.user.id,id]),{preserveScroll:true})
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

        post(route("admin.role.store",props.auth.user.id),data,)

    }

    useEffect(() => {
        setRoles(props.roles);
    },[props.roles])


    return (
        <AdminPanel auth={props.auth} error={props.error} >
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl"}>
                        Gestions des roles
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5"}>
                        <div className={"space-x-5 flex"}>
                            <div>
                                <TextField  name={"libelle"} label={"libelle"} value={data.libelle} onChange={(e)=>setData("libelle",e.target.value)}/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.libelle}</div>
                            </div>
                            <div>
                                <button className={"p-1 text-white bg-green-600"} type={"submit"}>
                                    Valider
                                </button>
                            </div>
                        </div>

                    </form>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            roles &&
                            <DataGrid
                                componentsProps={{
                                    columnMenu:{backgroundColor:"red",background:"yellow"},
                                    cell:{
                                        align:"center"
                                    }
                                }}
                                rows={roles}
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
