import React, {useEffect, useState} from 'react';
import {DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector} from '@mui/x-data-grid';
import {Pagination} from "@mui/material";
import AdminPanel from "@/Layouts/AdminPanel";

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'libelle', headerName: 'LIBELLE', width: 130 },

];
function Index(props) {

    const [roles,setRoles] = useState();

    useEffect(() => {
        setRoles(props.roles);
    },[props.roles])


    return (
        <AdminPanel auth={props.auth} error={props.error} >
            <div className={"p-5"}>
                <div>

                    <div className={"my-5 text-2xl"}>
                        Gestions des roles
                    </div>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        {
                            roles &&
                            <DataGrid
                                componentsProps={{
                                    columnMenu:{backgroundColor:"red",background:"yellow"}
                                }}
                                rows={roles}
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
