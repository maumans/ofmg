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

function Show(props) {


    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'libelle', headerName: 'NIVEAU', width: 300 },
        { field: 'action', headerName: 'ACTION',width:350,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleDelete(cellValues.row.id)} className={`bg-red-500 p-2 text-white rounded hover:text-red-700 hover:bg-white transition duration-500`}>
                        <DeleteIcon/>
                    </button>
                </div>
            )
        },

    ];

    function handleDelete(id){
        confirm("Voulez-vous supprimer ce niveau") && Inertia.delete(route("admin.niveau.destroy",[props.auth.user.id,id]),{preserveScroll:true})
    }


    return (
        <AdminPanel auth={props.auth} error={props.error} active={"niveau"}>
            <div className={"p-5"}>
                <div>
                    <div className={"my-5 text-2xl"}>
                        Liste des classe ({props.region.libelle.toLowerCase()})
                    </div>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            props?.region?.villes &&
                            <DataGrid
                                components={{
                                    Toolbar:GridToolbar,
                                }}
                                rows={props.region.villes}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                autoHeight
                            />
                        }
                    </div>
                </div>
            </div>
        </AdminPanel>
    );
}

export default Show;
