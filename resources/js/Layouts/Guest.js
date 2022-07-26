import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/inertia-react';
import {motion} from "framer-motion";

export default function Guest({ children }) {
    return (
        <div className="flex flex-col sm:justify-center items-center bg-gray-100">
            <motion.div
                initial={{y:-10,opacity:0}}
                animate={{y:0,opacity:1}}
                transition={{
                    duration:0.5,
                }}

                className="md:w-6/12 sm:w-10/12 w-10/12 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg mt-10">
                {children}
            </motion.div>
        </div>
    );
}
