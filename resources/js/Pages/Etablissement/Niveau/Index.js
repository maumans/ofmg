import React, {useEffect, useState} from 'react';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    GridToolbar,
    useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';
import {
    Autocomplete, Button,
    Dialog, DialogActions, DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    TextField
} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SnackBar from "@/Components/SnackBar";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import DialogContentText from "@mui/material/DialogContentText";

function Index(props) {

    const [niveaux,setNiveaux] = useState();

    const {data,setData,post,reset}=useForm({
        "libelle":"",
        "cycle":"",
        "libelleEdit":"",
        "editId":""
    });

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'libelle', headerName: 'NIVEAU', width: 250 },
        { field: 'cycle', headerName: 'CYCLE', width: 250,renderCell:(r)=>r.row.cycle?.libelle },
        { field: 'action', headerName: 'ACTION',width:250,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleEdit(cellValues.row)} className={"p-2 text-white orangeBlueBackground rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
                        <EditIcon/>
                    </button>
                    <button onClick={()=>handleDelete(cellValues.row.id)} className={`bg-red-500 p-2 text-white bg-red-700 rounded hover:text-red-700 hover:bg-white transition duration-500`}>
                        <DeleteIcon/>
                    </button>
                </div>
            )
        },

    ];

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    function handleDelete(id){
        confirm("Voulez-vous supprimer ce niveau") && Inertia.delete(route("etablissement.niveau.destroy",[props.auth.user.id,id]),{preserveScroll:true})
    }

    function handleEdit(row){
        setOpen(true);
        setData(data=>({
            ...data,
            editId:row.id,
            libelleEdit:row.libelle
        }))
    }

    function handleSubmitEdit(){
        Inertia.put(route("etablissement.niveau.update",[props.auth.user.id,data.editId]),data,{preserveScroll:true});
        setOpen(false)
    }


    function handleSubmit(e)
    {
        e.preventDefault();

        post(route("etablissement.niveau.store",props.auth.user.id),{data,onSuccess: ()=>reset("libelle")})

    }

    useEffect(() => {
        setNiveaux(props.niveaux);
    },[props.niveaux])

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
        <AdminPanel auth={props.auth} error={props.error} sousActive={"niveau"} active={"paramètrage"}>
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl"}>
                        Gestion des niveaux
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5 "}>
                        <div className={"gap-4 grid md:grid-cols-3 grid-cols-1"}>
                            <div>
                                <TextField  name={"libelle"} label={"libelle"} value={data.libelle} onChange={(e)=>setData("libelle",e.target.value.toUpperCase())} required/>
                                <div className={"flex text-red-600"}>{props.errors?.libelle}</div>
                            </div>
                            <div>
                                <FormControl className={"w-full"}>
                                    <Autocomplete
                                        className={"w-full"}
                                        onChange={(e,val)=>setData("cycle",val)}
                                        disablePortal={true}
                                        id={"combo-box-demo"}
                                        options={props.cycles}
                                        getOptionLabel={(option)=>option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"cycles"} label={params.libelle} required/>}
                                    />
                                </FormControl>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.cycle}</div>
                            </div>
                            <div className={"col-span-3"}>
                                <button className={"p-2 text-white orangeVertBackground rounded hover:text-green-600 hover:bg-white hover:border hover:border-green-600 transition duration-500"} style={{height: 56}} type={"submit"}>
                                    Valider
                                </button>
                            </div>
                        </div>

                    </form>

                    <div style={{width: '100%' }} className={"flex justify-center"}>
                        {
                            niveaux &&
                            <DataGrid
                                components={{
                                    Toolbar:GridToolbar,
                                }}
                                rows={niveaux}
                                columns={columns}
                               initialState={{
                                        pagination: {
                                            pageSize: 10,
                                        },
                                    }}
                                rowsPerPageOptions={[10]}
                                autoHeight
                            />
                        }
                    </div>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Modification</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Modification du libelle de la commune
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                type="text"
                                fullWidth
                                variant={"standard"}
                                name={"libelleEdit"}
                                label={"libelle"}
                                value={data.libelleEdit}
                                onChange={(e)=>setData("libelleEdit",e.target.value.toUpperCase())}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Annuler</Button>
                            <Button onClick={handleSubmitEdit}>Enregistrer</Button>
                        </DialogActions>
                    </Dialog>

                    <SnackBar error={error} update={update} success={success} />                </div>
            </div>
        </AdminPanel>
    );
}

export default Index;
