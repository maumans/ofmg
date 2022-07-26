import React from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import Authenticated from "@/Layouts/Authenticated";
import {motion} from "framer-motion";

function Create({auth,error,etablissement}) {
    return (
        <AdminPanel auth={auth} error={error} active={"vue"}>

            <motion.div
                initial={{y:-100,opacity:0}}
                animate={{y:0,opacity:1}}
                transition={{
                    duration:0.5,
                    type:"spring",
                }}

                className={"m-5 bg-white space-y-5"}>
                <div className={"p-2 flex flex-col"}>
                   <span>
                        <span className={"font-bold"}>Etablissement:</span> {etablissement.nom}
                   </span>
                    <span>
                        <span className={"font-bold"}>Code de l'etablissement:</span> {etablissement.code}
                    </span>
                </div>

                <div className={"p-2 flex flex-col"}>
                   <span>
                        <span className={"font-bold"}>Nombre de classe: </span> {etablissement.niveaux_count}
                   </span>
                </div>
                <div className={"grid grid-col"}>

                </div>
            </motion.div>

        </AdminPanel>
    );
}

export default Create;
