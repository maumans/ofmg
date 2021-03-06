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
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import {TabPanel, a11yProps} from "../../../Components/TabPanel"
import Save from "../../../Components/Pdfrender";
import VisibilityIcon from "@mui/icons-material/Visibility";


import {DataGrid, GridToolbar} from "@mui/x-data-grid";

import List from "@mui/material/List";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {fontWeight, minWidth} from "@mui/system";

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
                console.log(floatValue,values,((floatValue >= 0 || floatValue === undefined) &&  floatValue <= props.max))
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
            suffix={props.devise==="eur"?" ???":props.devise==="usd"?" $":" FG"

            }
        />
    );
});

function Index({auth,nbrMois,success,montantTotal,paiements,errors,tuteur,totalAll,payerAll,resteApayerAll,donneesParFrais}) {

    const [successSt, setSuccessSt]=useState();

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
        "numero_retrait":""
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
           apprenant?.tarifs.map((tarif)=>(
               list={...list,[apprenant.id+"_"+tarif.id]:false}
           ))))
        setTarifs(list)
    },[])

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




    //////TAB 2 CODES


    function handleShow(id) {
        return undefined;
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'Nom_complet', headerName: "NOM COMPLET DE L'APPRENANT",headerClassName:"header", flex: 1, minWidth: 300, fontWeight:"bold", renderCell:(cellValues)=>(
                cellValues.row.apprenant.prenom+" "+cellValues.row.apprenant.prenom
            ) },
        { field: 'type_paiement', headerName: "TYPE DE FRAIS", flex: 1, minWidth: 150,  renderCell:(cellValues)=>(
                cellValues.row.type_paiement?.libelle
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
                    <button onClick={()=>handleShow(cellValues.row.id)} className={"p-2 text-white bg-blue-400 bg-blue-400 rounded hover:text-blue-400 hover:bg-white transition duration-500"}>
                        <VisibilityIcon/>
                    </button>
                </div>
            )
        },

    ];

    return (
        <Authenticated
            auth={auth}
            errors={errors}
        >
            <Head title="Accueil" />

            <Box sx={{ width: '100%',marginTop:10 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs

                        TabIndicatorProps={{ sx: { display: 'none' } }}
                        sx={{
                            '& .MuiTabs-flexContainer': {
                                flexWrap: 'wrap',
                            },
                        }}


                        value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                        <Tab label="PAIEMENT" {...a11yProps(0)} />
                        <Tab label="APERCU DU RECU" {...a11yProps(1)} />
                        <Tab label="HISTORIQUE DE PAIEMENT" {...a11yProps(2)}/>
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <h1 className="p-6 bg-white border-b border-gray-200 text-xl p-2 text-white bg-orange-400">PAIEMENT</h1>

                                {
                                    tuteur?.tuteur_apprenants?.length > 0 &&
                                    <div className="p-6">
                                        <div className={"space-y-5 border p-2 rounded"}>
                                            <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                    sx={{backgroundColor:"#f8f1eb"}}
                                                >
                                                    <div className={"grid gap-3 w-full"}>
                                                        <div className="text-xl font-bold rounded" style={{backgroundColor:"#f8f1eb"}}>
                                                            Synth??se des paiements
                                                        </div>
                                                        <div className="grid md:grid-cols-3 grid-cols-1 gap-3 w-full">
                                                            {
                                                                <div>
                                                                    <span className={"font-bold"}>Total ?? payer: </span> <span>{formatNumber(totalAll)} FG</span>
                                                                </div>
                                                            }
                                                            {
                                                                <div>
                                                                    <span className={"font-bold"}>Reste ?? payer: </span> <span>{formatNumber(resteApayerAll)} FG</span>
                                                                </div>
                                                            }

                                                            {
                                                                <div>
                                                                    <span className={"font-bold"}>Pay??: </span> <span>{formatNumber(payerAll)} FG</span>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>

                                                </AccordionSummary>

                                                <AccordionDetails
                                                    aria-expanded={true}
                                                >
                                                    <div className="text-xl font-bold p-2 rounded" >
                                                        Donne??s par frais
                                                    </div>
                                                    <div className={"grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-3"}>
                                                            {
                                                                donneesParFrais.map((frais)=>(
                                                                    <div key={frais.libelle} className="space-y-3 p-2 shadow-lg">
                                                                        <div className={"font-bold p-2 bg-orange-400 text-white rounded"}>
                                                                            {
                                                                                frais.libelle
                                                                            }
                                                                        </div>
                                                                        <div>
                                                                            <span className={"font-bold"}>Total ?? payer: </span> <span>{formatNumber(frais.montant)} FG</span>
                                                                        </div>

                                                                        <div>
                                                                            <span className={"font-bold"}>Reste ?? payer: </span> <span>{formatNumber(frais.resteApayer)} FG</span>
                                                                        </div>

                                                                        <div>
                                                                            <span className={"font-bold"}>Pay??: </span> <span>{formatNumber(frais.payer)} FG</span>
                                                                        </div>

                                                                    </div>
                                                                ))
                                                            }
                                                        </div>

                                                </AccordionDetails>

                                            </Accordion>


                                        </div>
                                    </div>
                                }
                                <div>
                                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5 "}>

                                        {
                                            tuteur?.tuteur_apprenants.map((apprenant)=>(


                                                <div key={apprenant.id} className={"w-full p-5 divide-y"}>

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
                                                                        <span className={"font-bold text-lg"}>Etablissement:</span> <span>{apprenant?.niveau.etablissement.nom}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className={"font-bold text-lg"}>Niveau:</span> <span>{apprenant?.niveau?.description+"("+apprenant?.niveau?.libelle+")"}</span>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </AccordionSummary>
                                                        <AccordionDetails
                                                            aria-expanded={true}
                                                        >
                                                            <div className={"grid md:grid-cols-2 grid-cols-1 col-span-3 gap-4"}>
                                                                <div hidden={apprenant?.tarifs?.length===0} className={"md:col-span-2 sm:col-span-2 text-lg"}>
                                                                    Veuillez cocher les frais ?? regler
                                                                </div>
                                                                {
                                                                    (apprenant?.tarifs) && apprenant?.tarifs.map((t) =>(

                                                                        <div key={t.id} className={"grid grid-cols-1 gap-2 p-5 border-green-600 rounded"} style={{backgroundColor:"#f8f1eb"}}>
                                                                            {
                                                                                <div className={"text-xl p-2 rounded text-orange-400 bg-white"}>
                                                                                    <div key={t.id} className={"text-xl"}>
                                                                                        <FormControlLabel control={<Checkbox name={apprenant.id+"_"+t.id} onChange={handleChangeCheckbox} />} label={t.type_paiement.libelle} />
                                                                                    </div>
                                                                                </div>
                                                                            }
                                                                            {
                                                                                t?.montant &&
                                                                                <div>
                                                                                    <span className={"font-bold"}>Total ?? payer: </span> <span>{formatNumber(t.montant)} FG</span>
                                                                                </div>
                                                                            }
                                                                            {
                                                                                t?.montant &&
                                                                                <div>
                                                                                    <span className={"font-bold"}>Somme <span className="lowercase">{t.frequence} ?? payer: </span> </span> <span> {formatNumber(t.montant/(t.frequence==="MENSUELLE"?t.pivot.nombreMois:t.frequence==="SEMESTRIELLE"?nbrMois/2:t.frequence==="TRIMESTRIELLE"?nbrMois/3:t.frequence==="ANNUELLE"? 1:1))} FG</span>
                                                                                </div>
                                                                            }
                                                                            {
                                                                                t?.montant &&
                                                                                <div>
                                                                                    <span className={"font-bold"}>Reste ?? payer: </span> <span>{formatNumber(t.pivot.resteApayer)} FG</span>
                                                                                </div>
                                                                            }

                                                                            {
                                                                                t?.montant &&
                                                                                <div>
                                                                                    <span className={"font-bold"}>Pay??: </span> <span>{formatNumber(t.montant-t.pivot.resteApayer)} FG</span>
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
                                                                                tarifs &&
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


                                                                    ))
                                                                }
                                                            </div>
                                                        </AccordionDetails>
                                                    </Accordion>






                                                    {
                                                        /*
                                                        <div className={"gap-5 space-y-10 grid md:grid-cols-3 grid-cols-1 items-end mb-5"}>
                                                        {
                                                            apprenant &&
                                                            <div className={"col-span-3 grid grid-cols-2 gap-5 p-2 rounded"}>
                                                                <div>
                                                                    <span className={"font-bold text-xl"}>Matricule:</span> <span>{apprenant?.matricule}</span>
                                                                </div>
                                                                <div>
                                                                    <span className={"font-bold text-xl"}>Nom complet:</span> <span>{apprenant?.prenom} {apprenant?.nom}</span>
                                                                </div>
                                                                <div>
                                                                    <span className={"font-bold text-xl"}>Etablissement:</span> <span>{apprenant?.niveau.etablissement.nom}</span>
                                                                </div>
                                                                <div>
                                                                    <span className={"font-bold text-xl"}>Niveau:</span> <span>{apprenant?.niveau?.description+"("+apprenant?.niveau?.libelle+")"}</span>
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className={"grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 col-span-3 gap-4"}>
                                                            <div hidden={!apprenant?.tarifs} className={"md:col-span-2 sm:col-span-2 text-lg"}>
                                                                Veuillez cocher les frais ?? regler
                                                            </div>
                                                            {
                                                                (apprenant?.tarifs) && apprenant?.tarifs.map((t) =>(

                                                                    <div key={t.id} className={"grid grid-cols-1 gap-2 p-5 border-green-600 rounded"} style={{backgroundColor:"#f8f1eb"}}>
                                                                        {
                                                                            <div className={"text-xl p-2 rounded text-orange-400 bg-white"}>
                                                                                <div key={t.id} className={"text-xl"}>
                                                                                    <FormControlLabel control={<Checkbox name={apprenant.id+"_"+t.id} onChange={handleChangeCheckbox} />} label={t.type_paiement.libelle} />
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                        {
                                                                            t?.montant &&
                                                                            <div>
                                                                                <span className={"font-bold text-lg"}>Total ?? payer: </span> <span>{formatNumber(t.montant)} FG</span>
                                                                            </div>
                                                                        }
                                                                        {
                                                                            t?.montant &&
                                                                            <div>
                                                                                <span className={"font-bold text-lg"}>Somme <span className="lowercase">{t.frequence} ?? payer: </span> </span> <span> {formatNumber(t.montant/(t.frequence==="MENSUELLE"?nbrMois:t.frequence==="SEMESTRIELLE"?nbrMois/2:t.frequence==="TRIMESTRIELLE"?nbrMois/3:t.frequence==="ANNUELLE"? 1:1))} FG</span>
                                                                            </div>
                                                                        }
                                                                        {
                                                                            t?.montant &&
                                                                            <div>
                                                                                <span className={"font-bold text-lg"}>Reste ?? payer: </span> <span>{formatNumber(t.resteApayer)} FG</span>
                                                                            </div>
                                                                        }

                                                                        {
                                                                            t?.montant &&
                                                                            <div>
                                                                                <span className={"font-bold text-lg"}>Pay??: </span> <span>{formatNumber(t.montant-t.resteApayer)} FG</span>
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
                                                                                <span className={"font-bold text-lg"}>Echeance: </span> <span>Le {t.echeance} de chaque mois</span>
                                                                            </div>
                                                                        }


                                                                        {
                                                                            tarifs &&
                                                                            <div  className={"grid gap-3 grid-cols-1"}>

                                                                                {console.log(t.resteApayer)}
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
                                                                                                max:t.resteApayer,
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


                                                                ))
                                                            }
                                                        </div>

                                                    </div>

                                                         */
                                                    }
                                                </div>
                                            ))
                                        }

                                        {
                                            tarifs && Object.values(tarifs).find(value=>value===true) &&
                                            <div className={"p-2 ml-5 bg-orange-400 my-5 text-white w-max-c text-lg"} style={{width:"fit-content"}}>
                                                <span className={"font-bold"}>Montant total:</span> <span>{formatNumber(data.total)} FG</span>
                                            </div>
                                        }

                                        {
                                            tarifs && Object.values(tarifs).find(value=>value===true) &&
                                            <div className={"ml-5"}>
                                                <TextField
                                                    className={"w-6/12"}  name={"numero_retrait"} label={"Entrez votre numero OM"} onChange={(e)=>setData("numero_retrait",e.target.value)}
                                                    required
                                                />
                                            </div>
                                        }

                                        {
                                            tarifs && Object.values(tarifs).find(value=>value===true) &&
                                            <div className={"flex ml-5 col-span-3"}>
                                                <button className={"p-2 text-white bg-green-600 font-bold"}  type={"submit"}>
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
                            </div>
                        </div>
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
                                    etablissement={tuteur.tuteur_apprenants[0].niveau.etablissement}
                                    paiements={tuteur.paiements}
                                    nbrMois={10}
                                    total={data.total}
                                />
                            }
                        </Box>
                    </Modal>
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <Box sx={style}>
                        {

                            <Save
                                tuteur={tuteur}
                                apprenant={tuteur.tuteur_apprenants[0]}
                                etablissement={tuteur.tuteur_apprenants[0].niveau.etablissement}
                                paiements={tuteur.paiements}
                                nbrMois={10}
                                total={data.total}
                            />
                        }
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={2}>

                    <div className={"flex justify-center"}>
                        {
                            tuteur &&
                            <div style={{width:1200,minWidth:400}}>
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
                                    checkboxSelection
                                    autoHeight


                                />
                            </div>
                        }
                    </div>
                </TabPanel>

            </Box>


        </Authenticated>
    );
}

export default Index;
