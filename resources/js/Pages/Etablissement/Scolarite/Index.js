import React, {useEffect, useState} from 'react';
import {motion} from "framer-motion";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from '@mui/icons-material/Search';

import AdminPanel from "@/Layouts/AdminPanel";
import SnackBar from "@/Components/SnackBar";
import formatNumber from "@/Utils/formatNumber";

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import {Backdrop, CircularProgress, Stack, TextField} from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import {useForm} from "@inertiajs/inertia-react";
import axios from "axios";
import {Inertia} from "@inertiajs/inertia";
import {format} from "date-fns";

function Index({auth,error,paiements,success}) {

    const {data,setData,post,reset}=useForm({
        "dateDebut":new Date(),
        "dateFin":new Date(),
    });

    function handleShow(id) {
        return undefined;
    }

    const [successSt,setSuccessSt] = useState();
    const [paiementsSt,setPaiementsSt] = useState([]);

    useEffect(() => {
        success && setSuccessSt(success);
    },[])

    useEffect(()=>{
        setPaiementsSt(paiements)
    },[])





    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },

        { field: 'created_at', headerName: "DATE", flex: 1, minWidth: 150, renderCell:(cellValues)=>(
                format(new Date(cellValues.row.created_at), 'dd/MM/yyyy')
            ) },
        { field: 'Nom_complet', headerName: "NOM COMPLET DE L'APPRENANT",headerClassName:"header", flex: 1, minWidth: 300, fontWeight:"bold", renderCell:(cellValues)=>(
                cellValues.row.apprenant.prenom+" "+cellValues.row.apprenant.nom
            ) },
        { field: 'montant', headerName: "MONTANT", flex: 1, minWidth: 150,  renderCell:(cellValues)=>(
                formatNumber(cellValues.row.montant)+" FG"
            ) },
        { field: 'status', headerName: "STATUS",headerClassName:"header", flex: 1, minWidth: 150, fontWeight:"bold", renderCell:(cellValues)=> {

            if (cellValues.row?.paiement_global)
            {
                    return cellValues.row.paiement_global.transaction_status==="SUCCESS"?"SUCCES":cellValues.row.paiement_global.transaction_status==="PENDING"?"EN ATTENTE":cellValues.row.paiement_global.transaction_status==="FAILED" && "ECHEC"
            }
            else
            {
                if(cellValues.row?.mode_paiement.libelle==="PAIEMENT USSD ET APPLI")
                {
                    return cellValues.row.transaction_status==="SUCCESS"?"SUCCES":cellValues.row.transaction_status==="FAILED" && "ECHEC"
                }
                else
                {
                    if (cellValues.row?.mode_paiement.libelle==="PAIEMENT CASH")
                    {
                        return "SUCCES"
                    }
                }
            }}},
        { field: 'mode_paiement', headerName: "MODE DE PAIEMENT", flex: 1, minWidth: 250,  renderCell:(cellValues)=>(
                cellValues.row.mode_paiement?.libelle
            ) },
        { field: 'action', headerName: 'ACTION',width:100,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleShow(cellValues.row.id)} className={"p-2 text-white orangeBlueBackground orangeBlueBackground rounded hover:text-blue-400 hover:bg-white transition duration-500"}>
                        <VisibilityIcon/>
                    </button>
                </div>
            )
        },

    ];

    function handleSearch()
    {
        handleToggle()
        axios.post(route("etablissement.paiement.filter",auth.user.etablissement_admin.id),data)
            .then(({data}) => {
                setPaiementsSt(data);
                setFiltre(true)
                setOpen(false)
            })

/*
        Inertia.post(route("etablissement.paiement.filter",auth.user.etablissement_admin.id),data)
*/
    }

    function handleCloseFiltre()
    {
        setPaiementsSt(data);
        setFiltre(false)
    }

    const [filtre, setFiltre] = useState(false);
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    return (
            <AdminPanel auth={auth} error={error} active={"rapport"} sousActive={"listePaiementScolarite"}>
                <div className={"p-5"}>

                    <div className={"my-5 text-2xl text-white orangeOrangeBackground rounded p-2"}>
                        Liste des paiements de scolarité
                    </div>

                    <div className={"gap-3 flex flex-wrap my-5"}>
                        <DesktopDatePicker
                            className="sm:w-5/12 w-full"
                            value={data.dateDebut}
                            label="Date debut"
                            inputFormat="dd/MM/yyyy"
                            renderInput={(params) => <TextField {...params} />}
                            onChange={(date)=>setData('dateDebut',date)}/>
                        <DesktopDatePicker
                            className="sm:w-5/12 w-full"
                            value={data.dateFin}
                            label="Date debut"
                            inputFormat="dd/MM/yyyy"
                            renderInput={(params) => <TextField {...params} />}
                            onChange={(date)=>setData('dateFin',date)}
                        />
                        {
                            filtre &&
                            <button className={"p-2 bg-red-600 text-white rounded"} onClick={handleCloseFiltre}><CloseIcon/></button>
                        }

                        <button className={"p-2 bg-green-600 text-white rounded"} onClick={handleSearch}><SearchIcon/></button>
                    </div>

                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={open}
                        onClick={handleClose}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <div>
                        {
                            <motion.div
                                initial={{y:-10,opacity:0}}
                                animate={{y:0,opacity:1}}
                                transition={{
                                    duration:0.5,
                                }}
                                style={{width: '100%' }}>
                                <DataGrid
                                    components={{
                                        Toolbar:GridToolbar,
                                    }}
                                    rows={paiementsSt}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            pageSize: 10,
                                        },
                                    }}
                                    rowsPerPageOptions={[10,20,100]}
                                    autoHeight
                                />
                            </motion.div>
                        }
                    </div>
                </div>
                <SnackBar success={successSt}/>
            </AdminPanel>
    );
}

export default Index;
