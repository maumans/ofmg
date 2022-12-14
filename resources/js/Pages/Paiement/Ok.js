import React, {useState} from 'react';
import Authenticated from "@/Layouts/Authenticated";
import SnackBar from "@/Components/SnackBar";
import Box from "@mui/material/Box";
import Save from "@/Components/RecuHorsConnexion";
import {Modal} from "@mui/material";
import {useRemember} from "@inertiajs/inertia-react";
import {Inertia} from "@inertiajs/inertia";
import EastIcon from "@mui/icons-material/East";

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

function Ok({auth,errors,success,total,apprenant}) {

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
                <div className={"p-5 space-y-5 "}>
                    <div>
                        Votre paiement est en cours de traitement vous allez recevoir un message de confirmation sur votre téléphone!
                    </div>

                    {/*<div>
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
                                    apprenant={apprenant}
                                    total={total}
                                />
                            }
                        </Box>
                    </Modal>*/}

                </div>
            </div>
            <SnackBar success={success}/>
        </Authenticated>
    );
}

export default Ok;
