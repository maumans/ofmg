import React, {useEffect, useState,Fragment} from 'react';
import {Head, useForm, useRemember} from "@inertiajs/inertia-react";
import Authenticated from "@/Layouts/Authenticated";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Alert,
    Autocomplete, Avatar, Backdrop,
    Checkbox, CircularProgress,
    Divider,
    FormControl,
    FormControlLabel, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText,
    Modal,
    Snackbar,
    TextField, Tooltip
} from "@mui/material";
import {Inertia} from "@inertiajs/inertia";
import NumberFormat from 'react-number-format';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import {TabPanel, a11yProps} from "../../../Components/TabPanel"
import Save from "../../../Components/Pdfrender";
import VisibilityIcon from "@mui/icons-material/Visibility";


import {DataGrid, GridToolbar} from "@mui/x-data-grid";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import {motion} from 'framer-motion'
import axios from "axios";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {format} from "date-fns";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    minWidth: 400,
    bgcolor: 'background.paper',
    borderRadius:2,
    boxShadow: 24,
    p: 4,
};

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

const styles = theme => ({
    dropdown: {
        transition: theme.transitions.create(["transform"], {
            duration: theme.transitions.duration.short
        })
    },
    dropdownOpen: {
        transform: "rotate(-180deg)"
    },
    dropdownClosed: {
        transform: "rotate(0)"
    }
})

