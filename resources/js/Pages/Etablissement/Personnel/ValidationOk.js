import React from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";

function ValidationOk({auth,error}) {
    return (
        <AdminPanel auth={auth} error={error} active={"salaire"} sousActive={"validationSalaire"}>
           <div className="space-y-4 p-5">
               <div className={"text-blue-600"}>
                   Paiement des salaires effectués avec succès
               </div>

               <div>
                   <button onClick={()=>Inertia.get(route("etablissement.personnel.paiement.historique",auth.user.id))} className={"my-4 p-2 text-white bg-green-700 rounded hover:text-green-700 hover:bg-white transition duration-500"}>
                       Consulter l'historique
                   </button>
               </div>
           </div>
        </AdminPanel>

        );
}

export default ValidationOk;
