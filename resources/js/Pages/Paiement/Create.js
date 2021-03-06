import React, {useEffect, useState} from 'react';
import {Head, useForm, useRemember} from "@inertiajs/inertia-react";
import Authenticated from "@/Layouts/Authenticated";
import {
    Alert,
    Autocomplete,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
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

import {TabPanel, a11yProps} from "../../Components/TabPanel"
import Save from "../../Components/Pdfrender";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {fontWeight} from "@mui/system";

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

function Create({auth,etablissement,apprenant,matricule,nbrMois,modePaiements,success,montantTotal,paiements,errors,tuteur,}) {

    const [typePaiements,setTypePaiements]=useState([]);

    const [successSt, setSuccessSt]=useState();

    const [montants,setMontants]=useState({})

    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const {data,setData,post}=useForm({
        "matricule":"",
        "modePaiements":"",
        "typePaiements":"",
        "apprenant":apprenant,
        "tarifs":"",
        "montants":[],
        "total":montantTotal?montantTotal:0
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
        Inertia.post(route("paiement.store",auth?.user?.id),data,{preserveScroll:true})

    }

    function handleSearchMat()
    {
        data.matricule && Inertia.get(route("paiement.search",[data.matricule]),{preserveScroll:true})
    }

    useEffect(() => {
        setSuccessSt(success)
    },[success])

    useEffect(() => {
        if(successSt)
            setOpen(true);
    },[successSt])




    useEffect(() => {

        if(data.typePaiements) {
            let tab=[]
            let list=null

            data.typePaiements.map((typePaiement) => (
                        tab.push(typePaiement.id)
            ))

            for (const [key,value] of Object.entries(tab)) {
                list={...list,[value]:""}
            }
            setMontants(list)
        }


        if(data.typePaiements) {
            let tpTab=[]

            data.typePaiements.map((typePaiement)=>{
                tpTab.push(apprenant.niveau.tarifs.filter((t)=>t.type_paiement_id===typePaiement.id)[0])
            })
            setData("tarifs",tpTab)
        }
    },[data.typePaiements])


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
        matricule && setData("matricule",matricule)
    },[matricule])

    useEffect(() => {
        montantTotal && handleOpenModal()
    },[montantTotal])

    const [tarifs,setTarifs]=useState()

    useEffect(() => {
        setData("tarifs",tarifs)
    },[tarifs])


    function handleChangeCheckbox (event){
        setTarifs(tarifs=>({
            ...tarifs,
            [event.target.name]: event.target.checked,
        }));
    }

    useEffect(() => {
        if(apprenant?.tarifs)
        {
            let list={}
            apprenant.tarifs.map((tarif)=>(
                list={...list,[tarif.id]:false}
            ))
            setTarifs(list)
        }

    },[])


    //////TAB 2 CODES

    function handleShow(id) {
        return undefined;
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'Nom_complet', headerName: "NOM COMPLET DE L'APPRENANT",headerClassName:"header", width:300, fontWeight:"bold", renderCell:(cellValues)=>(
                cellValues.row.apprenant.prenom+" "+cellValues.row.apprenant.prenom
            ) },
        { field: 'type_paiement', headerName: "TYPE DE PAIEMENT", width: 200,  renderCell:(cellValues)=>(
                cellValues.row.type_paiement.libelle
            ) },
        { field: 'mode_paiement', headerName: "MODE DE PAIEMENT", width: 200,  renderCell:(cellValues)=>(
                cellValues.row.mode_paiement.libelle
            ) },
        { field: 'montant', headerName: "MONTANT", width: 100, renderCell:(cellValues)=>(
                formatNumber(cellValues.row.montant)+" FG"
            ) },
        { field: 'created_at', headerName: "DATE", width: 150, renderCell:(cellValues)=>(
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
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                        <Tab label="PAIEMENT" {...a11yProps(0)} />
                        <Tab label="HISTORIQUE DE PAIEMENT" {...a11yProps(1)} />
                        <Tab label="Item Three" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <h1 className="p-6 bg-white border-b border-gray-200 text-xl p-2 text-white bg-orange-400">PAIEMENT</h1>

                                <div>
                                    <div className="flex space-x-5 p-5 mt-20">
                                        <TextField
                                            className={"w-full"}  name={"matricule"} label={"Entrez le matricule de l'apprenant"} value={data.matricule} onChange={(e)=>setData("matricule",e.target.value)}/>
                                        <button onClick={handleSearchMat} className={"p-2 bg-green-400 text-white hover:bg-green-600 rounded"}>Rechercher</button>
                                        <div className={"flex my-2 text-red-600"}>{errors?.matricule}</div>
                                    </div>

                                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5 "}>

                                        <div className={"w-full p-5"}>
                                            <div className={"gap-5 space-y-10 grid md:grid-cols-3 grid-cols-1 items-end mb-5"}>
                                                {
                                                    apprenant &&
                                                    <div className={"col-span-3 grid grid-cols-2 gap-5"}>
                                                        <div>
                                                            <span className={"font-bold text-xl"}>Matricule:</span> <span>{apprenant?.matricule}</span>
                                                        </div>
                                                        <div>
                                                            <span className={"font-bold text-xl"}>Nom complet:</span> <span>{apprenant?.prenom} {apprenant?.nom}</span>
                                                        </div>
                                                        <div>
                                                            <span className={"font-bold text-xl"}>Etablissement:</span> <span>{etablissement?.nom}</span>
                                                        </div>
                                                        <div>
                                                            <span className={"font-bold text-xl"}>Niveau:</span> <span>{apprenant?.niveau?.description+"("+apprenant?.niveau?.libelle+")"}</span>
                                                        </div>
                                                    </div>
                                                }
                                                <div className={"grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 col-span-3 gap-4"}>
                                                        <div hidden={!apprenant?.tarifs} className={"md:col-span-2 sm:col-span-2 text-lg"}>
                                                            Veuillez cocher les frais à regler
                                                        </div>
                                                        {
                                                        (apprenant?.tarifs) && apprenant?.tarifs.map((t) =>(

                                                                <div key={t.id} className={"grid grid-cols-1 gap-5 p-5 border-green-600 rounded"} style={{backgroundColor:"#f8f1eb"}}>
                                                                    {
                                                                        <div className={"text-xl p-2 rounded text-orange-400 bg-white"}>
                                                                            <div key={t.id} className={"text-xl"}>
                                                                                <FormControlLabel control={<Checkbox name={t.id+""} onChange={handleChangeCheckbox} />} label={t.type_paiement.libelle} />
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        t?.montant &&
                                                                        <div>
                                                                            <span className={"font-bold text-lg"}>Total à payer: </span> <span>{formatNumber(t.montant)} FG</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        t?.montant &&
                                                                        <div>
                                                                            <span className={"font-bold text-lg"}>Somme <span className="lowercase">{t.frequence} à payer: </span> </span> <span> {formatNumber(t.montant/(t.frequence==="MENSUELLE"?nbrMois:t.frequence==="SEMESTRIELLE"?nbrMois/2:t.frequence==="TRIMESTRIELLE"?nbrMois/3:t.frequence==="ANNUELLE"? 1:1))} FG</span>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        t?.montant &&
                                                                        <div>
                                                                            <span className={"font-bold text-lg"}>Reste à payer: </span> <span>{formatNumber(t.resteApayer)} FG</span>
                                                                        </div>
                                                                    }

                                                                    {
                                                                        t?.montant &&
                                                                        <div>
                                                                            <span className={"font-bold text-lg"}>Payé: </span> <span>{formatNumber(t.montant-t.resteApayer)} FG</span>
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
                                                                        console.log(data?.tarifs)
                                                                    }

                                                                    {
                                                                        tarifs &&
                                                                        <div  className={"grid gap-3 grid-cols-1"}>
                                                                            <div>
                                                                                <TextField
                                                                                    disabled={!tarifs[t.id]}
                                                                                    alt="Veillez cocher le champs"
                                                                                    className={"w-full"}  name={montants[t.type_paiement.id]} label={"Montant"} value={montants[t.type_paiement.id]} onChange={(e)=>setMontants(montants=>({
                                                                                    ...montants,
                                                                                    [t.type_paiement.id]:e.target.value
                                                                                }))}
                                                                                    InputProps={{
                                                                                        inputComponent: NumberFormatCustom,
                                                                                        inputProps:{
                                                                                            max:t.resteApayer,
                                                                                        },
                                                                                    }}
                                                                                    required
                                                                                />
                                                                                <div className={"flex my-2 text-red-600"}>{errors["montants."+t.type_paiement.id] && errors["montants."+t.type_paiement.id]}</div>
                                                                            </div>

                                                                        </div>
                                                                    }


                                                                </div>


                                                        ))
                                                        }
                                                    </div>

                                            </div>


                                            {
                                                data.montant &&
                                                <div className={"p-2 bg-orange-400 my-5 text-white w-max-c text-lg"} style={{width:"fit-content"}}>
                                                    <span className={"font-bold"}>Montant total:</span> <span>{formatNumber(data.total)} FG</span>
                                                </div>
                                            }
                                            {
                                                tarifs && Object.values(tarifs).find(value=>value===true) &&
                                                <div hidden={data.typePaiements} className={"flex col-span-3"}>
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
                                        </div>
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
                                apprenant &&
                                <Save
                                    apprenant={apprenant}
                                    etablissement={etablissement}
                                    paiements={apprenant.paiements}
                                    nbrMois={nbrMois}
                                    total={data.total}
                                />
                            }
                        </Box>
                    </Modal>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div hidden={true}>
                        {
                            paiements &&
                            <Save
                               apprenant={apprenant}
                               paiements={paiements}
                               etablissement={etablissement}
                               nbrMois={nbrMois}
                               total={data.total}
                        />
                        }
                    </div>

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

                                    sx={{
                                        borderColor: 'primary.light',
                                        '& .header': {
                                           fontWeight:900,
                                        }
                                    }}

                                />
                            </div>
                        }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <div>3</div>
                </TabPanel>
            </Box>


        </Authenticated>
    );
}

export default Create;
