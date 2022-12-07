import SnackBarFinal from "@/Components/SnackBarFinal";

require('./bootstrap');

import React from 'react';
import { render } from 'react-dom';
import {createInertiaApp, usePage} from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'E-school';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => require(`./Pages/${name}`),
    setup({ el, App, props }) {
        window.User={
            id:props.initialPage.props?.auth?.user?.id
        }
        return render(<App {...props} />, el);
    },
});

InertiaProgress.init({ color: '#ff7900'});
