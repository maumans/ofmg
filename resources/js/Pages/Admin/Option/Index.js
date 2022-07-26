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

function Index(props) {

    const [options,setOptions] = useState();

    const {data,setData,post,reset}=useForm({
        "libelle":"",
        "cycle":""
    });

    const columns = [
        { field: 'id', headerName: 'ID', flex: 1, minWidth: 70 },
        { field: 'libelle', headerName: 'OPTION', flex: 1, minWidth: 300 },
        { field: 'cycle', headerName: 'CYCLE', flex: 1, minWidth: 250,renderCell:(cellValues)=>(
            cellValues.row.cycle?.libelle
            ) },
        { field: 'departement', headerName: 'DEPARTEMENT', flex: 1, minWidth: 300,renderCell:(cellValues)=>(
                cellValues.row.departement?.libelle
            ) },

        { field: 'action', headerName: 'ACTION',flex: 1, minWidth: 250,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white bg-blue-300 rounded hover:text-blue-300 hover:bg-white transition duration-500 "}>
                        <VisibilityIcon/> les niveaux
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
        confirm("Voulez-vous supprimer cette option") && Inertia.delete(route("admin.option.destroy",[props.auth.user.id,id]),{preserveScroll:true})
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

        post(route("admin.option.store",props.auth.user.id),{data,onSuccess: ()=>reset("libelle")})

    }

    useEffect(() => {
        setOptions(props.options);
    },[props.options])

    useEffect(() => {
        if(data.cycle?.libelle!=="Université")
        {
            setData("departement",null)
        }
    },[data.cycle])


    return (
        <AdminPanel auth={props.auth} error={props.error} active={"option"}>
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl"}>
                        Gestion des options
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5 w-full"}>
                        <div className={"grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4"}>
                            <div>
                                <TextField name={"libelle"} label={"libelle"} value={data.libelle} onChange={(e)=>setData("libelle",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.libelle}</div>
                            </div>
                            <div>
                                <FormControl  className={"w-full"}>
                                    <Autocomplete
                                        id="tags-standard"
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("cycle",val)}
                                        disablePortal={true}
                                        id={"combo-box-demo"}
                                        options={props.cycles}
                                        getOptionLabel={(option)=>option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"cycles"} label={params.libelle} required />}
                                    />
                                </FormControl>
                                <div className={" flex my-2 text-red-600"}>{props.errors?.cycle}</div>
                            </div>
                            {
                                data.cycle?.libelle==="Université" &&
                                <div>
                                    <FormControl  className={"w-full"}>
                                        <Autocomplete
                                            id="tags-standard"
                                            className={"w-full"}
                                            onChange={(e,val)=>setData("departement",val)}
                                            disablePortal={true}
                                            id={"combo-box-demo"}
                                            options={props.departements}
                                            getOptionLabel={(option)=>option.libelle}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params)=><TextField  fullWidth {...params} placeholder={"departements"} label={params.libelle} required />}
                                        />
                                    </FormControl>
                                    <div className={" flex my-2 text-red-600"}>{props.errors?.departement}</div>
                                </div>
                            }
                            <div>
                                <button className={"p-2 text-white bg-green-600 rounded hover:text-green-600 hover:bg-white hover:border hover:border-green-600 transition duration-500"} style={{height: 56}} style={{height: 56}} type={"submit"}>
                                    Valider
                                </button>
                            </div>
                        </div>

                    </form>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            options &&
                            <DataGrid
                                components={{
                                    Toolbar:GridToolbar,
                                }}
                                rows={options}
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
