import React, {useEffect, useLayoutEffect, useState} from 'react';
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
    TextField,
    Radio, Tooltip
} from "@mui/material";
import {Inertia} from "@inertiajs/inertia";
import NumberFormat from 'react-number-format';


import {DataGrid, GridToolbar} from "@mui/x-data-grid";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import AdminPanel from "@/Layouts/AdminPanel";
import {CheckBox} from "@mui/icons-material";
import List from "@mui/material/List";
import capitalize from "@/Utils/Capitalize";
import SnackBar from "@/Components/SnackBar";
import {motion} from "framer-motion";

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

function Create({auth,etablissement,tuteur,apprenant,nbrMois,modePaiements,success,montantTotal,paiements,errors,error,classes,apprenants,codeNumeros}) {

    const [apprenantsList,setApprenantsList]=useState([]);

    const [successSt, setSuccessSt]=useState();

    const [codeNumerosSt, setCodeNumerosSt]=useState();

    const [montants,setMontants]=useState({})

    const [open, setOpen] = useState(false);

    const [apprenantsSt, setApprenantsSt] = useState([]);

    const [aucunResultat, setAucunResultat] = useState(null)

    const {data,setData,post,reset}=useForm({
        "modePaiements":"",
        "typePaiements":"",
        "apprenant":apprenant,
        "tarifs":"",
        "montants":[],
        "total":montantTotal?montantTotal:0,
        classeSearch:"",
        tuteurSearch:"",
        searchText:"",
        "tuteurSelectedId":null
    });


    useEffect(() => {
        setApprenantsSt(apprenants)
    },[])

    function handleClose()
    {
        setOpen(false);
    }

    const handleOpenModal = () => {

        //setOpenModal(true);
    }

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
        post(route("etablissement.paiement.store",[auth?.user?.id]),{data:data,preserveScroll:true,onSuccess:()=>reset()})
    }

    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        setLoading(false)


    },[])

    /*function handleSearchMat(matricule)
    {
        //Inertia.post(route("etablissement.paiement.search",auth?.user?.id),{matricule:matricule || null,classeId:data?.classeSearch?.id || null,tuteurNumber:data?.tuteurSearch || null},{preserveScroll:true})
        setLoading(true)
        axios.post(route("etablissement.paiement.search",auth?.user?.id),{matricule:matricule,classeId:data?.classeSearch?.id,tuteurNumber:data.tuteurSearch,searchText:data.searchText},{preserveScroll:true}).then(response=>{
            setSearchResult(response.data)
            if (response.data.apprenant===null && response.data.apprenants?.length===0 && response.data.tuteur===null)
            {
                setAucunResultat("Aucun resultat")
            }
            else
            {
                setAucunResultat(null)
            }
            setLoading(false)

        }).catch(err=>{
            console.log(err)
        })
    }*/

    useEffect(() => {
        apprenants && setApprenantsSt(apprenants)
    },[apprenants])

    useLayoutEffect(() => {
        setSuccessSt(success)
    },[success])

    useLayoutEffect(() => {
        if(successSt)
            setOpen(true);
    },[successSt])

    /*useEffect(() => {
        tuteur && !apprenant && setData("tuteurSelectedId",tuteur.id)
    },[tuteur])*/

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
        let list=null

        if(apprenant)
        {
            list=null
            apprenant?.tarifs.map((tarif)=>(
                list={...list,[apprenant.id+"_"+tarif.id]:false}
            ))
            setApprenantsList([apprenant])
        }
        /*else if (tuteur)
        {
            tuteur?.tuteur_apprenants.map((apprenant)=>(
                apprenant?.tarifs.map((tarif)=>(
                    list={...list,[apprenant.id+"_"+tarif.id]:false}
                ))))
            setApprenantsList(tuteur?.tuteur_apprenants)
        }*/

        else
        {
            setApprenantsList(null)
        }
        setTarifs(list)

    },[apprenant/*,tuteur*/])

    const columns = [
        //{ field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'matricule', headerName: 'MATRICULE',flex:1,minWidth: 130 },

        { field: 'prenom', headerName: 'PRENOM' ,flex:1,minWidth: 130 },
        { field: 'nom', headerName: 'NOM' ,flex:1,minWidth: 130 },
        { field: 'classe', headerName: 'CLASSE',flex:1,minWidth:250,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    {cellValues.row.classe.libelle}
                </div>
            )
        },
        { field: 'action', headerName: 'ACTION',flex:1,minWidth:200,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button type="button" onClick={()=>handleSearchMat(cellValues.row.id)} className={"p-2 text-white orangeBlueBackground rounded"}>
                        Procéder au paiement
                    </button>
                </div>
            )
        },

    ];


    const [checked, setChecked] = useState([]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

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

    return (
        <AdminPanel auth={auth} error={error} active={"fraisScolaires"} sousActive={"paiementFraisScolaires"}>

            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <h1 className="bg-white border-b border-gray-200 text-xl p-2 text-white orangeOrangeBackground">PAIEMENT</h1>

                        <div className={'w-full'}>


                            {
                                apprenantsList?.length > 0 ?
                                <div className="py-6">
                                    <div>
                                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                            <div>
                                                <form onSubmit={handleSubmit} className={"space-y-5 my-5 "}>
                                                    {
                                                        apprenantsList?.map((apprenant,i)=>(


                                                            <motion.div
                                                                initial={{y:-100,opacity:0}}
                                                                animate={{y:0,opacity:1}}
                                                                transition={{
                                                                    duration:0.5,
                                                                    type:"spring",
                                                                    delay:i*0.1
                                                                }}

                                                                key={apprenant.id} className={"w-full p-5 divide-y"}>

                                                                <Accordion
                                                                    defaultExpanded={ apprenantsList?.length===1}
                                                                >
                                                                    <AccordionSummary
                                                                        /*expandIcon={<button type={'button'} className="orangeOrangeBackground text-white p-2 rounded-full">
                                                                                <ExpandMoreIcon />
                                                                            </button>}*/
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
                                                                    >
                                                                        <div className={"grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 col-span-3 gap-5 divide-y-2"}>

                                                                            {
                                                                                apprenant &&
                                                                                <div className={"w-full md:col-span-2 sm:col-span-2  my-5"}>

                                                                                    {
                                                                                        apprenant?.tuteurs?.length >0 &&
                                                                                        <div>
                                                                                            <span className={"font-bold text-lg"}>Selectionnez l'auteur du paiement</span>
                                                                                        </div>
                                                                                    }

                                                                                    <List className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 divide-x" dense >
                                                                                        {
                                                                                            apprenant?.tuteurs.map((t) => {
                                                                                            const labelId = `checkbox-list-secondary-label-${t.id}`;
                                                                                            return (
                                                                                                <ListItem
                                                                                                    className={"w-full"}
                                                                                                    key={t.id}
                                                                                                    secondaryAction={
                                                                                                        <Radio
                                                                                                            checked={data.tuteurSelectedId===t.id}
                                                                                                            onChange={()=>setData("tuteurSelectedId",t.id)}
                                                                                                        />
                                                                                                    }
                                                                                                    disablePadding
                                                                                                >
                                                                                                    <ListItemButton>
                                                                                                        <ListItemText  id={labelId} primary={capitalize(t?.prenom)+" "+capitalize(t?.nom)} secondary={" Tel: "+t.telephone+" |   Email: "+t.email}
                                                                                                        />
                                                                                                    </ListItemButton>
                                                                                                </ListItem>
                                                                                            );
                                                                                        })}
                                                                                    </List>
                                                                                    <div className="text-red-600">
                                                                                        {errors?.tuteurSelectedId}
                                                                                    </div>

                                                                                </div>

                                                                            }
                                                                            <div hidden={apprenant?.tarifs?.length===0} className={"md:col-span-2 sm:col-span-2 font-bold text-lg py-5"}>
                                                                                Cocher les frais à regler *
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

                                                                                        <div className={"grid grid-cols-1 gap-2 p-5 rounded h-full"} style={{backgroundColor:"#f8f1eb"}}>
                                                                                            {
                                                                                                <div className={"text-xl p-2 rounded text-orange-400 bg-white"}>
                                                                                                    <div key={t.id} className={"text-xl"}>
                                                                                                        <FormControlLabel control={<Checkbox defaultChecked={t.pivot.resteApayer===0} disabled={t.pivot.resteApayer===0} name={apprenant.id+"_"+t.id} onChange={handleChangeCheckbox} />} label={t.type_paiement.libelle} />
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
                                                        setApprenantsList?.length > 0 &&
                                                        <div className={"p-2 ml-5 orangeOrangeBackground my-5 text-white w-max-c text-lg"} style={{width:"fit-content"}}>
                                                            <span className={"font-bold"}>Montant total:</span> <span>{data.total ? formatNumber(data.total)+" FG": "0 FG"} </span>
                                                        </div>
                                                    }

                                                    {
                                                        tarifs && Object.values(tarifs).find(value=>value===true) &&
                                                        <div className={"flex ml-5 col-span-3"}>
                                                            <button className={"p-2 text-white orangeVertBackground rounded hover:text-green-600 hover:bg-white hover:border hover:border-green-600 transition duration-500"} style={{height: 56}}  type={"submit"}>
                                                                Valider
                                                            </button>
                                                        </div>
                                                    }

                                                   <SnackBar success={success}/>
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    :
                                <div className={"p-5"}>
                                    {

                                        <DataGrid
                                            components={{
                                                Toolbar:GridToolbar,
                                            }}
                                            rows={apprenantsSt}
                                            columns={columns}
                                            initialState={{
                                                pagination: {
                                                    pageSize: 10,
                                                },
                                            }}
                                            rowsPerPageOptions={[10,20,100]}
                                            autoHeight
                                        />
                                    }
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>



        </AdminPanel>
    );
}

export default Create;
