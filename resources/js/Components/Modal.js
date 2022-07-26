import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {useEffect, useState} from "react";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius:2,
    boxShadow: 24,
    p: 4,
};

export default function ModalComponent({open,setOpen,contenu,width,maxWidth, minWidth}) {

    return (
        <div>
            <Modal
                open={open}
                onClose={()=>setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={[style,{width:width,minWidth: minWidth,maxWidth:maxWidth}]}>
                    <div className="p-4">
                        {contenu()}
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
