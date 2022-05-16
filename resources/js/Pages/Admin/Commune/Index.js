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

function Index(props) {

    const [communes,setCommunes] = useState();

    const {data,setData,post}=useForm({
        "libelle":"",
        "ville":""
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'libelle', headerName: 'COMMUNE', width: 130 },
        { field: 'ville', headerName: 'VILLE', width: 130,renderCell:(r)=>r.row.ville?.libelle },
        { field: 'action', headerName: 'ACTION',width:300,
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
        confirm("Voulez-vous supprimer cette region") && Inertia.delete(route("admin.commune.destroy",[props.auth.user.id,id]),{preserveScroll:true})
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

        post(route("admin.commune.store",props.auth.user.id),data,)

    }

    useEffect(() => {
        setCommunes(props.communes);
    },[props.communes])


    return (
        <AdminPanel auth={props.auth} error={props.error} sousActive={"commune"} active={"adresse"}>
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl"}>
                        Gestions des communes
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5"}>
                        <div className={"gap-4 grid grid-cols-2"}>
                            <div>
                                <TextField  name={"libelle"} label={"libelle"} value={data.libelle} onChange={(e)=>setData("libelle",e.target.value)}/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.libelle}</div>
                            </div>

                            <div>
                                <FormControl  className={"w-full"}>
                                    <Autocomplete
                                        id="tags-standard"
                                        onChange={(e,val)=>setData("ville",val)}
                                        disablePortal={true}
                                        id={"combo-box-demo"}
                                        options={props.villes}
                                        getOptionLabel={(option)=>option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"villes"} label={params.libelle}/>}
                                    />
                                </FormControl>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.ville}</div>
                            </div>
                            <div>
                                <button className={"p-2 text-white bg-green-600 rounded hover:text-green-600 hover:bg-white hover:border hover:border-green-600 transition duration-500"} style={{height: 56}} type={"submit"}>
                                    Valider
                                </button>
                            </div>
                        </div>

                    </form>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            communes &&
                            <DataGrid
                                components={{
                                    Toolbar:GridToolbar,
                                }}
                                rows={communes}
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
