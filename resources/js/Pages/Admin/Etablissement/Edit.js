import React, {useEffect, useState} from 'react';
import {Autocomplete, Divider, FormControl, InputLabel, MenuItem, Pagination, Select, TextField} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";
import SnackBar from "@/Components/SnackBar";

function Edit(props) {

    const [communesVilles,setCommunesVilles] = useState();
    const [codeNumerosSt, setCodeNumerosSt]=useState();

    const {data,setData,post,reset}=useForm({
        "nomEtablissement":props.etablissement.nom,
        "code":props.etablissement.code,
        "typeEtablissement":"",
        "ville":"",
        "commune":"",
        "telephone":props.etablissement.telephone,
    });

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


    function handleSubmit(e)
    {
        e.preventDefault();

        Inertia.put(route("admin.etablissement.update",[props.auth.user.id,props.etablissement.id]),data)
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
                            <div className={"w-full"} >
                                <TextField value={data.nomEtablissement}  className={"w-full"} name={"nomEtablissement"} label={"Nom de l'etablissement"} onChange={(e)=>setData("nomEtablissement",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.nomEtablissement}</div>
                            </div>

                            <div className={"w-full"}>
                                <TextField value={data.code}  className={"w-full"} name={"code"} label={"Code de l'etablissement"} onChange={(e)=>setData("code",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.code}</div>
                            </div>

                            <div>
                                <FormControl  className={"w-full"}>
                                    <Autocomplete
                                        defaultValue={props.etablissement.type_etablissement}
                                        onChange={(e,val)=>setData("typeEtablissement",val)}
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
                                        defaultValue={props.etablissement.ville}
                                        onChange={(e,val)=>{
                                            setData("ville",val)
                                        }}
                                        disablePortal={true}
                                        options={props.villes}
                                        getOptionLabel={(option)=>option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Ville"} label={params.libelle}/>}
                                    />
                                </FormControl>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.ville}</div>
                            </div>

                            <div>
                                <FormControl  className={"w-full"}>
                                    <Autocomplete
                                        defaultValue={props.etablissement.commune}
                                        onChange={(e,val)=>setData("commune",val)}
                                        disablePortal={true}
                                        options={communesVilles?communesVilles:props.communes}
                                        getOptionLabel={(option)=>option.libelle}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Commune"} label={params.libelle}/>}
                                    />
                                </FormControl>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.region}</div>
                            </div>
                            <div>
                                <TextField
                                    value={data.telephone}
                                    inputProps={{

                                        pattern:"(^"+codeNumerosSt+")[0-9]{6}"
                                    }}
                                    className={"w-full"}  name={"telephone"} label={"Telephone"} onChange={(e)=>setData("telephone",e.target.value)} required/>
                                <div className={"flex my-2 text-red-600"}>{props.errors?.telephone}</div>
                            </div>
                            <div className={"md:col-span-3 sm:col-span-2"}>
                                <button style={{height: 56}} className={"p-2 text-white orangeVertBackground rounded"} type={"submit"}>
                                    Valider
                                </button>
                            </div>
                        </div>

                    </form>
                    <SnackBar error={error} update={update} success={success} />
                </div>
            </div>
        </AdminPanel>
    );
}

export default Edit;
