import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Head, useForm, useRemember} from "@inertiajs/inertia-react";
import Authenticated from "@/Layouts/Authenticated";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Alert,
    Autocomplete, Avatar,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText,
    Modal,
    TextField,
    Radio, Tooltip
} from "@mui/material";
import {Inertia} from "@inertiajs/inertia";
import NumberFormat from 'react-number-format';


import {DataGrid, GridToolbar} from "@mui/x-data-grid";

import SearchIcon from '@mui/icons-material/Search';
import AdminPanel from "@/Layouts/AdminPanel";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    minWidth: 400,
    bgcolor: 'background.paper',
    borderRadius:2,
    boxShadow: 24,
    p: 4,
};

function Create({auth,etablissement,apprenant,matricule,nbrMois,modePaiements,success,montantTotal,paiements,errors,error,classes,apprenants,codeNumeros}) {

    const [apprenantsSt, setApprenantsSt] = useState([]);

    const {data,setData,post,reset}=useForm({
        "matricule":"",
        "modePaiements":"",
        "typePaiements":"",
        //"apprenant":apprenant,
        "tarifs":"",
        "montants":[],
        "total":montantTotal?montantTotal:0,
        classeSearch:"",
        tuteurSearch:"",
        searchText:"",
        "tuteurSelectedId":null
    });


    useEffect(() => {
        setApprenantsSt(apprenants)
    },[])


    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        setLoading(false)
    },[])

    function handleSearchMat(matricule)
    {
        //Inertia.post(route("etablissement.paiement.search",auth?.user?.id),{matricule:matricule || null,classeId:data?.classeSearch?.id || null,tuteurNumber:data?.tuteurSearch || null},{preserveScroll:true})
        setLoading(true)
        axios.post(route("etablissement.paiement.search",auth?.user?.id),{matricule:matricule,classeId:data?.classeSearch?.id,tuteurNumber:data.tuteurSearch,searchText:data.searchText},{preserveScroll:true}).then(response=>{
            setApprenantsSt(response.data.apprenants)

            setLoading(false)

        }).catch(err=>{
            console.log(err)
        })
    }

    function handlePaiementTarif(id)
    {
        Inertia.get(route("etablissement.paiement.tarif",[auth?.user?.id,id]),{preserveScroll:true})
    }

    const columns = [
        //{ field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'matricule', headerName: 'MATRICULE',flex:1,minWidth: 130 },

        { field: 'prenom', headerName: 'PRENOM' ,flex:1,minWidth: 130 },
        { field: 'nom', headerName: 'NOM' ,flex:1,minWidth: 130 },
        { field: 'classe', headerName: 'CLASSE',flex:1,minWidth:250,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    {cellValues.row.classe.libelle}
                </div>
            )
        },
        { field: 'action', headerName: 'ACTION',flex:1,minWidth:200,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    <button type="button" onClick={()=>handlePaiementTarif(cellValues.row.id)} className={"p-2 text-white orangeBlueBackground rounded"}>
                        Procéder au paiement
                    </button>
                </div>
            )
        },

    ];

    return (
        <AdminPanel auth={auth} error={error} active={"fraisScolaires"} sousActive={"paiementFraisScolaires"}>

            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <h1 className="p-6 bg-white border-b border-gray-200 text-xl p-2 text-white orangeOrangeBackground">PAIEMENT</h1>

                        <div className={'w-full'}>
                            <div className="grid sm:grid-cols-3 grid-cols-1 gap-5 p-2  mt-8 m-5 w-full">
                               {/*<div className={"flex"}>
                                   <TextField className={"w-full"}  name={"matricule"} value={data.matricule} label={"Entrez le matricule de l'apprenant"} onChange={(e)=>setData(data=>({
                                       "matricule":e.target.value,
                                       "tuteurSearch":"",
                                       "classeSearch":"",
                                   }))}/>
                               </div>
                                <div className={"flex"}>
                                    <TextField className={"w-full"}  name={"tuteurSearch"} value={data.tuteurSearch} label={"Entrez le numero du tuteur"} onChange={(e)=>setData(data=>({
                                        "matricule":"",
                                        "tuteurSearch":e.target.value,
                                        "classeSearch":"",
                                    }))}/>
                                </div>*/}

                                <div className={"flex"}>
                                    <TextField className={"w-full"}  name={"searchText"} value={data.searchText} label={"Matricule, nom, prenom"} onChange={(e)=>setData(data=>({
                                        "searchText":e.target.value,
                                    }))}/>
                                </div>

                                <div className={"flex"}>
                                    <FormControl
                                        className={"w-full"}
                                    >
                                        <Autocomplete
                                            className={"w-full"}
                                            onChange={(e,val)=>setData("classeSearch",val)}

                                            disablePortal={true}
                                            options={classes}
                                            getOptionLabel={(option)=>option.libelle}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params)=><TextField  fullWidth {...params} placeholder={"classe"} label={params.libelle}/>}
                                        />
                                        <div className={"flex text-red-600"}>{errors?.classe}</div>
                                    </FormControl>


                                </div>

                                <div className={"flex"}>
                                    <button onClick={()=>handleSearchMat(data.matricule)} className={"p-2 orangeVertBackground text-white hover:orangeVertBackground rounded"}><SearchIcon/> Rechercher</button>
                                </div>

                            </div>

                            <div className={"p-5"}>
                                {

                                    <DataGrid
                                        loading={loading}
                                        components={{
                                            Toolbar:GridToolbar,
                                        }}
                                        rows={apprenantsSt}
                                        columns={columns}
                                        initialState={{
                                            pagination: {
                                                pageSize: 10,
                                            },
                                        }}
                                        rowsPerPageOptions={[10,20,100]}
                                        autoHeight
                                    />
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>



        </AdminPanel>
    );
}

export default Create;
