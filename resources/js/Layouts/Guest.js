import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/inertia-react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div>
                <Link href="/">
                    <div className={"text-2xl font-bold text-orange-400 rounded-full bg-white p-10"}>
                        E-School
                    </div>
                </Link>
            </div>

            <div className="md:w-6/12 sm:w-10/12 w-10/12  mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
