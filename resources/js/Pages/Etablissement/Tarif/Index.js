import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    GridToolbar,
    useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';
import {
    Alert,
    Autocomplete, Checkbox,
    FormControl, FormControlLabel,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    TextField
} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NumberFormat from "react-number-format";
import SnackBar from "@/Components/SnackBar";
import {motion} from "framer-motion";
import formatNumber from "@/Utils/formatNumber";

function Index(props) {

    const [tarifs,setTarifs] = useState();

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'typePaiement', headerName: 'TYPE FRAIS', minWidth:130,renderCell:(cellValues)=>cellValues.row.type_paiement?.libelle,flex:1 },
        { field: 'classe', headerName: 'CLASSE', minWidth:250,flex:1, renderCell:(cellValues)=>cellValues.row.classe?.libelle },
        { field: 'montant', headerName: 'MONTANT', minWidth:130,flex:1 ,renderCell:(cellValues)=>formatNumber(cellValues.row.montant)+" FG"},
        { field: 'frequence', headerName: 'FREQUENCE', minWidth:130,flex:1 },
        { field: 'echeance', headerName: 'ECHEANCE', minWidth:130 },
        { field: 'obligatoire', headerName: 'OBLIGATOIRE', minWidth:130,flex:1, renderCell:(cellValues)=>cellValues.row.obligatoire?"oui":"non" },
        { field: 'action', headerName: 'ACTION',minWidth:200,flex:1,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    {/*<button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white orangeBlueBackground rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
                        <EditIcon/>
                    </button>*/}
                    <button onClick={()=>handleDelete(cellValues.row.id)} className={`bg-red-500 p-2 text-white bg-red-700 rounded hover:text-red-700 hover:bg-white transition duration-500`}>
                        <DeleteIcon/>
                    </button>
                </div>
            )
        },

    ];

    function handleDelete(id){
        confirm("Voulez-vous supprimer ce tarif") && Inertia.delete(route("etablissement.tarif.destroy",[props.auth.user.id,id]),{preserveScroll:true})
    }


    useEffect(() => {
        setTarifs(props.tarifs);
    },[props.tarifs]);


    return (
        <AdminPanel auth={props.auth} error={props.error} sousActive={"typeFraisListe"} active={"rapport"}>
            <div className={"p-5"}>
                <div className={"my-5 text-2xl text-white orangeOrangeBackground rounded p-2"}>
                    Liste des frais scolaires
                </div>

                <motion.div
                    initial={{y:-100,opacity:0}}
                    animate={{y:0,opacity:1}}
                    transition={{
                        duration:0.5,
                        type:"spring",
                    }}

                    style={{width: '100%' }} className={"flex justify-center"}>
                    {
                        tarifs &&
                        <DataGrid
                            components={{
                                Toolbar:GridToolbar,
                            }}
                            rows={tarifs}
                            columns={columns}
                           initialState={{
                                        pagination: {
                                            pageSize: 10,
                                        },
                                    }}
                            rowsPerPageOptions={[10,20,100]}
                            autoHeight
                        />
                    }
                </motion.div>
                <SnackBar success={ props.success }/>
            </div>
        </AdminPanel>
    );
}

export default Index;
