import React from 'react';
import { Link, Head } from '@inertiajs/inertia-react';
import Authenticated from "@/Layouts/Authenticated";
import TypeAnimation from 'react-type-animation';

import img1 from "../img/img1.jpg"
import img2 from "../img/img2.jpg"
import img3 from "../img/img3.jpg"
import img4 from "../img/img4.jpg"

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar,Autoplay, EffectFade } from 'swiper';

// Components
import HeroSlider, {
    Slide,
    Nav,
    OverlayContainer,
} from "hero-slider"
import BasicSlider from "@/Components/heroSliders/BasicSlider";
import BlendModeSlider from "@/Components/heroSliders/BlendModeSlider";
import NavBarSlider from "@/Components/heroSliders/NavBarSlider";
import SnackBar from "@/Components/SnackBar";

export default function Welcome(props) {
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
        >
            <Head title="Accueil" />
            <div>

                <NavBarSlider
                    titre={props.auth.etablissement ?"Bienvenue à "+props.auth?.user?.etablissement_admin?.nom:"La plateforme idéale pour vos paiements scolaires et universitaires"}
                    images={[{image:img1,description:"Frais scolaires"},{image:img2,description:"Paiement de salaire"},{image:img3,description:"Rapport de paiement"},{image:img1,description:"Alerte sur les paiements"},]}
                />
            </div>
        </Authenticated>
    );
}
