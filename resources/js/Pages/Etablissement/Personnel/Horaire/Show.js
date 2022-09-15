import React, {useEffect, useRef, useState} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {Accordion, AccordionDetails, AccordionSummary, Autocomplete, FormControl, TextField} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {motion} from "framer-motion";
import formatNumber from "@/Utils/formatNumber";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import NumberFormat from "react-number-format";
import {useForm} from "@inertiajs/inertia-react";
import SnackBar from "@/Components/SnackBar";


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
        />
    );
});

function Show({auth,error,personnel,success,mois}) {
    const {data,setData,post,reset}=useForm({
            mois:null
        }
    )

    const [personnelSt,setPersonnelSt]=useState(null)
    const [successSt,setSuccessSt]=useState(null)

    useEffect(() => {
        setSuccessSt(success)
    },[success])

    const update=()=>
    {
        setSuccessSt(null)
    }

    useEffect(() => {
        setPersonnelSt(personnel)
    },[personnel])


    function onHandleChange(e,id){
        setData(id+"",e.target.value);
    }

    const columnsEnseignant=[
        { field: 'id', headerName: 'ID', minWidth: 70, flex: 1},
        { field: 'matiere', headerName: 'MATIERE', minWidth: 200, flex: 1,renderCell:cellValues =>(
                cellValues.row?.cours?.matiere?.libelle
            )},
        { field: 'classe', headerName: 'CLASSE', minWidth: 250, flex: 1,renderCell:cellValues =>(
                cellValues.row?.cours?.classe?.libelle
            )},
        { field: 'nombreHeureActuel', headerName: "NOMBRE D'HEURES ACTUELS", minWidth: 70, flex: 1,renderCell:cellValues =>(
                data.mois && cellValues.row.contrat_fonction_mois.find(cfm=>cfm.mois.id===data.mois?.id)?.nombreHeures
            )},
        { field: 'Salaire', headerName: "SALAIRE MENSUEL", minWidth: 100, flex: 1,renderCell:cellValues =>(
                data.mois && formatNumber(cellValues.row.contrat_fonction_mois.find(cfm=>cfm.mois.id===data.mois?.id)?.salaire)+" FG"
            )},
        { field: 'nouveau', headerName: "NOUVEAU NOMBRE D'HEURE", minWidth: 70, flex: 1,renderCell:cellValues =>(
                cellValues.row.contrat_fonction_mois.map(cfm=>
                    cfm.mois.id===data.mois?.id &&
                    <TextField
                        variant="standard"
                        key={cfm.id}
                        name={cfm.id+""}
                        onChange={(e) => onHandleChange(e, cfm.id)}
                        autoComplete="montant"
                        InputProps={{
                            inputComponent: NumberFormatCustom,
                            inputProps: {
                                max: 1000000000,
                            },
                        }}
                    />
                )

            )},
    ]

    const [tabEnseignant,setTabEnseignant]=useState([])

    useEffect(() => {
        setTabEnseignant(personnel.contrat_en_cours.contrat_fonctions.filter(cf=>cf?.fonction.libelle.toLowerCase()==="enseignant"))
    },[personnel])

    function handleSubmit()
    {
        post(route("etablissement.personnel.horaire.store",[auth.user.id]),{data,preserveScroll:true})
    }

    return (
        <AdminPanel auth={auth} error={error} active={"personnel"} sousActive={"gestionHoraire"}>
            <div className={"p-5 grid gap-4 rounded"}>
                <div className={"text-2xl p-3 rounded bg-black text-white"} style={{width:"fit-content"}}>
                    {personnelSt?.prenom} {personnelSt?.nom}
                </div>

                <div className={"mt-5"}>
                    <div>
                        Selectionnez un mois
                    </div>
                    <FormControl  className={"md:w-5/12 sm:w-5/12 w-full"}>
                        <Autocomplete
                            onChange={(e,val)=>{
                                setData("mois",val)
                            }}
                            disablePortal={true}
                            options={mois}
                            getOptionLabel={(option)=>option.libelle}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params)=><TextField  fullWidth {...params} placeholder={"mois"} label={params.libelle}/>}
                        />
                    </FormControl>
                </div>

                <div>
                    <Accordion defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{backgroundColor:"#f8f1eb"}}
                        >
                            Enseignant
                        </AccordionSummary>

                        <AccordionDetails
                            aria-expanded={true}
                        >
                            <div className={"my-5"}>
                                <DataGrid

                                    rows={tabEnseignant?tabEnseignant:[]}
                                    columns={columnsEnseignant}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    autoHeight
                                />
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <SnackBar success={successSt} update={update}/>

                <div>
                    <button onClick={handleSubmit} className={"p-2 text-white bg-green-600 rounded hover:text-green-600 hover:bg-white hover:border hover:border-green-600 transition duration-500"} style={{height: 56}} type={"submit"} style={{height:56}}>
                        Enregistrer
                    </button>
                </div>
            </div>
        </AdminPanel>
    );
}

export default Show;
