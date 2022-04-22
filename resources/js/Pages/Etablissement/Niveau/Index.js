import React, {useEffect, useState} from 'react';
import {DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector} from '@mui/x-data-grid';
import {Autocomplete, FormControl, InputLabel, MenuItem, Modal, Pagination, Select, TextField} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SnackBar from "@/Components/SnackBar";

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

    const [niveaux,setNiveaux] = useState();

    const {data,setData,post}=useForm({
        "libelle":"",
        "description":"",
    });

    const {data:dataEdit,setData:setDataEdit}=useForm({
        "id":null,
        "libelle":"",
        "description":"",
    });

    const [open, setOpen] = React.useState(false);
    const handleOpen = (niveau) => {
        setDataEdit((dataEdit) => ({
            "id":niveau.id,
            "libelle":niveau.libelle,
            "description":niveau.description
        }))

        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'libelle', headerName: 'LIBELLE', width: 130, editable: true },
        { field: 'description', headerName: 'DESCRIPTION', width: 250, editable: true },
        { field: 'action', headerName: 'ACTION',width:400,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleShow(cellValues.row.id)} className={"p-2 text-white bg-blue-400 bg-blue-400 rounded hover:text-blue-400 hover:bg-white transition duration-500"}>
                        <VisibilityIcon/>
                    </button>
                    <button onClick={()=>handleOpen(cellValues.row)} className={"p-2 text-white bg-blue-700 rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
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
        confirm("Voulez-vous supprimer ce niveau") && Inertia.delete(route("etablissement.niveau.destroy",[props.auth.user.id,id]),{preserveScroll:true})
    }

    function handleEdit(e){
        e.preventDefault()
        Inertia.post(route("etablissement.niveau.update",[props.auth.user.id,dataEdit.id]),{_method: "put",dataEdit},{preserveState:false,preserveScroll:true})

    }

    function handleShow(id){
        Inertia.get(route("etablissement.niveau.show",[props.auth.user.id,id]))
    }

    function handleSubmit(e)
    {
        e.preventDefault();

        post(route("etablissement.niveau.store",props.auth.user.id),data)

    }

    useEffect(() => {
        setNiveaux(props.niveaux);
    },[props.niveaux]);

    function handleCellEditCommit(params) {

        console.log(params)

        setData(params.field,params.value);

        Inertia.post(route("etablissement.niveau.update",[props.auth.user.id,params.id]),{_method: "put",dataEdit})
    }

    return (
        <AdminPanel auth={props.auth} error={props.error} active={"niveau"}>
            <div className={"p-5"}>
                <div>
                    <div className={"my-5 text-2xl text-white bg-orange-400 rounded text-white p-2"}>
                        Gestions des niveaux
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5 p-2 border rounded"}>
                        <div className={"text-lg font-bold mb-5"}>
                            Ajouter un niveau
                        </div>
                        <div className={"gap-4 grid md:grid-cols-3 grid-cols-1 items-center"}>
                            <div className={"w-full"}>
                                <TextField className={"w-full"}  name={"libelle"} label={"libelle"} value={data.libelle} onChange={(e)=>setData("libelle",e.target.value)}/>
                                <div className={"flex text-red-600"}>{props.errors?.libelle}</div>
                            </div>
                            <div className={"w-full"}>
                                <TextField className={"w-full"}  name={"description"} label={"description"} value={data.description} onChange={(e)=>setData("description",e.target.value)}/>
                                <div className={"flex text-red-600"}>{props.errors?.description}</div>
                            </div>
                            <div>
                                <button className={"p-3 text-white bg-green-600 rounded"} type={"submit"}>
                                    Enregister
                                </button>
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
                                    Modifier un niveau
                                </div>
                                <div className={"gap-4 grid md:grid-cols-3 grid-cols-1 items-center"}>
                                    <div className={"w-full"}>
                                        <TextField className={"w-full"}  name={"libelle"} label={"libelle"} value={dataEdit.libelle} onChange={(e)=>setDataEdit("libelle",e.target.value)}/>
                                        <div className={"flex text-red-600"}>{props.errors?.libelle}</div>
                                    </div>
                                    <div className={"w-full"}>
                                        <TextField className={"w-full"}  name={"description"} label={"description"} value={dataEdit.description} onChange={(e)=>setDataEdit("description",e.target.value)}/>
                                        <div className={"flex text-red-600"}>{props.errors?.description}</div>
                                    </div>
                                    <div>
                                        <button className={"p-3 text-white bg-green-600 rounded"} type={"submit"}>
                                            Enregister
                                        </button>
                                    </div>
                                </div>

                            </form>
                        </Box>
                    </Modal>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            niveaux &&
                            <DataGrid
                                componentsProps={{
                                    columnMenu:{backgroundColor:"red",background:"yellow"},
                                }}
                                rows={niveaux}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                checkboxSelection
                                autoHeight
                                onCellEditCommit={handleCellEditCommit}
                            />
                        }
                    </div>

                    <SnackBar success={ props.success }/>
                </div>
            </div>
        </AdminPanel>
    );
}

export default Index;
