import React, {useEffect, useState} from 'react';
import {DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector} from '@mui/x-data-grid';
import {Autocomplete, FormControl, InputLabel, MenuItem, Pagination, Select, TextField} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";

function Index(props) {

    const [villes,setVilles] = useState();

    const {data,setData,post}=useForm({
        "libelle":"",
        "region":""
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'libelle', headerName: 'VILLE', width: 130 },
        { field: 'region', headerName: 'REGION', width: 130,renderCell:(r)=>r.row.region?.libelle },
        { field: 'action', headerName: 'ACTION',width:350,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white bg-blue-300"}>
                        Voir les communes
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
        confirm("Voulez-vous supprimer cette region") && Inertia.delete(route("admin.ville.destroy",[props.auth.user.id,id]),{preserveScroll:true})
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

        post(route("admin.ville.store",props.auth.user.id),data,)

    }

    useEffect(() => {
        setVilles(props.villes);
    },[props.villes])


    return (
        <AdminPanel auth={props.auth} error={props.error} >
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl"}>
                        Gestions des villes
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5 "}>
                        <div className={"gap-4 grid grid-cols-1"}>
                            <div>
                                <TextField  name={"libelle"} label={"libelle"} value={data.libelle} onChange={(e)=>setData("libelle",e.target.value)}/>
                                <div className={"flex text-red-600"}>{props.errors?.libelle}</div>
                            </div>
                            <div className={"flex-1"}>
                                <FormControl >
                                    <Autocomplete
                                        id="tags-standard"
                                        onChange={(e,val)=>setData("region",val)}
                                        disablePortal={true}
                                        id={"combo-box-demo"}
                                        options={props.regions}
                                        getOptionLabel={(option)=>option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"regions"} label={params.libelle}/>}
                                    />
                                </FormControl>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.region}</div>
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
                            villes &&
                            <DataGrid
                                componentsProps={{
                                    columnMenu:{backgroundColor:"red",background:"yellow"},
                                    cell:{
                                        align:"center"
                                    }
                                }}
                                rows={villes}
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
