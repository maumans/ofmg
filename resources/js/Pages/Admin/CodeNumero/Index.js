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
import SnackBar from "@/Components/SnackBar";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

function Index(props) {

    const [codeNumeros,setCodeNumeros] = useState();

    const {data,setData,post,reset}=useForm({
        "libelle":"",
        "libelleEdit":"",
        "editId":""
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'libelle', headerName: 'LIBELLE', width: 250 },
        { field: 'editer', headerName: 'EDITER',width:250,hide: data.editId==="",
            renderCell:(cellValues)=>(
                data.editId===cellValues.row.id &&
                <div>
                    <TextField variant={"standard"}  name={"libelleEdit"} label={"libelle"} value={data.libelleEdit} onChange={(e)=>setData("libelleEdit",e.target.value)}/>
                    <div className={"flex my-2 text-red-600"}>{props.errors?.libelleEdit}</div>
                </div>
            )
        },
        { field: 'action', headerName: 'ACTION',width:250,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    {
                        data.editId===cellValues.row.id &&
                        <>
                            <button onClick={()=>setData("editId","")} className={"p-2 text-white bg-red-500 rounded hover:text-red-700 hover:bg-white transition duration-500"}>
                                <CloseIcon/>
                            </button>
                            <button onClick={handleSubmitEdit} className={"p-2 text-white bg-green-500 rounded hover:text-green-700 hover:bg-white transition duration-500"}>
                                <CheckIcon/>
                            </button>
                        </>
                    }
                    {
                        data.editId !==cellValues.row.id &&
                        <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white bg-blue-700 rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
                            <EditIcon/>
                        </button>
                    }

                    <button onClick={()=>handleDelete(cellValues.row.id)} className={`bg-red-500 p-2 text-white bg-red-700 rounded hover:text-red-700 hover:bg-white transition duration-500`}>
                        <DeleteIcon/>
                    </button>
                </div>
            )
        },

    ];

    function handleDelete(id){
        confirm("Voulez-vous supprimer ce code") && Inertia.delete(route("admin.codeNumero.destroy",[props.auth.user.id,id]),{preserveScroll:true})
    }

    function handleEdit(id){
        setData("editId",id)
    }

    useEffect(() => {
        setData("libelleEdit","")
    },[data.editId])

    function handleSubmitEdit(){
        Inertia.put(route("admin.codeNumero.update",[props.auth.user.id,data.editId]),data,{preserveScroll:true});
    }

    function handleSubmit(e)
    {
        e.preventDefault();

        post(route("admin.codeNumero.store",props.auth.user.id),{data,onSuccess: ()=>reset("libelle")})

    }

    useEffect(() => {
        setCodeNumeros(props.codeNumeros);
    },[props.codeNumeros])


    return (
        <AdminPanel auth={props.auth} error={props.error} active={"codeNumero"}>
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl"}>
                        Gestion des codes de numéro
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5"}>
                        <div className={"space-y-5"}>
                            <div>
                                <TextField  name={"libelle"} label={"libelle"} value={data.libelle} onChange={(e)=>setData("libelle",e.target.value)}/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.libelle}</div>
                            </div>
                            <div>
                                <button className={"p-2 text-white bg-green-600 rounded hover:text-green-600 hover:bg-white hover:border hover:border-green-600 transition duration-500"} style={{height: 56}} type={"submit"}>
                                    Valider
                                </button>
                            </div>
                        </div>

                    </form>

                    <div style={{width: '100%' }} className={"flex justify-center"}>
                        {
                            codeNumeros &&
                            <DataGrid
                                components={{
                                    Toolbar:GridToolbar,
                                }}
                                rows={codeNumeros}
                                columns={columns}
                                pageSize={10}
                                rowsPerPageOptions={[10]}
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
