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
    Alert,
    Autocomplete, Checkbox,
    FormControl, FormControlLabel,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    TextField
} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NumberFormat from "react-number-format";
import SnackBar from "@/Components/SnackBar";
import {motion} from "framer-motion";
import formatNumber from "@/Utils/formatNumber";

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumberFormat
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
            prefix={"Le "}
            suffix={" de chaque mois"}
        />
    );
});

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

function Index(props) {

    const [tarifs,setTarifs] = useState();

    const [open, setOpen] = React.useState(false);


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

   function handleClose()
   {
       setOpen(false);
   }

    useEffect(() => {
        if(props.success)
            setOpen(true);
    },[props.success])



    const {data,setData,post}=useForm({
        "montant":"",
        "frequence":"",
        "echeance":"",
        "classes":"",
        "typePaiement":"",
        "AnneeScolaire":"",
        "etablissement_id":"",
        "obligatoire":false

    });

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'typePaiement', headerName: 'TYPE FRAIS', minWidth:130,renderCell:(cellValues)=>cellValues.row.type_paiement?.libelle,flex:1 },
        { field: 'classe', headerName: 'CLASSE', minWidth:250,flex:1, renderCell:(cellValues)=>cellValues.row.classe?.libelle },
        { field: 'montant', headerName: 'MONTANT', minWidth:130,flex:1 ,renderCell:(cellValues)=>formatNumber(cellValues.row.montant)+" FG"},
        { field: 'frequence', headerName: 'FREQUENCE', minWidth:130,flex:1 },
        { field: 'echeance', headerName: 'ECHEANCE', minWidth:130 },
        { field: 'obligatoire', headerName: 'OBLIGATOIRE', minWidth:130,flex:1, renderCell:(cellValues)=>cellValues.row.obligatoire?"oui":"non" },
        { field: 'action', headerName: 'ACTION',minWidth:200,flex:1,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white orangeBlueBackground rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
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
        confirm("Voulez-vous supprimer ce tarif") && Inertia.delete(route("etablissement.tarif.destroy",[props.auth.user.id,id]),{preserveScroll:true})
    }

    function handleEdit(id){
        alert("EDIT"+id)
    }

    function handleShow(id){
        alert("SHOW"+id)
    }

    function handleSubmit(e)
    {
        e.preventDefault();
        Inertia.post(route("etablissement.tarif.store",props.auth.user.id),data,{preserveState:false})

    }

    useEffect(() => {
        setData("etablissement_id",props.etablissementId)
    },[])

    useEffect(() => {
        setTarifs(props.tarifs);
    },[props.tarifs]);


    return (
        <AdminPanel auth={props.auth} error={props.error} active={"Service"}>
            <div className={"p-5"}>
                <div className={"my-5 text-2xl text-white orangeOrangeBackground rounded text-white p-2"}>
                    Gestion des services
                </div>

                <form action="" onSubmit={handleSubmit} className={"my-5 p-2 border rounded"}>
                    <div className={"text-lg font-bold mb-5"}>
                        Ajouter un service (Tarif)
                    </div>
                    <div className={"gap-5 grid md:grid-cols-3 grid-cols-1"}>
                        <div>
                            <Autocomplete
                                id="tags-standard"
                                onChange={(e,val)=>setData("typePaiement",val)}
                                disablePortal={true}
                                id={"combo-box-demo"}
                                options={props.typePaiements}
                                getOptionLabel={option=>option.libelle}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Type de frais"} label={params.libelle} required/>}
                            />
                            <div className={"text-red-600"}>{props.errors?.etablissement_id}</div>
                        </div>
                        <div>
                            <Autocomplete
                                multiple
                                //filterOptions={(options)=>[{libelle:"Tout selectionner" }, ...options]}
                                disabled={data.typePaiement?.concerne!=="APPRENANT"}
                                id="tags-standard"
                                groupBy={(option) => option.niveau.libelle}
                                onChange={(e,val)=> setData("classes",val)}
                                isOptionEqualToValue={(option, value) => value.libelle==="Tout selectionner" && setData("classes",props.classes.filter((classe)=>(data.typePaiement?data.typePaiement?.tarifs.find(tarif=>tarif.classe_id===classe.id)===undefined:1)))}
                                disablePortal={true}
                                options={props.classes.filter((classe)=>(data.typePaiement?data.typePaiement?.tarifs.find(tarif=>tarif.classe_id===classe.id)===undefined:1))}
                                getOptionLabel={option=>option.libelle}
                                required
                                renderInput={(params)=><TextField fullWidth {...params} placeholder={"Classes"} label={params.libelle}/>}
                            />
                            <div className={"text-red-600"}>{props.errors?.classes}</div>
                        </div>
                        <div>
                            <FormControl className={"w-full"}>
                                <InputLabel id="demo-simple-select-standard-label">Fréquence</InputLabel>
                                <Select
                                    className={"w-full"}
                                    disabled={data.typePaiement?.libelle==="INSCRIPTION"}
                                    labelId="demo-simple-select-label"
                                    label={"Fréquence"}

                                    value={data.frequence}
                                    onChange={(e)=>setData("frequence",e.target.value)}
                                >
                                    <MenuItem value={"MENSUELLE"}>MENSUELLE</MenuItem>
                                   {/* <MenuItem value={"TRIMESTRIELLE"}>TRIMESTRIELLE</MenuItem>
                                    <MenuItem value={"SEMESTRIELLE"}>SEMESTRIELLE</MenuItem>*/}
                                    <MenuItem value={"ANNUELLE"}>ANNUELLE</MenuItem>

                                </Select>
                            </FormControl>
                            <div className={"flex my-2 text-red-600"}>{props.errors?.situation_matrimoniale}</div>
                        </div>

                        <div>
                            <TextField className={"w-full"}  name={"montant"} label={"Montant"} value={data.libelle} onChange={(e)=>setData("montant",e.target.value)}
                                       InputProps={{
                                           inputComponent: NumberFormatCustomMontant,
                                           inputProps:{
                                               max:100000000,
                                               name:"montant"

                                           },
                                       }}/>
                            <div className={"flex my-2 text-red-600"}>{props.errors?.libelle}</div>
                        </div>

                        <div>
                            <TextField
                                InputProps={{
                                    inputComponent: NumberFormatCustom,
                                    inputProps:{
                                        min:1,
                                        max:31
                                    }
                                }}
                                disabled={data.typePaiement?.libelle==="INSCRIPTION"}
                                className={"w-full"}  name={"echeance"} label={"Jour limite de paiement"} value={data.echeance} onChange={(e)=>setData("echeance",e.target.value)}/>
                            <div className={"flex my-2 text-red-600"}>{props.errors?.libelle}</div>
                        </div>
                        <div className={"md:col-span-3"} >
                            <FormControlLabel disabled={data.typePaiement?.concerne!=="APPRENANT"} control={<Checkbox name={"obligatoire"} onChange={(e)=>setData("obligatoire",e.target.checked)} />} label={"Obligatoire"} />
                        </div>

                        <SnackBar error={error} update={update} success={success}/>

                        <div className={"flex md:col-span-3 justify-end"}>
                            <button className={"p-2 text-white orangeVertBackground rounded hover:text-green-600 hover:bg-white hover:border hover:border-green-600 transition duration-500"} style={{height: 56}}  type={"submit"}>
                                Enregistrer
                            </button>
                        </div>
                    </div>

                </form>

                <motion.div
                    initial={{y:-100,opacity:0}}
                    animate={{y:0,opacity:1}}
                    transition={{
                        duration:0.5,
                        type:"spring",
                    }}

                    style={{width: '100%' }} className={"flex justify-center"}>
                    {
                        tarifs &&
                        <DataGrid
                            components={{
                                Toolbar:GridToolbar,
                            }}
                            rows={tarifs}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10,20,100]}
                            autoHeight
                        />
                    }
                </motion.div>
                <SnackBar success={ props.success }/>
            </div>
        </AdminPanel>
    );
}

export default Index;
