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
    Autocomplete, Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
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

function Index(props) {

    const [inscriptions,setInscriptions] = useState();
    const [tarifs,setTarifs] = useState();

    const {data,setData,post}=useForm({
        "prenom":"",
        "nom":"",
        "matricule":"",
        "prenomTuteur":"",
        "nomTuteur":"",
        "telephoneTuteur":"",
        "emailTuteur":"",
        "dateNaissance":"",
        "niveau":"",
        "lieuNaissance":"",
        "montant":"",
        "tarifs":{}
    });

    const columns = [
        { field: 'id', headerName: 'ID', width:100 },
        { field: 'prenom', headerName: 'PRENOM', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.prenom},
        { field: 'nom', headerName: 'NOM', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.nom},
        { field: 'matricule', headerName: 'MATRICULE', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.matricule},
        { field: 'dateNaissance', headerName: 'DATE DE NAISSANCE', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.date_naissance},
        { field: 'lieuNaissance', headerName: 'LIEU DE NAISSANCE', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.lieu_naissance},
        {field: 'prenomTuteur', headerName: 'PRENOM DU TUTEUR', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.prenomTuteur},
        { field: 'nomTuteur', headerName: 'NOM DU TUTEUR', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.nomTuteur},
        { field: 'telephoneTuteur', headerName: 'TELEPHONE DU TUTEUR', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.telephoneTuteur},
        { field: 'emailTuteur', headerName: 'EMAIL DU TUTEUR', width:150,renderCell:(cellValues)=>cellValues.row.apprenant?.emailTuteur},
        { field: 'niveau', headerName: 'NIVEAU', width:150, renderCell:(cellValues)=>cellValues.row.niveau?.libelle },
        { field: 'montant', headerName: 'MONTANT', width:150},
        { field: 'action', headerName: 'ACTION',width:150,
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
        confirm("Voulez-vous supprimer role") && Inertia.delete(route("etablissement.inscription.destroy",[props.auth.user.id,id]),{preserveScroll:true})
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

        post(route("etablissement.inscription.store",props.auth.user.id),data)

    }

    useEffect(() => {
        setInscriptions(props.inscriptions);
    },[props.inscriptions]);

    useEffect(() => {
        data.niveau?.tarifs?.length >0 ?
            data.niveau.tarifs.map((tarif)=>(
                tarif.type_paiement.libelle==="INSCRIPTION" &&
                setData("montant",tarif.montant)
            ))
            :setData("montant",null)
    },[data.niveau])

    function handleChange (event){
        setTarifs(tarifs=>({
            ...tarifs,
            [event.target.name]: event.target.checked,
        }));
    }

    useEffect(() => {
        if(data.niveau?.tarifs)
        {
            let list={}
            data.niveau.tarifs.map((tarif)=>(
                list={...list,[tarif.id]:false}
            ))
            setTarifs(list)
        }

    },[data.niveau])

    useEffect(() => {
        setData("tarifs",tarifs)
    },[tarifs])


    return (
        <AdminPanel auth={props.auth} error={props.error} active={"inscription"} >
            <div className={"p-5"}>
                <div>
                    <div className={"my-5 text-2xl text-white bg-orange-400 rounded text-white p-2"}>
                        Gestions des inscriptions
                    </div>

                    <form action="" onSubmit={handleSubmit} className={"space-y-5 my-5 "}>

                        <div className={"w-full border p-5 rounded space-y-5"}>
                            <div className={"text-xl font-bold"}>
                                INSCRIRE UN ELEVE
                            </div>
                            <div className={"space-y-5 p-2 border"}>
                                <div className={"text-lg font-bold"}>
                                    Infos de l'apprenant
                                </div>
                                <div className={"gap-5 grid md:grid-cols-3 grid-cols-1 items-end mb-5"}>
                                    <div>
                                        <TextField className={"w-full"}  name={"prenom"} label={"Prenom"} value={data.prenom} onChange={(e)=>setData("prenom",e.target.value)}/>
                                        <div className={"flex my-2 text-red-600"}>{props.errors?.prenom}</div>
                                    </div>
                                    <div>
                                        <TextField className={"w-full"}  name={"nom"} label={"Nom"} value={data.nom} onChange={(e)=>setData("nom",e.target.value)}/>
                                        <div className={"flex my-2 text-red-600"}>{props.errors?.nom}</div>
                                    </div>
                                    <div>
                                        <TextField className={"w-full"}  name={"matricule"} label={"Matricule"} value={data.matricule} onChange={(e)=>setData("matricule",e.target.value)}/>
                                        <div className={"flex my-2 text-red-600"}>{props.errors?.matricule}</div>
                                    </div>
                                    <div>
                                        <div className={"font-bold"}>Date de naissance</div>
                                        <TextField className={"w-full"}  name={"dateNaissance"} type={"date"} value={data.dateNaissance} onChange={(e)=>setData("dateNaissance",e.target.value)}/>
                                        <div className={"flex my-2 text-red-600"}>{props.errors?.dateNaissance}</div>
                                    </div>
                                    <div>
                                        <TextField className={"w-full"}  name={"lieuNaissance"} label={"Lieu de naissance"} value={data.lieuNaissance} onChange={(e)=>setData("lieuNaissance",e.target.value)}/>
                                        <div className={"flex my-2 text-red-600"}>{props.errors?.lieuNaissance}</div>
                                    </div>

                                    <div>
                                        <FormControl  className={"w-full"}>
                                            <Autocomplete
                                                onChange={(e,val)=>{
                                                    setData("niveau",val)
                                                }}
                                                disablePortal={true}
                                                options={props.niveaux}
                                                getOptionLabel={(option)=>option.libelle}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params)=><TextField  fullWidth {...params} placeholder={"niveau"} label={params.libelle}/>}
                                            />
                                        </FormControl>
                                        <div className={"flex my-2 text-red-600"}>{props.errors?.ville}</div>
                                    </div>
                                </div>
                            </div>

                           <div className={"space-y-5 p-2 border"}>
                               <div className={"text-lg font-bold"}>
                                   Infos du tuteur
                               </div>
                               <div className={"grid md:grid-cols-3 grid-cols-1 gap-4"}>
                                   <div>
                                       <TextField className={"w-full"}  name={"prenomTuteur"} label={"Prenom du tuteur"} value={data.prenomTuteur} onChange={(e)=>setData("prenomTuteur",e.target.value)}/>
                                       <div className={"flex my-2 text-red-600"}>{props.errors?.prenomTuteur}</div>
                                   </div>
                                   <div>
                                       <TextField className={"w-full"}  name={"nomTuteur"} label={"Nom du tuteur"} value={data.nomTuteur} onChange={(e)=>setData("nomTuteur",e.target.value)}/>
                                       <div className={"flex my-2 text-red-600"}>{props.errors?.nomTuteur}</div>
                                   </div>
                                   <div>
                                       <TextField className={"w-full"}  name={"telephone"} label={"telephone"} value={data.telephoneTuteur} onChange={(e)=>setData("telephoneTuteur",e.target.value)}/>
                                       <div className={"flex my-2 text-red-600"}>{props.errors?.telephoneTuteur}</div>
                                   </div>
                                   <div>
                                       <TextField className={"w-full"}  name={"emailTuteur"} label={"Email du tuteur"} value={data.emailTuteur} onChange={(e)=>setData("emailTuteur",e.target.value)}/>
                                       <div className={"flex my-2 text-red-600"}>{props.errors?.emailTuteur}</div>
                                   </div>
                               </div>
                           </div>

                            {
                                data.niveau &&
                                <div className={"border p-5 space-y-5"}>
                                    <div className={"text-lg font-bold"}>
                                       Les type de frais
                                    </div>
                                    <div className={"flex flex-wrap"}>
                                        {
                                            data.niveau?.tarifs.map((tarif)=>(
                                                <div key={tarif.id} className={"mx-5"}>
                                                    <FormControlLabel control={<Checkbox name={tarif.id+""} onChange={handleChange} />} label={tarif.type_paiement.libelle} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                            {
                                data.montant &&
                                <div className={"my-5 p-2 font-bold"} style={{width:"fit-content"}}>
                                    Montant de l'inscription:
                                    <span className={"my-5 p-2 text-white  bg-orange-600 font-bold"}>{data.montant} FG</span>
                                </div>
                            }


                            <div className={"flex col-span-3 justify-end"}>
                                <button className={"p-3 text-white bg-green-600 rounded"}  type={"submit"}>
                                    Enregistrer
                                </button>
                            </div>
                        </div>

                    </form>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            inscriptions &&
                            <DataGrid

                                components={{
                                    Toolbar:GridToolbar,
                                }}

                                componentsProps={{
                                    columnMenu:{backgroundColor:"red",background:"yellow"},
                                }}
                                rows={inscriptions}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                checkboxSelection
                                autoHeight
                            />
                        }
                    </div>
                </div>
            </div>
        </AdminPanel>
    );
}

export default Index;
