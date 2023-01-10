import React, {useEffect, useState} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import SnackBar from "@/Components/SnackBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {Inertia} from "@inertiajs/inertia";
import {motion} from "framer-motion";
import {Autocomplete, Backdrop, CircularProgress, FormControl, Modal, TextareaAutosize, TextField} from "@mui/material";
import {CheckIcon} from "@mui/icons-material/Check";
import NumberFormat from "react-number-format";
import {useForm} from "@inertiajs/inertia-react";
import formatNumber from "@/Utils/formatNumber";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {a11yProps, TabPanel} from "@/Components/TabPanel";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from "axios";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import {format} from "date-fns";

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumberFormat
            isAllowed={(values) => {
                const {floatValue} = values;
                return ((floatValue >= 0 &&  floatValue <= props.max) || floatValue === undefined);
            }}
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator={true}

            isNumericString
            suffix={props.devise==="eur"?" €":props.devise==="usd"?" $":" FG"

            }
        />
    );
});

function Historique({auth,error,salaires,paiementOccasionnel,success,mois}) {

    const {data,setData,post}=useForm({
        "onglet":"salaire"
    });

    const [moisSt,setMoisSt]=useState("");

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'transaction_id', headerName: 'ID TRANSACTION', minWidth: 250},
        { field: 'created_at', headerName: 'DATE', width: 130, renderCell:(cellValues)=>(format(new Date(cellValues.row.created_at), 'dd/MM/yyyy')) },
        { field: 'prenom', headerName: 'PRENOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.prenom) },
        { field: 'nom', headerName: 'NOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.nom) },
        { field: 'telephone', headerName: 'TELEPHONE', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.telephone) },
        { field: 'montant', headerName: 'MONTANT', width: 130, renderCell:(cellValues)=>(formatNumber(cellValues.row.montant)+" FG")  },
        { field: 'status', headerName: 'STATUS', width: 130, renderCell:(cellValues)=>(
            cellValues.row.transaction_status==="SUCCESS"?"SUCCES":cellValues.row.transaction_status==="PENDING"?"EN ATTENTE":cellValues.row.transaction_status==="FAILED" && "ECHEC"
        ) },
        { field: 'mois', headerName: 'MOIS', width: 130, renderCell:(cellValues)=>(cellValues.row.mois?.libelle)  },
    ];

    const columnsOccasionnel = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'transaction_id', headerName: 'ID TRANSACTION', minWidth: 250},
        { field: 'created_at', headerName: 'DATE', width: 130, renderCell:(cellValues)=>format(new Date(cellValues.row.created_at), 'dd/MM/yyyy') },
        { field: 'prenom', headerName: 'PRENOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.prenom) },
        { field: 'nom', headerName: 'NOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.nom) },
        { field: 'telephone', headerName: 'TELEPHONE', width: 130, renderCell:(cellValues)=>(cellValues.row.numero_depot) },
        { field: 'status', headerName: 'STATUS', width: 130, renderCell:(cellValues)=>(
                cellValues.row.transaction_status==="SUCCESS"?"SUCCES":cellValues.row.transaction_status==="PENDING"?"EN ATTENTE":cellValues.row.transaction_status==="FAILED" && "ECHEC"
            ) },
        { field: 'montant', headerName: 'MONTANT', width: 130, renderCell:(cellValues)=>(formatNumber(cellValues.row.montant)+" FG")  },
        { field: 'motif', headerName: 'MOTIF', maxWidth: 300, renderCell:(cellValues)=>(cellValues.row.motif) },
    ];


    function onHandleChange(e,id){
        setData(id+"",e.target.value);
    }

    function handlePaiement(id){
        Inertia.post(route("etablissement.personnel.store",auth.user.id),data,{preserveState:false})
    }

    ////TABS
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    ////FILTRE

    const [salairesSt,setSalairesSt] = useState([]);
    const [paiementOccasionnelSt,setPaiementOccasionnelSt] = useState([]);

    useEffect(()=>{
        setSalairesSt(salaires)
    },[])

    useEffect(()=>{
        setPaiementOccasionnelSt(paiementOccasionnel)
    },[])

    useEffect(()=>{
        let onglet =value===0?"salaire":value===1 && "occasionnel"
        setData("onglet",onglet)
    },[value])

    function handleSearch()
    {
        handleToggle()
        axios.post(route("etablissement.personnel.historique.filter",auth.user.etablissement_admin.id),data)
            .then(({data}) => {

                value===0?setSalairesSt(data):value===1 && setPaiementOccasionnelSt(data);
                setFiltre(true)
                setOpen(false)
            })

/*
                Inertia.post(route("etablissement.personnel.historique.filter",auth.user.etablissement_admin.id),data)
*/
    }

    function handleCloseFiltre()
    {
        value===0?setSalairesSt(salaires):value===1 && setPaiementOccasionnelSt(paiementOccasionnel);
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
        <AdminPanel auth={auth} error={error} active={"salaire"} sousActive={"paiementHistorique"}>
            <div className={"p-5"}>
                <div className="text-2xl my-5 font-bold">
                    Historiques des paiements
                </div>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                    onClick={handleClose}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange}
                              variant="scrollable"
                              scrollButtons
                              allowScrollButtonsMobile
                              aria-label="scrollable force tabs example"
                        >
                            <Tab label="Paiements salaires" {...a11yProps(0)} />
                            <Tab label="Paiements occasionnels" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>

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

                       <div>
                           <motion.div
                               initial={{y:-100,opacity:0}}
                               animate={{y:0,opacity:1}}
                               transition={{
                                   duration:0.5,
                                   type:"spring",
                               }}

                               style={{width: '100%' }}
                           >
                               <DataGrid
                                   components={{
                                       Toolbar:GridToolbar,
                                   }}

                                   componentsProps={{
                                       columnMenu:{backgroundColor:"red",background:"yellow"},
                                   }}
                                   rows={salairesSt}
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
                       </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
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
                       <div>
                           <motion.div
                               initial={{y:-100,opacity:0}}
                               animate={{y:0,opacity:1}}
                               transition={{
                                   duration:0.5,
                                   type:"spring",
                               }}

                               style={{width: '100%' }}
                           >
                               <DataGrid
                                   components={{
                                       Toolbar:GridToolbar,
                                   }}

                                   componentsProps={{
                                       columnMenu:{backgroundColor:"red",background:"yellow"},
                                   }}
                                   rows={paiementOccasionnelSt}
                                   columns={columnsOccasionnel}
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
                    </TabPanel>
                </Box>
                <SnackBar success={success}/>
            </div>
        </AdminPanel>
    );
}

export default Historique;
