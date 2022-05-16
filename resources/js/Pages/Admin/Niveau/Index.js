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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Index(props) {

    const [niveaux,setNiveaux] = useState();

    const {data,setData,post}=useForm({
        "libelle":"",
        "cycle":""
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'libelle', headerName: 'NIVEAU', width: 130 },
        { field: 'cycle', headerName: 'CYCLE', width: 130,renderCell:(r)=>r.row.cycle?.libelle },
        { field: 'action', headerName: 'ACTION',width:350,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white bg-blue-300 rounded hover:text-blue-300 hover:bg-white transition duration-500"}>
                        <VisibilityIcon/> classes
                    </button>
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
        confirm("Voulez-vous supprimer cette cycle") && Inertia.delete(route("admin.niveau.destroy",[props.auth.user.id,id]),{preserveScroll:true})
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

        post(route("admin.niveau.store",props.auth.user.id),data,)

    }

    useEffect(() => {
        setNiveaux(props.niveaux);
    },[props.niveaux])


    return (
        <AdminPanel auth={props.auth} error={props.error} active={"niveau"}>
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl"}>
                        Gestions des niveaux
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5 "}>
                        <div className={"gap-4 grid md:grid-cols-3 grid-cols-1"}>
                            <div>
                                <TextField  name={"libelle"} label={"libelle"} value={data.libelle} onChange={(e)=>setData("libelle",e.target.value)} required/>
                                <div className={"flex text-red-600"}>{props.errors?.libelle}</div>
                            </div>
                            <div>
                                <FormControl className={"w-full"}>
                                    <Autocomplete
                                        className={"w-full"}
                                        id="tags-standard"
                                        onChange={(e,val)=>setData("cycle",val)}
                                        disablePortal={true}
                                        id={"combo-box-demo"}
                                        options={props.cycles}
                                        getOptionLabel={(option)=>option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"cycles"} label={params.libelle} required/>}
                                    />
                                </FormControl>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.cycle}</div>
                            </div>
                            <div className={"col-span-3"}>
                                <button className={"p-2 text-white bg-green-600 rounded hover:text-green-600 hover:bg-white hover:border hover:border-green-600 transition duration-500"} style={{height: 56}} type={"submit"}>
                                    Valider
                                </button>
                            </div>
                        </div>

                    </form>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            niveaux &&
                            <DataGrid
                                components={{
                                    Toolbar:GridToolbar,
                                }}
                                rows={niveaux}
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
