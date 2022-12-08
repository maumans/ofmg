import React, {useEffect, useState} from 'react';
import Authenticated from "@/Layouts/Authenticated";
import SnackBar from "@/Components/SnackBar";
import Box from "@mui/material/Box";
import Save from "@/Components/Pdfrender";
import {LinearProgress, Modal} from "@mui/material";
import {useRemember} from "@inertiajs/inertia-react";
import SnackBarFinal from "@/Components/SnackBarFinal";
import {Inertia} from "@inertiajs/inertia";
import EastIcon from '@mui/icons-material/East';

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

    const [notification,setNotification] = useState(null);

    const handleCloseModal = () => setOpenModal(false);

    Echo.private(`App.Models.User.2`)
        .notification((notif) => {
            setNotification(notif)
            //notify.show('Toasty!');
        });

    useEffect(() => {
        console.log(notification)
    },[notification])

    return (
        <Authenticated
            auth={auth}
            errors={errors}
            setNotification={setNotification}
        >

            <div className="flex">
                <div className={`p-5 space-y-5 `}>
                    <div>
                        Votre paiement est en cours de traitement vous allez recevoir un message de confirmation sur votre téléphone!
                        Merci de vérifier vos transactions
                    </div>

                    <div>
                        <button onClick={()=>Inertia.get(route('tuteur.paiement.index',[auth.user]))}  className={"p-2 text-white orangeOrangeBackground hover:orangeOrangeBackground transition duration-500 rounded"}>Cliquez ici <EastIcon/></button>
                    </div>

                    <div>
                        {/*<button onClick={handleOpenModal} className={"p-2 text-white orangeOrangeBackground hover:orangeOrangeBackground transition duration-500 rounded"}>
                                        Consulter le reçu
                                    </button>*/}
                    </div>

                    {/*<Modal
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
                                </Modal>*/}

                </div>
            </div>
            {
                notification && <SnackBarFinal success={notification.transaction.message}/>
            }

        </Authenticated>
    );
}

export default Ok;
