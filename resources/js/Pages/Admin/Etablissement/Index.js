import React, {useEffect, useState} from 'react';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    GridToolbar,
    useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';
import {Autocomplete, Divider, FormControl, InputLabel, MenuItem, Pagination, Select, TextField} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SnackBar from "@/Components/SnackBar";

function Index(props) {

    const [etablissements,setEtablissements] = useState();
    const [communesVilles,setCommunesVilles] = useState();

    const {data,setData,post,reset}=useForm({
        "nomEtablissement":"",
        "typeEtablissement":"",
        "ville":"",
        "commune":"",
        "nom":"",
        "prenom":"",
        "email":"",
        "password":"",
        "confirmPassword":"",
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'code', headerName: 'CODE', width: 200 },
        { field: 'nom', headerName: 'NOM', width: 250 },
        { field: 'type', headerName: 'TYPE', width: 250,renderCell:(r)=>r.row.type_etablissement?.libelle },
        { field: 'ville', headerName: 'VILLE', width: 250,renderCell:(r)=>r.row.ville?.libelle },
        { field: 'commune', headerName: 'COMMUNE', width: 250,renderCell:(r)=>r.row.commune?.libelle },
        { field: 'email', headerName: 'EMAIL ADMIN', width: 250,renderCell:(r)=>r.row.admins[0]?.email },
        { field: 'action', headerName: 'ACTION',width:250,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
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
        confirm("Voulez-vous supprimer cet etablissement?") && Inertia.delete(route("admin.etablissement.destroy",[props.auth.user.id,id]),{preserveScroll:true})
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

        post(route("admin.etablissement.store",props.auth.user.id),{data,onSuccess: ()=>reset(
            "nomEtablissement",
                "typeEtablissement",
                "ville",
                "commune",
                "nom",
                "prenom",
                "email",
                "password",
                "confirmPassword",
            )})

    }

    useEffect(() => {
        setEtablissements(props.etablissements);
    },[props.etablissements])

    useEffect(()=>{
        setCommunesVilles(data.ville?.communes)
        setData("commune",null)
    },[data.ville])

    return (
        <AdminPanel auth={props.auth} error={props.error} active={"etablissement"}>
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl"}>
                        Gestion des etablissements
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5"}>
                        <div>
                            Infos de l'etablissement
                        </div>
                        <div className={"gap-4 grid md:grid-cols-3 grid-cols-1"}>
                            <div className={"md:col-span-3 w-full"}>
                                <TextField  className={"w-full"} name={"nomEtablissement"} label={"Nom de l'etablissement"} value={data.nomEtablissement} onChange={(e)=>setData("nomEtablissement",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.nomEtablissement}</div>
                            </div>

                            <div>
                                <FormControl  className={"w-full"}>
                                    <Autocomplete
                                        onChange={(e,val)=>setData("typeEtablissement",val)}
                                        disablePortal={true}
                                        options={props.typeEtablissements}
                                        getOptionLabel={(option)=>option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"type d'etablissements"} label={params.libelle} required/>}
                                    />
                                </FormControl>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.ville}</div>
                            </div>
                            <div>
                                <FormControl  className={"w-full"}>
                                    <Autocomplete
                                        onChange={(e,val)=>{
                                            setData("ville",val)
                                        }}
                                        disablePortal={true}
                                        options={props.villes}
                                        getOptionLabel={(option)=>option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"ville"} label={params.libelle}/>}
                                    />
                                </FormControl>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.ville}</div>
                            </div>
                            <div>
                                <FormControl  className={"w-full"}>
                                    <Autocomplete
                                        onChange={(e,val)=>setData("commune",val)}
                                        disablePortal={true}
                                        options={communesVilles?communesVilles:props.communes}
                                        getOptionLabel={(option)=>option.libelle?option.libelle:""}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"commune"} label={params.libelle}/>}
                                    />
                                </FormControl>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.region}</div>
                            </div>
                            <Divider className={"md:col-span-3"} />

                            <div className={"md:col-span-3"}>
                                Compte de l'administrateur de l'etablissement
                            </div>
                            <div>
                                <TextField className={"w-full"}  name={"nom"} label={"Nom"} value={data.nom} onChange={(e)=>setData("nom",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.nom}</div>
                            </div>

                            <div>
                                <TextField className={"w-full"}  name={"prenom"} label={"Prenom"} value={data.prenom} onChange={(e)=>setData("prenom",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.prenom}</div>
                            </div>

                            <div>
                                <TextField className={"w-full"}  name={"email"} label={"Email"} value={data.email} onChange={(e)=>setData("email",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.email}</div>
                            </div>
                            <div>
                                <TextField className={"w-full"} inputProps={{type: "password"}}  name={"password"} label={"Mot de passe"} value={data.password} onChange={(e)=>setData("password",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.password}</div>
                            </div>
                            <div>
                                <TextField className={"w-full"}  name={"confirmPassword"} label={"Confirmer le mot de passe"} value={data.confirmPassword} onChange={(e)=>setData("confirmPassword",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.confirmPassword}</div>
                            </div>

                            <div>
                                <button style={{height: 56}} className={"p-2 text-white bg-green-600 rounded"} type={"submit"}>
                                    Valider
                                </button>
                            </div>
                        </div>

                    </form>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            etablissements &&
                            <DataGrid
                                components={{
                                    Toolbar:GridToolbar,
                                }}
                                rows={etablissements}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                autoHeight
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
