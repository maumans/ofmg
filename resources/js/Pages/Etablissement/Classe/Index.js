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
    Autocomplete, Dialog, DialogContent,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Modal,
    Pagination,
    Select,
    TextField, Tooltip
} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SnackBar from "@/Components/SnackBar";

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

    const [classes,setClasses] = useState();
    const [options,setOptions] = useState();

    const {data,setData,post}=useForm({
        "libelle":null,
        "description":"",
        "niveau":null,
        "option":null,
        "departement":null,
        "code":""
    });

    useLayoutEffect(() => {
        props.success && setData(data=>({
            "libelle":null,
            "niveau":null,
            "option":null,
            "departement":null,
            "code":""
            })
        )
    },[props])

    const {data:dataEdit,setData:setDataEdit}=useForm({
        "id":null,
        "libelle":"",
        "description":"",
    });

    const [open, setOpen] = React.useState(false);
    const handleOpen = (classe) => {
        setDataEdit((dataEdit) => ({
            "id":classe.id,
            "code":classe.code ? classe.code : null,
            "libelle":classe.libelle,
            "niveau":classe.niveau,
            "departement":classe.departement,
            "option":classe.option,
        }))

        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'libelle', headerName: 'LIBELLE', minWidth: 400,flex:1 },
        { field: 'option', headerName: 'OPTION', minWidth: 300,flex:1,  renderCell:(cellValues)=>(
            cellValues.row.option?.libelle
            )},
        { field: 'departement', headerName: 'DEPARTEMENT', minWidth: 300,flex:1,  renderCell:(cellValues)=>(
                cellValues.row.option?.departement?.libelle
            )},
        { field: 'action', headerName: 'ACTION',width:400,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button onClick={()=>handleShow(cellValues.row.id)} className={"p-2 text-white orangeVioletBackground rounded hover:text-blue-400 hover:bg-white transition duration-500"}>
                        <VisibilityIcon/>
                    </button>
                    <button onClick={()=>handleOpen(cellValues.row)} className={"p-2 text-white orangeBlueBackground rounded hover:text-blue-700 hover:bg-white transition duration-500"}>
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
        confirm("Voulez-vous supprimer cette classe") && Inertia.delete(route("etablissement.classe.destroy",[props.auth.user.id,id]),{preserveScroll:true})
    }

    function handleEdit(e){
        e.preventDefault()
        Inertia.post(route("etablissement.classe.update",[props.auth.user.id,dataEdit.id]),{_method: "put",dataEdit},{preserveScroll:true})

    }

    function handleShow(id){
        Inertia.get(route("etablissement.classe.show",[props.auth.user.id,id]))
    }

    function handleSubmit(e)
    {
        e.preventDefault();

        Inertia.post(route("etablissement.classe.store",props.auth.user.id),data,{preserveScroll:true})

    }

    useEffect(() => {
        setClasses(props.classes);
    },[props.classes]);


    useEffect(() => {
        props.options && setOptions(props.options);
    },[])

    useEffect(() => {
        let libelle=""

        data.niveau && (libelle=libelle+data.niveau.libelle)

        data.option && (libelle=libelle+" "+data.option.libelle)

        data.code !==null && (libelle=libelle+" "+data.code)

        setData("libelle",libelle)

    },[data.niveau,data.option,data.code])


    useEffect(() => {
        let libelle=""

        dataEdit.niveau && (libelle=libelle+dataEdit.niveau.libelle)

        dataEdit.option && (libelle=libelle+" "+dataEdit.option.libelle)

        dataEdit.code !==null && (libelle=libelle+" "+dataEdit.code)

        setDataEdit("libelle",libelle)

    },[dataEdit.niveau,dataEdit.option,dataEdit.code])

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
        <AdminPanel auth={props.auth} error={props.error} active={"gestionCursus"} sousActive={"classe"}>
            <div className={"p-5"}>
                <div>
                    <div className={"my-5 text-2xl text-white orangeOrangeBackground rounded text-white p-2"}>
                        Gestion des classes
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5 p-2 border rounded"}>
                        <div className={"text-lg font-bold mb-5"}>
                            Ajouter une classe
                        </div>
                        {
                            data.libelle!=="" &&
                            <div>
                                <span className={"w-full text-lg"}>
                                Aperçu: <div className={"flex text-blue-600"}>{data.libelle}</div>
                            </span>
                                <div className={"flex text-red-600"}>{props.errors?.libelle}</div>
                                <div className={"flex text-red-600"}>{props.errors?.classe}</div>
                            </div>

                        }
                        <div className={"gap-4 grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 items-center"} style={{maxWidth:1000}}>
                            <div>
                                <FormControl  className={"w-full"}>
                                    <Autocomplete
                                        value={data.niveau}

                                        onChange={(e,val)=>{
                                            setData("niveau",val)
                                        }}
                                        disablePortal={true}
                                        options={props.niveaux}
                                        getOptionLabel={(option)=>option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Niveau"}  required label={params.libelle}/>}

                                    />
                                </FormControl>
                            </div>

                            {
                                props.departements &&
                                <div>
                                    <FormControl  className={"w-full"}>
                                        <Autocomplete
                                            value={data.departement}
                                            onChange={(e,val)=>{
                                                setData("departement",val)
                                                setOptions(val?.options)
                                            }}
                                            disablePortal={true}
                                            options={props.departements}
                                            getOptionLabel={(option)=>option.libelle}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Departement"}  required label={params.libelle}/>}

                                        />
                                    </FormControl>
                                </div>
                            }

                            {
                                (data.niveau?.cycle?.libelle==="LYCÉE" || data.departement) &&
                                <div>
                                    <FormControl  className={"w-full"}>
                                        <Autocomplete
                                            value={data.option}
                                            onChange={(e,val)=>{
                                                setData("option",val)
                                            }}
                                            disablePortal={true}
                                            options={options}
                                            getOptionLabel={(option)=>option.libelle}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Option"} label={params.libelle}/>}

                                        />
                                    </FormControl>
                                </div>
                            }

                            <div className={"w-full"}>
                                <Tooltip title="Code en guise de prefixe (Ex: 10ème année A)">
                                    <TextField
                                        value={data.code}
                                        className={"w-full"}  name={"code"} label={"Code"} onChange={(e)=>setData("code",e.target.value)}
                                    />
                                </Tooltip>
                            </div>

                            <div className={"md:col-span-2"}>
                                <button className={"p-2 text-white orangeVertBackground rounded hover:text-green-600 hover:bg-white hover:border hover:border-green-600 transition duration-500"} style={{height: 56}} type={"submit"}>
                                    Enregister
                                </button>
                            </div>
                        </div>

                    </form>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogContent>
                            <form action="" onSubmit={handleEdit} className={"space-y-5 my-5 p-2 border rounded"}>
                                <div className={"text-lg font-bold mb-5"}>
                                    Modifier une classe
                                </div>
                                <div className={"gap-4 grid md:grid-cols-3 grid-cols-1 items-center"}>
                                </div>
                                {
                                    dataEdit.libelle!=="" &&
                                    <div>
                                <span className={"w-full text-lg"}>
                                Aperçu: <div className={"flex text-blue-600"}>{dataEdit.libelle}</div>
                            </span>
                                        <div className={"flex text-red-600"}>{props.errors?.libelle}</div>
                                        <div className={"flex text-red-600"}>{props.errors?.classe}</div>
                                    </div>

                                }
                                <div className={"gap-4 grid grid-cols-1 items-center"} style={{maxWidth:1000}}>
                                    {
                                        dataEdit.niveau &&
                                        <div className={"w-full"}>
                                            <Autocomplete
                                                className={"w-full"}
                                                value={dataEdit.niveau}

                                                onChange={(e,val)=>{
                                                    setDataEdit("niveau",val)
                                                }}
                                                disablePortal={true}
                                                options={props.niveaux}
                                                getOptionLabel={(option)=>option.libelle}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Niveau"}  required label={params.libelle}/>}

                                            />
                                        </div>
                                    }



                                    <div>
                                        <button className={"p-3 text-white orangeVertBackground rounded"} type={"submit"}>
                                            Enregister
                                        </button>
                                    </div>
                                </div>

                            </form>
                        </DialogContent>
                    </Dialog>

                    <motion.div
                        initial={{y:-100,opacity:0}}
                        animate={{y:0,opacity:1}}
                        transition={{
                            duration:0.5,
                            type:"spring",
                        }}
                        style={{width: '100%' }} className={"flex justify-center"}>
                        {
                            classes &&
                            <DataGrid
                                components={{
                                    Toolbar:GridToolbar,
                                }}
                                rows={classes}
                                columns={columns}
                               initialState={{
                                        pagination: {
                                            pageSize: 10,
                                        },
                                    }}
                                rowsPerPageOptions={[10,20,100]}
                                autoHeight
                                //onCellEditCommit={handleCellEditCommit}
                            />
                        }
                    </motion.div>

                    <SnackBar error={error} update={update} success={success} />                </div>
            </div>
        </AdminPanel>
    );
}

export default Index;
