import React, {useEffect, useState} from 'react';
import {format} from "date-fns";
import Authenticated from "@/Layouts/Authenticated";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import {TextField, Tooltip} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {motion} from "framer-motion";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import axios from "axios";
import {formatNumber} from "chart.js/helpers";
import AdminPanel from "@/Layouts/AdminPanel";
import {useForm} from "@inertiajs/inertia-react";
import {Inertia} from "@inertiajs/inertia";

function Index({auth,error,transactions}) {

    const {data,setData,post}=useForm({
        "dateDebut":new Date(),
        "dateFin":new Date(),
    });

    const columnsTransactions = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'transactionId', headerName: "ID TRANSACTION",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold"},

        { field: 'date', headerName: "DATE",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold", renderCell:(cellValues)=>(
                format(new Date(cellValues.row.created_at), 'dd/MM/yyyy')+" à "+cellValues.row.created_at?.split('T')[1]?.split(".")[0]
            ) },
        { field: 'peerId', headerName: "TELEPHONE",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold"},

        { field: 'amount', headerName: "MONTANT",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold", renderCell:(cellValues)=>(
                formatNumber(cellValues.row.amount)+" FG"
            )},
        { field: 'status', headerName: "STATUS",headerClassName:"header", flex: 1, minWidth: 150, fontWeight:"bold", renderCell:(cellValues)=>(
                cellValues.row.status==="SUCCESS"?"Succès":cellValues.row.status==="PENDING"?"EN ATTENTE":cellValues.row.status==="FAILED" && "ECHEC"
            )},
        { field: 'message', headerName: "MESSAGE",headerClassName:"header", flex: 1, minWidth: 220, fontWeight:"bold",renderCell:(cellValues)=>(
                <Tooltip title={cellValues.row.status==="PENDING"?"En attente de confirmation":cellValues.row.message}>
                    <div className={'cursor-pointer'}>
                        {
                            cellValues.row.status==="PENDING"?"En attente de confirmation":cellValues.row.message
                        }
                    </div>
                </Tooltip>
            )},
        { field: 'action', headerName: 'ACTION',width:100,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    {
                        cellValues.row.status==="SUCCESS"
                        &&
                        <button onClick={()=>handleOpenModal(cellValues.row)} className={"p-2 text-white orangeOrangeBackground hover:orangeOrangeBackground transition duration-500 rounded"}>
                            Reçu
                        </button>
                    }

                </div>
            )
        },

    ];

    const [transactionsSt,setTransactionsSt] = useState(transactions);
    const [openBackdrop, setOpenBackdrop] = useState(true);

    function handleSearch()
    {
        setOpenBackdrop(true)
        axios.post(route("etablissement.transaction.filtre",auth.user.id),data)
            .then(({data}) => {
                setTransactionsSt(data);
                setOpenBackdrop(false)
            })
            .catch(err => {
                console.error(err)
            })
    }

    useEffect(()=>{
        setOpenBackdrop(false)
    },[])

    useEffect(()=>{
        handleSearch()
    },[data.dateDebut,data.dateFin])

    return (
        <AdminPanel auth={auth} error={error} sousActive={"transaction"} active={"rapport"}>
            <div>
                <div className={"text-2xl text-white orangeOrangeBackground rounded p-2"}>
                    Liste des transactions
                </div>
                <div className="space-y-5">

                    <div className={"gap-3 grid md:grid-cols-2 my-5"}>
                        <DesktopDatePicker
                            className="w-full"
                            value={data.dateDebut}
                            label="Date debut"
                            inputFormat="dd/MM/yyyy"
                            renderInput={(params) => <TextField {...params} />}
                            onChange={(date)=>setData('dateDebut',date)}/>
                        <DesktopDatePicker
                            className="w-full"
                            value={data.dateFin}
                            label="Date debut"
                            inputFormat="dd/MM/yyyy"
                            renderInput={(params) => <TextField {...params} />}
                            onChange={(date)=>setData('dateFin',date)}
                        />
                    </div>
                    <motion.div
                        initial={{y:-10,opacity:0}}
                        animate={{y:0,opacity:1}}
                        transition={{
                            duration:0.5,
                        }}
                    >
                        <DataGrid
                            loading={openBackdrop}
                            componentsProps={{
                                columnMenu:{backgroundColor:"red",background:"yellow"},
                            }}

                            components={{
                                Toolbar:GridToolbar,
                            }}
                            rows={transactionsSt}
                            columns={columnsTransactions}
                            initialState={{
                                pagination: {
                                    pageSize: 10,
                                },
                            }}
                            rowsPerPageOptions={[10,20,100]}
                            autoHeight


                        />
                    </motion.div>
                </div>
            </div>
        </AdminPanel>
    );
}

export default Index;
