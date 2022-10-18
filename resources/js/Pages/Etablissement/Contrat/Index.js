import React, {useEffect, useState} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {AnimatePresence, motion} from "framer-motion";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SnackBar from "@/Components/SnackBar";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import formatNumber from "@/Utils/formatNumber";

function Index({auth,error,users,success}) {

    const [userInfos,setUserInfos] =useState(0);
    const [userContrat,setUserContrat] =useState(null);

    const [successSt,setSuccessSt] = useState();

    function handleShow(user) {
        setUserContrat(user)

    }

    function handleFin(user) {
        confirm("Voulez-vous mettre à cette fonction") && alert("Retirer")

    }

    const columns = [
        { field: 'Nom_complet', headerName: "NOM COMPLET",headerClassName:"header", flex: 1, minWidth: 300, fontWeight:"bold", renderCell:(cellValues)=>(
                cellValues.row.prenom+" "+cellValues.row.nom
            ) },
        /*
        { field: 'fonction', headerName: "FONCTION", flex: 1, minWidth: 150,  renderCell:(cellValues)=>(
                cellValues.row.contrat_fonctions[0].fonction?.libelle
            )},
        { field: 'Debut', headerName: "Debut de fonction", flex: 1, minWidth: 250,  renderCell:(cellValues)=>(
                cellValues.row?.dateDebut
            ) },
        { field: 'anneeScolaire', headerName: "Année Scolaire", flex: 1, minWidth: 150, renderCell:(cellValues)=>(
                cellValues.row.annee_scolaire && cellValues.row.annee_scolaire?.dateDebut.split("-")[0]+"/"+cellValues.row.annee_scolaire?.dateFin.split("-")[0]
            ) },

         */
        { field: 'action', headerName: 'ACTION',minWidth:130,flex:1,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleShow(cellValues.row)} className={"p-2 text-white orangeBlueBackground orangeBlueBackground rounded hover:text-blue-400 hover:bg-white transition duration-500"}>
                        Contrats <VisibilityIcon/>
                    </button>
                </div>
            )
        },

    ];

    function columnsContratFunct(contrat)
    {
        const columnsContrat = [
            { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },

            { field: 'fonction', headerName: "FONCTION", flex: 1, minWidth: 150,  renderCell:(cellValues)=>(
                    cellValues.row.fonction?.libelle
                )},

            { field: 'matiere', headerName: "MATIERE", flex: 1, minWidth: 150, renderCell:(cellValues)=>(
                    cellValues.row.cours?.matiere?.libelle
                )},
            { field: 'classe', headerName: "CLASSE", flex: 2, minWidth: 150, renderCell:(cellValues)=>(
                    cellValues.row.cours?.classe?.libelle
                )},
            { field: 'Debut', headerName: "Debut de fonction", flex: 1, minWidth: 250,  renderCell:(cellValues)=>(
                    contrat.dateDebut
                ) },
            { field: 'Montant', headerName: "MONTANT", flex: 1, minWidth: 250,  renderCell:(cellValues)=>(
                    cellValues.row?.montant && formatNumber(cellValues.row?.montant)+" FG/"+(cellValues.row?.frequence==="MENSUELLE"?"mois":cellValues.row?.frequence==="HORAIRE"?"heure":"")
                ) },

            { field: 'anneeScolaire', headerName: "Année Scolaire", flex: 1, minWidth: 150, renderCell:(cellValues)=>(
                    cellValues.row.annee_scolaire && cellValues.row.annee_scolaire?.dateDebut.split("-")[0]+"/"+cellValues.row.annee_scolaire?.dateFin.split("-")[0]
                ) },
            { field: 'action', headerName: 'ACTION',minWidth:200,flex:1,
                renderCell:(cellValues)=>(
                    <div className={"space-x-2"}>
                        <button onClick={()=>handleFin(cellValues.row)} className={"p-2 text-white bg-red-400 bg-red-400 rounded hover:text-blue-400 hover:bg-white transition duration-500"}>
                            Fin de la fonction
                        </button>
                    </div>
                )
            },

        ];
        return columnsContrat
    }



    return (
        <AdminPanel auth={auth} error={error} active={"contrat"} sousActive={"listeContrat"}>
            {
                userContrat ?
                    <div className={"p-5"}>
                        <div className={"my-5 text-2xl text-white orangeOrangeBackground rounded text-white p-2"}>
                            Gestion des contrats
                        </div>
                        <div className={"text-2xl p-3 rounded bg-black text-white mb-5"} style={{width:"fit-content"}}>
                            {userContrat.prenom} {userContrat.nom}
                        </div>
                        <div className={"text-lg font-bold mb-5"}>
                            Liste des fonctions par contrat
                        </div>


                        <AnimatePresence>
                            {
                                <motion.div
                                    initial={{x:-10,opacity:0}}
                                    animate={{x:0,opacity:1}}
                                    transition={{
                                        duration:0.5,
                                    }}
                                    className={"mt-5"}
                                >
                                    {
                                        userContrat?.contrats?.map(contrat=>(
                                            <div className={"my-5"} key={contrat.id}>
                                                <div className="my-5 font-bold">
                                                    Contrat N° {contrat.id}
                                                </div>
                                                <DataGrid

                                                    components={{
                                                        Toolbar:GridToolbar,
                                                    }}
                                                    rows={contrat?contrat?.contrat_fonctions:[]}
                                                    columns={columnsContratFunct(contrat)}
                                                    pageSize={5}
                                                    rowsPerPageOptions={[5]}
                                                    autoHeight
                                                />
                                            </div>
                                        ))
                                    }

                                    <button onClick={()=>setUserContrat(null)} className={"p-2 text-white orangeBlueBackground orangeBlueBackground rounded hover:text-blue-400 hover:bg-white transition duration-500 mt-5"}>
                                        <ArrowBackIosIcon></ArrowBackIosIcon> retour
                                    </button>
                                </motion.div>
                            }
                        </AnimatePresence>
                    </div>
                    :
                    <div className={"p-5"}>
                        <div className={"my-5 text-2xl text-white orangeOrangeBackground rounded text-white p-2"}>
                            Gestion des contrats
                        </div>
                        <div className={"text-lg font-bold mb-5"}>
                            Liste du personnel
                        </div>

                        <AnimatePresence>
                            {
                                <motion.div
                                    initial={{y:-10,opacity:0}}
                                    animate={{y:0,opacity:1}}
                                    transition={{
                                        duration:0.5,
                                    }}
                                >
                                    <DataGrid

                                        components={{
                                            Toolbar:GridToolbar,
                                        }}
                                        rows={users}
                                        columns={columns}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        autoHeight
                                    />
                                </motion.div>
                            }
                        </AnimatePresence>

                        <SnackBar success={successSt}/>

                    </div>
            }


        </AdminPanel>
    );
}

export default Index;
