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
import {Pagination,Box} from "@mui/material";
import {maxWidth} from "@mui/system";


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


const columns = [
    { field: 'id', headerName: 'ID',maxWidth:"100%",flex: 1,resizable: false},
    { field: 'nom', headerName: 'PRENOM',flex: 1,resizable: true },
    { field: 'prenom', headerName: 'NOM',flex: 1 },
    { field: 'email', headerName: 'EMAIL',maxWidth:"100%",flex: 1 },
    { field: 'situation_matrimoniale', headerName: 'SITUATION MATRIMONIALE',flex: 1 },
    { field: 'telephone', headerName: 'TELEPHONE',flex: 1 },

];



function Index(props) {

    const [users,setUsers] = useState();

    useEffect(() => {
        setUsers(props.users);
    },[props.users])

    function MyCustomColumnMenu(background) {

        return <div className="bg-black">
            MAU
        </div>
    }

    return (
       <AdminPanel auth={props.auth} error={props.error} >
           <div className={"p-5"}>
               <div>

                   <div className={"my-5 text-2xl"}>
                       Gestions des utilsateurs
                   </div>

                   <div style={{height:450 }} className={"flex justify-center"}>
                       {
                           users &&

                                   <DataGrid

                                       sx={{

                                           "& .MuiDataGrid-columnHeaderTitleContainerContent .MuiCheckbox-root, & .MuiDataGrid-columnHeaderTitleContainerContent .MuiIconButton-root":
                                               {
                                                   color:"white"
                                               }
                                       }}
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
                                           }



                                       }}
                                       rows={users}
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
