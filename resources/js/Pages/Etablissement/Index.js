import React from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import SnackBar from "@/Components/SnackBar";

function Index({auth,error,etablissement,nombreInscrit}) {
    return (
        <AdminPanel auth={auth} error={error} active={"vue"}>
            <div className={"grid grid-cols-1 m-5"}>
                <div className={"bg-orange-400 text-white p-5 rounded transform hover:bg-orange-500 transition duration-500 hover:cursor-pointer"}>
                    <div className={"p-2 flex flex-col"}>
                       <span>
                            <span className={"font-bold"}>ETABLISSEMENT:</span> {etablissement.nom}
                       </span>
                        <span>
                            <span className={"font-bold"}>CODE:</span> {etablissement.code}
                        </span>
                        {
                            etablissement.annee_en_cours &&
                            <span>
                                <span className={"font-bold"}>Annee Scolaire: </span> {etablissement.annee_en_cours.dateDebut+"/"+etablissement.annee_en_cours.dateFin}
                            </span>
                        }
                        <span>
                            <span className={"font-bold"}>Nombre de classe: </span> {etablissement.niveaux_count}
                       </span>
                        <span>
                            <span className={"font-bold"}>Nombre d'apprenants inscrits: </span> {nombreInscrit}
                       </span>
                    </div>
                </div>
            </div>

            <SnackBar error={error}/>
        </AdminPanel>
    );
}

export default Index;
