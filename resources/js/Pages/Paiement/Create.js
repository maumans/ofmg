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

function Create({auth,etablissement,apprenant,matricule,code,nbrMois,modePaiements,success,montantTotal,paiements,errors,error,tuteur,codeNumeros}) {



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
        "code":code && !apprenant ?code :'',
        "matricule":matricule && !apprenant ?matricule :'',
        "etablissement":etablissement
    });

    useEffect(() => {
        if(codeNumeros)
        {
            let st=""
            codeNumeros.map((c,i)=>st=st+(i? "|":"")+c.libelle)
            setCodeNumerosSt(st)
        }
    },[])

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

    function handleSearchMat(e)
    {
        e.preventDefault()

        data.matricule && data.code && Inertia.get(route("paiement.search",[data.code,data.matricule]),{preserveScroll:true})
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
                format(new Date(cellValues.row.created_at), 'dd/MM/yyyy')
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

    return (
        <Authenticated
            auth={auth}
            errors={errors}
        >
            <Head title="Accueil" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <h1 className="p-6 bg-white border-b border-gray-200 text-xl p-2 text-white orangeOrangeBackground">PAIEMENT</h1>

                        <div>

                            <form onSubmit={handleSearchMat} className="md:flex gap-5 p-5 mt-20 w-full">
                                <div className={"w-full"}>
                                    <TextField className={"w-full"}  name={"code"} label={"Entrez le code de l'etablissement"} value={data.code} onChange={(e)=>setData("code",e.target.value)} required/>
                                    <div className={"flex my-2 text-red-600"}>{errors?.code}</div>
                                </div>
                                <div className={"w-full"}>
                                    <TextField className={"w-full"}  name={"matricule"} label={"Entrez le matricule de l'apprenant"} value={data.matricule} onChange={(e)=>setData("matricule",e.target.value)} required/>
                                    <div className={"flex my-2 text-red-600"}>{errors?.matricule}</div>
                                </div>
                                <div>
                                    <button type="submit" style={{height: 56}} className={"p-2 orangeVertBackground text-white hover:orangeVertBackground rounded"}>Rechercher</button>
                                </div>
                            </form>

                            {
                                (matricule && !apprenant) &&
                                <div className={"m-5 p-2 mt-4 bg-gray-100 rounded font-bold text-red-500"}>
                                    Données incorrectes veuillez vérifier le code l'établissement ({code}) et le matricule de l'apprenant ({matricule})
                                </div>
                            }

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
                                                    <span className={"font-bold text-xl"}>Niveau:</span> <span>{apprenant?.classe?.libelle}</span>
                                                </div>
                                            </div>
                                        }

                                        {

                                            apprenant
                                            &&
                                            (
                                                apprenant?.tarifs?.length > 0 ?
                                                    <div className={"grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 col-span-3 gap-4"}>
                                                        <div hidden={!apprenant?.tarifs} className={"md:col-span-2 sm:col-span-2 text-lg"}>
                                                            Veuillez cocher les frais à regler
                                                        </div>
                                                        {
                                                            apprenant?.tarifs.map((t) =>(

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
                                                                                <span className={"font-bold text-lg"}>Fréquence de paiement: </span> <span> {t.frequence} </span>
                                                                            </div>
                                                                        }
                                                                        {
                                                                            t?.echeance &&
                                                                            <div>
                                                                                <span className={"font-bold"}>Echéance: </span> <span>Le {t.echeance} de chaque mois</span>
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
                                                    :
                                                    <div className={"text-blue-600 text-xl md:col-span-3"}>
                                                        Aucun tarif disponible pour cet apprenant veuillez contacter l'etablissement pour plus d'informations!
                                                    </div>
                                            )
                                        }

                                        {
                                            error &&

                                            <div className={"text-red-600 text-xl md:col-span-3"}>
                                                {error}
                                            </div>
                                        }

                                    </div>


                                    {
                                        tarifs && Object.values(tarifs).find(value=>value===true) &&
                                        <div className={"p-2 orangeOrangeBackground mt-5 text-white w-max-c text-lg"} style={{width:"fit-content"}}>
                                            <span className={"font-bold"}>Montant total:</span> <span>{formatNumber(data.total)} FG</span>
                                        </div>
                                    }

                                    {
                                        tarifs && Object.values(tarifs).find(value=>value===true) && codeNumerosSt!=="" &&
                                        <div className={"my-5"}>
                                            <TextField
                                                inputProps={{

                                                    pattern:"^6("+codeNumerosSt+")[0-9]{6}"
                                                }}
                                                className={"w-6/12"}  name={"numero_retrait"} label={"Entrez le numéro à débiter"} onChange={(e)=>setData("numero_retrait",e.target.value)}
                                                required
                                            />
                                        </div>
                                    }

                                    {
                                        tarifs && Object.values(tarifs).find(value=>value===true) &&
                                        <div className={"flex col-span-3"}>
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
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>


        </Authenticated>
    );
}

export default Create;
