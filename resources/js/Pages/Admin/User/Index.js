import React, {useEffect, useState} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
    GridToolbar,
    GridToolbarContainer, GridToolbarExport
} from '@mui/x-data-grid';
import {Autocomplete, FormControl, InputLabel, MenuItem, Pagination, Select, TextField} from "@mui/material";
import {Inertia} from "@inertiajs/inertia";
import {useForm} from "@inertiajs/inertia-react";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import SnackBar from "@/Components/SnackBar";
function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
        );
}

function CustomToolbar() {
    return (
            <GridToolbarContainer>
                <GridToolbarExport sx={{backgroundColor:"#FF7900",color:"white"}}/>
            </GridToolbarContainer>
    );
}


function Index(props) {

    const [users,setUsers] = useState();

    const {data,setData,post,reset}=useForm({
        "nom":"",
        "prenom":"",
        "login":"",
        "email":"",
        "situation_matrimoniale":"",
        "telephone":"",
        "password":"",
        "date_naissance":"",
        "role":null,
    });

    useEffect(() => {
       setUsers(props.users);
    },[props.users])

    const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'nom', headerName: 'PRENOM',flex:1,minWidth:150},
        { field: 'prenom', headerName: 'NOM',flex:1,minWidth:150 },
        { field: 'login', headerName: 'LOGIN',flex:1,minWidth:150 },
        { field: 'email', headerName: 'EMAIL',flex:1,minWidth:150},
        { field: 'situation_matrimoniale', headerName: 'SITUATION MATRIMONIALE',flex:1,minWidth:150 },
        { field: 'telephone', headerName: 'TELEPHONE',flex:1,minWidth:150 },
        { field: 'status', headerName: 'STATUS',flex:1,minWidth:100,
            renderCell:(user)=>(
                user.status
            )
        },

        { field: 'role(s)', headerName: 'ROLES',flex:1,minWidth:200,
            renderCell:(user)=>(
                <div>
                    {user.row.roles.map((role)=> role.libelle+" ")}
                </div>
            )
        },
        { field: 'Organisation', headerName: 'ORGANISATION',flex:1,minWidth:300,
            renderCell:(user)=>(
                <div>
                    {user.row.roles.find((role)=> role.libelle.toLowerCase()==="admin")?"Addvalis":user.row.roles.find((role)=> role.libelle.toLowerCase()==="ofmg")?"Orange":user.row.roles.find((role)=> role.libelle.toLowerCase()==="etablissement")?user.row.etablissement?.nom:user.row.roles.find((role)=> role.libelle.toLowerCase()==="tuteur")?"Tuteur":user.row.roles.find((role)=> role.libelle.toLowerCase()==="personnel")?user.row.etablissement?.nom:""}
                </div>
            )
        },

        { field: 'action', headerName: 'ACTION',width:250,
            renderCell:(cellValues,i)=>(
                <div key={i} className={"space-x-2"}>
                    <button onClick={()=>handleShow(cellValues.row.id)} className={"p-2 text-white orangeVioletBackground rounded hover:text-blue-500 hover:bg-white transition duration-500"}>
                        <VisibilityIcon/>
                    </button>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white orangeBlueBackground rounded hover:text-red-700 hover:bg-white transition duration-500"}>
                        <EditIcon/>
                    </button>
                    <button onClick={()=>handleDelete(cellValues.row.id)} className={`${cellValues.row.status==="Actif"?" bg-red-500 rounded hover:text-red-500 hover:bg-white transition duration-500 p-2":" orangeVertBackground rounded hover:text-green-500 hover:bg-white transition duration-500 p-2"} p-2 text-white`}>
                        {
                            cellValues.row.status==="Actif"?"Bloquer":" Debloquer"
                        }
                    </button>

                </div>
            )
        },

    ];

    function handleDelete(id){
        confirm("Voulez-vous supprimer cet utilisateur") && Inertia.delete(route("admin.user.destroy",[props.auth.user.id,id]),{preserveScroll:true})
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

        post(route("admin.user.store",props.auth.user.id),{data,onSuccess: ()=>reset("nom","prenom","login","email","situation_matrimoniale","telephone","password","role")})

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
       <AdminPanel auth={props.auth} error={props.error} active={"utilisateur"}>
           <div className={"p-5 w-full"}>
               <div className={"w-full"}>

                   <div className={"my-5 text-2xl"}>
                       Gestion des utilisateurs
                   </div>
                   <div className={"w-full"}>
                       <div className={"my-10 w-full"}>
                           <form action="" onSubmit={handleSubmit} className={"grid md:grid-cols-3 gap-4"}>
                               <div className={"w-full"}>
                                   <TextField className={"w-full"} name={"nom"} label={"Nom"} value={data.nom} onChange={(e)=>setData("nom",e.target.value)}/>
                                   <div className={"flex my-2 text-red-600"}>{props.errors?.nom}</div>
                               </div>
                               <div className={"w-full"}>
                                   <TextField className={"w-full"} name={"prenom"} label={"Prenom"} value={data.prenom} onChange={(e)=>setData("prenom",e.target.value)}/>
                                   <div className={"flex my-2 text-red-600"}>{props.errors?.prenom}</div>
                               </div>
                               <div className={"w-full"}>
                                   <TextField className={"w-full"} name={"login"} label={"Identifiant"} value={data.login} onChange={(e)=>setData("login",e.target.value)}/>
                                   <div className={"flex my-2 text-red-600"}>{props.errors?.login}</div>
                               </div>
                               <div className={"w-full"}>
                                   <TextField className={"w-full"} name={"email"} label={"Email"} value={data.email} onChange={(e)=>setData("email",e.target.value)}/>
                                   <div className={"flex my-2 text-red-600"}>{props.errors?.email}</div>
                               </div>
                               <div className={"w-full"}>
                                   <FormControl  className={"w-full"}>
                                       <InputLabel id="demo-simple-select-standard-label">Situation matrimoniale</InputLabel>
                                       <Select
                                           labelId="demo-simple-select-label"
                                           id="demo-simple-select"
                                           value={data.situation_matrimoniale}
                                           onChange={(e)=>setData("situation_matrimoniale",e.target.value)}
                                           label={"Situation matrimoniale"}
                                       >
                                           <MenuItem value={"Celibataire"}>Celibataire</MenuItem>
                                           <MenuItem value={"Marié"}>Marié(e)</MenuItem>
                                           <MenuItem value={"Divorcé"}>Divorcé(e)</MenuItem>
                                           <MenuItem value={"Concubin"}>Concubin(e)</MenuItem>
                                           <MenuItem value={"Veuf"}>Veuf(ve)</MenuItem>
                                       </Select>
                                   </FormControl>
                                   <div className={"flex my-2 text-red-600"}>{props.errors?.situation_matrimoniale}</div>
                               </div>
                               <div className={"w-full"}>
                                   <TextField className={"w-full"} name={"telephone"} label={"Téléphone"} value={data.telephone} onChange={(e)=>setData("telephone",e.target.value)}/>
                                   <div className={"flex my-2 text-red-600"}>{props.errors?.telephone}</div>
                               </div>
                               <div className={"w-full"}>
                                   <TextField className={"w-full"}  name={"password"} label={"Mot de passe"} value={data.password} onChange={(e)=>setData("password",e.target.value)}/>
                                   <div className={"flex my-2 text-red-600"}>{props.errors?.password}</div>
                               </div>

                               <div className={"w-full"}>
                                   <Autocomplete
                                       className={"w-full"}
                                       id="tags-standard"
                                       onChange={(e,val)=>setData("role",val)}
                                       disablePortal={true}
                                       id={"combo-box-demo"}
                                       options={props.roles}
                                       getOptionLabel={option=>option.libelle}
                                       isOptionEqualToValue={(option, value) => option.id === value.id}
                                       renderInput={(params)=><TextField  fullWidth {...params} placeholder={"Role"} label={params.libelle}/>}
                                   />
                                   <div className={"text-red-600"}>{props.errors?.role}</div>
                               </div>
                               <div className={"gap-5 flex col-span-3"}>
                                   <button className={"p-2 text-white orangeVertBackground rounded hover:text-green-600 hover:bg-white transition duration-500 border hover:border-green-600"} style={{height: 56}} type={"submit"}>
                                       Valider
                                   </button>
                                   <button className={"p-2 text-white bg-red-600 rounded hover:text-red-600 hover:bg-white transition duration-500 border border-red-500"} style={{height: 56}} type={"reset"}>
                                       Annuler
                                   </button>
                               </div>

                           </form>

                       </div>
                   </div>

                   <div className={"flex justify-center"}>
                       {
                           users &&
                                   <DataGrid
                                       sx={{width:10}}
                                       pagination
                                       components={{
                                           Toolbar:GridToolbar,
                                           Pagination:CustomPagination
                                       }}

                                       rows={users}
                                       columns={columns}
                                       pageSize={10}
                                       rowsPerPageOptions={[10]}
                                       autoHeight
                                       autoSize
                                   />
                       }
                       <SnackBar success={ props.success } />
                   </div>
               </div>
           </div>
       </AdminPanel>
    );
}

export default Index;
