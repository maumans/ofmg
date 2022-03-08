import React, {useEffect} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";

import {DataGrid, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector} from '@mui/x-data-grid';
import {Pagination} from "@mui/material";

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nom', headerName: 'PRENOM', width: 130 },
    { field: 'prenom', headerName: 'NOM', width: 130 },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90,
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) =>
            `${params.row.nom || ''} ${params.row.prenom || ''}`,
    },
];

const rows = [
    { id: 1, prenom: 'Snow', nom: 'Jon', age: 35 },
    { id: 2, prenom: 'Lannister', nom: 'Cersei', age: 42 },
    { id: 3, prenom: 'Lannister', nom: 'Jaime', age: 45 },
    { id: 4, prenom: 'Stark', nom: 'Arya', age: 16 },
    { id: 5, prenom: 'Targaryen', nom: 'Daenerys', age: 12 },
    { id: 6, prenom: 'Melisandre', nom: null, age: 150 },
    { id: 7, prenom: 'Clifford', nom: 'Ferrara', age: 44 },
    { id: 8, prenom: 'Frances', nom: 'Rossini', age: 36 },
    { id: 9, prenom: 'Roxie', nom: 'Harvey', age: 65 },
];

function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            count={pageCount}
            page={page + 2}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}
function Index(props) {


    return (
      <AdminPanel auth={props.auth} error={props.error}>
            <div className={"p-5"}>
                <div>

                    <div>

                    </div>

                    <div style={{height:450, width: '100%' }} className={"flex justify-center"}>
                        <DataGrid
                            componentsProps={{
                                columnMenu:{backgroundColor:"red"}
                            }}
                            rows={rows}
                            columns={columns}
                            pageSize={6}
                            rowsPerPageOptions={[6]}
                            checkboxSelection
                        />
                    </div>
                </div>
            </div>
      </AdminPanel>
    );
}

export default Index;
