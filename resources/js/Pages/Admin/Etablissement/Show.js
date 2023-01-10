import React, {useEffect} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import formatNumber from "@/Utils/formatNumber";
import {format} from "date-fns";

function Show(props) {

    const columns = [
        { field: 'date', headerName: 'DATE ', width: 150,renderCell:(cellValues)=>(
            <div>
                format(new Date(cellValues.row.created_at), 'dd/MM/yyyy')
            </div>
            ) },
        { field: 'matricule', headerName: 'MATRICULE', width: 200,renderCell:(cellValues)=>(
                <div>
                    {cellValues.row.apprenant.matricule}
                </div>
            ) },
        { field: 'classe', headerName: 'CLASSE', minWidth: 400,flex:1,renderCell:(cellValues)=>(
                <div>
                    {cellValues.row.apprenant.classe.libelle}
                </div>
            ) },

        { field: 'montant', headerName: 'MONTANT', width: 200,renderCell:(cellValues)=>(
                <div>
                    {formatNumber(cellValues.row.montant)+" FG"}
                </div>
            ) },
        { field: 'typeFrais', headerName: 'TYPE DE FRAIS', width: 200,renderCell:(cellValues)=>(
                <div>
                    {cellValues.row.type_paiement?.libelle}
                </div>
            ) },
        { field: 'modePaiement', headerName: 'MODE DE PAIEMENT', width: 200,renderCell:(cellValues)=>(
                <div>
                    {cellValues.row.mode_paiement?.libelle}
                </div>
            ) },
        { field: 'numeroRetrait', headerName: 'NUMERO RETRAIT', width: 200,renderCell:(cellValues)=>(
                <div>
                    {cellValues.row.numero_retrait}
                </div>
            ) },
        { field: 'numeroDepot', headerName: 'NUMERO DEPOT', width: 200,renderCell:(cellValues)=>(
                <div>
                    {cellValues.row.numero_depot}
                </div>
            ) },
    ]

    return (
        <AdminPanel auth={props.auth} error={props.error} active={"etablissement"}>
            <div className={"p-5"}>
                <div className={"p-3 orangeOrangeBackground text-white mb-5"}>
                    Information de l'etablissement {props.etablissement.nom}
                </div>
                <div className={"grid md:grid-cols-2 grid-cols-1 gap-5"}>
                    <div>
                        <span className={"font-bold"}>Nom:</span> {props.etablissement.nom}
                    </div>
                    <div>
                        <span className={"font-bold"}>Code: </span>
                         {props.etablissement.code}
                    </div>
                    <div>
                        <span className={"font-bold"}>Type: </span>
                         {props.etablissement.type_etablissement.libelle}
                    </div>
                    <div>
                        <span className={"font-bold"}>Numero de telephone: </span>
                        {props.etablissement.telephone}
                    </div>
                    <div>
                        <span className={"font-bold"}>Ville: </span>
                        {props.etablissement.ville.libelle}
                    </div>
                    <div>
                        <span className={"font-bold"}>Commune: </span>
                        {props.etablissement.commune.libelle}
                    </div>
                    <div>
                        <span className={"font-bold md:col-span-2"}>Annee scolaire encours: </span>
                        {
                            props.etablissement.annee_en_cours ?
                                props.etablissement.annee_en_cours.dateDebut+"/"+props.etablissement.annee_en_cours.dateDebut
                                :
                                "aucune"
                        }
                    </div>

                    <div>
                        <span className={"font-bold md:col-span-2"}>Date de creation: </span>
                        {
                                props.etablissement.created_at.split("T")[0]
                        }
                    </div>

                    <div className={"col-span-2"}>
                        <div className={"my-3 text-xl font-bold"}>
                            Historique des paiements
                        </div>
                        {
                            props.etablissement.paiements &&
                            <DataGrid
                                components={{
                                    Toolbar:GridToolbar,
                                }}
                                rows={props.etablissement.paiements}
                                columns={columns}
                               initialState={{
                                        pagination: {
                                            pageSize: 10,
                                        },
                                    }}
                                rowsPerPageOptions={[10]}
                                autoHeight
                            />
                        }
                    </div>

                </div>

            </div>
        </AdminPanel>
    );
}

export default Show;
