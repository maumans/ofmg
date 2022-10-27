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
        "posId":"",
        "msisdn":"",
        "typeEtablissement":"",
        "ville":"",
        "commune":"",
        "nom":"",
        "prenom":"",
        "telephoneAdmin":"",
        "telephone":"",
        "login":"",
        "email":"",
        "password":"",
    });


    function handleSubmit(e)
    {
        e.preventDefault();

        post(route("admin.etablissement.store",props.auth.user.id),{data,onSuccess: ()=>reset(
                "nomEtablissement",
                "code",
                "posId",
                "msisdn",
                "typeEtablissement",
                "telephone",
                "telephoneAdmin",
                "ville",
                "commune",
                "nom",
                "prenom",
                "login",
                "email",
                "password",
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

                            <div className={"w-full"}>
                                <TextField  className={"w-full"} name={"posId"} label={"PosId de l'etablissement"} onChange={(e)=>setData("posId",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.posId}</div>
                            </div>

                            <div className={"w-full"}>
                                <TextField  className={"w-full"} name={"msisdn"} label={"Numero msisdn"} onChange={(e)=>setData("msisdn",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.msisdn}</div>
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

                                    className={"w-full"}  name={"telephone"} label={"Telephone"} onChange={(e)=>setData("telephone",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.telephone}</div>
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

                                    className={"w-full"}  name={"telephoneAdmin"} label={"Telephone"} onChange={(e)=>setData("telephoneAdmin",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.telephoneAdmin}</div>
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
                                <TextField className={"w-full"}  name={"password"} label={"Mot de passe"} onChange={(e)=>setData("password",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.password}</div>
                            </div>

                            <div className={"md:col-span-3 sm:col-span-2"}>
                                <button style={{height: 56}} className={"p-2 text-white orangeVertBackground rounded"} type={"submit"}>
                                    Valider
                                </button>
                            </div>
                        </div>

                    </form>
                    <SnackBar error={error} update={update} success={success} />                </div>
            </div>
        </AdminPanel>
    );
}

export default Create;
