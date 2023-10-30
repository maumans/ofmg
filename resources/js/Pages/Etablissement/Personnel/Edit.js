import React, {useEffect, useState} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {
    Autocomplete, Backdrop,
    Checkbox, CircularProgress,
    FormControl,
    InputLabel,
    ListItem,
    ListItemButton,
    ListItemText, MenuItem, Select,
    TextField
} from "@mui/material";
import {useForm} from "@inertiajs/inertia-react";
import SearchIcon from "@mui/icons-material/Search";
import List from "@mui/material/List";
import {AnimatePresence, motion} from "framer-motion";
import capitalize from "@/Utils/Capitalize";
import CloseIcon from '@mui/icons-material/Close';
import NumberFormat from "react-number-format";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import SnackBar from "@/Components/SnackBar";
import {Inertia} from "@inertiajs/inertia";

const NumberFormatCustomMontant = React.forwardRef(function NumberFormatCustom(props, ref) {
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


function Create({auth,errors,success,fonctions,classes,matieres,personnel,connexion,enseignant,comptable,directeur}) {

    const [newEmp, setNewEmp] =useState(false)

    const {data,setData,post,put}=useForm({
        "nom":personnel.nom || "",
        "prenom":personnel.prenom || "",
        "telephone":personnel.telephone || "",
        "adresse":personnel.adresse || "",
        "login":personnel.login || "",
        "email":personnel.email || "",
        "password":"",
        "fonction":null,
        "niveauValidation":personnel.niveauValidation || 1,
        "search":"",
        "personnels":"",
        "personnel":personnel,
        "classe":null,
        "matiere":null,
        "montant":"",
        "frequence":'',
        "coursList":personnel.cours,
        "coursDeleted":[]

    });

    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };
    const handleOpenBackdrop = () => {
        setOpenBackdrop(true);
    };

    function handleSearchButton()
    {
        data.search?
            axios.get(route("etablissement.contrat.personnel.search",[auth.user.id,data.search]),{preserveState:true,preserveScroll:true}).then((response)=>{
                setData("personnels",response.data)
            }).catch(error=>{
                console.log(error)
            })
            :
            setData("personnelsSearch",null)
    }

    function handleSubmit(e)
    {
        e.preventDefault();
        setOpenBackdrop(true)
        put(route("etablissement.personnel.update",[auth.user.id,personnel.id]), {data})
    }

    const [checked, setChecked] = useState(null);

    const handleToggle = (value) => () => {
        checked===value?setChecked(null)
        :setChecked(value)
    };

    function handleSelectPersonnel()
    {
        setData(data=>({
            ...data,
            "personnel":data.personnels.find(personnel=>personnel.id===checked),
            "search":""
        }))
        setChecked(null)
    }

    const [fonctionsSt,setFonctionsSt]=useState([])

    useEffect(() => {
        data.personnel && setData("personnels",null)
    },[data.personnel])

    const [coursList,setCoursList]=useState(personnel.cours)


    useEffect(() => {
        setOpenBackdrop(false)
    },[]);

    function handleDelete(id) {

        setData('coursDeleted',[...data.coursDeleted, coursList.find(cours=>cours.id===id && cours.status)])

        setCoursList(coursList.filter(cours=>cours.id!==id))
    }

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'classe', headerName: "CLASSE",headerClassName:"header", flex: 1, minWidth: 300, fontWeight:"bold", renderCell:(cellValues)=>(
                cellValues.row.classe?.libelle
            ) },
        { field: 'matiere', headerName: "MATIERE", flex: 1, minWidth: 150,  renderCell:(cellValues)=>(
                cellValues.row.matiere?.libelle
            ) },
        { field: 'montant', headerName: "MONTANT", flex: 1, minWidth: 250,  renderCell:(cellValues)=>(
                cellValues.row?.montant+" FG/"+(cellValues.row?.frequence==="MENSUELLE"?"mois":"heure")
            ) },
        { field: 'action', headerName: 'ACTION',width:100,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleDelete(cellValues.row.id)} className={"p-2 text-white orangeBlueBackground orangeBlueBackground rounded hover:text-blue-400 hover:bg-white transition duration-500"}>
                        <DeleteIcon/>
                    </button>
                </div>
            )
        },

    ];

    //const [success,setSuccess]=useState(null)
    const [error,setError]=useState(null)

    function handleAdd() {

        if(data.classe && data.matiere && data.montant && data.frequence)
        {
            if(coursList.find(cours=>(cours.classe.id===data.classe.id && cours.matiere.id===data.matiere.id))) {
                setError("Ce cours existe déja")
            }
            else
            {
                setCoursList((coursList)=>([
                    ...coursList,
                    {
                        "id":coursList.length !== 0?coursList[coursList.length-1].id+1:coursList.length+1,
                        "classe":data.classe,
                        "matiere":data.matiere,
                        "montant":data.montant,
                        "frequence":data.frequence,
                        "nouveau":true,
                    }
                ]))
            }
        }
        else
        {
            setError("Veuillez remplir tous les champs")
        }


    }

    function update()
    {
        setError(null)
    }

    useEffect(() => {
        setData("coursList",coursList)
    },[coursList])

    useEffect(() => {
        setData((data)=>({
                ...data,
                "classe":null,
                "matiere":null,
                "montant":"",
                "frequence":"",
        }))
    },[coursList])

    return (
        <AdminPanel auth={auth} error={errors} active={"gestionPersonnel"} /*sousActive={"listePersonnel"}*/>
            <div className={"p-5"}>
                <div>
                    <div className={"my-5 text-2xl text-white orangeOrangeBackground rounded p-2"}>
                        Modification du personnel
                    </div>
                     <div className={"p-5 border rounded"}>

                         <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5 rounded"} >

                             <AnimatePresence>
                                 {
                                     (newEmp || data.personnel ) &&
                                     <motion.div
                                         initial={{x: -10, opacity: 0}}
                                         animate={{x: 0, opacity: 1}}
                                         exit={{opacity: 0, x: -10}}
                                     >
                                         <div className={"grid md:grid-cols-2 grid-cols-1 gap-4 bg-white p-4"} >
                                             <div className={"md:col-span-2"}>
                                                 Info de base
                                             </div>
                                             <div>
                                                 <TextField className={"w-full"}  name={"prenom"} label={"Prenom"} value={data.personnel ?data.personnel.prenom:data.prenom} onChange={(e)=>setData("prenom",e.target.value)} required/>
                                                 <div className={"my-2 text-red-600"}>{errors?.prenom}</div>
                                             </div>

                                             <div>
                                                 <TextField className={"w-full"}  name={"nom"} label={"Nom"} value={data.nom} onChange={(e)=>setData("nom",e.target.value)} required/>
                                                 <div className={"my-2 text-red-600"}>{errors?.nom}</div>
                                             </div>
                                             <div>
                                                 <TextField className={"w-full"}  name={"adresse"} label={"Adresse"} value={data.adresse} onChange={(e)=>setData("adresse",e.target.value)} required/>
                                                 <div className={"my-2 text-red-600"}>{errors?.adresse}</div>
                                             </div>

                                             <div>
                                                 <TextField className={"w-full"}  name={"telephone"} label={"Telephone"} value={data.telephone} onChange={(e)=>setData("telephone",e.target.value)} required/>
                                                 <div className={"my-2 text-red-600"}>{errors?.telephone}</div>
                                             </div>

                                         </div>
                                     </motion.div>
                                 }
                             </AnimatePresence>

                             <div className={"w-full  bg-white p-4"}>
                                 <div>
                                     Selectionnez la fonction à attribuer à l'employé *
                                 </div>
                                 <Autocomplete
                                     className={"w-full my-4"}
                                     onChange={(e,val)=>setData("fonction",val)}
                                     disablePortal={true}
                                     id={"combo-box-demo"}
                                     options={fonctions}
                                     getOptionLabel={option=>option.libelle}
                                     isOptionEqualToValue={(option, value) => option.id === value.id}
                                     renderInput={(params)=><TextField autoComplete={"Fonction"}  fullWidth {...params} label={"Fonction"} />}

                                 />
                                 <div className={"text-red-600"}>{errors?.fonction}</div>
                             </div>

                             {
                                 (connexion || (data.fonction && data.fonction?.libelle?.toLowerCase() !== 'enseignant'))
                                 &&
                                 <div className={"grid md:grid-cols-2 grid-cols-1 gap-4 bg-white p-4"} >
                                     {
                                         (connexion || (data.fonction && data.fonction?.libelle?.toLowerCase() !== 'enseignant'))
                                         &&
                                         <>
                                             <div>
                                                 <TextField /*disabled={data.personnel?.email!==""}*/  className={"w-full"}  name={"login"} label={"Identifiant"} value={data.login} onChange={(e)=>setData("login",e.target.value)} required/>
                                                 <div className={"my-2 text-red-600"}>{errors?.login}</div>
                                             </div>

                                             <div>
                                                 <TextField /*disabled={data.personnel?.email!==""}*/  className={"w-full"}  name={"email"} label={"Email"} value={data.email} onChange={(e)=>setData("email",e.target.value)}/>
                                                 <div className={"my-2 text-red-600"}>{errors?.email}</div>
                                             </div>
                                         </>
                                     }

                                     {

                                         (data.fonction?.libelle.toLowerCase()==="comptable" || comptable) &&
                                         <div>
                                             <TextField className={"w-full"}
                                                        inputProps={{
                                                            min:1,
                                                            max:2
                                                        }}
                                                        type={"number"}
                                                        min={1}
                                                        max={2}
                                                        name={"niveauValidation"}
                                                        label={"Niveau de validation (comptable)"}
                                                        value={data.niveauValidation}
                                                        onChange={(e)=>setData("niveauValidation",e.target.value)}
                                                        required
                                             />
                                             <div className={"my-2 text-red-600"}>{errors?.niveauValidation}</div>
                                         </div>
                                     }
                                 </div>


                             }

                             <AnimatePresence>
                                 {
                                     (newEmp || data.personnel ) &&
                                     <motion.div
                                         initial={{x: -10, opacity: 0}}
                                         animate={{x: 0, opacity: 1}}
                                         exit={{opacity: 0, x: -10}}
                                     >
                                         <div className={"bg-white p-4"} >

                                             {
                                                 (data.fonction?.libelle.toLowerCase() ==="enseignant" /*|| enseignant*/) &&
                                                     <div className={"grid md:grid-cols-2 gap-4 w-full"}>
                                                         <div className={"md:col-span-2"}>
                                                             Attribution de cours
                                                         </div>
                                                         <div className={"w-full"}>
                                                             <Autocomplete
                                                                 value={data.classe}
                                                                 className={"w-full"}
                                                                 onChange={(e,val)=>setData("classe",val)}
                                                                 disablePortal={true}
                                                                 id={"combo-box-demo"}
                                                                 options={classes}
                                                                 getOptionLabel={option=>option.libelle}
                                                                 isOptionEqualToValue={(option, value) => option.id === value.id}
                                                                 renderInput={(params)=><TextField autoComplete={"classe"}  fullWidth {...params} placeholder={"Classe"} label={params.libelle}/>}
                                                                 required
                                                             />
                                                             <div className={"text-red-600"}>{errors?.classe}</div>
                                                         </div>

                                                         <div className={"w-full"}>
                                                             <Autocomplete
                                                                 value={data.matiere}
                                                                 className={"w-full"}
                                                                 onChange={(e,val)=>setData("matiere",val)}
                                                                 disablePortal={true}
                                                                 id={"combo-box-demo"}
                                                                 options={matieres}
                                                                 getOptionLabel={option=>option.libelle}
                                                                 isOptionEqualToValue={(option, value) => option.id === value.id}
                                                                 renderInput={(params)=><TextField autoComplete={"matiere"}  fullWidth {...params} placeholder={"Matiere"} label={params.libelle}/>}
                                                                 required
                                                             />
                                                             <div className={"text-red-600"}>{errors?.matiere}</div>
                                                         </div>
                                                     </div>

                                             }

                                             <div className={"grid md:grid-cols-2 gap-4"}>
                                                 <div className={"md:col-span-2 mt-4"}>
                                                     Salaire de l'employé
                                                 </div>

                                                 <div className={"w-full"}>
                                                     <TextField className={"w-full"}  name={"montant"} label={"Montant"} value={data.montant} onChange={(e)=>setData("montant",e.target.value)}
                                                                InputProps={{
                                                                    inputComponent: NumberFormatCustomMontant,
                                                                    inputProps:{
                                                                        max:100000000,
                                                                        name:"montant"

                                                                    },
                                                                }}
                                                     />
                                                     <div className={"my-2 text-red-600"}>{errors?.montant}</div>
                                                 </div>
                                                 <div className={"w-full"}>
                                                     <FormControl className={"w-full"}>
                                                         <InputLabel id="demo-simple-select-standard-label">Frequence</InputLabel>
                                                         <Select
                                                             className={"w-full"}
                                                             labelId="demo-simple-select-label"
                                                             label={"Frequence"}
                                                             value={data.frequence}
                                                             onChange={(e)=>setData("frequence",e.target.value)}
                                                         >
                                                             <MenuItem value={"HORAIRE"}>HORAIRE</MenuItem>
                                                             <MenuItem value={"MENSUELLE"}>MENSUELLE</MenuItem>
                                                         </Select>
                                                     </FormControl>
                                                     <div className={"flex my-2 text-red-600"}>{errors?.frequence}</div>
                                                 </div>
                                             </div>

                                             {
                                                 (data.fonction?.libelle.toLowerCase() ==="enseignant" /*|| enseignant*/) &&
                                                     <>
                                                         <div className={"md:col-span-3 sm:col-span-2"}>
                                                             <button onClick={handleAdd} type="button" className={"text-white border p-2 orangeBlueBackground rounded hover:orangeBlueBackground transition duration-500 mb-4"}>Ajouter</button>
                                                         </div>
                                                         <div className={"md:col-span-3 sm:col-span-2"}>
                                                             <DataGrid

                                                                 components={{
                                                                     Toolbar:GridToolbar,
                                                                 }}
                                                                 getRowId={(row) => row.id}
                                                                 rows={coursList}
                                                                 columns={columns}
                                                                 pageSize={5}
                                                                 rowsPerPageOptions={[5]}
                                                                 autoHeight
                                                             />
                                                         </div>
                                                     </>
                                             }



                                             <SnackBar update={update} error={error}/>

                                             <SnackBar success={success}/>

                                         </div>
                                     </motion.div>

                                 }
                             </AnimatePresence>

                             <div className={"grid md:grid-cols-2 grid-cols-1 gap-4 mt-4 bg-white p-4"} >
                                 <div className={"md:col-span-2 "}>
                                     <button style={{height: 56}} className={"p-2 text-white orangeVertBackground rounded"} type={"submit"}>
                                         Valider
                                     </button>
                                 </div>
                             </div>


                         </form>
                     </div>

                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openBackdrop}
                        onClick={handleCloseBackdrop}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
            </div>

        </AdminPanel>
    );
}

export default Create;
