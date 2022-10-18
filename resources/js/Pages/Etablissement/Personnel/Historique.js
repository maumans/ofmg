import React, {useEffect, useState} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import SnackBar from "@/Components/SnackBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {Inertia} from "@inertiajs/inertia";
import {motion} from "framer-motion";
import {Autocomplete, FormControl, Modal, TextareaAutosize, TextField} from "@mui/material";
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

    });

    const [moisSt,setMoisSt]=useState("");

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'prenom', headerName: 'PRENOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.prenom) },
        { field: 'nom', headerName: 'NOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.nom) },
        { field: 'telephone', headerName: 'TELEPHONE', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.telephone) },
        { field: 'mois', headerName: 'MOIS', width: 130, renderCell:(cellValues)=>(cellValues.row.mois?.libelle)  },
        { field: 'montant', headerName: 'MONTANT', width: 130, renderCell:(cellValues)=>(formatNumber(cellValues.row.montant)+" FG")  },
    ];

    const columnsOccasionnel = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'prenom', headerName: 'PRENOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.prenom) },
        { field: 'nom', headerName: 'NOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.nom) },
        { field: 'telephone', headerName: 'TELEPHONE', width: 130, renderCell:(cellValues)=>(cellValues.row.numero_retrait) },
        { field: 'motif', headerName: 'MOTIF', width: 300, renderCell:(cellValues)=>(cellValues.row.motif) },
        { field: 'montant', headerName: 'MONTANT', width: 130, renderCell:(cellValues)=>(formatNumber(cellValues.row.montant)+" FG")  },
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

    return (
        <AdminPanel auth={auth} error={error} active={"salaire"} sousActive={"paiementHistorique"}>
            <div className={"p-5"}>
                <div className="text-2xl my-5 font-bold">
                    Historiques des paiements
                </div>

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
                       <div>
                           <motion.div
                               initial={{y:-100,opacity:0}}
                               animate={{y:0,opacity:1}}
                               transition={{
                                   duration:0.5,
                                   type:"spring",
                               }}

                               style={{height:450, width: '100%' }}
                           >
                               {
                                   salaires &&
                                   <DataGrid
                                       components={{
                                           Toolbar:GridToolbar,
                                       }}

                                       componentsProps={{
                                           columnMenu:{backgroundColor:"red",background:"yellow"},
                                       }}
                                       rows={salaires}
                                       columns={columns}
                                       pageSize={5}
                                       rowsPerPageOptions={[5]}
                                       autoHeight
                                   />
                               }
                           </motion.div>
                       </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                       <div>
                           <motion.div
                               initial={{y:-100,opacity:0}}
                               animate={{y:0,opacity:1}}
                               transition={{
                                   duration:0.5,
                                   type:"spring",
                               }}

                               style={{height:450, width: '100%' }}
                           >
                               {
                                   salaires &&
                                   <DataGrid
                                       components={{
                                           Toolbar:GridToolbar,
                                       }}

                                       componentsProps={{
                                           columnMenu:{backgroundColor:"red",background:"yellow"},
                                       }}
                                       rows={paiementOccasionnel}
                                       columns={columnsOccasionnel}
                                       pageSize={5}
                                       rowsPerPageOptions={[5]}
                                       autoHeight
                                   />
                               }
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
