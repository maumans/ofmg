import React, {useEffect, useState} from 'react';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    GridToolbar,
    useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';
import {
    Autocomplete, Avatar, Button, Checkbox, CircularProgress, Dialog, DialogContent,
    FormControl,
    FormControlLabel,
    FormGroup, FormLabel, InputAdornment,
    InputLabel, ListItem, ListItemAvatar, ListItemButton, ListItemText,
    MenuItem, Modal,
    Pagination, Radio, RadioGroup,
    Select,
    TextField
} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SnackBar from "@/Components/SnackBar";
import formatNumber from "@/Utils/formatNumber";

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import List from "@mui/material/List";
import capitalize from "@/Utils/Capitalize";

import {motion,AnimatePresence} from "framer-motion"
import Box from "@mui/material/Box";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 200,
    width:"98%",
    maxWidth: 1300,
    height:"80%",
    overflow: 'auto',
    bgcolor: 'background.paper',
    borderRadius:2,
    p: 4,
};

function Create(props) {

    const [inscriptions,setInscriptions] = useState();
    const [tarifs,setTarifs] = useState();
    const [tarifsEdit,setTarifsEdit] = useState();

    const {data,setData,post}=useForm({
        "prenom":"",
        "nom":"",
        "matricule":"",
        "dateNaissance":"",
        "classe":"",
        "lieuNaissance":"",
        "montant":"",
        "tarifs":{},
        search:"",
        tuteurs:"",
        tuteursSearch:[],
        tuteursAdd:[],
        type:"",

    });

    const {data:dataTuteur,setData:setDataTuteur} = useForm({
        id:"",
        prenom: '',
        nom: '',
        login: '',
        email: '',
        password: "",
        adresse: '',
        telephone: '',
        telephone2: '',
        telephone3: '',
        situation_matrimoniale:"",
        titre:"",
    })

    const handleChangeRadio = (event) => {
        setData('type',event.target.value)
    };

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
        setData("tuteursSearch",checked);
    },[checked])

    const onHandleChange = (event) => {
        setDataTuteur(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };


    const [open, setOpen] = React.useState(false);

    const handleClose = () => setOpen(false);

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    }
    const handleCloseModal = () => setOpenModal(false);
    const [tuteurAddError, setTuteurAddError]=useState(null)
    const [tuteurAddSuccess, setTuteurAddSuccess]=useState(null)

    function handleAddNewTuteur(e)
    {
        e.preventDefault();
        let verif=false

        if(openModal)
        {
            if(data.tuteursAdd.length > 0)
            {
                verif = data.tuteursAdd.find(t => t.telephone === dataTuteur.telephone)
            }


            if(!verif)
            {
                verif = props.tuteurs.find(t => t.telephone === dataTuteur.telephone)
            }

        }

        if(!verif)
        {
            let tab=[...data.tuteursAdd]

            if(openModal)
            {
                tab.push(dataTuteur)
                setDataTuteur({
                    id:"",
                    prenom: '',
                    nom: '',
                    login: '',
                    email: '',
                    password: "",
                    adresse: '',
                    telephone: '',
                    telephone2: '',
                    telephone3: '',
                    situation_matrimoniale:"",
                    titre:"",
                })

                setData((data)=>({
                   ...data,
                    tuteursAdd:tab,
                    tuteurs:null,
                    search:null
                }))

                setData("tuteursAdd",tab)
                setTuteurAddSuccess("Tuteur ajouté avec succès")
            }
            else
            {
                checked && data.tuteursSearch.map((t)=>{
                    let a=data.tuteurs.find(tuteur => tuteur.id===t)

                    if(data.tuteursAdd.find(t => t.telephone === a.telephone))
                    {
                        setTuteurAddError("Le tuteur tel: "+ a.telephone +" a déja été ajouté")
                    }
                    else {
                        if(a){
                            tab.push({
                                id:a.id,
                                prenom: a.nom,
                                nom: a.prenom,
                                login: a.login,
                                email: a.email,
                                password: a.password,
                                adresse: a.adresse,
                                telephone: a.telephone,
                                telephone2: a.telephone2,
                                telephone3: a.telephone3,
                                situation_matrimoniale:a.situation_matrimoniale,
                                titre:a.titre,
                            })
                            setChecked([])
                            //setTuteurAddSuccess("Tuteur ajouté avec succès ,changer")

                            setData((data)=>({
                                ...data,
                                tuteursAdd:tab,
                                tuteurs:null,
                                search:null

                            }))
                        }
                    }
                })
            }
        }
        else
        {
            if(openModal)
            {
                setTuteurAddError("Le tuteur tel: "+ dataTuteur.telephone +" a déja été ajouté")

            }
        }
    }

    function updateSnackBar()
    {
        tuteurAddSuccess && setTuteurAddSuccess(null)
        tuteurAddError && setTuteurAddError(null)
    }




    const tuteursAddColumn = [

        { field: 'prenom', headerName: 'PRENOM', width:150},
        { field: 'nom', headerName: 'NOM', width:150},
        { field: 'telephone', headerName: 'Tel', width:150},
        { field: 'telephone2', headerName: 'Tel 2', width:150},
        { field: 'telephone3', headerName: 'Tel 3', width:150},
    { field: 'login', headerName: 'IDENTIFIANT', width:150},
        { field: 'email', headerName: 'EMAIL', width:150},
        { field: 'telephone', headerName: 'TELEPHONE', width:150},
        { field: 'password', headerName: 'MOT DE PASSE', width:150},
        { field: 'titre', headerName: 'TITRE', width:150},
        { field: 'situation_matrimoniale', headerName: 'SITUATION MATRIMONIALE', width:250},


    ];


    function handleSubmit(e)
    {
        e.preventDefault();

        post(route("etablissement.inscription.store",props.auth.user.id), {data:data})

    }

    useEffect(() => {
        setInscriptions(props.inscriptions);
    },[props.inscriptions]);

    /*useEffect(() => {
        data.classe && data.classe?.tarifs?.map(tarif => {
            if(data.type === 'inscription')
            {
                tarif.type_paiement.libelle==="INSCRIPTION" && setData("montant",tarif.montant)
            }
            else if(data.type==='reinscription')
            {
                tarif.type_paiement.libelle==="REINSCRIPTION" && setData("montant",tarif.montant)

            }
        })
    },[data.classe])*/

    useEffect(() => {
        data.classe?.tarifs?.length >0 ?
            data.classe.tarifs.map((tarif)=> {

                if (data.type === 'inscription') {
                    tarif.type_paiement.libelle.toLowerCase() === "INSCRIPTION".toLowerCase() &&
                    setData("montant", tarif.montant)
                } else if (data.type === 'reinscription') {
                    (tarif.type_paiement.libelle.toLowerCase() === "REINSCRIPTION".toLowerCase() || tarif.type_paiement.libelle.toLowerCase() === "Réinscription".toLowerCase()) &&
                    setData("montant", tarif.montant)
                }
            }
        )
        :setData("montant",null)

    },[data.classe,data.type])

    function handleChange (event){
        setTarifs(tarifs=>({
            ...tarifs,
            [event.target.name]: event.target.checked,
        }));
    }

    function handleChangeEdit (event){
        setTarifsEdit(tarifs=>({
            ...tarifsEdit,
            [event.target.name]: event.target.checked,
        }));
    }

    const [declancheur,setDeclancheur]=useState(null)

    function handleSearchButton()
    {
        setDeclancheur(true)
        data.search?
        axios.get(route("etablissement.inscription.tuteur.search",[props.auth.user.id,data.search]),{preserveState:true,preserveScroll:true}).then((response)=>{
            setData("tuteurs",response.data)
        }).catch(error=>{
            console.log(error)
        })
            :
            setData("tuteursSearch",null)
    }

    useEffect(() => {
        if(data.tuteurs)
        {
            setDeclancheur(false)
        }
    },[data.tuteurs])

    function deleteTuteurInTuteursAdd(telephone)
    {
        setData("tuteursAdd",data.tuteursAdd.filter((t)=>t.telephone !== telephone))
    }

    useEffect(() => {
        if(data.classe?.tarifs)
        {

            let list={}
            data.classe.tarifs.map((tarif)=> {

                if(!(data.type === 'reinscription' && tarif.type_paiement.libelle.toLowerCase() === "INSCRIPTION".toLowerCase())
                    &&
                    !(data.type === 'inscription' && (tarif.type_paiement.libelle.toLowerCase() === "REINSCRIPTION".toLowerCase() || tarif.type_paiement.libelle.toLowerCase() === "Réinscription".toLowerCase()))
                )
                {
                    list = {...list, [tarif.id]: tarif.obligatoire}
                }
            })
            setTarifs(list)
        }

    },[data.classe,data.type])



    useEffect(() => {
        setData("tarifs",tarifs)
    },[tarifs])


    return (
        <AdminPanel auth={props.auth} error={props.error} sousActive={"inscrire"} active={"gestionCursus"} >
            <div className={"p-5"}>
                <div>
                    <div className={"my-5 text-2xl text-white orangeOrangeBackground rounded p-2"}>
                        Inscrire un {props.anneeEnCours?.etablissement.type_etablissement.libelle.toLowerCase() ==="école"?"élève":"etudiant"}
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5"}>

                        <div className={"w-full border p-5 rounded space-y-5"} style={{maxWidth: 1000}}>

                            <div className={"border p-2"}>
                                <div className={"text-lg font-bold"}>
                                    Type
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={data.type}
                                        onChange={handleChangeRadio}
                                    >
                                        <FormControlLabel value="inscription" control={<Radio required />} label="Inscription" />
                                        <FormControlLabel value="reinscription" control={<Radio required />} label="Réinscription" />
                                    </RadioGroup>
                                </FormControl>
                            </div>

                            <div className={"space-y-5 p-2 border"}>
                                <div className={"text-lg font-bold"}>
                                    Infos de {props.anneeEnCours?.etablissement.type_etablissement.libelle.toLowerCase() ==="école"?"l'élève":"l'etudiant"}
                                </div>
                                <div className={"grid md:grid-cols-3 grid-cols-1 items-end mb-5 gap-5"}>
                                    <div>
                                        <TextField required className={"w-full"}  name={"prenom"} label={"Prenom"} value={data.prenom} onChange={(e)=>setData("prenom",e.target.value)}/>
                                    </div>
                                    <div>
                                        <TextField required className={"w-full"}  name={"nom"} label={"Nom"} value={data.nom} onChange={(e)=>setData("nom",e.target.value)}/>
                                    </div>
                                    <div>
                                        <TextField required className={"w-full"}  name={"matricule"} label={"Matricule"} value={data.matricule} onChange={(e)=>setData("matricule",e.target.value)}/>
                                    </div>

                                    <div className={"md:col-span-3 grid md:grid-cols-3 gap-5"}>
                                        <div className={"flex text-red-600"}>{props.errors?.prenom}</div>

                                        <div className={"flex text-red-600"}>{props.errors?.nom}</div>

                                        <div className={"flex text-red-600"}>{props.errors?.matricule}</div>
                                    </div>

                                    <div>
                                        <div className={"font-bold"}>Date de naissance</div>
                                        <TextField required className={"w-full"}  name={"dateNaissance"} type={"date"} value={data.dateNaissance} onChange={(e)=>setData("dateNaissance",e.target.value)}/>
                                    </div>

                                    <div>
                                        <TextField className={"w-full"}  name={"lieuNaissance"} label={"Lieu de naissance"} value={data.lieuNaissance} onChange={(e)=>setData("lieuNaissance",e.target.value)}/>
                                    </div>

                                    <div>
                                        <FormControl  className={"w-full"}>
                                            <Autocomplete
                                                onChange={(e,val)=>{
                                                    setData("classe",val)
                                                }}
                                                disablePortal={true}
                                                options={props.classes}
                                                getOptionLabel={(option)=>option.libelle}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params)=><TextField  fullWidth {...params} placeholder={"classe"} label={params.libelle}/>}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className={"md:col-span-3 grid md:grid-cols-3 gap-5"}>
                                        <div className={"flex text-red-600"}>{props.errors?.lieuNaissance}</div>

                                        <div className={"flex text-red-600"}>{props.errors?.dateNaissance}</div>

                                        <div className={"flex text-red-600"}>{props.errors?.classe}</div>
                                    </div>
                                </div>
                            </div>

                            {
                                (data.classe && data.type) &&
                                <div className={"border p-5 space-y-5"}>
                                    <div className={"text-lg font-bold"}>
                                        Les type de frais
                                    </div>
                                    <div className={"flex flex-wrap"}>
                                        {
                                            data.classe?.tarifs?.length >0 ?
                                            data.classe?.tarifs.map((tarif)=>(
                                             (!(data.type === 'reinscription' && tarif.type_paiement.libelle.toLowerCase() === "INSCRIPTION".toLowerCase())
                                                &&
                                                 !(data.type === 'inscription' && (tarif.type_paiement.libelle.toLowerCase() === "REINSCRIPTION".toLowerCase() || tarif.type_paiement.libelle.toLowerCase() === "Réinscription".toLowerCase()))
                                             ) &&

                                                <div key={tarif.id} className={"mx-5"}>
                                                    <FormControlLabel  control={<Checkbox disabled={tarif.obligatoire?true:false} name={tarif.id+""} defaultChecked={tarif.obligatoire?true:false} onChange={handleChange} />} label={<div>{tarif.type_paiement.libelle} <span className={"p-1 rounded orangeOrangeBackground text-white"}>{formatNumber(tarif.montant)} FG/AN</span></div>} />
                                                </div>

                                                )

                                            /*{

                                                if (data.type === 'inscription') {
                                                return (
                                                    <div key={tarif.id} className={"mx-5"}>
                                                        <FormControlLabel  control={<Checkbox disabled={tarif.obligatoire?true:false} name={tarif.id+""} defaultChecked={tarif.obligatoire?true:false} onChange={handleChange} />} label={<div>{tarif.type_paiement.libelle} <span className={"p-1 rounded orangeOrangeBackground text-white"}>{formatNumber(tarif.montant)} FG/AN</span></div>} />
                                                    </div>
                                                )
                                                } else if (data.type === 'reinscription') {
                                                    return <div key={tarif.id} className={"mx-5"}>
                                                            <FormControlLabel  control={<Checkbox disabled={tarif.obligatoire?true:false} name={tarif.id+""} defaultChecked={tarif.obligatoire?true:false} onChange={handleChange} />} label={<div>{tarif.type_paiement.libelle} <span className={"p-1 rounded orangeOrangeBackground text-white"}>{formatNumber(tarif.montant)} FG/AN</span></div>} />
                                                        </div>
                                                }
                                                else
                                                {
                                                    return null
                                                }
                                            }*/

                                            )
                                                :
                                                <div className={'text-red-600'}>
                                                    Aucun type de frais définit pour cette classe!!! Veuillez définir les types de frais
                                                </div>
                                        }
                                    </div>
                                </div>
                            }

                            <div className={"border p-2"}>
                                <div className={"text-lg font-bold"}>
                                    Tuteurs
                                </div>

                                {
                                    !(data.tuteursAdd && data.tuteursAdd.length) > 0 &&
                                    <div className="mb-5 text-red-600">
                                        Aucun tuteur associé
                                        <div className="text-red-600">
                                            {props.errors?.tuteursAdd}
                                        </div>
                                    </div>
                                }

                                <div className={'mb-5'}>
                                    <div>
                                        Rechercher un tuteur existant
                                    </div>
                                    <div className={"p-2 border rounded space-x-3 flex items-center w-full"} style={{maxWidth:600}} >

                                        <TextField
                                            className={"w-full"}
                                            variant={"standard"}
                                            onChange={(e) => setData("search", e.target.value)}
                                            label={"Entrez l'identifiant,le numero ou l'email du tuteur"}

                                        />
                                        <button type="button" onClick={handleSearchButton} className={"rounded bg-gray-600 p-3 text-white flex"}>
                                            <SearchIcon/>
                                        </button>

                                    </div>

                                    {
                                        declancheur &&
                                        <Box className={"text-center"}>
                                            <CircularProgress />
                                        </Box>

                                    }

                                    {
                                        data.tuteurs?.length >0 &&
                                        <div>

                                            <List dense sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
                                                { data.tuteurs.map((t,i) => {
                                                    const labelId = `checkbox-list-secondary-label-${t.id}`;
                                                    return (

                                                        <motion.div
                                                            key={t.id}

                                                            initial={{y:-100,opacity:0}}
                                                            animate={{y:0,opacity:1}}
                                                            transition={{
                                                                duration: 0.5,
                                                                type: "spring",
                                                                delay: i * 0.1
                                                            }}
                                                        >
                                                            <ListItem
                                                                secondaryAction={
                                                                    <Checkbox
                                                                        edge="end"
                                                                        onChange={handleToggle(t.id)}
                                                                        checked={checked.indexOf(t.id) !== -1}
                                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                                    />
                                                                }
                                                                disablePadding
                                                            >
                                                                <ListItemButton>
                                                                    <ListItemText id={labelId} primary={capitalize(t?.prenom)+" "+capitalize(t?.nom)} secondary={" Tel: "+t.telephone+" |   Login: "+t.login+(t.login && (" |   Email: "+t.email))}
                                                                    />
                                                                </ListItemButton>
                                                            </ListItem>

                                                        </motion.div>
                                                    );
                                                })}
                                            </List>
                                            <button onClick={handleAddNewTuteur} className={"p-3 rounded orangeVertBackground text-white flex text-center items-center mt-4"}>
                                                Ajouter
                                            </button>
                                        </div>
                                    }
                                </div>


                                        <List
                                            className={"w-full grid md:grid-cols-2 grid-cols-1 gap-3 rounded"}
                                        >
                                            <AnimatePresence>
                                            {
                                                data?.tuteursAdd.map((t,i) => (

                                                        <motion.div
                                                            initial={{x:-10,opacity:0}}
                                                            animate={{x:0,opacity:1}}
                                                            exit={{ opacity: 0,x:-10 }}
                                                            key={i}

                                                            className={"bg-white rounded"}
                                                        >
                                                            <ListItem
                                                                className="flex justify-between"
                                                            >
                                                                <ListItemText primary={capitalize(t?.prenom)+" "+capitalize(t?.nom)} secondary={" Tel: "+t.telephone+" |   Login: "+t.login+(t.login && (" |   Email: "+t.email))}
                                                                />
                                                                <button  onClick={()=>deleteTuteurInTuteursAdd(t.telephone)} className={"p-2 rounded-full bg-red-600 text-white flex text-center items-center"} type={"button"}>
                                                                    <CloseIcon/>
                                                                </button>
                                                            </ListItem>
                                                            <div className="text-red-600 p-2">
                                                                {props.errors["tuteursAdd."+i+".login"]}
                                                            </div>
                                                            {
                                                                <div className="text-red-600 p-2">
                                                                    {props.errors["tuteursAdd."+i+".email"]}
                                                                </div>
                                                            }
                                                            <div className="text-red-600 p-2">
                                                                {props.errors["tuteursAdd."+i+".telephone"]}
                                                            </div>
                                                        </motion.div>

                                                ))}
                                            </AnimatePresence>
                                        </List>


                                <div >
                                    <button onClick={()=>setOpenModal(true)} type={"button"} className={"rounded orangeBlueBackground p-3 text-white flex"}>
                                        Créer un nouveau tuteur <span className={"ml-2 rounded-full bg-white text-green-600 flex text-center items-center"}><AddIcon /></span>
                                    </button>
                                </div>
                            </div>


                            {
                                (data.montant && data.type) &&
                                <div className={"my-5 p-2 font-bold"} style={{width:"fit-content"}}>
                                    Montant de { data.type ==='inscription' ?"l'inscription:": data.type ==='reinscription' && "la réinscription:"}
                                    <span className={"my-5 p-2 text-white  orangeOrangeBackground font-bold"}>{formatNumber(data.montant)} FG</span>
                                </div>
                            }

                            <div className={"flex col-span-3 justify-end"}>
                                <Button
                                    disabled={
                                        !data?.type
                                        ||
                                        !data?.classe
                                        ||
                                        (data?.type ==='reinscription' && !data?.classe?.tarifs?.find((tarif)=>(tarif?.type_paiement?.libelle.toLowerCase() ==='réinscription')))
                                        ||
                                        (data?.type ==='inscription' && !data?.classe?.tarifs?.find((tarif)=>(tarif?.type_paiement?.libelle.toLowerCase() ==='inscription')))

                                    }
                                    color={'success'} variant={'contained'} type={"submit"}>
                                    Enregistrer
                                </Button>
                            </div>
                        </div>

                    </form>

                    {
                        ////////// ADD TUTEUR MODAL
                    }
                    <Dialog
                        open={openModal}
                        onClose={handleCloseModal}
                    >
                        <DialogContent>
                            <form onSubmit={handleAddNewTuteur} className={"gap-5 grid md:grid-cols-3 sm:grid-cols-2  grid-cols-1 items-end mb-5 border p-2"}>
                                <div className={"text-lg font-bold md:col-span-3 sm:col-span-2"}>
                                    Infos du tuteur
                                </div>
                                <div>
                                    <div>
                                        <TextField className={"w-full"}  name={"prenom"} label={"Prenom"} value={dataTuteur.prenom} onChange={onHandleChange}
                                                   autoComplete="prenom"
                                                   required/>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <TextField className={"w-full"}  name={"nom"} label={"Nom"} value={dataTuteur.nom} onChange={onHandleChange}
                                                   autoComplete="nom"
                                                   required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <TextField className={"w-full"}  name={"adresse"} label={"Adresse"} value={dataTuteur.adresse} onChange={onHandleChange}
                                                   autoComplete="adresse"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <TextField type="login" className={"w-full"}  name={"login"} label={"Login"} value={dataTuteur.login} onChange={onHandleChange}
                                                   autoComplete="login"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <TextField type="email" className={"w-full"}  name={"email"} label={"Email"} value={dataTuteur.email} onChange={onHandleChange}
                                                   autoComplete="email"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <TextField className={"w-full"}  name={"telephone"} label={"Telephone"} value={dataTuteur.telephone} onChange={onHandleChange}
                                                   autoComplete="telephone"
                                                   required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <TextField className={"w-full"}  name={"telephone2"} label={"Telephone 2"} value={dataTuteur.telephone2} onChange={onHandleChange}
                                                   autoComplete="telephone2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <TextField className={"w-full"}  name={"telephone3"} label={"Telephone 3"} value={dataTuteur.telephone3} onChange={onHandleChange}
                                                   autoComplete="telephone3"
                                        />
                                    </div>
                                </div>

                                <div className={"mt-4"}>
                                    <FormControl  className={"w-full"}>
                                        <InputLabel>Situation Matrimoniale</InputLabel>
                                        <Select
                                            name="situation_matrimoniale"
                                            value={dataTuteur.situation_matrimoniale}
                                            onChange={onHandleChange}
                                        >
                                            <MenuItem value={"Celibataire"}>Celibataire</MenuItem>
                                            <MenuItem value={"Marié"}>Marié(e)</MenuItem>
                                            <MenuItem value={"Divorcé"}>Divorcé(e)</MenuItem>
                                            <MenuItem value={"Concubin"}>Concubin(e)</MenuItem>
                                            <MenuItem value={"Veuf"}>Veuf(ve)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className={"mt-4"}>
                                    <FormControl  className={"w-full"}>
                                        <InputLabel>Titre</InputLabel>
                                        <Select
                                            name={"titre"}
                                            value={dataTuteur.titre}
                                            onChange={onHandleChange}
                                        >
                                            <MenuItem value={"M"}>Monsieur</MenuItem>
                                            <MenuItem value={"Mme"}>Madame</MenuItem>
                                            <MenuItem value={"Mlle"}>Mademoiselle</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>


                                <div className="mt-4">
                                    <TextField
                                        type={"password"}
                                        className={"w-full"}  name={"password"} label={"Mot de passe"} value={dataTuteur.password} onChange={onHandleChange}
                                        autoComplete="password"
                                        required
                                    />
                                </div>

                                <div className={'md:col-span-3 sm:col-span-2'}>
                                    <button className={"p-3 text-white orangeVertBackground rounded"} type={"submit"}>
                                        Enregistrer
                                    </button>
                                </div>
                            </form>

                            {
                                data.tuteursAdd &&
                                <div>
                                    <DataGrid

                                        components={{
                                            Toolbar:GridToolbar,
                                        }}

                                        componentsProps={{
                                            columnMenu:{backgroundColor:"red",background:"yellow"},
                                        }}

                                        getRowId={(row) => row.telephone}
                                        rows={data.tuteursAdd}
                                        columns={tuteursAddColumn}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        //checkboxSelection
                                        autoHeight
                                    />
                                </div>
                            }
                        </DialogContent>

                    </Dialog>
                </div>
            </div>
            <SnackBar error={tuteurAddError} success={ props.success || tuteurAddSuccess }  update={updateSnackBar}/>
        </AdminPanel>
    );
}

export default Create;
