import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    GridToolbar,
    useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';
import {
    Autocomplete, Avatar, Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup, InputAdornment,
    InputLabel, ListItem, ListItemAvatar, ListItemButton, ListItemText,
    MenuItem, Modal,
    Pagination,
    Select,
    TextField
} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Box from "@mui/material/Box";
import SnackBar from "@/Components/SnackBar";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import formatNumber from "@/Utils/formatNumber";
import List from "@mui/material/List";
import capitalize from "@/Utils/Capitalize";
import {motion} from "framer-motion";
import {submit} from "dom7";
import DownloadIcon from '@mui/icons-material/Download';


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

function Index(props) {

    const [inscriptions,setInscriptions] = useState();
    const [tarifs,setTarifs] = useState();
    const [tarifsEdit,setTarifsEdit] = useState();

    const [success,setSuccess] = useState(null);

    useEffect(() => {
        props.success && setSuccess(props.success);
    },[props.success])

    function update()
    {
        setSuccess(null)
    }



    useEffect(() => {
        (data.matriculeSearch==="" && data.anneeScolaireSearch===null && data.classeSearch===null ) && setInscriptions(props.inscriptions);

    },[inscriptions])

    const {data,setData,post}=useForm({
        "prenom":"",
        "nom":"",
        "matricule":"",
        "dateNaissance":"",
        "classe":"",
        "lieuNaissance":"",
        "montant":"",
        "tarifs":{},
        anneeScolaireSearch:null,
        matriculeSearch:"",
        classeSearch:null,
        tuteurs:"",
        tuteursSearch:[],
        tuteursAdd:[],
        "inscriptions":null
    });

    const {data:dataTuteur,setData:setDataTuteur} = useForm({
        id:"",
        prenomTuteur: 'mau',
        nomTuteur: 'mans',
        email: 'mau@gmail.com',
        password: "mau",
        confirm_password: "mau",
        adresse: 'kountia',
        telephone: '621993863',
        telephone2: '622345678',
        telephone3: '622549087',
        situation_matrimoniale:"Marié",
        titre:"M",
    })

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

    function handleExport(e)
    {
        e.preventDefault();
        post(route("etablissement.inscription.import",props.auth.user.id),data.inscriptions, {preserveState: false})
    }

    useEffect(() => {
      setData("tuteursSearch",checked);
    },[checked])

    const onHandleChange = (event) => {
        setDataTuteur(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const {data:dataEdit,setData:setDataEdit}=useForm({
        "id":"",
        "prenom":"",
        "nom":"",
        "matricule":"",
        "prenomTuteur":"",
        "nomTuteur":"",
        "telephoneTuteur":"",
        "emailTuteur":"",
        "dateNaissance":"",
        "classe":"",
        "lieuNaissance":"",
        "montant":"",
        "inscription":"",
        "tarifs":{},
        "tuteurs":null,
    });

    const [open, setOpen] = React.useState(false);
    const [openDetails, setOpenDetails] = React.useState(false);

    const handleOpen = (inscription) => {
        setDataEdit((dataEdit) => ({
            "id":inscription.id,
            "prenom":inscription.apprenant.prenom,
            "nom":inscription.apprenant.nom,
            "matricule":inscription.apprenant.matricule,
            "prenomTuteur":inscription.apprenant.prenomTuteur,
            "nomTuteur":inscription.apprenant.nomTuteur,
            "telephoneTuteur":inscription.apprenant.telephoneTuteur,
            "emailTuteur":inscription.apprenant.emailTuteur,
            "dateNaissance":inscription.apprenant.date_naissance,
            "classe":inscription.classe,
            "lieuNaissance":inscription.apprenant.lieu_naissance,
            "montant":inscription.montant,
            "inscription":inscription,
            "tarifs":{},
        }))

        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false)
        setOpenDetails(false)
    };

    const [openModal, setOpenModal] = useState(false);
    const [inscription, setInscription] = useState(null);

    const handleDetails = (i) => {
        setInscription(i)
        setOpenDetails(true);
    }

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
                    prenomTuteur: '',
                    nomTuteur: '',
                    email: '',
                    password: "",
                    confirm_password: "",
                    adresse: '',
                    telephone: '',
                    telephone2: '',
                    telephone3: '',
                    situation_matrimoniale:"",
                    titre:"",
                })
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
                                prenomTuteur: a.nom,
                                nomTuteur: a.prenom,
                                email: a.email,
                                password: a.password,
                                confirm_password: a.confirm_password,
                                adresse: a.adresse,
                                telephone: a.telephone,
                                telephone2: a.telephone2,
                                telephone3: a.telephone3,
                                situation_matrimoniale:a.situation_matrimoniale,
                                titre:a.titre,
                            })
                            setChecked([])
                            setTuteurAddSuccess("Tuteur ajouté avec succès")
                            setData("tuteursAdd",tab)
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


    const columns = [
        { field: 'prenom', headerName: 'PRENOM', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.prenom},
        { field: 'nom', headerName: 'NOM', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.nom},
        { field: 'matricule', headerName: 'MATRICULE', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.matricule},
        { field: 'classe', headerName: 'CLASSE', width:300, renderCell:(cellValues)=>cellValues.row.classe?.libelle },
        { field: 'action', headerName: 'ACTION',width:150,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleDetails(cellValues.row)} className={"p-2 text-white bg-blue-400 rounded hover:text-blue-500 hover:bg-white transition duration-500"}>
                        <ListAltIcon/>
                    </button>
                    <button onClick={()=>handleOpen(cellValues.row)} className={"p-2 text-white bg-blue-700 rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
                        <EditIcon/>
                    </button>
                    <button onClick={()=>handleDelete(cellValues.row.id)} className={`bg-red-500 p-2 text-white bg-red-700 rounded hover:text-red-700 hover:bg-white transition duration-500`}>
                        <DeleteIcon/>
                    </button>
                </div>
            )
        },

    ];


    function handleDelete(id){
        confirm("Voulez-vous supprimer cette inscription") && Inertia.delete(route("etablissement.inscription.destroy",[props.auth.user.id,id]),{preserveScroll:true})
    }

    function handleEdit(e){
        e.preventDefault()
        Inertia.post(route("etablissement.inscription.update",[props.auth.user.id,dataEdit.id]),{_method: "put",dataEdit},{preserveState:false,preserveScroll:true})

    }

    function handleShow(id){
        alert("SHOW"+id)
    }

    function handleSubmit(e)
    {
        e.preventDefault();

        post(route("etablissement.inscription.store",props.auth.user.id),data, {preserveState: false})

    }

    useEffect(() => {
        data.classe?.tarifs?.length >0 ?
            data.classe.tarifs.map((tarif)=>(
                tarif.type_paiement.libelle==="INSCRIPTION" &&
                setData("montant",tarif.montant)
            ))
            :setData("montant",null)
    },[data.classe])

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

    useEffect(() => {
        setInscriptions(props.inscriptions)
    },[props.inscriptions])


    function handleSearchButton()
    {
        //Inertia.post(route("etablissement.inscription.searchInscription",props.auth.user.id),{matricule:data.matriculeSearch,anneeScolaireId:data.anneeScolaireSearch?.id || null,classeId:data.classeSearch?.id || null},{preserveState:true,preserveScroll:true})


        axios.post(route("etablissement.inscription.searchInscription",props.auth.user.id),{matricule:data.matriculeSearch ,anneeScolaireId:data.anneeScolaireSearch?.id,classeId:data.classeSearch?.id},{preserveState:true,preserveScroll:true}).then((response)=>{
            setInscriptions(response.data)
        }).catch(error=>{
            console.log(error)
        });


    }

    function deleteTuteurInTuteursAdd(telephone)
    {
        setData("tuteursAdd",data.tuteursAdd.filter((t)=>t.telephone !== telephone))
    }

    useEffect(() => {
        if(data.classe?.tarifs)
        {

            let list={}
            data.classe.tarifs.map((tarif)=> {
                list = {...list, [tarif.id]: tarif.obligatoire}
            })
            setTarifs(list)
        }

    },[data.classe])

    useEffect(() => {
        if(dataEdit.classe?.tarifs)
        {
            let list={}
            dataEdit.classe.tarifs.map((tarif)=>(
                list={...list,[tarif.id]:dataEdit.inscription.apprenant.tarifs.find((t)=>t.id===tarif.id)?true:false}
            ))
            setTarifsEdit(list)
        }

    },[dataEdit.classe])

    useEffect(() => {
        setData("tarifs",tarifs)
    },[tarifs])

    useEffect(() => {
        setDataEdit("tarifs",tarifsEdit)
    },[tarifsEdit])


    return (
        <AdminPanel auth={props.auth} error={props.error} sousActive={"listeInscripton"} active={"inscription"} >
            <div className={"p-5"}>
                <div>
                    <div className={"my-5 text-2xl text-white bg-orange-400 rounded text-white p-2"}>
                        Liste des inscriptions
                    </div>


                    {
                        ///////////Filtre
                    }

                    <div className={"gap-5 grid md:grid-cols-3 grid-cols-1 items-end mb-5"}>
                        <div>
                            <TextField className={"w-full"}  name={"matriculeSearch"} label={"Entrez le matricule de l'apprenant"} value={data.matriculeSearch} onChange={(e)=>setData("matriculeSearch",e.target.value)}/>
                            <div className={"flex text-red-600"}>{props.errors?.matricule}</div>
                        </div>
                        <div className={"flex space-x-5"}>
                            <FormControl  className={"w-full"}>
                                <Autocomplete
                                    onChange={(e,val)=>{
                                        setData("anneeScolaireSearch",val)
                                    }}
                                    disablePortal={true}
                                    options={props.anneeScolaires}
                                    getOptionLabel={(option)=>option.dateDebut.split("-")[0]+"/"+option.dateFin.split("-")[0]}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Annee Scolaire"} label={params.libelle}/>}
                                />
                                <div className={"flex text-red-600"}>{props.errors?.anneeScolaire}</div>
                            </FormControl>
                        </div>


                        <div className={"flex space-x-5"}>
                            <FormControl  className={"w-full"}>
                                <Autocomplete
                                    onChange={(e,val)=>{
                                        setData("classeSearch",val)
                                    }}
                                    disablePortal={true}
                                    options={props.classes}
                                    getOptionLabel={(option)=>option.libelle}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params)=><TextField  fullWidth {...params} placeholder={"classe"} label={params.libelle}/>}
                                />
                                <div className={"flex text-red-600"}>{props.errors?.classe}</div>
                            </FormControl>
                            <button type="button" onClick={handleSearchButton} className={"rounded bg-gray-600 p-3 text-white flex"}>
                                <SearchIcon/>
                            </button>
                        </div>
                    </div>

                    {
                        ////////// ADD EDIT INSCRIPTION MODAL
                    }
                    <Modal
                        keepMounted
                        open={open || openDetails}
                        onClose={handleClose}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                    >
                        <Box sx={style}>
                            {
                                open &&
                                <form action="" onSubmit={handleEdit} className={"space-y-5 my-5 p-2 border rounded"}>
                                    <div className={"w-full border p-5 rounded space-y-5"}>
                                        <div className={"text-xl font-bold"}>
                                            Modifier une inscription
                                        </div>
                                        <div className={"space-y-5 p-2 border"}>
                                            <div className={"text-lg font-bold"}>
                                                Infos de l'apprenant
                                            </div>
                                            <div className={"gap-5 grid md:grid-cols-3 grid-cols-1 items-end mb-5"}>
                                                <div>
                                                    <TextField className={"w-full"}  name={"prenom"} label={"Prenom"} value={dataEdit.prenom} onChange={(e)=>setDataEdit("prenom",e.target.value)}/>
                                                    <div className={"flex my-2 text-red-600"}>{props.errors?.prenom}</div>
                                                </div>
                                                <div>
                                                    <TextField className={"w-full"}  name={"nom"} label={"Nom"} value={dataEdit.nom} onChange={(e)=>setDataEdit("nom",e.target.value)}/>
                                                    <div className={"flex my-2 text-red-600"}>{props.errors?.nom}</div>
                                                </div>
                                                <div>
                                                    <TextField className={"w-full"}  name={"matricule"} label={"Matricule"} value={dataEdit.matricule} onChange={(e)=>setDataEdit("matricule",e.target.value)}/>
                                                    <div className={"flex my-2 text-red-600"}>{props.errors?.matricule}</div>
                                                </div>
                                                <div>
                                                    <div className={"font-bold"}>Date de naissance</div>
                                                    <TextField className={"w-full"}  name={"dateNaissance"} type={"date"} value={dataEdit.dateNaissance} onChange={(e)=>setDataEdit("dateNaissance",e.target.value)}/>
                                                    <div className={"flex my-2 text-red-600"}>{props.errors?.dateNaissance}</div>
                                                </div>
                                                <div>
                                                    <TextField className={"w-full"}  name={"lieuNaissance"} label={"Lieu de naissance"} value={dataEdit.lieuNaissance} onChange={(e)=>setDataEdit("lieuNaissance",e.target.value)}/>
                                                    <div className={"flex my-2 text-red-600"}>{props.errors?.lieuNaissance}</div>
                                                </div>

                                                {
                                                    dataEdit.classe &&
                                                    <div>
                                                        <FormControl  className={"w-full"}>
                                                            <Autocomplete
                                                                onChange={(e,val)=>{
                                                                    setDataEdit("classe",val)
                                                                }}
                                                                disablePortal={true}
                                                                options={props.classes}
                                                                getOptionLabel={(option)=>option.libelle}
                                                                renderInput={(params)=><TextField  fullWidth {...params} placeholder={"classe"} label={params.libelle}/>}
                                                            />
                                                        </FormControl>
                                                        <div className={"flex my-2 text-red-600"}>{props.errors?.classe}</div>
                                                    </div>
                                                }
                                            </div>
                                        </div>

                                        {
                                            dataEdit?.classe &&
                                            <div className={"border p-5 space-y-5"}>
                                                <div className={"text-lg font-bold"}>
                                                    Les type de frais
                                                </div>
                                                <div className={"flex flex-wrap"}>
                                                    {
                                                        dataEdit.classe?.tarifs.map((tarif)=>(
                                                            <div key={tarif.id} className={"mx-5"}>
                                                                <FormControlLabel control={<Checkbox defaultChecked={dataEdit.inscription.apprenant.tarifs.find((t)=>t.id===tarif.id)?true:false} name={tarif.id+""} onChange={handleChangeEdit} />} label={tarif.type_paiement.libelle} />
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        }

                                        <div className={"flex col-span-3 justify-end"}>
                                            <button className={"p-3 text-white bg-green-600 rounded"}  type={"submit"}>
                                                Enregistrer
                                            </button>
                                        </div>
                                    </div>


                                </form>
                            }
                            {
                                openDetails &&
                                    <div className={"w-full h-full border border-orange-500 p-5 rounded space-y-8 items-between"}>
                                        <div className={"text-3xl font-bold p-2 border text-white bg-orange-500 rounded"}>
                                            Details de l'inscription
                                        </div>
                                        <div className={"flex space-x-5 items-center"}>
                                            <SchoolIcon className="text-orange-500" sx={{fontSize:50}} />
                                            <div className="text-3xl uppercase">
                                                {props.auth.user.etablissement_admin.nom}
                                            </div>
                                        </div>
                                        <div className={"relative"}>
                                            <div className="absolute -top-3 left-2 bg-orange-500 text-white rounded p-2">
                                                Infos apprenant
                                            </div>
                                            <div className={"md:flex flex-wrap md:gap-5 capitalize text-xl border rounded px-5 py-10 border-orange-500"}>
                                                <div><span className={"font-bold"}>Prenom: </span>{inscription?.apprenant?.prenom}</div>
                                                <div><span className={"font-bold"}>Nom: </span>{inscription?.apprenant?.nom}</div>
                                                <div><span className={"font-bold"}>Date de naissance: </span>{inscription?.apprenant?.date_naissance}</div>
                                                <div><span className={"font-bold"}>Lieu de naissance: </span>{inscription?.apprenant?.lieu_naissance}</div>
                                            </div>
                                        </div>
                                        <div className={"relative"}>
                                            <div className="absolute -top-3 left-2 bg-orange-500 text-white rounded p-2">
                                                Infos inscription
                                            </div>
                                            <div className="md:flex flex-wrap md:gap-5 text-xl border rounded px-5 py-10 border-orange-500">
                                                <div><span className={"font-bold"}>Classe: </span>{inscription?.classe?.libelle}</div>
                                                <div><span className={"font-bold"}>Matricule: </span>{inscription?.apprenant?.matricule}</div>
                                                <div><span className={"font-bold"}>Année scolaire: </span>{inscription?.annee_scolaire?.dateDebut.split("-")[0]+"/"+inscription?.annee_scolaire?.dateFin.split("-")[0]}</div>

                                                <div><span className={"font-bold"}>Montant de l'inscription: </span>{formatNumber(inscription?.montant)} FG</div>
                                            </div>
                                        </div>

                                    </div>
                            }
                        </Box>
                    </Modal>

                    <form onSubmit={handleExport} className="p-2 space-y-4 border my-4">
                        <div>
                            Importer des inscriptions
                        </div>
                        <div className={"flex "}>
                            <div>
                                <TextField type="file" name="inscriptions" onChange={(e)=>setData('inscriptions',e.target.files[0])}/>
                            </div>
                            <div className={"ml-5"}>
                                <a href="/storage/ModeleFichier/inscription.xlsx" download>

                                    <div className="bg-blue-400 flex items-center rounded text-white hover:transition hover:scale-100 duration-500 px-2" style={{height: 56}}>

                                        <DownloadIcon/> Télécharger le modèle
                                    </div>
                                </a>
                            </div>
                        </div>
                        <button type={'submit'} className={"p-2 my-4 text-white bg-green-500 hover:bg-green-600 rounded"}>
                            Importer
                        </button>

                    </form>

                    <motion.div
                        initial={{y:-100,opacity:0}}
                        animate={{y:0,opacity:1}}
                        transition={{
                            duration:0.5,
                            type:"spring",
                        }}

                        style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            <DataGrid

                                components={{
                                    Toolbar:GridToolbar,
                                }}

                                componentsProps={{
                                    columnMenu:{backgroundColor:"red",background:"yellow"},
                                }}
                                rows={inscriptions ?inscriptions:[]}
                                columns={columns}
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                autoHeight
                            />
                        }
                    </motion.div>
                </div>
            </div>
            <SnackBar success={ success } update={update}/>
        </AdminPanel>
    );
}

export default Index;
