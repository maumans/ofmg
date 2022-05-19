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
    Radio
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

function Create({auth,etablissement,apprenant,matricule,nbrMois,modePaiements,success,montantTotal,paiements,errors,error,classes,apprenants}) {

    const [apprenantsList,setApprenantsList]=useState([]);

    const [successSt, setSuccessSt]=useState();

    const [montants,setMontants]=useState({})

    const [open, setOpen] = useState(false);

    const {data,setData}=useForm({
        "matricule":"",
        "modePaiements":"",
        "typePaiements":"",
        "apprenant":apprenant,
        "tarifs":"",
        "montants":[],
        "total":montantTotal?montantTotal:0,
        "numero_retrait":"",
        classeSearch:"",
        tuteurSearch:"",
        "tuteurSelectedId":null
    });

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

    const [searchResult,setSearchResult] =useState();

    function handleSubmit(e)
    {
        e.preventDefault();
        Inertia.post(route("etablissement.paiement.store",[auth?.user?.id]),data,{preserveScroll:true})
    }

    function handleSearchMat(matricule)
    {
        //Inertia.post(route("etablissement.paiement.search",auth?.user?.id),{matricule:matricule || null,classeId:data?.classeSearch?.id || null,tuteurNumber:data?.tuteurSearch || null},{preserveScroll:true})
        axios.post(route("etablissement.paiement.search",auth?.user?.id),{matricule:matricule || null,classeId:data?.classeSearch?.id || null,tuteurNumber:data?.tuteurSearch || null},{preserveScroll:true}).then(response=>{
            setSearchResult(response.data)
        }).catch(err=>{
            console.log(err)
        })
    }

    useLayoutEffect(() => {
        setSuccessSt(success)
    },[success])

    useLayoutEffect(() => {
        if(successSt)
            setOpen(true);
    },[successSt])

    useEffect(() => {
        searchResult?.tuteur && !searchResult?.apprenant && setData("tuteurSelectedId",searchResult.tuteur.id)
    },[searchResult?.tuteur])

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
        let list=null

        if(searchResult?.apprenant)
        {
            list=null
            searchResult?.apprenant?.tarifs.map((tarif)=>(
                list={...list,[searchResult?.apprenant.id+"_"+tarif.id]:false}
            ))
            setApprenantsList([searchResult?.apprenant])
        }
        else if (searchResult?.tuteur)
        {
            searchResult?.tuteur?.tuteur_apprenants.map((apprenant)=>(
                apprenant?.tarifs.map((tarif)=>(
                    list={...list,[apprenant.id+"_"+tarif.id]:false}
                ))))
            setApprenantsList(searchResult?.tuteur?.tuteur_apprenants)
        }

        else
        {
            setApprenantsList(null)
        }
        setTarifs(list)

    },[searchResult?.apprenant,searchResult?.tuteur])





    const columns = [
        { field: 'id', headerName: 'ID',flex:1,minWidth: 70 },
        { field: 'prenom', headerName: 'PRENOM' ,flex:1,minWidth: 130 },
        { field: 'nom', headerName: 'NOM' ,flex:1,minWidth: 130 },
        { field: 'matricule', headerName: 'MATRICULE',flex:1,minWidth: 130 },
        { field: 'date_naissance', headerName: 'DATE DE NAISSANCE',flex:1,minWidth: 200 },
        { field: 'action', headerName: 'ACTION',flex:1,minWidth:200,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button type="button" onClick={()=>handleSearchMat(cellValues.row.matricule)} className={"p-2 text-white bg-blue-400"}>
                        Proceder au paiement
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


    //////TAB 2 CODES

    function handleShow(id) {
        return undefined;
    }

    return (
        <AdminPanel auth={auth} error={error} active={"paiement"}>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <h1 className="p-6 bg-white border-b border-gray-200 text-xl p-2 text-white bg-orange-400">PAIEMENT</h1>

                        <div>
                            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 p-2  mt-16 m-5">
                               <div className={"flex"}>
                                   <TextField className={"w-full"}  name={"matricule"} label={"Entrez le matricule de l'apprenant"} value={data.matricule} onChange={(e)=>setData("matricule",e.target.value)}/>
                               </div>
                                <div className={"flex"}>
                                    <TextField className={"w-full"}  name={"tuteurSearch"} label={"Entrez le numero du tuteur"} value={data.tuteurSearch} onChange={(e)=>setData("tuteurSearch",e.target.value)}/>
                                </div>

                                <div className={"flex"}>
                                    <FormControl
                                        className={"w-full"}
                                    >
                                        <Autocomplete
                                            className={"w-full"}
                                            onChange={(e,val)=>{
                                                setData("classeSearch",val)
                                            }}
                                            disablePortal={true}
                                            options={classes}
                                            getOptionLabel={(option)=>option.libelle}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params)=><TextField  fullWidth {...params} placeholder={"classe"} label={params.libelle}/>}
                                        />
                                        <div className={"flex text-red-600"}>{errors?.classe}</div>
                                    </FormControl>
                                </div>


                                <div className={"md:col-span-3 flex md:justify-end"}>
                                    <button onClick={()=>handleSearchMat(data.matricule)} className={"p-2 bg-green-400 text-white hover:bg-green-600 rounded"}><SearchIcon/> Rechercher</button>
                                </div>
                            </div>

                            <div>
                                {
                                    searchResult?.apprenants && searchResult.apprenants.length > 0 && !apprenantsList &&
                                    <DataGrid
                                        rows={searchResult.apprenants}
                                        columns={columns}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        checkboxSelection
                                        autoHeight
                                    />
                                }
                            </div>


                            {
                                apprenantsList?.length > 0&&
                                <div className="py-6">
                                    <div className="max-w-7xl">
                                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                            <div>
                                                <form onSubmit={handleSubmit} className={"space-y-5 my-5 "}>

                                                    {
                                                        apprenantsList?.map((apprenant)=>(


                                                            <div key={apprenant.id} className={"w-full p-5 divide-y"}>
                                                                {console.log(searchResult)}

                                                                <Accordion
                                                                    defaultExpanded={searchResult?.apprenant!==null}
                                                                >
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
                                                                                    <span className={"font-bold text-lg"}>Classe:</span> <span>{apprenant?.classe?.description+"("+apprenant?.classe?.libelle+")"}</span>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </AccordionSummary>
                                                                    <AccordionDetails
                                                                    >
                                                                        <div className={"grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 col-span-3 gap-5 divide-y-2"}>

                                                                            {
                                                                                searchResult?.apprenant &&
                                                                                <div className={"w-full md:col-span-2 sm:col-span-2  my-5"}>

                                                                                    {
                                                                                        searchResult?.apprenant?.tuteurs?.length >0 &&
                                                                                        <div>
                                                                                            <span className={"font-bold text-lg"}>Selectionnez l'auteur du paiement *</span>
                                                                                        </div>
                                                                                    }

                                                                                    <List className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 divide-x" dense >
                                                                                        { searchResult?.apprenant?.tuteurs.map((t) => {
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

                                                                                </div>

                                                                            }
                                                                            <div hidden={apprenant?.tarifs?.length===0} className={"md:col-span-2 sm:col-span-2 font-bold text-lg py-5"}>
                                                                                Cocher les frais à regler *
                                                                            </div>
                                                                            {
                                                                                (apprenant?.tarifs) && apprenant?.tarifs.map((t) =>(

                                                                                    <div key={t.id} className={"grid grid-cols-1 gap-2 p-5 rounded"} style={{backgroundColor:"#f8f1eb"}}>
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
                                                            </div>
                                                        ))
                                                    }

                                                    {
                                                        setApprenantsList?.length > 0 &&
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
                                                            <button className={"p-2 text-white bg-green-600 rounded hover:text-green-600 hover:bg-white hover:border hover:border-green-600 transition duration-500"} style={{height: 56}}  type={"submit"}>
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
                            }

                        </div>
                    </div>
                </div>
            </div>



        </AdminPanel>
    );
}

export default Create;
