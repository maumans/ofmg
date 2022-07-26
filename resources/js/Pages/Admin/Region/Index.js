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
import VisibilityIcon from "@mui/icons-material/Visibility";
import SnackBar from "@/Components/SnackBar";

function Index(props) {

    const [regions,setRegions] = useState();

    const {data,setData,post,reset}=useForm({
        "libelle":"",
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'libelle', headerName: 'REGION', width: 250 },
        { field: 'action', headerName: 'ACTION',width:300,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white bg-blue-300 rounded hover:text-blue-300 hover:bg-white transition duration-500"}>
                        <VisibilityIcon/> villes
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
        confirm("Voulez-vous supprimer cette region") && Inertia.delete(route("admin.region.destroy",[props.auth.user.id,id]),{preserveScroll:true})
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

        post(route("admin.region.store",props.auth.user.id),{data,onSuccess: ()=>reset("libelle")})

    }

    useEffect(() => {
        setRegions(props.regions);
    },[props.regions])


    return (
        <AdminPanel auth={props.auth} error={props.error} sousActive={"region"} active={"adresse"}>
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl"}>
                        Gestion des regions
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5"}>
                        <div className={"space-x-5 flex"}>
                            <div>
                                <TextField  name={"libelle"} label={"libelle"} value={data.libelle} onChange={(e)=>setData("libelle",e.target.value)}/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.libelle}</div>
                            </div>
                            <div>
                                <button className={"p-2 text-white bg-green-600 rounded hover:text-green-600 hover:bg-white hover:border hover:border-green-600 transition duration-500"} style={{height: 56}} type={"submit"} style={{height: 56}}>
                                    Valider
                                </button>
                            </div>
                        </div>

                    </form>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            regions &&
                            <DataGrid
                                components={{
                                    Toolbar:GridToolbar,
                                }}
                                rows={regions}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                autoHeight
                            />
                        }
                    </div>
                    <SnackBar success={ props.success }/>
                </div>
            </div>
        </AdminPanel>
    );
}

export default Index;
