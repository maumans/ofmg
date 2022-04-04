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

    const {data,setData,post}=useForm({
        "nom":"",
        "prenom":"",
        "email":"",
        "situation_matrimoniale":"",
        "telephone":"",
        "password":"",
        "date_naissance":"",
        "roles":[],
    });

    useEffect(() => {
       setUsers(props.users);
    },[props.users])

    const columns = [
        { field: 'id', headerName: 'ID',flex:1,minWidth:100},
        { field: 'nom', headerName: 'PRENOM',flex:1,minWidth:150},
        { field: 'prenom', headerName: 'NOM',flex:1,minWidth:150 },
        { field: 'email', headerName: 'EMAIL',flex:1,minWidth:150},
        { field: 'situation_matrimoniale', headerName: 'SITUATION MATRIMONIALE',flex:1,minWidth:150 },
        { field: 'telephone', headerName: 'TELEPHONE',flex:1,minWidth:150 },
        { field: 'status', headerName: 'STATUS',flex:1,minWidth:100,
            renderCell:(user)=>(
                user.status
            )
        },

        { field: 'role(s)', headerName: 'ROLES',flex:1,minWidth:300,
            renderCell:(user)=>(
                <div>
                    {user.row.roles.map((role)=> role.libelle+" ")}
                </div>
            )
        },

        { field: 'action', headerName: 'ACTION',width:250,
            renderCell:(cellValues,i)=>(
                <div key={i} className={"space-x-2"}>
                    <button onClick={()=>handleShow(cellValues.row.id)} className={"p-2 text-white bg-blue-500"}>
                        voir
                    </button>
                    <button onClick={()=>handleEdit(cellValues.row.id)} className={"p-2 text-white bg-red-700"}>
                        modifier
                    </button>
                    <button onClick={()=>handleDelete(cellValues.row.id)} className={`${cellValues.row.status==="Actif"?" bg-red-500":" bg-green-500"} p-2 text-white`}>
                        {
                            cellValues.row.status==="Actif"?"Bloquer":" Debloquer"
                        }
                    </button>

                </div>
            )
        },

    ];

    function handleDelete(id){
        confirm("Voulez-vous ... cet user") && Inertia.delete(route("admin.user.destroy",[props.auth.user.id,id]),{preserveScroll:true})
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

        post(route("admin.user.store",props.auth.user.id),data)

    }

    return (
       <AdminPanel auth={props.auth} error={props.error} >
           <div className={"p-5 w-full"}>
               <div className={"w-full"}>

                   <div className={"my-5 text-2xl"}>
                       Gestions des utilsateurs
                   </div>
                   <div className={"w-full"}>
                       <button className={"p-1 text-white my-5"} style={{backgroundColor:"#FF7900"}}>
                           Ajouter un nouvel utilisateur
                       </button>
                       <div className={"my-10 w-full"}>
                           <div className={"w-96"}>
                               <form action="" onSubmit={handleSubmit} className={"space-y-5"}>
                                   <div className={"space-x-5 flex"}>
                                       <div>
                                           <TextField  name={"nom"} label={"nom"} value={data.nom} onChange={(e)=>setData("nom",e.target.value)}/>
                                           <div className={"flex my-2 text-red-600"}>{props.errors?.nom}</div>
                                       </div>
                                       <div>
                                           <TextField  name={"prenom"} label={"prenom"} value={data.prenom} onChange={(e)=>setData("prenom",e.target.value)}/>
                                           <div className={"flex my-2 text-red-600"}>{props.errors?.prenom}</div>
                                       </div>
                                   </div>
                                   <div className={"space-x-5 flex items-end"}>
                                       <div className={"flex-1"}>
                                           <TextField  name={"email"} label={"email"} value={data.email} onChange={(e)=>setData("email",e.target.value)}/>
                                           <div className={"flex my-2 text-red-600"}>{props.errors?.email}</div>
                                       </div>
                                       <div className={"flex-1"}>
                                           <FormControl  className={"w-full"}>
                                               <InputLabel id="demo-simple-select-standard-label">situation matrimoniale</InputLabel>
                                               <Select
                                                   labelId="demo-simple-select-label"
                                                   id="demo-simple-select"
                                                   value={data.situation_matrimoniale}
                                                   onChange={(e)=>setData("situation_matrimoniale",e.target.value)}
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

                                   </div>
                                   <div className={"space-x-5 flex items-end"}>
                                      <div className={"flex-1"}>
                                          <TextField  name={"telephone"} label={"telephone"} value={data.telephone} onChange={(e)=>setData("telephone",e.target.value)}/>
                                          <div className={"flex my-2 text-red-600"}>{props.errors?.telephone}</div>
                                      </div>
                                       <div className={"flex-1"}>
                                           <TextField  name={"password"} label={"password"} value={data.password} onChange={(e)=>setData("password",e.target.value)}/>
                                           <div className={"flex my-2 text-red-600"}>{props.errors?.password}</div>
                                       </div>
                                   </div>
                                   <div className={"space-x-5 flex items-end"}>
                                       <div className={"flex-1"}>
                                           <Autocomplete
                                               multiple
                                               id="tags-standard"
                                               onChange={(e,val)=>setData("roles",val)}
                                               disablePortal={true}
                                               id={"combo-box-demo"}
                                               options={props.roles}
                                               getOptionLabel={option=>option.libelle}
                                               isOptionEqualToValue={(option, value) => option.id === value.id}
                                               renderInput={(params)=><TextField  fullWidth {...params} placeholder={"roles"} label={params.libelle}/>}
                                           />
                                           <div className={"text-red-600"}>{props.errors?.roles}</div>
                                       </div>
                                   </div>
                                   <div className={"space-x-5 my-5"}>
                                       <button className={"p-1 text-white bg-green-600"} type={"submit"}>
                                           Valider
                                       </button>
                                       <button className={"p-1 text-white bg-red-600"} type={"reset"}>
                                           Annuler
                                       </button>
                                   </div>

                               </form>

                           </div>
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

                                       componentsProps={{
                                           row:{
                                               style:{
                                                   backgroundColor:"#"
                                               }
                                           },
                                           header:{
                                               style:{
                                                   color:"red"
                                               }
                                           },
                                           columnMenu:{
                                               style:{
                                                   backgroundColor:"black",
                                                   color:"white"
                                               }
                                           },
                                           cell:{
                                               align:"center"
                                           }
                                       }}
                                       rows={users}
                                       columns={columns}
                                       pageSize={5}
                                       rowsPerPageOptions={[5]}
                                       checkboxSelection
                                       autoHeight
                                       autoSize
                                   />
                       }
                   </div>
               </div>
           </div>
       </AdminPanel>
    );
}

export default Index;
