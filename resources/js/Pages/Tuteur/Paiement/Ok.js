import React, {useState} from 'react';
import Authenticated from "@/Layouts/Authenticated";
import SnackBar from "@/Components/SnackBar";
import Box from "@mui/material/Box";
import Save from "@/Components/Pdfrender";
import {Modal} from "@mui/material";
import {useRemember} from "@inertiajs/inertia-react";

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

function Ok({auth,errors,success,tuteur,total}) {

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(true);
    }


    const handleCloseModal = () => setOpenModal(false);

    return (
        <Authenticated
            auth={auth}
            errors={errors}
        >
            <div className="flex justify-center">
                <div className={"p-5 text-green-600 space-y-5 "}>
                    <div>
                        Le paiement a été effectué avec succès cliquez sur le button ci-dessous pour consulter le reçu du paiement
                    </div>
                    <div>
                        <button onClick={handleOpenModal} className={"p-2 text-white bg-orange-400 hover:bg-orange-600 transition duration-500 rounded"}>
                            Consulter le reçu
                        </button>
                    </div>

                    <Modal
                        keepMounted
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                    >
                        <Box sx={style}>
                            {

                                <Save
                                    tuteur={tuteur}
                                    apprenant={tuteur.tuteur_apprenants[0]}
                                    etablissement={tuteur.tuteur_apprenants[0].classe.etablissement}
                                    paiements={tuteur.paiements}
                                    nbrMois={10}
                                    total={total}
                                />
                            }
                        </Box>
                    </Modal>

                </div>
            </div>
            <SnackBar success={success}/>
        </Authenticated>
    );
}

export default Ok;
