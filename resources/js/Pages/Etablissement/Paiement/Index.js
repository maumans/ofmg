import React, {useEffect, useState} from 'react';
import {motion} from "framer-motion";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AdminPanel from "@/Layouts/AdminPanel";
import SnackBar from "@/Components/SnackBar";

function Index({auth,error,paiements,success}) {

    function handleShow(id) {
        return undefined;
    }

    const [successSt,setSuccessSt] = useState();

    useEffect(() => {
        success && setSuccessSt(success);
    },[])

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'Nom_complet', headerName: "NOM COMPLET DE L'APPRENANT",headerClassName:"header", flex: 1, minWidth: 300, fontWeight:"bold", renderCell:(cellValues)=>(
                cellValues.row.apprenant.prenom+" "+cellValues.row.apprenant.nom
            ) },
        { field: 'type_paiement', headerName: "TYPE DE FRAIS", flex: 1, minWidth: 150,  renderCell:(cellValues)=>(
                cellValues.row.type_paiement?.libelle
            ) },
        { field: 'mode_paiement', headerName: "MODE DE PAIEMENT", flex: 1, minWidth: 250,  renderCell:(cellValues)=>(
                cellValues.row.mode_paiement?.libelle
            ) },
        { field: 'created_at', headerName: "DATE", flex: 1, minWidth: 150, renderCell:(cellValues)=>(
                cellValues.row.created_at.split("T")[0]
            ) },
        { field: 'action', headerName: 'ACTION',width:100,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleShow(cellValues.row.id)} className={"p-2 text-white bg-blue-400 bg-blue-400 rounded hover:text-blue-400 hover:bg-white transition duration-500"}>
                        <VisibilityIcon/>
                    </button>
                </div>
            )
        },

    ];
    return (
        <AdminPanel auth={auth} error={error} active={"paiement"}>
           <div className={"p-5"}>
               <div className="text-xl my-5 font-bold">
                   Liste des paiements
               </div>
               <div>
                   {
                       <motion.div
                           initial={{y:-10,opacity:0}}
                           animate={{y:0,opacity:1}}
                           transition={{
                               duration:0.5,
                           }}
                           style={{height:450, width: '100%' }}>
                           <DataGrid
                               rows={paiements}
                               columns={columns}
                               pageSize={5}
                               rowsPerPageOptions={[5]}
                               autoHeight
                           />
                       </motion.div>
                   }
               </div>
           </div>
            <SnackBar success={successSt}/>
        </AdminPanel>
    );
}

export default Index;
