import React, {useEffect, useState} from 'react';
import AdminPanel from "@/Layouts/AdminPanel";
import ListAltIcon from "@mui/icons-material/ListAlt";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {Button, Checkbox} from "@mui/material";
import {Inertia} from "@inertiajs/inertia";
import {motion} from "framer-motion";

function Validation({auth,error,apprenants,classe}) {

    const [loading,setLoading] = useState(true);
    const [columns,setColumns] = useState([]);

    const [tarifs,setTarifs] = useState([])

    useEffect(() => {
        setLoading(false)
    },[apprenants]);

    useEffect(() => {
        apprenants.map((apprenant) => {

            classe?.tarifs?.map((tarif)=>(
                setTarifs((tarifs)=>({
                    ...tarifs,
                    [apprenant.id+"-"+tarif.id]:!!tarif.obligatoire
                }))
            ))
        })
    },[])



    useEffect(() => {
        let tab=[
            { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
            { field: 'prenom', headerName: 'PRENOM', width:150,renderCell:(cellValues)=>cellValues.row?.prenom},
            { field: 'nom', headerName: 'NOM', width:150,renderCell:(cellValues)=>cellValues.row?.nom},
            { field: 'matricule', headerName: 'MATRICULE', width:150,renderCell:(cellValues)=>cellValues.row?.matricule},
            { field: 'classe', headerName: 'CLASSE', width:150, renderCell:(cellValues)=>cellValues.row.classe?.libelle },
        ]
        classe?.tarifs?.map((tarif)=>(
                tab.push({
                    field: tarif?.type_paiement?.libelle,
                    headerName: tarif?.type_paiement?.libelle.toUpperCase(),
                    width:150,
                    renderCell:(cellValues)=>(
                        <Checkbox
                            defaultChecked={!!tarif.obligatoire}
                            disabled={!!tarif.obligatoire}
                            name={cellValues.row.id+"-"+tarif.id}
                            checked={tarifs[cellValues.row.id+"-"+tarif.id]}
                            onChange={handleChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    )
                })
            )
        )

        setColumns(tab)
    },[])

    function handleChange(event)
    {
        setTarifs((tarifs)=>(
            {
                ...tarifs,
                [event.target.name]:event.target.checked
            }
        ))

    }

    useEffect(()=>{
        console.log(tarifs)
    },[tarifs])

    /*const columns = [
        { field: 'numero', headerName: 'N°', minWidth: 100,renderCell:cellValues=>cellValues.api.getRowIndex(cellValues.row.id)+1 },
        { field: 'prenom', headerName: 'PRENOM', width:150,renderCell:(cellValues)=>cellValues.row?.prenom},
        { field: 'nom', headerName: 'NOM', width:150,renderCell:(cellValues)=>cellValues.row?.nom},
        { field: 'matricule', headerName: 'MATRICULE', width:150,renderCell:(cellValues)=>cellValues.row?.matricule},
        { field: 'classe', headerName: 'CLASSE', width:300, renderCell:(cellValues)=>cellValues.row.classe?.libelle },
        { field: 'action', headerName: 'ACTION',width:150,
            renderCell:(cellValues)=>(
                <div className={"space-x-2"}>
                    {/!*<button onClick={()=>handleDetails(cellValues.row)} className={"p-2 text-white orangeVioletBackground rounded hover:text-blue-500 hover:bg-white transition duration-500"}>
                        <ListAltIcon/>
                    </button>*!/}
                </div>
            )
        },

    ];*/


    return (
        <AdminPanel auth={auth} error={error} sousActive={"reinscription"}
                    active={"gestionCursus"}>
            <div>
                <div>
                    <div className={"my-5 text-2xl text-white orangeOrangeBackground rounded text-white p-2"}>
                        Réinscription
                    </div>

                    <motion.div
                        initial={{y:-100,opacity:0}}
                        animate={{y:0,opacity:1}}
                        transition={{
                            duration:0.5,
                            type:"spring",
                        }}

                        style={{width: '100%' }} className={"justify-center"}>

                        <form onSubmit={(e)=>{
                            e.preventDefault();
                            setLoading(true)
                            Inertia.post(route('etablissement.reinscription.validationSubmit',[auth.user?.id]),{tarifs,classe})
                        }}
                        >
                            <DataGrid

                                loading={loading}

                                components={{
                                    Toolbar:GridToolbar,
                                }}

                                rows={apprenants}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        pageSize: 30,
                                    },
                                }}
                                rowsPerPageOptions={[30,50,100]}
                                autoHeight
                            />

                            <div className={'w-fit mt-5'}>
                                <Button type={'submit'} variant={"outlined"} color={"info"}>
                                    Enregistrer
                                </Button>
                            </div>

                        </form>


                    </motion.div>
                </div>
            </div>
        </AdminPanel>
    );
}

export default Validation;
