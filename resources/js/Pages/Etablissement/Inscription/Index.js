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
import Box from "@mui/material/Box";
import SnackBar from "@/Components/SnackBar";
import SearchIcon from "@mui/icons-material/Search";
import formatNumber from "@/Utils/formatNumber";


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

    const {data,setData,post}=useForm({
        "prenom":"",
        "nom":"",
        "matricule":"",
        "dateNaissance":"",
        "niveau":"",
        "lieuNaissance":"",
        "montant":"",
        "tarifs":{},
        anneeScolaireSearch:null,
        niveauSearch:null,
        tuteurs:"",
        tuteursSearch:[],
        tuteursAdd:[],


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
        "niveau":"",
        "lieuNaissance":"",
        "montant":"",
        "inscription":"",
        "tarifs":{}
    });

    const [open, setOpen] = React.useState(false);
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
            "niveau":inscription.niveau,
            "lieuNaissance":inscription.apprenant.lieu_naissance,
            "montant":inscription.montant,
            "inscription":inscription,
            "tarifs":{}
        }))

        setOpen(true);
    }
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
        { field: 'id', headerName: 'ID', width:100 },
        { field: 'prenom', headerName: 'PRENOM', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.prenom},
        { field: 'nom', headerName: 'NOM', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.nom},
        { field: 'matricule', headerName: 'MATRICULE', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.matricule},
        { field: 'dateNaissance', headerName: 'DATE DE NAISSANCE', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.date_naissance},
        { field: 'lieuNaissance', headerName: 'LIEU DE NAISSANCE', width:170,renderCell:(cellValues)=>cellValues.row.apprenant?.lieu_naissance},
        { field: 'niveau', headerName: 'NIVEAU', width:150, renderCell:(cellValues)=>cellValues.row.niveau?.libelle },
        { field: 'AnneeScolaire', headerName: 'ANNEE SCOLAIRE', width:170, renderCell:(cellValues)=>cellValues.row.annee_scolaire?.dateDebut+" "+cellValues.row.annee_scolaire?.dateFin },
        { field: 'montant', headerName: "FRAIS D'INSCRIPTION", width:170,renderCell:(cellValues)=>formatNumber(cellValues.row.montant)+" FG"},
        { field: 'action', headerName: 'ACTION',width:150,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
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

    const tuteursAddColumn = [

        { field: 'prenomTuteur', headerName: 'PRENOM', width:150},
        { field: 'nomTuteur', headerName: 'NOM', width:150},
        { field: 'telephone', headerName: 'Tel', width:150},
        { field: 'telephone2', headerName: 'Tel 2', width:150},
        { field: 'telephone3', headerName: 'Tel 3', width:150},
        { field: 'email', headerName: 'EMAIL', width:150},
        { field: 'telephone', headerName: 'TELEPHONE', width:150},
        { field: 'password', headerName: 'MOT DE PASSE', width:150},
        { field: 'titre', headerName: 'TITRE', width:150},
        { field: 'situation_matrimoniale', headerName: 'SITUATION MATRIMONIALE', width:250},


    ];

    function handleDelete(id){
        confirm("Voulez-vous supprimer role") && Inertia.delete(route("etablissement.inscription.destroy",[props.auth.user.id,id]),{preserveScroll:true})
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
        data.niveau?.tarifs?.length >0 ?
            data.niveau.tarifs.map((tarif)=>(
                tarif.type_paiement.libelle==="INSCRIPTION" &&
                setData("montant",tarif.montant)
            ))
            :setData("montant",null)
    },[data.niveau])

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


    function handleSearchButton()
    {

        //Inertia.post(route("etablissement.inscription.searchInscription",props.auth.user.id),{anneeScolaireId:data.anneeScolaireSearch?.id || null,niveauId:data.niveauSearch?.id || null},{preserveState:true,preserveScroll:true})

        axios.post(route("etablissement.inscription.searchInscription",props.auth.user.id),{anneeScolaireId:data.anneeScolaireSearch?.id || null,niveauId:data.niveauSearch?.id || null},{preserveState:true,preserveScroll:true}).then((response)=>{
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
        if(data.niveau?.tarifs)
        {

            let list={}
            data.niveau.tarifs.map((tarif)=> {
                list = {...list, [tarif.id]: tarif.obligatoire}
            })
            setTarifs(list)
        }

    },[data.niveau])

    useEffect(() => {
        if(dataEdit.niveau?.tarifs)
        {
            let list={}
            dataEdit.niveau.tarifs.map((tarif)=>(
                list={...list,[tarif.id]:dataEdit.inscription.apprenant.tarifs.find((t)=>t.id===tarif.id)?true:false}
            ))
            setTarifsEdit(list)
        }

    },[dataEdit.niveau])

    useEffect(() => {
        setData("tarifs",tarifs)
    },[tarifs])

    useEffect(() => {
        setDataEdit("tarifs",tarifsEdit)
    },[tarifsEdit])


    return (
        <AdminPanel auth={props.auth} error={props.error} active={"inscription"} >
            <div className={"p-5"}>
                <div>
                    <div className={"my-5 text-2xl text-white bg-orange-400 rounded text-white p-2"}>
                        Liste des inscriptions
                    </div>


                    {
                        ///////////FIltre
                    }

                    <div className={"gap-5 grid md:grid-cols-3 grid-cols-1 items-end mb-5"}>
                        <div className={"flex space-x-5"}>
                            <FormControl  className={"w-full"}>
                                <Autocomplete
                                    onChange={(e,val)=>{
                                        setData("anneeScolaireSearch",val)
                                    }}
                                    disablePortal={true}
                                    options={props.anneeScolaires}
                                    getOptionLabel={(option)=>option.dateDebut+"-"+option.dateFin+"("+option.id+")"}
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
                                        setData("niveauSearch",val)
                                    }}
                                    disablePortal={true}
                                    options={props.niveaux}
                                    getOptionLabel={(option)=>option.libelle}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params)=><TextField  fullWidth {...params} placeholder={"niveau"} label={params.libelle}/>}
                                />
                                <div className={"flex text-red-600"}>{props.errors?.niveau}</div>
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
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                    >
                        <Box sx={style}>
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

                                            <div>
                                                <FormControl  className={"w-full"}>
                                                    <Autocomplete
                                                        onChange={(e,val)=>{
                                                            setDataEdit("niveau",val)
                                                        }}
                                                        disablePortal={true}
                                                        options={props.niveaux}
                                                        getOptionLabel={(option)=>option.libelle}
                                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"niveau"} label={params.libelle}/>}
                                                    />
                                                </FormControl>
                                                <div className={"flex my-2 text-red-600"}>{props.errors?.niveau}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"space-y-5 p-2 border"}>
                                        <div className={"text-lg font-bold"}>
                                            Infos du tuteur
                                        </div>
                                        <div className={"grid md:grid-cols-3 grid-cols-1 gap-4"}>
                                            <div>
                                                <TextField className={"w-full"}  name={"prenomTuteur"} label={"Prenom du tuteur"} value={dataEdit.prenomTuteur} onChange={(e)=>setDataEdit("prenomTuteur",e.target.value)}/>
                                                <div className={"flex my-2 text-red-600"}>{props.errors?.prenomTuteur}</div>
                                            </div>
                                            <div>
                                                <TextField className={"w-full"}  name={"nomTuteur"} label={"Nom du tuteur"} value={dataEdit.nomTuteur} onChange={(e)=>setDataEdit("nomTuteur",e.target.value)}/>
                                                <div className={"flex my-2 text-red-600"}>{props.errors?.nomTuteur}</div>
                                            </div>
                                            <div>
                                                <TextField className={"w-full"}  name={"telephone"} label={"telephone"} value={dataEdit.telephoneTuteur} onChange={(e)=>setDataEdit("telephoneTuteur",e.target.value)}/>
                                                <div className={"flex my-2 text-red-600"}>{props.errors?.telephoneTuteur}</div>
                                            </div>
                                            <div>
                                                <TextField className={"w-full"}  name={"emailTuteur"} label={"Email du tuteur"} value={dataEdit.emailTuteur} onChange={(e)=>setDataEdit("emailTuteur",e.target.value)}/>
                                                <div className={"flex my-2 text-red-600"}>{props.errors?.emailTuteur}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        dataEdit?.niveau &&
                                        <div className={"border p-5 space-y-5"}>
                                            <div className={"text-lg font-bold"}>
                                                Les type de frais
                                            </div>
                                            <div className={"flex flex-wrap"}>
                                                {
                                                    dataEdit.niveau?.tarifs.map((tarif)=>(
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
                        </Box>
                    </Modal>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            inscriptions &&
                            <DataGrid

                                components={{
                                    Toolbar:GridToolbar,
                                }}

                                componentsProps={{
                                    columnMenu:{backgroundColor:"red",background:"yellow"},
                                }}
                                rows={inscriptions}
                                columns={columns}
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                checkboxSelection
                                autoHeight
                            />
                        }
                    </div>
                </div>
            </div>
            <SnackBar error={tuteurAddError} success={ props.success || tuteurAddSuccess }  update={updateSnackBar}/>
        </AdminPanel>
    );
}

export default Index;
