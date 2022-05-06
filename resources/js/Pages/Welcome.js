import React from 'react';
import { Link, Head } from '@inertiajs/inertia-react';
import Authenticated from "@/Layouts/Authenticated";

import img1 from "../img/img1.jpg"
import img2 from "../img/img2.jpg"
import img3 from "../img/img3.jpg"
import img4 from "../img/img4.jpg"

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar,Autoplay, EffectFade } from 'swiper';

export default function Welcome(props) {
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
        >
            <Head title="Accueil" />

            <div>
                <div className={"relative"}>
                    {
                        props.auth.etablissement &&
                        <div className={"absolute text-4xl z-20 w-full h-full flex justify-center items-center text-center p-20"}>
                            <div className={"bg-white rounded bg-transparent"}>
                                Bienvenue à {props.auth?.user?.etablissement_admin?.nom}
                            </div>
                        </div>
                    }

                    <Swiper
                        modules={[Navigation, Pagination,Autoplay,EffectFade]}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{delay:3000}}
                        navigation
                        pagination={{ clickable: true }}
                        onSwiper={(swiper) => console.log(swiper)}
                        onSlideChange={() => console.log('slide change')}
                    >
                        <SwiperSlide><img className={"w-full"} style={{maxHeight:"80vh",objectFit:"cover"}} src={img1} alt=""/></SwiperSlide>
                        <SwiperSlide><img className={"w-full"} style={{maxHeight:"80vh",objectFit:"cover"}} src={img2} alt=""/></SwiperSlide>
                        <SwiperSlide><img className={"w-full"} style={{maxHeight:"80vh",objectFit:"cover"}} src={img3} alt=""/></SwiperSlide>
                        <SwiperSlide><img className={"w-full"} style={{maxHeight:"80vh",objectFit:"cover"}} src={img4} alt=""/></SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </Authenticated>
    );
}
