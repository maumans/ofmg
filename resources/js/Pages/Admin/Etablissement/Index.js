import React, {useEffect, useState} from 'react';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    GridToolbar,
    useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';
import {Autocomplete, Divider, FormControl, InputLabel, MenuItem, Pagination, Select, TextField} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SnackBar from "@/Components/SnackBar";
import VisibilityIcon from '@mui/icons-material/Visibility';

function Index(props) {

    const [etablissements,setEtablissements] = useState();

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'code', headerName: 'CODE', width: 200 },
        { field: 'nom', headerName: 'NOM', width: 250 },
        { field: 'login', headerName: 'IDENTIFIANT', width: 250,renderCell:(r)=>r.row?.admins[0]?.login},
        { field: 'type', headerName: 'TYPE', width: 250,renderCell:(r)=>r.row.type_etablissement?.libelle },
        { field: 'ville', headerName: 'VILLE', width: 250,renderCell:(r)=>r.row.ville?.libelle },
        { field: 'commune', headerName: 'COMMUNE', width: 250,renderCell:(r)=>r.row.commune?.libelle },
        { field: 'email', headerName: 'EMAIL ADMIN', width: 250,renderCell:(r)=>r.row?.admins[0]?.email },
        { field: 'action', headerName: 'ACTION',width:250,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleShow(cellValues.row.id)} className={"p-2 text-white orangeVioletBackground rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
                        <VisibilityIcon/>
                    </button>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white orangeBlueBackground rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
                        <EditIcon/>
                    </button>
                    <button onClick={()=>handleDelete(cellValues.row.id)} className={`bg-red-500 p-2 text-white bg-red-700 rounded hover:text-red-700 hover:bg-white transition duration-500`}>
                        <DeleteIcon/>
                    </button>
                </div>
            )
        },

    ];

    const [successSt, setSuccessSt]= useState(null);

    useEffect(() => {
        setSuccessSt(props.success)
    },[props.success])

    function handleDelete(id){
        confirm("Voulez-vous supprimer cet etablissement?") && Inertia.delete(route("admin.etablissement.destroy",[props.auth.user.id,id]),{preserveScroll:true})
    }

    function handleEdit(id){
        Inertia.get(route("admin.etablissement.edit",[props.auth.user.id,id]))
    }

    function handleShow(id){
        Inertia.get(route("admin.etablissement.show",[props.auth.user.id,id]))
    }

    useEffect(() => {
        setEtablissements(props.etablissements);
    },[props.etablissements])

    function handleCreate() {
        Inertia.get(route("admin.etablissement.create",props.auth.user.id))
    }

    return (
        <AdminPanel auth={props.auth} error={props.error} active={"etablissement"}>
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl"}>
                        Gestion des etablissements
                    </div>
                    <div>
                        <button onClick={handleCreate} className={"px-2 orangeVertBackground text-white hover:orangeVertBackground transition duration-500 rounded my-3"} style={{height: 56}}>
                            Ajouter un etablissement
                        </button>
                    </div>
                    <div style={{width: '100%' }} className={"flex justify-center"}>
                        {
                            etablissements &&
                            <DataGrid
                                components={{
                                    Toolbar:GridToolbar,
                                }}
                                rows={etablissements}
                                columns={columns}
                               initialState={{
                                        pagination: {
                                            pageSize: 10,
                                        },
                                    }}
                                rowsPerPageOptions={[10]}
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
