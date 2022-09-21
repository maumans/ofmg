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

function Create(props) {

    const [communesVilles,setCommunesVilles] = useState();
    const [codeNumerosSt, setCodeNumerosSt]=useState();

    const {data,setData,post,reset}=useForm({
        "nomEtablissement":"",
        "code":"",
        "typeEtablissement":"",
        "ville":"",
        "commune":"",
        "nom":"",
        "prenom":"",
        "telephone":"",
        "telephoneEtab":"",
        "login":"",
        "email":"",
        "password":"",
        "confirmPassword":"",
    });


    function handleSubmit(e)
    {
        e.preventDefault();

        post(route("admin.etablissement.store",props.auth.user.id),{data,onSuccess: ()=>reset(
                "nomEtablissement",
                "code",
                "typeEtablissement",
                "telephone",
                "telephoneEtab",
                "ville",
                "commune",
                "nom",
                "prenom",
                "login",
                "email",
                "password",
                "confirmPassword",
            )})

    }

    useEffect(() => {
        if(props.codeNumeros)
        {
            let st=""
            props.codeNumeros.map((c,i)=>st=st+(i? "|":"")+c.libelle)
            setCodeNumerosSt(st)
        }
    },[])


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
                        <div className={"gap-4 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1"}>
                            <div className={"w-full"}>
                                <TextField  className={"w-full"} name={"nomEtablissement"} label={"Nom de l'etablissement"} onChange={(e)=>setData("nomEtablissement",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.nomEtablissement}</div>
                            </div>

                            <div className={"w-full"}>
                                <TextField  className={"w-full"} name={"code"} label={"Code de l'etablissement"} onChange={(e)=>setData("code",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.code}</div>
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
                            <div>
                                <TextField
                                    inputProps={{

                                        pattern:"(^"+codeNumerosSt+")[0-9]{6}"
                                    }}

                                    className={"w-full"}  name={"telephoneEtab"} label={"Telephone"} onChange={(e)=>setData("telephoneEtab",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.telephoneEtab}</div>
                            </div>
                            <Divider className={"md:col-span-3"} />

                            <div className={"md:col-span-3"}>
                                Compte de l'administrateur de l'etablissement
                            </div>
                            <div>
                                <TextField className={"w-full"}  name={"nom"} label={"Nom"} onChange={(e)=>setData("nom",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.nom}</div>
                            </div>

                            <div>
                                <TextField className={"w-full"}  name={"prenom"} label={"Prenom"} onChange={(e)=>setData("prenom",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.prenom}</div>
                            </div>

                            <div>
                                <TextField
                                    inputProps={{

                                        pattern:"(^"+codeNumerosSt+")[0-9]{6}"
                                    }}

                                    className={"w-full"}  name={"telephone"} label={"Telephone"} onChange={(e)=>setData("telephone",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.telephone}</div>
                            </div>

                            <div className={"w-full"}>
                                <TextField className={"w-full"} name={"login"} label={"login"} onChange={(e)=>setData("login",e.target.value)}/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.login}</div>
                            </div>

                            <div>
                                <TextField className={"w-full"}  name={"email"} label={"Email"} onChange={(e)=>setData("email",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.email}</div>
                            </div>
                            <div>
                                <TextField className={"w-full"} inputProps={{type: "password"}}  name={"password"} label={"Mot de passe"} onChange={(e)=>setData("password",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.password}</div>
                            </div>
                            <div>
                                <TextField className={"w-full"} inputProps={{type: "password"}}  name={"confirmPassword"} label={"Confirmer le mot de passe"} onChange={(e)=>setData("confirmPassword",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.confirmPassword}</div>
                            </div>

                            <div>
                                <button style={{height: 56}} className={"p-2 text-white bg-green-600 rounded"} type={"submit"}>
                                    Valider
                                </button>
                            </div>
                        </div>

                    </form>
                    <SnackBar success={ props.success} />
                </div>
            </div>
        </AdminPanel>
    );
}

export default Create;
