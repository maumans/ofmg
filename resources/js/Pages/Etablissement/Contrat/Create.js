import React, {useEffect, useState} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {
    Autocomplete,
    Checkbox,
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


function Create({auth,errors,fonctions,classes,matieres}) {

    const [newEmp, setNewEmp] =useState(false)

    const {data,setData,post}=useForm({
        "nom":"",
        "prenom":"",
        "telephone":"",
        "adresse":"",
        "email":"",
        "password":"",
        "fonction":null,
        "niveauValidation":"",
        "search":"",
        "personnels":"",
        "personnel":null,
        "classe":null,
        "matiere":null,
        "montant":"",
        "frequence":"",
        "coursList":null

    });

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

        post(route("etablissement.contrat.store",auth.user.id), {data:data})
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

    const [coursList,setCoursList]=useState([])

    function handleDelete(id) {
        setCoursList(coursList.filter(cours=>cours.id!==id))
    }

    const columns = [
        { field: 'id', headerName: 'N°', width: 70},
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

    const [success,setSuccess]=useState(null)
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
                        "id":coursList.length!==0?coursList[coursList.length-1].id+1:coursList.length+1,
                        "classe":data.classe,
                        "matiere":data.matiere,
                        "montant":data.montant,
                        "frequence":data.frequence,
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

    return (
        <AdminPanel auth={auth} error={errors} active={"contrat"} sousActive={"creerContrat"}>
            <div className={"p-5"}>
                <div>
                    <div className={"my-5 text-2xl text-white orangeOrangeBackground rounded text-white p-2"}>
                        Gestion des contrats
                    </div>
                     <div className={"p-5 border rounded"}>

                         <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5 rounded"} >
                             <div className={"text-lg font-bold mb-5"}>
                                 Contrat
                             </div>

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
                                     renderInput={(params)=><TextField autoComplete={"Fonction"}  fullWidth {...params} label={"Fonction"} required/>}
                                     required
                                 />
                                 <div className={"text-red-600"}>{errors?.fonction}</div>
                             </div>

                             <div className={"p-4 rounded space-y-3 items-center w-full bg-white"} >

                                 <div className={"w-full space-y-2 py-4"} >
                                     <div>
                                         Recherchez l'employé s'il existe déjà
                                     </div>
                                     <div className={"flex w-full space-x-2"}>
                                         <TextField
                                             className={"flex-1"}
                                             value={data.search}
                                             onChange={(e) => setData("search", e.target.value)}
                                             label={"Nom, prenom ou le tel"}

                                         />
                                         <button type="button" onClick={handleSearchButton} className={"rounded bg-gray-600 p-2 text-white"}>
                                             <SearchIcon/>
                                         </button>
                                     </div>
                                 </div>
                                 <AnimatePresence>
                                     {
                                         data.personnel &&

                                         <motion.div
                                             initial={{x: -10, opacity: 0}}
                                             animate={{x: 0, opacity: 1}}
                                             exit={{opacity: 0, x: -10}}

                                             className={"bg-gray-200 p-4 mt-3 w-6/12 flex justify-between rounded"}
                                         >
                                             <div>
                                                 <div className="font-bold capitalize">
                                                     {data.personnel.prenom + " " + data.personnel.nom}
                                                 </div>
                                                 <div>
                                                     <span className="font-bold capitalize">Fonctions:</span> {(data.personnel.contrat_fonctions.find((cf,i,j) => cf.fonction?.libelle.toLowerCase()==="directeur") && "Directeur") } {(data.personnel.contrat_fonctions.find((cf,i,j) => cf.fonction?.libelle.toLowerCase()==="comptable") && "Comptable")} {data.personnel.contrat_fonctions.find((cf,i,j) => cf.fonction?.libelle.toLowerCase()==="enseignant") && "Enseignant"}
                                                 </div>

                                                 <div>
                                                     <span className="font-bold capitalize">Tel: </span> {data.personnel.telephone}
                                                 </div>
                                             </div>
                                             <div>
                                                 <button onClick={() => setData("personnel", null)}
                                                         className={"p-1 rounded-full bg-red-600 text-white flex text-center items-center"}
                                                         type={"button"}>
                                                     <CloseIcon/>
                                                 </button>
                                             </div>
                                         </motion.div>
                                     }
                                 </AnimatePresence>

                                 {
                                     data.personnels?.length >0 &&
                                     <div>

                                         <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                             { data.personnels.map((t,i) => {

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
                                                             onClick={handleToggle(t.id)}

                                                             secondaryAction={
                                                                 <Checkbox
                                                                     edge="end"
                                                                     onChange={handleToggle(t.id)}
                                                                     checked={checked===t.id}
                                                                     inputProps={{ 'aria-labelledby': labelId }}
                                                                 />
                                                             }
                                                             disablePadding
                                                         >
                                                             <ListItemButton>
                                                                 <ListItemText id={labelId} primary={capitalize(t?.prenom)+" "+capitalize(t?.nom)} secondary={"Tel: "+t.telephone}
                                                                 />
                                                             </ListItemButton>
                                                         </ListItem>

                                                     </motion.div>
                                                 );
                                             })}
                                         </List>
                                         <button onClick={handleSelectPersonnel} className={"p-3 rounded orangeVertBackground text-white flex text-center items-center mt-4"}>
                                             Choisir
                                         </button>
                                     </div>
                                 }
                             </div>
                             <AnimatePresence>
                                 {
                                     (!newEmp && !data.personnel) &&
                                     <div className={"grid md:grid-cols-2 grid-cols-1 gap-4 bg-white p-4"} >
                                         <div className={"col-span-2 space-y-4"}>
                                             <div>
                                                 L'employé n'existe pas? Veuillez le créer
                                             </div>
                                             <button onClick={()=>setNewEmp(true)} type="button" className={"p-2 text-white orangeBlueBackground rounded"}>
                                                 Creer un employé
                                             </button>
                                         </div>
                                     </div>
                                 }
                             </AnimatePresence>


                             <AnimatePresence>
                                 {
                                     (newEmp || data.personnel) &&
                                     <motion.div
                                         initial={{x: -10, opacity: 0}}
                                         animate={{x: 0, opacity: 1}}
                                         exit={{opacity: 0, x: -10}}
                                     >
                                         <div className={"grid md:grid-cols-2 grid-cols-1 gap-4 bg-white p-4"} >
                                             <div className={"md:col-span-2"}>
                                                 Creation de l'employé
                                             </div>
                                             <div>
                                                 <TextField disabled={data.personnel!==null} className={"w-full"}  name={"prenom"} label={"Prenom"} value={data.personnel ?data.personnel.prenom:data.prenom} onChange={(e)=>setData("prenom",e.target.value)} required/>
                                                 <div className={"my-2 text-red-600"}>{errors?.prenom}</div>
                                             </div>

                                             <div>
                                                 <TextField disabled={data.personnel!==null} className={"w-full"}  name={"nom"} label={"Nom"} value={data.personnel ?data.personnel.nom:data.nom} onChange={(e)=>setData("nom",e.target.value)} required/>
                                                 <div className={"my-2 text-red-600"}>{errors?.nom}</div>
                                             </div>
                                             <div>
                                                 <TextField disabled={data.personnel!==null} className={"w-full"}  name={"adresse"} label={"Adresse"} value={data.personnel ?data.personnel.adresse:data.adresse} onChange={(e)=>setData("adresse",e.target.value)} required/>
                                                 <div className={"my-2 text-red-600"}>{errors?.adresse}</div>
                                             </div>

                                             <div>
                                                 <TextField disabled={data.personnel!==null} className={"w-full"}  name={"telephone"} label={"Telephone"} value={data.personnel ?data.personnel.telephone:data.telephone} onChange={(e)=>setData("telephone",e.target.value)} required/>
                                                 <div className={"my-2 text-red-600"}>{errors?.telephone}</div>
                                             </div>

                                             {
                                                 (data.fonction?.libelle.toLowerCase() === "directeur" || data.fonction?.libelle.toLowerCase() === "comptable")
                                                 &&
                                                 <>
                                                     <div>
                                                         <TextField /*disabled={data.personnel?.email!==""}*/  className={"w-full"}  name={"login"} label={"Identifiant"} value={data.personnel?.login?data.personnel?.login:data.login} onChange={(e)=>setData("login",e.target.value)} required/>
                                                         <div className={"my-2 text-red-600"}>{errors?.login}</div>
                                                     </div>

                                                     <div>
                                                         <TextField /*disabled={data.personnel?.email!==""}*/  className={"w-full"}  name={"email"} label={"Email"} value={data.personnel?.email?data.personnel?.email:data.email} onChange={(e)=>setData("email",e.target.value)}/>
                                                         <div className={"my-2 text-red-600"}>{errors?.email}</div>
                                                     </div>

                                                     {
                                                         !data.personnel?.email &&
                                                         <div>
                                                             <TextField value={data.password} className={"w-full"}  name={"password"} label={"Mot de passe"} onChange={(e)=>setData("password",e.target.value)} required/>
                                                             <div className={"my-2 text-red-600"}>{errors?.password}</div>
                                                         </div>
                                                     }
                                                 </>
                                             }

                                             {
                                                 data.fonction?.libelle.toLowerCase()==="comptable" &&
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
                                     </motion.div>
                                 }
                             </AnimatePresence>

                             <AnimatePresence>
                                 {
                                     (newEmp || data.personnel) &&
                                     <motion.div
                                         initial={{x: -10, opacity: 0}}
                                         animate={{x: 0, opacity: 1}}
                                         exit={{opacity: 0, x: -10}}
                                     >
                                         <div className={"bg-white p-4"} >

                                             {
                                                 data.fonction?.libelle.toLowerCase() ==="enseignant" &&
                                                     <div className={"grid md:grid-cols-2 gap-4 w-full"}>
                                                         <div className={"md:col-span-2"}>
                                                             Attribution de cours
                                                         </div>
                                                         <div className={"w-full"}>
                                                             <Autocomplete
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
                                                     <TextField className={"w-full"}  name={"montant"} label={"Montant"} value={data.montant} onChange={(e)=>setData("montant",e.target.value)} required
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
                                                             required
                                                         >
                                                             <MenuItem value={"HORAIRE"}>HORAIRE</MenuItem>
                                                             <MenuItem value={"MENSUELLE"}>MENSUELLE</MenuItem>
                                                         </Select>
                                                     </FormControl>
                                                     <div className={"flex my-2 text-red-600"}>{errors?.frequence}</div>
                                                 </div>
                                             </div>

                                             {
                                                 data.fonction?.libelle.toLowerCase() ==="enseignant" &&
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
                </div>
            </div>

        </AdminPanel>
    );
}

export default Create;
