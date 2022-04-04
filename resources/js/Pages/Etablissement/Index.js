import React from 'react';
import AdminPanel from "@/Layouts/AdminPanel";

function Index({auth,error,etablissement}) {
    return (
        <AdminPanel auth={auth} error={error} active={"vue"}>
            <div className={"grid md:grid-cols-3 md:grid-cols-2 grid-cols-1 m-5 md:gap-5 sm:gap-3 gap-1"}>
                <div className={"bg-green-600 text-white p-5 rounded transform hover:bg-green-500 transition duration-500 hover:cursor-pointer"}>
                    <div className={"p-2 flex flex-col"}>
                       <span>
                            <span className={"font-bold"}>ETABLISSEMENT:</span> {etablissement.nom}
                       </span>
                        <span>
                            <span className={"font-bold"}>CODE:</span> {etablissement.code}
                        </span>
                        <span>
                            <span className={"font-bold"}>Nombre de classe: </span> {etablissement.niveaux_count}
                       </span>
                    </div>
                </div>

                <div className={"bg-pink-600 text-white p-5 rounded transform hover:bg-pink-500 transition duration-500 hover:cursor-pointer"}>
                    <div className={"p-2 flex flex-col"}>
                       <span>
                            <span className={"font-bold"}>ETABLISSEMENT:</span> {etablissement.nom}
                       </span>
                        <span>
                            <span className={"font-bold"}>CODE:</span> {etablissement.code}
                        </span>
                        <span>
                            <span className={"font-bold"}>Nombre de classe: </span> {etablissement.niveaux_count}
                       </span>
                    </div>
                </div>

                <div className={"bg-red-600 text-white p-5 rounded transform hover:bg-red-500 transition duration-500 hover:cursor-pointer"}>
                    <div className={"p-2 flex flex-col"}>
                       <span>
                            <span className={"font-bold"}>ETABLISSEMENT:</span> {etablissement.nom}
                       </span>
                        <span>
                            <span className={"font-bold"}>CODE:</span> {etablissement.code}
                        </span>
                        <span>
                            <span className={"font-bold"}>Nombre de classe: </span> {etablissement.niveaux_count}
                       </span>
                    </div>
                </div>
            </div>
        </AdminPanel>
    );
}

export default Index;
