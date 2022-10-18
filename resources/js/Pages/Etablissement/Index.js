import React from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import SnackBar from "@/Components/SnackBar";
import {motion} from "framer-motion";

function Index({auth,error,etablissement,nombreInscrit}) {
    return (
        <AdminPanel auth={auth} error={error} active={"vue"}>
            <div className={"grid grid-cols-1 m-5"}>
                <motion.div
                    initial={{y:-10,opacity:0}}
                    animate={{y:0,opacity:1}}
                    transition={{
                        duration:0.3,
                        type:"spring",
                    }}
                    className={"bg-black text-white p-5 rounded transform hover:bg-gray-800 transition duration-500 hover:cursor-pointer"}>
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
                                <span className={"font-bold"}>Annee Scolaire: </span> {etablissement.annee_en_cours.dateDebut.split("-")[0]+"/"+etablissement.annee_en_cours.dateFin.split("-")[0]}
                            </span>
                        }
                        <span>
                            <span className={"font-bold"}>Nombre de classe: </span> {etablissement.classes_count}
                       </span>
                        <span>
                            <span className={"font-bold"}>Nombre d'apprenants inscrits: </span> {nombreInscrit}
                       </span>
                    </div>
                </motion.div>
            </div>
        </AdminPanel>
    );
}

export default Index;
