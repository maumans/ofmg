import React, {useEffect, useRef, useState} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import SnackBar from "@/Components/SnackBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {Inertia} from "@inertiajs/inertia";
import {motion} from "framer-motion";
import {Autocomplete, FormControl, Modal, Step, StepLabel, TextareaAutosize, TextField} from "@mui/material";
import {CheckIcon} from "@mui/icons-material/Check";
import NumberFormat from "react-number-format";
import {useForm} from "@inertiajs/inertia-react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {a11yProps, TabPanel} from "@/Components/TabPanel";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ModalComponent from "@/Components/Modal";
import formatNumber from "@/Utils/formatNumber";
import { useConfirmDialog } from 'react-mui-confirm';

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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    minWidth: 400,
    bgcolor: 'background.paper',
    borderRadius:2,
    boxShadow: 24,
    p: 10,
};

function Salaire({auth,error,personnels,success,mois,anneeEnCours,salaires,codeNumeros}) {

    const [successSt,setSuccessSt]=useState(null)
    const [codeNumerosSt, setCodeNumerosSt]=useState();

    //const confirm = useConfirmDialog();


    useEffect(() => {
        if(codeNumeros)
        {
            let st=""
            codeNumeros.map((c,i)=>st=st+(i? "|":"")+c.libelle)
            setCodeNumerosSt(st)
        }
    },[])

    useEffect(() => {
        setSuccessSt(success)
    },[success])

    const [personnelsSt,setPersonnelsSt]=useState([])

    useEffect(() => {
        setPersonnelsSt(personnels)
    },[])

    const {data:dataOccasionnel,setData:setDataOccasionnel}=useForm({
        "nom":"",
        "prenom":"",
        "telephone":"",
        "montant":"",
        "motif":"",

    });

    const {data,setData,post}=useForm({

    });

    const [moisSt,setMoisSt]=useState(null);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'prenom', headerName: 'PRENOM', width: 130 },
        { field: 'nom', headerName: 'NOM', width: 130 },
        { field: 'adresse', headerName: 'ADRESSE', width: 130 },
        { field: 'telephone', headerName: 'TELEPHONE', width: 130 },
        { field: 'salaire', headerName: 'SALAIRE', width: 130,renderCell:(cellValues)=> (
            moisSt && formatNumber(cellValues.row.salairesAp?.filter(salaire => salaire.mois.id === moisSt?.id)[0]?.salaire)+ " FG"
            )},
       { field: 'montant', headerName: 'MONTANT',width:200, hide:moisSt===null,
            renderCell:(cellValues)=> {
                return <div hidden={cellValues.row.salaires.find((salaire) => (salaire.mois?.id === moisSt?.id)) === null} className={"space-x-2"}>
                    <TextField
                        variant="standard"
                        name={cellValues.row.id + ""}
                        onChange={(e) => onHandleChange(e, cellValues.row.id)}
                        autoComplete="montant"
                        InputProps={{
                            inputComponent: NumberFormatCustom,
                            inputProps: {
                                max: 100000000,
                            },
                        }}
                    />
                </div>
            }
        },

    ];


    const columnsModal = [
        { field: 'id', headerName: 'ID', width: 70 },
        //{ field: 'matricule', headerName: 'MATRICULE', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.matricule) },
        { field: 'prenom', headerName: 'PRENOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.prenom) },
        { field: 'nom', headerName: 'NOM', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.nom) },
        { field: 'telephone', headerName: 'TELEPHONE', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.telephone) },
        { field: 'mois', headerName: 'MOIS', width: 130, renderCell:(cellValues)=>(moisSt?.libelle)  },
        { field: 'montant', headerName: 'MONTANT', width: 130, renderCell:(cellValues)=>(data[cellValues.row.id+""]  && formatNumber(data[cellValues.row.id+""])+" FG")  },
    ];


    const columnAnnuler = [
        { field: 'id', headerName: 'ID', width: 70,flex:1, },
        //{ field: 'matricule', headerName: 'MATRICULE', width: 130, renderCell:(cellValues)=>(cellValues.row.personnel?.matricule) },
        { field: 'prenom', headerName: 'PRENOM', width: 130,flex:1, renderCell:(cellValues)=>(cellValues.row.personnel?.prenom) },
        { field: 'nom', headerName: 'NOM', width: 130,flex:1, renderCell:(cellValues)=>(cellValues.row.personnel?.nom) },
        { field: 'telephone', headerName: 'TELEPHONE', width: 130,flex:1, renderCell:(cellValues)=>(cellValues.row.personnel?.telephone) },
        { field: 'mois', headerName: 'MOIS', width: 130,flex:1, renderCell:(cellValues)=>(cellValues.row.mois?.libelle)  },
        { field: 'montant', headerName: 'MONTANT', width: 130,flex:1, renderCell:(cellValues)=>(formatNumber(cellValues.row.montant)+ " FG")  },
        { field: 'motif', headerName: 'MOTIF', width: 200,flex:1, renderCell:(cellValues)=><div>{cellValues.row.motifAnnulation}</div>  },

    ];



    function onHandleChange(e,id){
        setData(id+"",e.target.value);
    }

    function handlePaiement(id){
        Inertia.post(route("etablissement.personnel.store",auth.user.id),data,{preserveState:false})
    }


    function handleSubmit(e)
    {
        e.preventDefault();

        /*
        confirm({
            title: 'Voulez-vous transmettre?',
        }).then(() => console.log("letion cancelled."))
            .catch(() => console.log("Deletion cancelled."));

         */

        moisSt ?
            confirm('Voulez-vous transmettre?')
             && Inertia.post(route("etablissement.personnel.paiement.salaire.store",[auth.user.id,moisSt.id]),data,{preserveState:false})
            :
            alert("Veuillez selectionner le mois")

    }

    ////Modal component


    const [open, setOpen] = React.useState(false);

    const contenu=()=>(
        personnelsSt &&
            <>
                <DataGrid
                    rows={personnelsSt.filter((personnel)=>(tabPersonnelSelected?.find(t=>t===personnel.id)) && data[personnel.id]!==undefined && data[personnel.id]!=="")}
                    columns={columnsModal}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    autoHeight
                />
                <button  onClick={handleSubmit} className={"my-4 p-2 text-white orangeVertBackground rounded hover:text-green-700 hover:bg-white transition duration-500"}>
                  Transmettre pour validation
                </button>
            </>
    )

    ////GRID SELECTED
    const [tabPersonnelSelected,setTabPersonnelSelected]=useState([])

    /////MODAL

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(true);
    }
    const handleCloseModal = () => setOpenModal(false);

    ///TABS
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function handleOccasionnelSubmit(e) {
        e.preventDefault();
        Inertia.post(route("etablissement.personnel.paiementeOccasionnel",[auth.user.id]),dataOccasionnel,{preserveState:false});
    }

    return (
        <AdminPanel auth={auth} error={error} active={"salaire"} sousActive={"paiementSalaire"}>
            <div className="p-5">
                <Box sx={{ width:'100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange}
                              variant="scrollable"
                              scrollButtons
                              allowScrollButtonsMobile
                              aria-label="scrollable force tabs example"
                        >
                            <Tab label="Paiements manuels" {...a11yProps(0)} />
                            <Tab label="Paiements occasionnels" {...a11yProps(1)} />
                            <Tab label="Paiements annulés" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <div>
                            <div className="text-xl my-5 font-bold">
                                Paiement des salaires du personnel ({anneeEnCours.dateDebut.split("-")[0]+"/"+anneeEnCours.dateFin.split("-")[0]})
                            </div>

                            {
                                mois &&
                                <div className={"mb-5 text-blue-600"}>
                                    Veuillez selectionner le mois à payer *
                                </div>
                            }
                            <motion.div
                                initial={{y:-100,opacity:0}}
                                animate={{y:0,opacity:1}}
                                transition={{
                                    duration:0.5,
                                    type:"spring",
                                }}

                                style={{height:450, width: '100%' }}
                            >
                                <div className={"my-5 z-0"}>
                                    <FormControl  className={"w-full z-10"} style={{maxWidth:300}}>
                                        <Autocomplete
                                            onChange={(e,val)=>{
                                                setMoisSt(val)
                                                val ?setPersonnelsSt(personnels.filter((personnel)=>(personnel.salaires.find((salaire)=>salaire.mois?.id===val?.id)===undefined))):setPersonnelsSt(personnels)
                                            }}
                                            label="Mois"
                                            disablePortal={true}
                                            options={mois}
                                            getOptionLabel={(option)=>option.libelle}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Mois"}  label={params.libelle}/>}

                                        />
                                    </FormControl>
                                </div>
                                {
                                    personnelsSt &&
                                    <DataGrid
                                        components={{
                                            Toolbar:GridToolbar,
                                        }}
                                        rows={personnelsSt}
                                        columns={columns}
                                        pageSize={10}
                                        rowsPerPageOptions={[10]}
                                        autoHeight
                                        checkboxSelection
                                        onSelectionModelChange={(tab)=>setTabPersonnelSelected(tab)}
                                    />
                                }

                                <div>
                                    <button onClick={()=>setOpen(true)} className={"my-4 p-2 text-white orangeVertBackground rounded hover:text-green-700 hover:bg-white transition duration-500"}>
                                        Enregistrer
                                    </button>
                                    <ModalComponent open={open} setOpen={setOpen} contenu={contenu} width={800} minWidth={100}/>

                                </div>
                            </motion.div>
                            <SnackBar success={success}/>

                            <Modal
                                keepMounted
                                open={openModal}
                                onClose={handleCloseModal}
                                aria-labelledby="keep-mounted-modal-title"
                                aria-describedby="keep-mounted-modal-description"
                            >
                                <Box sx={style}>
                                    {
                                        personnelsSt &&
                                        <DataGrid
                                            components={{
                                                Toolbar:GridToolbar,
                                            }}
                                            rows={personnelsSt.filter((personnel)=>data[personnel.id+""]!==undefined)}
                                            columns={columnsModal}
                                            pageSize={10}
                                            rowsPerPageOptions={[10]}
                                            autoHeight
                                        />
                                    }

                                    <button onClick={handleSubmit} className={"my-4 p-2 text-white orangeVertBackground rounded hover:text-green-700 hover:bg-white transition duration-500"}>
                                        Valider
                                    </button>
                                </Box>
                            </Modal>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <div className="text-xl my-5 font-bold">
                            Effectuer un paiement occasionnel ({anneeEnCours.dateDebut.split("-")[0]+"/"+anneeEnCours.dateFin.split("-")[0]})
                        </div>
                        <form onSubmit={handleOccasionnelSubmit} className={"gap-5 grid md:grid-cols-3 sm:grid-cols-2 mb-5 border p-2"}>
                            <div>
                                <TextField className={"w-full"}  name={"prenom"} label={"Prenom"} onChange={(e)=>setDataOccasionnel("prenom",e.target.value)}
                                           autoComplete="prenom"
                                           required
                                />
                            </div>
                            <div>
                                <TextField className={"w-full"}  name={"nom"} label={"Nom"} onChange={(e)=>setDataOccasionnel("nom",e.target.value)}
                                           autoComplete="nom"
                                           required
                                />
                            </div>

                            <div>
                                <TextField className={"w-full"}  name={"telephone"} label={"Telephone"} onChange={(e)=>setDataOccasionnel("telephone",e.target.value)}
                                           inputProps={{

                                               pattern:"(^"+codeNumerosSt+")[0-9]{6}"
                                           }}
                                           autoComplete="telephone"
                                           required
                                />
                            </div>

                            <div>

                                <TextField
                                    className={"w-full"}  name={"montant"} label={"Montant"} onChange={(e)=>setDataOccasionnel("montant",e.target.value)}
                                    InputProps={{
                                        inputComponent: NumberFormatCustom,
                                        inputProps:{
                                            max:10000000000,
                                            name:"montant"

                                        },
                                    }}
                                    required
                                />
                            </div>

                            <div className={"md:col-span-3 sm:col-span-2"}>
                                <TextareaAutosize className={"w-full"} placeholder={"Quel est le motif du paiement?"} style={{height:200}} onChange={(e)=>setDataOccasionnel("motif",e.target.value)}
                                                  autoComplete="telephone"
                                                  required
                                />
                            </div>


                            <div className={'md:col-span-2'}>
                                <button className={"p-3 text-white orangeVertBackground rounded"} type={"submit"}>
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </TabPanel>

                    <TabPanel value={value} index={2}>
                        <div className="text-xl my-5 font-bold">
                            Paiement de salaires annulés ({anneeEnCours.dateDebut.split("-")[0]+"/"+anneeEnCours.dateFin.split("-")[0]})
                        </div>
                        <DataGrid
                            components={{
                                Toolbar:GridToolbar,
                            }}
                            rows={salaires.filter(salaire=>salaire.status ==="ANNULE")}
                            columns={columnAnnuler}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            autoHeight
                        />
                    </TabPanel>
                </Box>

                <SnackBar success={successSt}/>
            </div>

        </AdminPanel>
    );
}

export default Salaire;
