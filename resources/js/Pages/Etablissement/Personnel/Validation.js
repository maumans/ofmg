import React, {useEffect, useState} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {Inertia} from "@inertiajs/inertia";
import formatNumber from "@/Utils/formatNumber";
import {motion} from "framer-motion";
import {Modal, TextareaAutosize} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ResponsiveModal from "@/Utils/ResponsiveModal"
import SnackBar from "@/Components/SnackBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useForm} from "@inertiajs/inertia-react";
import {a11yProps, TabPanel} from "@/Components/TabPanel";
import ModalComponent from "@/Components/Modal";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    bgcolor: 'background.paper',
    borderRadius:2,
    boxShadow: 24,
    p: 4,
};

function Validation({auth,error,salaires,success}) {

    const [etape,setEtape]=useState(1)

    const [motifAnnulation,setMotifAnnulation]=useState(null)

    const [salairesSt,setSalairesSt]=useState([])

    const [errorSt,setErrorSt] = useState(null)

    const [rowId,setRowId] = useState(null)

    const {data,setData,post}=useForm({
        "salaireId":null,
        "motifAnnulation":null,
    })

    const [openModal, setOpenModal] = useState(false);

    const handleCloseModal = () => setOpenModal(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    }

    ////TABS
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        //{ field: 'matricule', headerName: 'MATRICULE', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.matricule) },
        { field: 'prenom', headerName: 'PRENOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.prenom) },
        { field: 'nom', headerName: 'NOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.nom) },
        { field: 'telephone', headerName: 'TELEPHONE', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.telephone) },
        { field: 'mois', headerName: 'MOIS', width: 130, renderCell:(cellValues)=>(cellValues.row.mois?.libelle)  },
        { field: 'montant', headerName: 'MONTANT', width: 130, renderCell:(cellValues)=>(formatNumber(cellValues.row.montant)+" FG")  },
        { field: 'action', headerName: 'ACTION',width:200,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button type="button" onClick={(e)=>{
                        setData("salaireId",cellValues.row.id)
                        handleOpenModal()
                    }} className={`bg-red-500 p-2 text-white bg-red-700 rounded hover:text-red-700 hover:bg-white transition duration-500`}>
                        Annuler
                    </button>
                </div>
            )
        },
    ];

    const columnsModal = [
        { field: 'id', headerName: 'ID', width: 70 },
        //{ field: 'matricule', headerName: 'MATRICULE', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.matricule) },
        { field: 'prenom', headerName: 'PRENOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.prenom) },
        { field: 'nom', headerName: 'NOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.nom) },
        { field: 'telephone', headerName: 'TELEPHONE', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.telephone) },
        { field: 'mois', headerName: 'MOIS', width: 130, renderCell:(cellValues)=>(cellValues.row.mois?.libelle)  },
        { field: 'montant', headerName: 'MONTANT', width: 130, renderCell:(cellValues)=>(formatNumber(cellValues.row.montant)+" FG")  },
    ];

    function handleSubmit(e)
    {
        e.preventDefault();

        confirm("Voulez-vous effectuer ces paiements ?") && Inertia.post(route("etablissement.personnel.paiement.validationSalaire.store",[auth.user.id]),salairesSt,{preserveState:false})

    }

    function handleCancel(e)
    {
        e.preventDefault();
        confirm("Voulez-vous annuler ce paiement ?") && Inertia.post(route("etablissement.personnel.paiement.validationCancel",[auth.user.id]),data,{preserveState:false})
    }

    const [open, setOpen] = React.useState(false);

    return (
        <AdminPanel auth={auth} error={error} active={"salaire"} sousActive={"validationSalaire"}>

            <div>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange}
                              variant="scrollable"
                              scrollButtons
                              allowScrollButtonsMobile
                              aria-label="scrollable force tabs example"
                        >
                            <Tab label="Paiements en attente de validation" {...a11yProps(0)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <div className={"p-5"}>
                            <div className="text-xl my-5 font-bold">
                                Paiements de salaires en attentes de validation
                            </div>
                            {
                                etape===1
                                &&
                                <div className={"mb-5 text-blue-600"}>
                                    Veuillez selectionner les paiements à valider *
                                </div>
                            }

                            {
                                etape===1 &&
                                <motion.div
                                    initial={{y:-100,opacity:0}}
                                    animate={{y:0,opacity:1}}
                                    transition={{
                                        duration:0.5,
                                        type:"spring",
                                    }}

                                    style={{height:450, width: '100%' }}
                                >

                                    <DataGrid
                                        components={{
                                            Toolbar:GridToolbar,
                                        }}
                                        rows={salaires}
                                        columns={columns}
                                        pageSize={10}
                                        rowsPerPageOptions={[10]}
                                        checkboxSelection
                                        autoHeight
                                        onSelectionModelChange={(newSelectionModel) => {
                                            setSalairesSt(salaires.filter((salaire)=>newSelectionModel.find(r=>r===salaire.id)));
                                        }}
                                    />

                                    <div>
                                        <button onClick={()=>{
                                            salairesSt.length!==0 ?
                                                setEtape(2):
                                                alert("Veuillez selectionner les paiements à valider")
                                        }} className={"my-4 p-2 text-white bg-green-700 rounded hover:text-green-700 hover:bg-white transition duration-500"}>
                                            Passer à la validation <ArrowForwardIosIcon/>
                                        </button>
                                    </div>

                                </motion.div>
                            }


                            {
                                etape===2 &&
                                <motion.div
                                    initial={{x:-100,opacity:0}}
                                    animate={{x:0,opacity:1}}
                                    transition={{
                                        duration:0.5,
                                        type:"spring",
                                    }}
                                    style={{height:450, width: '100%' }}
                                >
                                    {
                                        salairesSt &&
                                        <DataGrid
                                            components={{
                                                Toolbar:GridToolbar,
                                            }}
                                            rows={salairesSt}
                                            columns={columnsModal}
                                            pageSize={10}
                                            rowsPerPageOptions={[10]}
                                            autoHeight
                                        />
                                    }

                                    <div className="flex justify-between">
                                        <button onClick={()=>setEtape(1)} className={"my-4 p-2 text-white bg-green-700 rounded hover:text-green-700 hover:bg-white transition duration-500"}>
                                            <ArrowBackIosIcon/>  precedent
                                        </button>

                                        <button onClick={handleSubmit} className={"my-4 p-2 text-white bg-green-700 rounded hover:text-green-700 hover:bg-white transition duration-500"}>
                                            Valider
                                        </button>
                                    </div>
                                </motion.div>
                            }
                            <SnackBar success={success}/>

                            <Modal
                                keepMounted
                                open={openModal}
                                onClose={handleCloseModal}
                                aria-labelledby="keep-mounted-modal-title"
                                aria-describedby="keep-mounted-modal-description"
                            >
                                <Box sx={style}>
                                    <form onSubmit={handleCancel} className="w-full">
                                        <TextareaAutosize
                                            onChange={(e)=>setData("motifAnnulation",e.target.value)}
                                            className="w-full"
                                            aria-label="minimum height"
                                            minRows={3}
                                            placeholder="Expliquez le motif de l'annulation"
                                            required
                                        />
                                        <div className="flex justify-between mt-5 w-full">
                                            <button type="button" onClick={handleCloseModal} className={"p-2 text-white bg-red-700 rounded hover:text-red-700 hover:bg-white transition duration-500"}>
                                                Fermer
                                            </button>

                                            <button className={`bg-green-500 p-2 text-white bg-green-700 rounded hover:text-green-700 hover:bg-white transition duration-500`}>
                                                Valider
                                            </button>

                                        </div>
                                    </form>
                                </Box>
                            </Modal>
                        </div>
                    </TabPanel>
                </Box>
            </div>


        </AdminPanel>

        );
}

export default Validation;