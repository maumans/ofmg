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

    useEffect(() => {
        console.log(error)
        console.log(success)
    })

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
        "niveau":"",
        "typePaiement":"",
        "AnneeScolaire":"",
        "etablissement_id":"",
        "obligatoire":false

    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'typePaiement', headerName: 'TYPE PAIEMENT', width:130,renderCell:(cellValues)=>cellValues.row.type_paiement?.libelle },
        { field: 'niveau', headerName: 'NIVEAU', width:130, renderCell:(cellValues)=>cellValues.row.niveau?.libelle },
        { field: 'montant', headerName: 'MONTANT', width:130 },
        { field: 'frequence', headerName: 'FREQUENCE', width:130 },
        { field: 'echeance', headerName: 'ECHEANCE', width:130 },
        { field: 'obligatoire', headerName: 'OBLIGATOIRE', width:130, renderCell:(cellValues)=>cellValues.row.obligatoire?"oui":"non" },
        { field: 'action', headerName: 'ACTION',width:200,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white bg-blue-700 rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
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

    useEffect(() => {
        if(data.typePaiement?.concerne!=="APPRENANT")
        {
            setData("obligatoire",true)
        }
    },[data.typePaiement])

    useEffect(() => {
        console.log(data.obligatoire)
    },[data.obligatoire])


    return (
        <AdminPanel auth={props.auth} error={props.error} active={"tarif"}>
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl text-white bg-orange-400 rounded text-white p-2"}>
                        Gestions des tarifs
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"my-5 p-2 border rounded"}>
                        <div className={"text-lg font-bold mb-5"}>
                            Ajouter un tarif
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
                                   renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Type de paiement"} label={params.libelle}/>}
                               />
                               <div className={"text-red-600"}>{props.errors?.etablissement_id}</div>
                           </div>
                           <div>
                               <Autocomplete
                                   disabled={data.typePaiement?.concerne!=="APPRENANT"}
                                   id="tags-standard"
                                   onChange={(e,val)=>setData("niveau",val)}
                                   disablePortal={true}
                                   id={"combo-box-demo"}
                                   options={props.niveaux}
                                   getOptionLabel={option=>option.libelle}
                                   isOptionEqualToValue={(option, value) => option.id === value.id}
                                   renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Niveau"} label={params.libelle}/>}
                               />
                               <div className={"text-red-600"}>{props.errors?.niveaux}</div>
                           </div>
                            <div>
                                <FormControl className={"w-full"}>
                                    <InputLabel id="demo-simple-select-standard-label">Fréquence</InputLabel>
                                    <Select
                                        disabled={data.typePaiement?.libelle==="INSCRIPTION"}
                                        labelId="demo-simple-select-label"

                                        value={data.frequence}
                                        onChange={(e)=>setData("frequence",e.target.value)}
                                    >
                                        <MenuItem value={"MENSUELLE"}>MENSUELLE</MenuItem>
                                        <MenuItem value={"TRIMESTRIELLE"}>TRIMESTRIELLE</MenuItem>
                                        <MenuItem value={"SEMESTRIELLE"}>SEMESTRIELLE</MenuItem>
                                        <MenuItem value={"ANNUELLE"}>ANNUELLE</MenuItem>

                                    </Select>
                                </FormControl>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.situation_matrimoniale}</div>
                            </div>

                            <div>
                                <TextField className={"w-full"}  name={"montant"} label={"Montant"} value={data.libelle} onChange={(e)=>setData("montant",e.target.value)}/>
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
                            {
                                <div className={"col-span-3"} >
                                    <FormControlLabel disabled={data.typePaiement?.concerne!=="APPRENANT"} control={<Checkbox name={"obligatoire"} onChange={(e)=>setData("obligatoire",e.target.checked)} />} label={"Obligatoire"} />
                                </div>
                            }

                            <SnackBar error={error} update={update} success={success}/>

                            <div className={"flex md:col-span-3 justify-end"}>
                                <button className={"p-3 text-white bg-green-600 rounded"}  type={"submit"}>
                                    Enregistrer
                                </button>
                            </div>
                        </div>

                    </form>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            tarifs &&
                            <DataGrid

                                components={{
                                    Toolbar:GridToolbar,
                                }}

                                componentsProps={{
                                    columnMenu:{backgroundColor:"red",background:"yellow"},
                                }}
                                rows={tarifs}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                checkboxSelection
                                autoHeight
                            />
                        }
                    </div>
                </div>
            </div>
        </AdminPanel>
    );
}

export default Index;
