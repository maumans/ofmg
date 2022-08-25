import React from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import SnackBar from "@/Components/SnackBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {Inertia} from "@inertiajs/inertia";
import {motion} from "framer-motion";

function Index({auth,error,personnels,success}) {

    function handleFonctions(id)
    {
        Inertia.get(route("etablissement.personnel.show",[auth.user.id,id]))
    }

    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 70, flex: 1 },
        { field: 'prenom', headerName: 'PRENOM', minWidth: 130, flex: 1 },
        { field: 'nom', headerName: 'NOM', minWidth: 130, flex: 1 },
        { field: 'adresse', headerName: 'ADRESSE', minWidth: 130, flex: 1 },
        { field: 'telephone', headerName: 'TELEPHONE', minWidth: 130, flex: 1 },
        { field: 'action', headerName: 'ACTION',minWidth: 300, flex: 1,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleFonctions(cellValues.row.id)} className={"p-2 text-white bg-blue-400 rounded hover:text-blue-400 hover:bg-white transition duration-500"}>
                        Details
                    </button>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white bg-blue-700 rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
                        <EditIcon/>
                    </button>
                    <button onClick={()=>handleDelete(cellValues.row.id)} className={`bg-red-500 p-2 text-white bg-red-700 rounded hover:text-red-700 hover:bg-white transition duration-500`}>
                        <DeleteIcon/>
                    </button>
                </div>
            )
        },

    ];

    function handleDelete(id){
        confirm("Voulez-vous supprimer cette personnel") && Inertia.delete(route("etablissement.personnel.destroy",[auth.user.id,id]),{preserveScroll:true})
    }

    function handleEdit(id){
        alert("EDIT"+id)
    }

    function handleShow(id){
        alert("SHOW"+id)
    }

    function handleSubmit(e)
    {
        e.preventDefault();
        Inertia.post(route("etablissement.personnel.store",auth.user.id),data,{preserveState:false})
    }

    return (
        <AdminPanel auth={auth} error={error} active={"personnel"} sousActive={"listePersonnel"}>
           <div className={"p-5"}>
               <div className="text-xl my-5 font-bold">
                   Liste du personnel
               </div>
               <motion.div
                   initial={{y:-100,opacity:0}}
                   animate={{y:0,opacity:1}}
                   transition={{
                       duration:0.5,
                       type:"spring",
                   }}

                   style={{height:450, width: '100%' }} className={"flex justify-center"}
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
                           pageSize={5}
                           rowsPerPageOptions={[5]}
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