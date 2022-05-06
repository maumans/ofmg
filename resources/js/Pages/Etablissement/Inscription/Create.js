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
import formatNumber from "@/Utils/formatNumber";

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import List from "@mui/material/List";
import capitalize from "@/Utils/Capitalize";


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
        "niveau":"",
        "lieuNaissance":"",
        "montant":"",
        "tarifs":{},
        search:"",
        tuteurs:"",
        tuteursSearch:[],
        tuteursAdd:[],

    });

    const {data:dataTuteur,setData:setDataTuteur} = useForm({
        id:"",
        prenom: 'mau',
        nom: 'mans',
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
        data.search &&
        axios.get(route("etablissement.inscription.search",[props.auth.user.id,data.search]),{preserveState:true,preserveScroll:true}).then((response)=>{
            console.log(response.data)
            setData("tuteurs",response.data)
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
        setData("tarifs",tarifs)
    },[tarifs])


    return (
        <AdminPanel auth={props.auth} error={props.error} active={"inscription"} >
            <div className={"p-5"}>
                <div>
                    <div className={"my-5 text-2xl text-white bg-orange-400 rounded text-white p-2"}>
                        Inscrire un {props.niveaux[0].etablissement.type_etablissement.libelle==="ecole"?"elève":"etudiant"}
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5"}>

                        <div className={"w-full border p-5 rounded space-y-5"}>
                            <div className={"text-xl font-bold"}>
                                INSCRIRE UN ELEVE
                            </div>
                            <div className={"space-y-5 p-2 border"}>
                                <div className={"text-lg font-bold"}>
                                    Infos de l'apprenant
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
                                                    setData("niveau",val)
                                                }}
                                                disablePortal={true}
                                                options={props.niveaux}
                                                getOptionLabel={(option)=>option.libelle}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params)=><TextField  fullWidth {...params} placeholder={"niveau"} label={params.libelle}/>}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className={"md:col-span-3 grid md:grid-cols-3 gap-5"}>
                                        <div className={"flex text-red-600"}>{props.errors?.dateNaissance}</div>

                                        <div className={"flex text-red-600"}>{props.errors?.lieuNaissance}</div>

                                        <div className={"flex text-red-600"}>{props.errors?.niveau}</div>
                                    </div>
                                </div>
                            </div>

                            <div className={"border p-2 space-y-5"}>
                                <div className={"text-lg font-bold"}>
                                    Tuteurs
                                </div>
                                {
                                    data.tuteursAdd &&
                                    data.tuteursAdd.length > 0 ?
                                        <List
                                            className={"divide-y grid md:grid-cols-2 grid-cols-1"}
                                            dense sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
                                            {
                                                data.tuteursAdd.map((t) => {
                                                const labelId = `checkbox-list-secondary-label-${t.id}`;
                                                return (
                                                    <ListItem
                                                        key={t.telephone}
                                                        secondaryAction={
                                                            <button  onClick={()=>deleteTuteurInTuteursAdd(t.telephone)} className={"p-2 rounded-full bg-red-600 text-white flex text-center items-center"}>
                                                                <DeleteIcon/>
                                                            </button>
                                                        }
                                                    >
                                                        <ListItemButton>
                                                            <ListItemText id={labelId} primary={capitalize(t.prenom)+" "+capitalize(t.nom)} secondary={" Tel: "+t.telephone+" |   Email: "+t.email}
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                );
                                            })}
                                        </List>
                                        :
                                        <div>
                                            Aucun tuteur
                                            <div className="text-red-600">
                                                {props.errors?.tuteursAdd}
                                            </div>
                                        </div>
                                }
                                <div >
                                    <button onClick={()=>setOpenModal(true)} type={"button"} className={"rounded bg-green-600 p-3 text-white flex"}>
                                        Ajouter un nouveau tuteur <span className={"ml-2 rounded-full bg-white text-green-600 flex text-center items-center"}><AddIcon /></span>
                                    </button>
                                </div>
                            </div>

                            <div className={"p-2 border rounded space-x-3 flex items-center w-full"} style={{maxWidth:600}} >
                                <TextField
                                    className={"w-full"}
                                    variant={"standard"}
                                    onChange={(e) => setData("search", e.target.value)}
                                    label={"Entrez l'identifiant ou l'email du tuteur"}

                                />
                                <button type="button" onClick={handleSearchButton} className={"rounded bg-gray-600 p-3 text-white flex"}>
                                    <SearchIcon/>
                                </button>

                            </div>

                            {
                                data.tuteurs?.length >0 &&
                                <div>

                                    <List dense sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
                                        { data.tuteurs.map((t) => {
                                            const labelId = `checkbox-list-secondary-label-${t.id}`;
                                            return (
                                                <ListItem
                                                    key={t.id}
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
                                                        <ListItemText id={labelId} primary={capitalize(t?.prenom)+" "+capitalize(t?.nom)} secondary={" Tel: "+t.telephone+" |   Email: "+t.email}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                    <button onClick={handleAddNewTuteur} className={"p-3 rounded bg-green-600 text-white flex text-center items-center"}>
                                        Ajouter
                                    </button>
                                </div>
                            }


                            {
                                data.niveau &&
                                <div className={"border p-5 space-y-5"}>
                                    <div className={"text-lg font-bold"}>
                                        Les type de frais
                                    </div>
                                    <div className={"flex flex-wrap"}>
                                        {
                                            data.niveau?.tarifs.map((tarif)=>(
                                                <div hidden={tarif.type_paiement.libelle==="INSCRIPTION"} key={tarif.id} className={"mx-5"}>
                                                    <FormControlLabel control={<Checkbox disabled={tarif.obligatoire?true:false} name={tarif.id+""} defaultChecked={tarif.obligatoire?true:false} onChange={handleChange} />} label={<div>{tarif.type_paiement.libelle} <span className={"p-1 rounded bg-orange-600 text-white"}>{formatNumber(tarif.montant)} FG/AN</span></div>} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                            {
                                data.montant &&
                                <div className={"my-5 p-2 font-bold"} style={{width:"fit-content"}}>
                                    Montant de l'inscription:
                                    <span className={"my-5 p-2 text-white  bg-orange-600 font-bold"}>{formatNumber(data.montant)} FG</span>
                                </div>
                            }


                            <div className={"flex col-span-3 justify-end"}>
                                <button className={"p-3 text-white bg-green-600 rounded"}  type={"submit"}>
                                    Enregistrer
                                </button>
                            </div>
                        </div>

                    </form>

                    {
                        ////////// ADD TUTEUR MODAL
                    }
                    <Modal
                        keepMounted
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                    >
                        <Box sx={style}>
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

                                <div className="mt-4">

                                    <TextField
                                        type={"password"}
                                        autoComplete="new-password"
                                        className={"w-full"}  name={"confirm_password"} label={"Confirmer mot de passe"} value={dataTuteur.confirm_password} onChange={onHandleChange}
                                        required
                                    />
                                </div>

                                <div className={'md:col-span-3 sm:col-span-2'}>
                                    <button className={"p-3 text-white bg-green-600 rounded"} type={"submit"}>
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
                                        checkboxSelection
                                        autoHeight
                                    />
                                </div>
                            }
                        </Box>

                    </Modal>
                </div>
            </div>
            <SnackBar error={tuteurAddError} success={ props.success || tuteurAddSuccess }  update={updateSnackBar}/>
        </AdminPanel>
    );
}

export default Create;
