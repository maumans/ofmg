import React, {useEffect, useState,Fragment} from 'react';
import {Head, useForm, useRemember} from "@inertiajs/inertia-react";
import Authenticated from "@/Layouts/Authenticated";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Alert,
    Autocomplete, Avatar,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText,
    Modal,
    Snackbar,
    TextField
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

function Index({auth,nbrMois,success,montantTotal,paiements,errors,tuteur,totalAll,payerAll,resteApayerAll,donneesParFrais,codeNumeros,transactions}) {

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

    const handleOpenModal = () => {

        setOpenModal(true);
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

        Inertia.post(route("tuteur.paiement.store",[auth?.user?.id]),data,{preserveScroll:true})
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
        { field: 'date', headerName: "DATE",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold", renderCell:(cellValues)=>(
                cellValues.row.created_at.split('T')[0]+" à "+cellValues.row.created_at.split('T')[1].split(".")[0]
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
                    <button onClick={handleOpenModal} className={"p-2 text-white orangeOrangeBackground hover:orangeOrangeBackground transition duration-500 rounded"}>
                        Reçu
                    </button>

                    <button onClick={()=>handleShow(cellValues.row.id)} className={"p-2 text-white orangeBlueBackground orangeBlueBackground rounded hover:text-blue-400 hover:bg-white transition duration-500"}>
                        <VisibilityIcon/>
                    </button>
                </div>
            )
        },

    ];

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'Nom_complet', headerName: "APPRENANT",headerClassName:"header", flex: 1, minWidth: 200, fontWeight:"bold", renderCell:(cellValues)=>(
                cellValues.row.apprenant.prenom+" "+cellValues.row.apprenant.nom
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
        { field: 'montant', headerName: "MONTANT", flex: 1, minWidth: 250,  renderCell:(cellValues)=>(
                formatNumber(cellValues.row.montant)+" FG"
            ) },
        { field: 'mode_paiement', headerName: "MODE DE PAIEMENT", flex: 1, minWidth: 250,  renderCell:(cellValues)=>(
                cellValues.row.mode_paiement?.libelle
            ) },
        { field: 'created_at', headerName: "DATE", flex: 1, minWidth: 150, renderCell:(cellValues)=>(
                cellValues.row.created_at.split("T")[0]
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
                                                    expandIcon={<ExpandMoreIcon />}
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
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel1a-content"
                                                            id="panel1a-header"
                                                            sx={{backgroundColor:"#f8f1eb"}}
                                                        >
                                                            {
                                                                apprenant &&
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
                                                    className={"w-6/12"}  name={"numero_retrait"} label={"Entrez votre numero OM"} onChange={(e)=>setData("numero_retrait",e.target.value)}
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

                    <div className={"flex justify-center"}>
                        {
                            tuteur &&
                            <motion.div
                                initial={{y:-10,opacity:0}}
                                animate={{y:0,opacity:1}}
                                transition={{
                                    duration:0.5,
                                }}
                                style={{width:1200,minWidth:400}}>
                                <DataGrid
                                    componentsProps={{
                                        columnMenu:{backgroundColor:"red",background:"yellow"},
                                    }}

                                    components={{
                                        Toolbar:GridToolbar,
                                    }}
                                    rows={tuteur.paiements_tuteur}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    autoHeight


                                />
                            </motion.div>
                        }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>

                    <div className={"flex justify-center"}>
                        {
                            tuteur &&
                            <motion.div
                                initial={{y:-10,opacity:0}}
                                animate={{y:0,opacity:1}}
                                transition={{
                                    duration:0.5,
                                }}
                                style={{width:1200,minWidth:400}}>
                                <DataGrid
                                    componentsProps={{
                                        columnMenu:{backgroundColor:"red",background:"yellow"},
                                    }}

                                    components={{
                                        Toolbar:GridToolbar,
                                    }}
                                    rows={transactions}
                                    columns={columnsTransactions}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    autoHeight


                                />
                            </motion.div>
                        }
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

                                <Save
                                    tuteur={tuteur}
                                    apprenant={tuteur.tuteur_apprenants[0]}
                                    etablissement={tuteur.tuteur_apprenants[0].classe.etablissement}
                                    paiements={tuteur.paiements}
                                    nbrMois={10}
                                />
                            }
                        </Box>
                    </Modal>
                </TabPanel>

                
            </Box>


        </Authenticated>
    );
}

export default Index;