function Index({auth,nbrMois,success,montantTotal,errors,tuteur,totalAll,payerAll,resteApayerAll,donneesParFrais,codeNumeros,transactions}) {

    const [successSt, setSuccessSt]=useState();
    const [codeNumerosSt, setCodeNumerosSt]=useState();

    const [montants,setMontants]=useState({})

    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const {data,setData,post}=useForm({
        "tarifs":"",
        "montants":[],
        "total":montantTotal?montantTotal:0,
        "numero_retrait":"",
        "etablissement":""
    });

    function handleClose()
    {
        setOpen(false);
    }

    const handleOpenModal = (transaction) => {

        setOpenModal(true);
        setTransaction(transaction)
    }
    const handleCloseModal = () => setOpenModal(false);

    function formatNumber(inputNumber) {
        let formetedNumber = (Number(inputNumber)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        let splitArray = formetedNumber.split('.');
        if (splitArray.length > 1) {
            formetedNumber = splitArray[0];
        }
        return (formetedNumber);
    }

    function handleSubmit(e)
    {
        e.preventDefault();

        /*axios.post(route("tuteur.paiement.store",[auth?.user?.id]),data,{preserveState:true,preserveScroll:true}).then((response)=>{
            console.log(response)
        }).catch(error=>{
            console.log(error)
        });*/

        handleToggleBackdrop()

        Inertia.post(route("tuteur.paiement.store",[auth?.user?.id]),data,{preserveScroll:true,onSuccess:()=>(handleToggleBackdrop())})
    }


    useEffect(() => {
        setSuccessSt(success)
    },[success])

    useEffect(() => {
        if(successSt)
            setOpen(true);
    },[successSt])

    const [tarifs,setTarifs]=useState()

    useEffect(() => {
        setData("tarifs",tarifs)
    },[tarifs])


    function handleChangeCheckbox (event){
        if(!event.target.checked) montants[event.target.name]=""

        setTarifs(tarifs=>({
            ...tarifs,
            [event.target.name]: event.target.checked,
        }));
    }

    useEffect(() => {
        let list=null
       tuteur?.tuteur_apprenants.map((apprenant)=>(
           (apprenant?.classe.etablissement === data.etablissement?.id) && apprenant?.tarifs.map((tarif)=>(
               list={...list,[apprenant.id+"_"+tarif.id]:false}
           ))))
        setTarifs(list)
    },[data.etablissement])

    useEffect(() => {

        if(tarifs) {

            let list=null

            for (const [key,value] of Object.entries(tarifs)) {
                list={...list,[key]:montants[key]||""}
            }
            setMontants(list)
        }

    },[tarifs])


    function sum( obj ) {
        var sum = 0;
        for( var el in obj ) {
            if( obj.hasOwnProperty( el ) ) {
                sum += obj[el]!=="" && parseFloat( obj[el] );
            }
        }
        return sum;
    }

    useEffect(() => {
        setData(data=>({
            ...data,
            montants:montants,
            total:sum(montants)
        }))

    },[montants])


    useEffect(() => {
        montantTotal && handleOpenModal()
    },[montantTotal])

    useEffect(() => {
        if(codeNumeros)
        {
            let st=""
            codeNumeros.map((c,i)=>st=st+(i? "|":"")+c.libelle)
            setCodeNumerosSt(st)
        }
    },[])


    //////TAB 2 CODES


    function handleShow(id) {
        return undefined;
    }

    const columnsTransactions = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'transactionId', headerName: "ID TRANSACTION",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold"},

        { field: 'date', headerName: "DATE",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold", renderCell:(cellValues)=>(
                format(new Date(cellValues.row.created_at), 'dd/MM/yyyy')+" à "+cellValues.row.created_at.split('T')[1].split(".")[0]
            ) },
        { field: 'peerId', headerName: "TELEPHONE",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold"},

        { field: 'amount', headerName: "MONTANT",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold", renderCell:(cellValues)=>(
                    formatNumber(cellValues.row.amount)+" FG"
            )},
        { field: 'status', headerName: "STATUS",headerClassName:"header", flex: 1, minWidth: 150, fontWeight:"bold", renderCell:(cellValues)=>(
                cellValues.row.status==="SUCCESS"?"Succès":cellValues.row.status==="PENDING"?"EN ATTENTE":cellValues.row.status==="FAILED" && "ECHEC"
            )},
        { field: 'message', headerName: "MESSAGE",headerClassName:"header", flex: 1, minWidth: 300, fontWeight:"bold",renderCell:(cellValues)=>(
                cellValues.row.status==="PENDING"?"En attente de confirmation":cellValues.row.message
            )},
        { field: 'action', headerName: 'ACTION',width:100,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleOpenModal(cellValues.row)} className={"p-2 text-white orangeOrangeBackground hover:orangeOrangeBackground transition duration-500 rounded"}>
                        Reçu
                    </button>
                </div>
            )
        },

    ];

    const [transaction,setTransaction]=useState(null);

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'transactionCurrentId', headerName: "ID TRANSACTION",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold",renderCell:(cellValues)=>cellValues.row?.paiement_global?.transactionCurrentId},
        { field: 'created_at', headerName: "DATE", flex: 1, minWidth: 150, renderCell:(cellValues)=>(
                format(new Date(cellValues.row.created_at), 'dd/MM/yyyy')
            ) },
        { field: 'Nom_complet', headerName: "APPRENANT",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold", renderCell:(cellValues)=>(
                cellValues.row.apprenant?.prenom+" "+cellValues.row.apprenant?.nom
            ) },
        { field: 'etablissement', headerName: "ETABLISSEMENT",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold", renderCell:(cellValues)=>(
                cellValues.row?.etablissement?.nom
            ) },
        { field: 'code', headerName: "CODE",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold", renderCell:(cellValues)=>(
                cellValues.row?.etablissement?.code
            ) },
        { field: 'type_paiement', headerName: "TYPE DE FRAIS", flex: 1, minWidth: 150,  renderCell:(cellValues)=>(
                cellValues.row.type_paiement?.libelle
            ) },
        { field: 'numero_retrait', headerName: "TELEPHONE",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold"},

        { field: 'montant', headerName: "MONTANT", flex: 1, minWidth: 250,  renderCell:(cellValues)=>(
                formatNumber(cellValues.row.montant)+" FG"
            ) },
        { field: 'mode_paiement', headerName: "MODE DE PAIEMENT", flex: 1, minWidth: 250,  renderCell:(cellValues)=>(
                cellValues.row.mode_paiement?.libelle
            ) },

    ];


    /// TAB ETAB

    const [valueEt, setValueEt] = useState(0);

    const handleChangeEt = (event, newValue) => {
        setValueEt(newValue);
    };

    const [etablissements,setEtablissements]=useState(null)

    useEffect(() => {

        let et=[]

        tuteur?.tuteur_apprenants.map(ap=>(

            et=[...et.filter(e=>e.id!==ap.classe.etablissement.id),ap.classe.etablissement]
        ))
        setEtablissements(et)
    },[])

    useEffect(() => {
        setData("etablissement",etablissements?.find((et,i) => i===valueEt))
    },[valueEt,etablissements])


    const [openBackdrop, setOpenBackdrop] = useState(false);


    const handleToggleBackdrop = () => {
        setOpenBackdrop(!openBackdrop);
    };



    const [paiementsSt,setPaisementsSt] = useState([]);
    const [transactionsSt,setTransactionsSt] = useState([]);

    useEffect(()=>{
        setPaisementsSt(tuteur.paiements_tuteur)
    },[])

    useEffect(()=>{
        setTransactionsSt(transactions)
    },[])

    useEffect(()=>{
        let onglet =value===1?"paiement":value===2 && "transaction"
        setData("onglet",onglet)
    },[value])

    function handleSearch()
    {
        setOpenBackdrop(true)
        axios.post(route("tuteur.paiement.filtre",auth.user.id),data)
            .then(({data}) => {

                value===1?setPaisementsSt(data):value===2 && setTransactionsSt(data);
                setFiltre(true)
                setOpenBackdrop(false)
            })

        /*
                        Inertia.post(route("etablissement.personnel.historique.filter",auth.user.etablissement_admin.id),data)
        */
    }

    function handleCloseFiltre()
    {
        setOpenBackdrop(true)
        value===1?setPaisementsSt(tuteur.paiements_tuteur):value===2 && setTransactionsSt(transactions);
        setFiltre(false)
        setTimeout(setOpenBackdrop(false),1000)
    }

    const [filtre, setFiltre] = useState(false);

    return (
        <Authenticated
            auth={auth}
            errors={errors}
        >
            <Head title="Accueil" />

            <Box sx={{ width: '100%'}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider',backgroundColor:"#f8f1eb",paddingTop:10 }}>
                    <Tabs
                        TabIndicatorProps={{ sx: { display: 'none' } }}
                        sx={{
                            '& .MuiTabs-flexContainer': {
                                flexWrap: 'wrap',
                                backgroundColor:"#f8f1eb"
                            },

                            "& .MuiTab-root.Mui-selected": {
                                color: '#fb923c',
                                fontWeight:"bold",
                            }
                        }}


                        value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                        <Tab
                            label="PAIEMENT" {...a11yProps(0)} />
                        <Tab label="HISTORIQUE DE PAIEMENT" {...a11yProps(1)}/>
                        <Tab label="TRANSACTIONS" {...a11yProps(2)}/>
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-5">

                            <Box sx={{bgcolor: 'background.paper' }}>
                                <Tabs
                                    value={valueEt}
                                    onChange={handleChangeEt}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example"
                                >
                                    {
                                        etablissements?.map(etablissement=>(
                                            <Tab key={etablissement.id} label={etablissement.nom} />
                                        ))
                                    }

                                </Tabs>
                            </Box>
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            {/*
                                <h1 className="p-6 bg-white border-b border-gray-200 text-xl p-2 text-white" style={{backgroundColor:'#fb923c'}}>PAIEMENT</h1>
                            */}

                                {
                                    tuteur?.tuteur_apprenants?.length > 0 &&
                                    <div className="p-6">
                                        <motion.div
                                            initial={{x:-100,opacity:0}}
                                            animate={{x:0,opacity:1}}
                                            transition={{
                                                duration:0.5,
                                            }}
                                            className={"space-y-5 border p-2 rounded"}>
                                            <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<button type={'button'} className="orangeOrangeBackground text-white p-2 rounded-full">
                                                        <ExpandMoreIcon />
                                                    </button>}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                    sx={{backgroundColor:"#f8f1eb"}}
                                                >
                                                    <div className={"grid gap-3 w-full"}>
                                                        <div className="text-xl font-bold rounded" style={{backgroundColor:"#f8f1eb"}}>
                                                            Synthèse des paiements
                                                        </div>
                                                        <div className="grid md:grid-cols-3 grid-cols-1 gap-3 w-full">
                                                            {
                                                                <div>
                                                                    <span className={"font-bold"}>Total à payer: </span> <span>{formatNumber(totalAll)} FG</span>
                                                                </div>
                                                            }
                                                            {
                                                                <div>
                                                                    <span className={"font-bold"}>Reste à payer: </span> <span>{formatNumber(resteApayerAll)} FG</span>
                                                                </div>
                                                            }

                                                            {
                                                                <div>
                                                                    <span className={"font-bold"}>Payé: </span> <span>{formatNumber(payerAll)} FG</span>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>

                                                </AccordionSummary>

                                                <AccordionDetails
                                                    aria-expanded={true}
                                                >
                                                    <div className="text-xl font-bold p-2 rounded" >
                                                        Donneés par frais
                                                    </div>
                                                    <div className={"grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-3"}>
                                                            {
                                                                donneesParFrais.map((frais)=>(
                                                                    <div key={frais.libelle} className="space-y-3 p-2 shadow-lg">
                                                                        <div className={"font-bold p-2 text-white rounded"} style={{backgroundColor:'#fb923c'}}>
                                                                            {
                                                                                frais.libelle
                                                                            }
                                                                        </div>
                                                                        <div>
                                                                            <span className={"font-bold"}>Total à payer: </span> <span>{formatNumber(frais.montant)} FG</span>
                                                                        </div>

                                                                        <div>
                                                                            <span className={"font-bold"}>Reste à payer: </span> <span>{formatNumber(frais.resteApayer)} FG</span>
                                                                        </div>

                                                                        <div>
                                                                            <span className={"font-bold"}>Payé: </span> <span>{formatNumber(frais.payer)} FG</span>
                                                                        </div>

                                                                    </div>
                                                                ))
                                                            }
                                                        </div>

                                                </AccordionDetails>

                                            </Accordion>


                                        </motion.div>
                                    </div>
                                }
                                <div>
                                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5 "}>
                                        {
                                            tuteur?.tuteur_apprenants.map((apprenant,i)=>(
                                                (apprenant?.classe?.etablissement?.id===data.etablissement?.id) &&
                                                <motion.div
                                                    initial={{y:-100,opacity:0}}
                                                    animate={{y:0,opacity:1}}
                                                    transition={{
                                                        duration:0.5,
                                                        type:"spring",
                                                        delay:i*0.1
                                                    }}
                                                    key={apprenant.id} className={"w-full p-5 divide-y"}>

                                                    <Accordion>
                                                        <AccordionSummary
                                                           /* expandIcon={<Tooltip  title={'Payer'}>
                                                                <button sx={styles.dropdownOpen} type={'button'} className="orangeOrangeBackground text-white p-2 rounded-full">
                                                                    Payer
                                                                </button>
                                                            </Tooltip>}*/
                                                            aria-controls="panel1a-content"
                                                            id="panel1a-header"
                                                            sx={{backgroundColor:"#f8f1eb"}}
                                                        >
                                                            {
                                                                apprenant &&
                                                                <div className={"flex justify-between items-center w-full"}>
                                                                    <div className={"col-span-3 grid md:grid-cols-2 grid-cols-1 gap-2 p-2 rounded w-full"}>
                                                                        <div>
                                                                            <span className={"font-bold text-lg"}>Matricule:</span> <span>{apprenant?.matricule}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className={"font-bold text-lg"}>Nom complet:</span> <span>{apprenant?.prenom} {apprenant?.nom}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className={"font-bold text-lg"}>Etablissement:</span> <span>{apprenant?.classe.etablissement.nom}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className={"font-bold text-lg"}>classe:</span> <span>{apprenant?.classe?.libelle}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <button type={'button'} className="orangeOrangeBackground text-white p-2 rounded-full w-fit">
                                                                            Payer
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </AccordionSummary>
                                                        <AccordionDetails
                                                            aria-expanded={true}
                                                        >
                                                            <div className={"grid md:grid-cols-2 grid-cols-1 col-span-3 gap-10"}>
                                                                <div hidden={apprenant?.tarifs?.length===0} className={"md:col-span-2 sm:col-span-2 text-lg"}>
                                                                    Veuillez cocher les frais à regler
                                                                </div>
                                                                {
                                                                    (apprenant?.tarifs) && apprenant?.tarifs.map((t) =>(

                                                                        <div key={t.id} className={"relative shadow-lg"}>
                                                                            {
                                                                                t.pivot.resteApayer===0 ?
                                                                                    <div className={"absolute -right-2 -top-3 rounded p-3 orangeVertBackground text-white"}>
                                                                                        Payé
                                                                                    </div>
                                                                                    :
                                                                                    <div className={"absolute -right-2 -top-3 rounded p-3 bg-red-400 text-white"}>
                                                                                        Reste à payer
                                                                                    </div>
                                                                            }
                                                                            <div key={t.id} className={`grid grid-cols-1 gap-2 p-5 rounded h-full ${t.pivot.resteApayer===0 ? "border-2 border-green-400":"border-2 border-red-400"}`} style={{backgroundColor:"#f8f1eb"}}>
                                                                                {
                                                                                    <div className={"flex items-center p-2 rounded text-orange-400 bg-white"} style={{height:50}}>
                                                                                        <div key={t.id} className={"text-xl"}>
                                                                                            <FormControlLabel  control={<Checkbox defaultChecked={t.pivot.resteApayer===0} disabled={t.pivot.resteApayer===0} name={apprenant.id+"_"+t.id} onChange={handleChangeCheckbox} />} label={t.type_paiement.libelle} />
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    t?.montant &&
                                                                                    <div>
                                                                                        <span className={"font-bold"}>Total à payer: </span> <span>{formatNumber(t.montant)} FG</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    t?.montant &&
                                                                                    <div>
                                                                                        <span className={"font-bold"}>Somme <span className="lowercase">{t.frequence} à payer: </span> </span> <span> {formatNumber(t.montant/(t.frequence==="MENSUELLE"?t.pivot.nombreMois:t.frequence==="SEMESTRIELLE"?nbrMois/2:t.frequence==="TRIMESTRIELLE"?nbrMois/3:t.frequence==="ANNUELLE"? 1:1))} FG</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    t?.montant &&
                                                                                    <div>
                                                                                        <span className={"font-bold"}>Reste à payer: </span> <span>{formatNumber(t.pivot.resteApayer)} FG</span>
                                                                                    </div>
                                                                                }

                                                                                {
                                                                                    t?.montant &&
                                                                                    <div>
                                                                                        <span className={"font-bold"}>Payé: </span> <span>{formatNumber(t.montant-t.pivot.resteApayer)} FG</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    t?.frequence &&
                                                                                    <div>
                                                                                        <span className={"font-bold text-lg"}>Frequence de paiement: </span> <span> {t.frequence} </span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    t?.echeance &&
                                                                                    <div>
                                                                                        <span className={"font-bold"}>Echeance: </span> <span>Le {t.echeance} de chaque mois</span>
                                                                                    </div>
                                                                                }


                                                                                {
                                                                                    (tarifs && t.pivot.resteApayer!==0) &&
                                                                                    <div  className={"grid gap-3 grid-cols-1"}>
                                                                                        <div>
                                                                                            <TextField
                                                                                                disabled={!tarifs[apprenant.id+"_"+t.id]}
                                                                                                alt="Veuillez cocher le champs"
                                                                                                className={"w-full"}  name={apprenant.id+"_"+t.id} label={"Montant"} value={montants[apprenant.id+"_"+t.id]} onChange={(e)=>setMontants(montants=>({
                                                                                                ...montants,
                                                                                                [apprenant.id+"_"+t.id]:e.target.value
                                                                                            }))}
                                                                                                InputProps={{
                                                                                                    inputComponent: NumberFormatCustom,
                                                                                                    inputProps:{
                                                                                                        max:t.pivot.resteApayer,
                                                                                                        name:apprenant.id+"_"+t.id

                                                                                                    },
                                                                                                }}
                                                                                                required
                                                                                            />
                                                                                            <div className={"flex my-2 text-red-600"}>{errors["montants."+apprenant.id+"_"+t.id] && errors["montants."+apprenant.id+"_"+t.id]}</div>
                                                                                        </div>

                                                                                    </div>
                                                                                }


                                                                            </div>

                                                                        </div>

                                                                    ))
                                                                }
                                                            </div>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </motion.div>
                                            ))
                                        }

                                        {
                                            tarifs && Object.values(tarifs).find(value=>value===true) &&
                                            <div className={"p-2 ml-5 orangeOrangeBackground my-5 text-white w-max-c text-lg"} style={{width:"fit-content"}}>
                                                <span className={"font-bold"}>Montant total:</span> <span>{formatNumber(data.total)} FG</span>
                                            </div>
                                        }

                                        {
                                            tarifs && Object.values(tarifs).find(value=>value===true)  && codeNumerosSt!=="" &&
                                            <div className={"ml-5"}>
                                                <TextField
                                                    inputProps={{

                                                        pattern:"(^"+codeNumerosSt+")[0-9]{6}"
                                                    }}
                                                    className={"w-6/12"}  name={"numero_retrait"} label={"Entrez le numéro à débiter"} onChange={(e)=>setData("numero_retrait",e.target.value)}
                                                    required
                                                />
                                            </div>
                                        }

                                        {
                                            tarifs && Object.values(tarifs).find(value=>value===true) &&
                                            <div className={"flex ml-5 col-span-3"}>
                                                <button className={"p-2 text-white orangeVertBackground font-bold rounded"}  type={"submit"}>
                                                    Valider
                                                </button>
                                            </div>
                                        }

                                        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                                                {success}
                                            </Alert>
                                        </Snackbar>
                                    </form>

                                </div>

                                {
                                    tuteur.tuteur_apprenants.length===0 &&
                                        <div className={"flex flex-col items-center py-10 space-y-5"}>
                                            <div>
                                                Vous n'avez aucun apprenant inscrit pour le moment
                                            </div>
                                            <div className={"text-blue-500"}>
                                                 Veuillez contacter l'etablissement si ce n'est pas le cas
                                            </div>
                                        </div>

                                }
                            </div>
                        </div>
                    </div>

                </TabPanel>

                <TabPanel value={value} index={1}>

                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-5">

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

                        <motion.div
                            initial={{y:-10,opacity:0}}
                            animate={{y:0,opacity:1}}
                            transition={{
                                duration:0.5,
                            }}>
                            <DataGrid
                                componentsProps={{
                                    columnMenu:{backgroundColor:"red",background:"yellow"},
                                }}

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
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>

                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-5">

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
                        <motion.div
                            initial={{y:-10,opacity:0}}
                            animate={{y:0,opacity:1}}
                            transition={{
                                duration:0.5,
                            }}
                        >
                            <DataGrid
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

                    <Modal
                        keepMounted
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                    >
                        <Box sx={style}>
                            {
                                transaction &&
                                <Save
                                    date={transaction?.paiement_global.created_at}
                                    tuteur={transaction?.paiement_global.tuteur}
                                    etablissement={transaction?.paiement_global.etablissement}
                                    total={transaction?.amount}
                                    telephone={transaction?.paiement_global.numero_retrait}
                                    paiements={transaction?.paiement_global.paiements}
                                    transactionCurrentId={transaction?.paiement_global.transactionCurrentId}
                                />
                            }
                        </Box>
                    </Modal>
                </TabPanel>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>


        </Authenticated>
    );
}

export default Index;
