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

    ]

    const [tabEnseignant,setTabEnseignant]=useState([])

    useEffect(() => {
        setTabEnseignant(personnel.contrat_en_cours.contrat_fonctions.filter(cf=>cf?.fonction.libelle.toLowerCase()==="enseignant"))
    },[personnel])

    return (
        <AdminPanel auth={auth} error={error} active={"personnel"} sousActive={"listePersonnel"}>
            <div className={"p-5 grid gap-4 rounded"}>
                <div className={"text-2xl p-3 rounded bg-black text-white"} style={{width:"fit-content"}}>
                    {personnelSt?.prenom} {personnelSt?.nom}
                </div>

                <div className={"grid grid-cols-1 gap-4"}>
                    {
                        personnelSt?.contrat_en_cours?.contrat_fonctions.map(cf=>(
                            cf.fonction.libelle.toLowerCase() !=="enseignant" &&
                            <Accordion key={cf.id}
                                       defaultExpanded={true}
                            >
                                <AccordionSummary
                                    expandIcon={<button type={'button'} className="orangeOrangeBackground text-white p-2 rounded-full">
                                        <ExpandMoreIcon />
                                    </button>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={{backgroundColor:"#f8f1eb"}}
                                >
                                    {
                                        cf.fonction.libelle +" "+(cf.fonction.libelle.toLowerCase() ==="enseignant" ? ("en cours de "+cf.cours.matiere.libelle.toUpperCase() +" ("+ cf.cours.classe.libelle.toUpperCase() +")"):cf.fonction.libelle.toLowerCase() ==="comptable"?" de niveau "+(personnel.niveauValidation ? personnel.niveauValidation:0):"")
                                    }
                                </AccordionSummary>

                                <AccordionDetails
                                    aria-expanded={true}
                                >
                                    <div className="grid grid-cols-3 gap-4 w-full">
                                        {
                                            cf.montant &&
                                            <div>
                                                <div className="font-bold">Salaire {cf.frequence.toLowerCase()}:</div>
                                                <div>
                                                    {formatNumber(cf.montant)+" FG"+(cf.frequence==="MENSUELLE"?"/mois":cf.frequence==="HORAIRE"?"/heure":"")}
                                                </div>
                                            </div>
                                        }
                                        <div>
                                            <div className="font-bold">Date de debut:</div>
                                            <div>
                                                {personnelSt?.contrat_en_cours?.dateDebut}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">Annee scolaire:</div>
                                            <div>
                                                {cf?.annee_scolaire.dateDebut.split("-")[0]+"/"+cf?.annee_scolaire.dateFin.split("-")[0]}
                                            </div>
                                        </div>


                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        ) )
                    }
                </div>

                {
                    tabEnseignant?.length>0 &&
                    <div>
                        <Accordion defaultExpanded={true}>
                            <AccordionSummary
                                expandIcon={<button type={'button'} className="orangeOrangeBackground text-white p-2 rounded-full">
                                    <ExpandMoreIcon />
                                </button>}
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
                }

            </div>
        </AdminPanel>
    );
}

export default Show;
