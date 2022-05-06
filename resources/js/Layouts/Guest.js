import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/inertia-react';

export default function Guest({ children }) {
    return (
        <div className="flex flex-col sm:justify-center items-center bg-gray-100">
            <div className="md:w-6/12 sm:w-10/12 w-10/12 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg mt-10">
                {children}
            </div>
        </div>
    );
}
