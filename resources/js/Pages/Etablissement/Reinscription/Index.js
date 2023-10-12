import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    GridToolbar,
    useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';
import {
    Autocomplete, Avatar, Button, Checkbox,
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

    const [apprenants,setApprenants] = useState([]);
    const [loading,setLoading] = useState(true);
    const [apprenantsSelected,setApprenantsSelected] = useState([]);

    useEffect(() => {
        setLoading(false)
    },[props.apprenants]);

    const [tarifs,setTarifs] = useState();

    ////// SnackBar

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)



    useEffect(() => {
        setError(props.error)
    },[props])

    useEffect(() => {
        setSuccess(props.success)
    },[props])

    function update()
    {
        error && setError(null)
        success && setSuccess(null)
    }

    useEffect(() => {
        (data.searchText==="" && data.anneeScolaireSearch===null && data.classeSearch===null ) && setApprenants(props.apprenants);

    },[props.apprenants])

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
        //matriculeSearch:"",
        searchText:"",
        classeSearch:props.classe,
        classeReinscription:null,
        tuteurs:"",
        tuteursSearch:[],
        tuteursAdd:[],
        apprenants:null
    });

    function handleExport(e)
    {
        e.preventDefault();
        post(route("etablissement.rereinscription.import",props.auth.user.id), {data:data.apprenants,preserveScroll: true})
    }


    const [open, setOpen] = React.useState(false);
    const [openDetails, setOpenDetails] = React.useState(false);

    const handleClose = () => {
        setOpen(false)
        setOpenDetails(false)
    };

    const [openModal, setOpenModal] = useState(false);
    const [apprenant, setApprenant] = useState(null);

    const handleDetails = (i) => {
        setApprenant(i)
        setOpenDetails(true);
    }

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'prenom', headerName: 'PRENOM', width:150,renderCell:(cellValues)=>cellValues.row?.prenom},
        { field: 'nom', headerName: 'NOM', width:150,renderCell:(cellValues)=>cellValues.row?.nom},
        { field: 'matricule', headerName: 'MATRICULE', width:150,renderCell:(cellValues)=>cellValues.row?.matricule},
        { field: 'classe', headerName: 'CLASSE', width:300, renderCell:(cellValues)=>cellValues.row.classe?.libelle },
        { field: 'action', headerName: 'ACTION',width:150,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleDetails(cellValues.row)} className={"p-2 text-white orangeVioletBackground rounded hover:text-blue-500 hover:bg-white transition duration-500"}>
                        <ListAltIcon/>
                    </button>
                </div>
            )
        },

    ];

    function handleShow(id){
        alert("SHOW"+id)
    }

    useEffect(() => {
        setApprenants(props.apprenants)
    },[props.apprenants])


    function handleSearch()
    {
        setLoading(true)
        axios.post(route("etablissement.reinscription.searchApprenant",props.auth.user.id),{searchText:data.searchText ,classeId:data.classeSearch?.id},{preserveState:true,preserveScroll:true}).then((response)=>{
            setApprenants(response.data)
            setLoading(false)
        }).catch(error=>{
            console.log(error)
        });


    }

    useEffect(()=>{
        handleSearch()
    },[data.searchText,data.classeSearch])

    useEffect(()=>{
     console.log(apprenantsSelected)
    })


    useEffect(() => {
        setData("tarifs",tarifs)
    },[tarifs])

    return (
        <AdminPanel auth={props.auth} error={props.error} sousActive={"reinscription"} active={"gestionCursus"} >
            <div className={"p-5"}>
                <div>
                    <div className={"my-5 text-2xl text-white orangeOrangeBackground rounded text-white p-2"}>
                        Réinscription
                    </div>

                    <div className={"gap-5 grid md:grid-cols-2 grid-cols-1 items-end mb-5 border p-2"}>
                        <div className={'text-xl md:col-span-2'}>
                            Filtres
                        </div>

                        <div>
                            <TextField className={"w-full"}  name={"searchText"} label={"Matricule, prenom, nom"} value={data.searchText} onChange={(e)=>{
                                setData("searchText",e.target.value)
                            }}/>
                            <div className={"flex text-red-600"}>{props.errors?.searchText}</div>
                        </div>

                        <div className={"flex space-x-5"}>
                            <FormControl  className={"w-full"}>
                                <Autocomplete
                                    value={data.classeSearch}
                                    onChange={(e,val)=>{
                                        if (val) {
                                            setData("classeSearch",val)
                                        }
                                        else {
                                            setData("classeSearch",props.classe)
                                        }

                                    }}
                                    disablePortal={true}
                                    options={props.classes}
                                    getOptionLabel={(option)=>option.libelle}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params)=><TextField  fullWidth {...params} placeholder={"classe"} label={params.libelle}/>}
                                />
                                <div className={"flex text-red-600"}>{props.errors?.classe}</div>
                            </FormControl>
                        </div>
                    </div>

                    <form onSubmit={(e)=>{
                            e.preventDefault();
                            Inertia.post(route('etablissement.reinscription.validation',[props.auth.user?.id]),{apprenants:apprenantsSelected,'classe':data.classeReinscription})
                        }}
                    >

                        <div className={'my-5 grid grid-cols-2'}>
                            <div>
                                <div>
                                    Classe de réinscription
                                </div>
                                <FormControl  className={"w-full"}>
                                    <Autocomplete
                                        value={data.classeReinscription}
                                        onChange={(e,val)=>{
                                            setData("classeReinscription",val)
                                        }}
                                        disablePortal={true}
                                        options={props.classes}
                                        getOptionLabel={(option)=>option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Selectionnez la classe de réinscription"} label={params.libelle}/>}
                                    />
                                    <div className={"flex text-red-600"}>{props.errors?.classeReinscription}</div>
                                </FormControl>
                            </div>
                        </div>




                        <motion.div
                            initial={{y:-100,opacity:0}}
                            animate={{y:0,opacity:1}}
                            transition={{
                                duration:0.5,
                                type:"spring",
                            }}

                            style={{width: '100%' }} className={"justify-center"}>

                            <DataGrid

                                loading={loading}

                                components={{
                                    Toolbar:GridToolbar,
                                }}

                                rows={apprenants}
                                columns={columns}
                               initialState={{
                                        pagination: {
                                            pageSize: 30,
                                        },
                                    }}
                                rowsPerPageOptions={[30,50,100]}
                                autoHeight
                                checkboxSelection

                                onSelectionModelChange={(newRowSelectionModel) => {
                                    setApprenantsSelected(newRowSelectionModel);
                                }}
                                //rowSelectionModel={apprenantsSelected}
                            />

                            <div className={'w-fit mt-5'}>
                                <Button type={'submit'} variant={"outlined"} color={"info"} disabled={apprenantsSelected?.length===0 || !data.classeReinscription}>
                                    Passer à la réinscription
                                </Button>
                            </div>

                        </motion.div>
                    </form>
                </div>
            </div>

            <Modal
                keepMounted
                open={open || openDetails}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>

                {
                    openDetails &&
                    <div className={"w-full h-full border border-orange-500 p-5 rounded space-y-8 items-between"}>
                        <div className={"text-3xl font-bold p-2 border text-white orangeOrangeBackground rounded"}>
                            Details de l'inscription
                        </div>
                        <div className={"flex space-x-5 items-center"}>
                            <SchoolIcon className="text-orange-500" sx={{fontSize:50}} />
                            <div className="text-3xl uppercase">
                                {props.auth.user.etablissement_admin.nom}
                            </div>
                        </div>
                        <div className={"relative"}>
                            <div className="absolute -top-3 left-2 orangeOrangeBackground text-white rounded p-2">
                                Infos apprenant
                            </div>
                            <div className={"md:flex flex-wrap md:gap-5 capitalize text-xl border rounded px-5 py-10 border-orange-500"}>
                                <div><span className={"font-bold"}>Prenom: </span>{apprenant?.prenom}</div>
                                <div><span className={"font-bold"}>Nom: </span>{apprenant?.nom}</div>
                                <div><span className={"font-bold"}>Date de naissance: </span>{apprenant?.date_naissance}</div>
                                <div><span className={"font-bold"}>Lieu de naissance: </span>{apprenant?.lieu_naissance}</div>
                            </div>
                        </div>
                        <div className={"relative"}>
                            <div className="absolute -top-3 left-2 orangeOrangeBackground text-white rounded p-2">
                                Infos inscription
                            </div>
                            <div className="md:flex flex-wrap md:gap-5 text-xl border rounded px-5 py-10 border-orange-500">
                                <div><span className={"font-bold"}>Classe: </span>{apprenant?.classe?.libelle}</div>
                                <div><span className={"font-bold"}>Matricule: </span>{apprenant?.matricule}</div>
                            </div>
                        </div>

                    </div>
                }
                </Box>
            </Modal>
            {
                <SnackBar error={error} update={update} success={success} />
            }
        </AdminPanel>
    );
}

export default Index;
