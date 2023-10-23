import React from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import SnackBar from "@/Components/SnackBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {Inertia} from "@inertiajs/inertia";
import {motion} from "framer-motion";
import ListAltIcon from "@mui/icons-material/ListAlt";
import {AlarmAdd, AlarmOn, Block, Check, HourglassFull} from "@mui/icons-material";
import MuiConfirmDialogDelete from "@/Components/MuiConfirmDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {Button} from "@mui/material";

function Index({auth,error,personnels,success}) {

    function handleFonctions(id)
    {
        Inertia.get(route("etablissement.personnel.show",[auth.user.id,id]))
    }

    function handleHoraire(id)
    {
        Inertia.get(route("etablissement.personnel.horaire.show",[auth.user.id,id]))
    }

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'prenom', headerName: 'PRENOM', minWidth: 130, flex: 1 },
        { field: 'nom', headerName: 'NOM', minWidth: 130, flex: 1 },
        { field: 'adresse', headerName: 'ADRESSE', minWidth: 130, flex: 1 },
        { field: 'telephone', headerName: 'TELEPHONE', minWidth: 130, flex: 1 },
        { field: 'action', headerName: 'ACTION',minWidth: 5500, flex: 1,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>

                    <button onClick={()=>handleShow(cellValues.row)} className={"p-2 text-white orangeBlueBackground orangeBlueBackground rounded hover:text-blue-400 hover:bg-white transition duration-500"}>
                        Contrats <VisibilityIcon/>
                    </button>
                    <button onClick={()=>handleHoraire(cellValues.row.id)} className={"p-2 text-white orangeBlueBackground rounded hover:text-blue-400 hover:bg-white transition duration-500"}>
                        Ajout horaire <AlarmAdd/>
                    </button>
                    <button onClick={()=>handleFonctions(cellValues.row.id)} className={"p-2 text-white orangeVioletBackground rounded hover:text-blue-400 hover:bg-white transition duration-500"}>
                        <ListAltIcon/>
                    </button>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white orangeBlueBackground rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
                        <EditIcon/>
                    </button>

                    {
                        cellValues.row.status==="Actif" ?
                            <MuiConfirmDialogDelete icon={<><Block/> Bloquer</>} classDelete={`p-2 text-white bg-red-700 rounded hover:text-red-700 hover:bg-white transition duration-500`} message={"Voulez-vous bloquer cet utilisateur?"} handleAction={()=>handleDelete(cellValues.row.id)} />
                            :
                            <MuiConfirmDialogDelete icon={<><Check/> Débloquer</>} classDelete={`p-2 text-white bg-green-700 rounded hover:text-green-700 hover:bg-white transition duration-500`} message={"Voulez-vous debloquer cet utilisateur?"} handleAction={()=>handleDelete(cellValues.row.id)} />

                    }
                </div>
            )
        },

    ];

    function handleDelete(id){
        Inertia.delete(route("etablissement.personnel.destroy",[auth.user.id,id]),{preserveScroll:true})
    }

    function handleEdit(id){
        Inertia.get(route("etablissement.personnel.edit",[auth.user.id,id]))
    }

    function handleShow(id){
        Inertia.get(route("etablissement.personnel.contrat.index",[auth.user.id,id]))
    }

    function handleSubmit(e)
    {
        e.preventDefault();
        Inertia.post(route("etablissement.personnel.store",auth.user.id),data,{preserveState:false})
    }

    return (
        <AdminPanel auth={auth} error={error} active={"gestionPersonnel"} /*sousActive={"listePersonnel"}*/>
           <div className={"p-5"}>

               <div className={"my-5 text-2xl text-white orangeOrangeBackground rounded text-white p-2"}>
                   Gestion du personnel
               </div>
               <div className={'flex justify-end my-5'}>
                   <div>
                       <Button color={'success'} variant={"contained"} onClick={()=>Inertia.get(route("etablissement.contrat.create",auth.user.id))} >
                           Ajouter un employé
                       </Button>
                   </div>
               </div>
               <motion.div
                   initial={{y:-100,opacity:0}}
                   animate={{y:0,opacity:1}}
                   transition={{
                       duration:0.5,
                       type:"spring",
                   }}

                   style={{width: '100%' }} className={"flex justify-center"}
               >
                   {
                       personnels &&
                       <DataGrid

                           components={{
                               Toolbar:GridToolbar,
                           }}

                           componentsProps={{
                               columnMenu:{backgroundColor:"red",background:"yellow"},
                           }}
                           rows={personnels}
                           columns={columns}
                           pageSize={10}
                           rowsPerPageOptions={[10,30,100]}
                           autoHeight
                       />
                   }
               </motion.div>
               <SnackBar success={success}/>
           </div>
        </AdminPanel>
    );
}

export default Index;
