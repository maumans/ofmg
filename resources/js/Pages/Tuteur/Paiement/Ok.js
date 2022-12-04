import React, {useEffect, useState} from 'react';
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

function Ok({auth,errors,success,tuteur,total,transaction}) {

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(true);
    }

    useEffect(() => {
        console.log(transaction)
    })

    const handleCloseModal = () => setOpenModal(false);

    return (
        <Authenticated
            auth={auth}
            errors={errors}
        >
            <div className="flex">
                <div className={`p-5 ${transaction.status === "PENDING"?"text-green-600":"text-red-600"} space-y-5 `}>
                    <div>
                        {
                            transaction.status === "PENDING"
                            ? "Votre paiement est en attente de confirmation. Veuillez valider sur votre téléphone " : transaction.message
                        }
                    </div>
                    <div>
                        <button onClick={handleOpenModal} className={"p-2 text-white orangeOrangeBackground hover:orangeOrangeBackground transition duration-500 rounded"}>
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
