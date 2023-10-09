import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    GridToolbar,
    useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';
import {
    Autocomplete,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Pagination,
    Select,
    TextField,
    Tooltip
} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SnackBar from "@/Components/SnackBar";
import Box from "@mui/material/Box";
import {motion} from "framer-motion";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    bgcolor: 'background.paper',
    borderRadius:2,
    boxShadow: 24,
    p: 4,
};

function Index(props) {

    const [anneeScolaires,setAnneeScolaires] = useState();

    const [open, setOpen] = React.useState(false);

    const {data:dataEdit,setData:setDataEdit}=useForm({
        dateDebutEdit:"",
        dateFinEdit:"",
    });
    const handleOpen = (anneeScolaire) => {
        setDataEdit((dataEdit) => ({
            id:anneeScolaire.id,
           dateDebutEdit:anneeScolaire.dateDebut,
           dateFinEdit:anneeScolaire.dateFin,
        }))

        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    useLayoutEffect(() => {

        props.success && setData(data=>({
            "dateDebut":null,
            "dateFin":null,
            })
        )
    },[props.success])

    const {data,setData,post}=useForm({
        "dateDebut":"",
        "dateFin":"",
    });

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'dateDebut', headerName: 'DATE DE DEBUT', width: 200 },
        { field: 'dateFin', headerName: 'DATE DE FIN', width: 200 },
        { field: 'action', headerName: 'ACTION',width:250,
            renderCell:(cellValues)=>(
               cellValues.row.actif ?
               <div className={"space-x-2"}>
                   <button onClick={()=>handleOpen(cellValues.row)} className={"p-2 text-white orangeBlueBackground rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
                       <EditIcon/>
                   </button>
               </div>
                   :''
            )
        },

    ];

    function handleDelete(id){
        confirm("Voulez-vous supprimer cette anné scolaire") && Inertia.delete(route("etablissement.anneeScolaire.destroy",[props.auth.user.id,id]),{preserveScroll:true})
    }

    function handleEdit(e){
        e.preventDefault()
        Inertia.post(route("etablissement.anneeScolaire.update",[props.auth.user.id,dataEdit.id]),{_method: "put",dataEdit},{preserveScroll:true})
    }

    function handleShow(id){
        alert("SHOW"+id)
    }

    function handleSubmit(e)
    {
        e.preventDefault();

        post(route("etablissement.anneeScolaire.store",props.auth.user.id),data)

    }

    useEffect(() => {
        setAnneeScolaires(props.anneeScolaires);
    },[props.anneeScolaires]);

    function handleCloture()
    {
        confirm("Voulez-vous vraiment cloturer l'année encours?") && Inertia.get(route("etablissement.anneeScolaire.cloture"));
    }

    ////// SnackBar

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)



    useEffect(() => {
        setError(props.error)
    },[props])

    useEffect(() => {
        setSuccess(props.success)
    },[props])

    function update()
    {
        error && setError(null)
        success && setSuccess(null)
    }


    return (
        <AdminPanel auth={props.auth} error={props.error} active={"anneeScolaire"}>
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl text-white orangeOrangeBackground rounded text-white p-2"}>
                        Gestion des années scolaires
                    </div>

                    <div className={"border p-5 rounded space-y-5 text-lg"}>
                         {props.anneeEnCours ? <span><span className={"font-bold text-lg"}>Année scolaire encours:</span> {props.anneeEnCours?.dateDebut+"/"+props.anneeEnCours?.dateFin} </span> : <span className={"text-blue-500"}>Aucune année scolaire encours!!! Veuillez demarrer une nouvelle année</span>  }
                        {
                            props.anneeEnCours &&
                            <button className={"bg-red-600 text-white rounded p-2 hover:bg-white hover:text-red-600 border hover:border-red-600 transition duration-500"} onClick={handleCloture}>
                                Cloturer l'année scolaire encours
                            </button>
                        }
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5"}>
                        <div className={"border p-5 rounded space-y-5"}>
                            <div className={"text-lg font-bold"}>
                                Démarrer une année scolaire {!props.anneeEnCoursFinie && <span className={'text-red-600 font-normal text-sm'}>(veuillez cloturer l'année scolaire encours)</span>}
                            </div>
                            <div className={"grid md:grid-cols-2 grid-cols-1 gap-4"} style={{maxWidth: 600}}>
                                <div>
                                    <div>Date de debut</div>
                                    <TextField
                                        disabled={!props.anneeEnCoursFinie}
                                        className={"w-full"}
                                        inputProps={{
                                            type:"date",
                                        }}  name={"dateDebut"} onChange={(e)=>setData("dateDebut",e.target.value)}/>
                                    <div className={"flex my-2 text-red-600"}>{props.errors?.dateDebut}</div>
                                </div>
                                <div>
                                    <div>Date de fin</div>
                                    <TextField
                                        disabled={!props.anneeEnCoursFinie}
                                        className={"w-full"}
                                        inputProps={{
                                            type:"date",
                                        }}
                                        name={"dateFin"} onChange={(e)=>setData("dateFin",e.target.value)}/>
                                    <div className={"flex my-2 text-red-600"}>{props.errors?.dateFin}</div>
                                </div>
                                <div>
                                    {
                                        !props.anneeEnCoursFinie ?
                                        <Tooltip title="Veuilez cloturer l'année scolaire encours">
                                            <button style={{height: 56}} className={"p-3 text-white bg-gray-600 rounded"} type={"button"}>
                                                Enregistrer
                                            </button>
                                        </Tooltip>
                                        :
                                        <button style={{height: 56}} className={"p-3 text-white orangeVertBackground rounded"} type={"submit"}>
                                            Enregistrer
                                        </button>
                                    }
                                </div>

                            </div>
                        </div>



                    </form>



                    <Modal
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                    >
                        <Box sx={style}>
                            <form action="" onSubmit={handleEdit} className={"space-y-5 my-5 p-2 border rounded"}>
                                <div className={"text-lg font-bold mb-5"}>
                                    Modifier une anneee scolaire
                                </div>
                                <div className={"flex flex-wrap gap-4"}>
                                    <div className={"w-full"}>
                                        <div>Date de debut</div>
                                        <TextField className={"w-full"}
                                            value={dataEdit.dateDebutEdit}
                                               inputProps={{
                                                   type:"date",
                                                   //min:props.aujourdhui
                                               }}
                                               name={"dateDebutEdit"} onChange={(e)=>setDataEdit("dateDebutEdit",e.target.value)}/>
                                        <div className={"flex my-2 text-red-600"}>{props.errors["dataEdit.dateDebutEdit"] && props.errors["dataEdit.dateDebutEdit"]}</div>
                                    </div>
                                    <div className={"w-full"}>
                                        <div>Date de fin</div>
                                        <TextField
                                            className={"w-full"}
                                            value={dataEdit.dateFinEdit}
                                            inputProps={{
                                                type:"date",
                                                //min:props.aujourdhui
                                            }}
                                            name={"dateFinEdit"} onChange={(e)=>setDataEdit("dateFinEdit",e.target.value)}/>
                                        <div className={"flex my-2 text-red-600"}>{props.errors["dataEdit.dateFinEdit"] && props.errors["dataEdit.dateFinEdit"]}</div>
                                    </div>
                                </div>

                                <div>
                                    {
                                        0 ?
                                            <Tooltip title="Impossible d'ajouter une année scolaire avant la fin de celle encours">
                                                <button style={{height: 56}} className={"p-3 text-white bg-gray-600 rounded"} type={"button"}>
                                                    Enregistrer
                                                </button>
                                            </Tooltip>
                                            :
                                            <button style={{height: 56}} className={"p-3 text-white orangeVertBackground rounded"} type={"submit"}>
                                                Enregistrer
                                            </button>
                                    }
                                </div>

                            </form>
                        </Box>
                    </Modal>


                    <motion.div
                        initial={{y:-100,opacity:0}}
                        animate={{y:0,opacity:1}}
                        transition={{
                            duration:0.5,
                            type:"spring",
                        }}
                        style={{width: '100%' }} className={"flex justify-center"}>
                        {
                            anneeScolaires &&
                            <DataGrid components={{
                                    Toolbar:GridToolbar,
                                }}
                                componentsProps={{
                                    columnMenu:{backgroundColor:"red",background:"yellow"},
                                }}
                                rows={anneeScolaires}
                                columns={columns}
                               initialState={{
                                        pagination: {
                                            pageSize: 10,
                                        },
                                    }}
                                rowsPerPageOptions={[10,20,100]}
                                autoHeight
                                pa
                            />
                        }
                    </motion.div>
                    <SnackBar error={error} update={update} success={success} />                </div>
            </div>
        </AdminPanel>
    );
}

export default Index;
