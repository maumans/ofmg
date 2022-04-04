import React from 'react';
import { Link, Head } from '@inertiajs/inertia-react';
import Authenticated from "@/Layouts/Authenticated";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar,Autoplay, EffectFade } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';


export default function Welcome(props) {
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
        >
            <Head title="Accueil" />

            <div>
                <div>
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
                        <SwiperSlide><img className={"w-full"} style={{maxHeight:"80vh",objectFit:"cover"}} src={"/img/img1.jpg"} alt=""/></SwiperSlide>
                        <SwiperSlide><img className={"w-full"} style={{maxHeight:"80vh",objectFit:"cover"}} src={"/img/img2.jpg"} alt=""/></SwiperSlide>
                        <SwiperSlide><img className={"w-full"} style={{maxHeight:"80vh",objectFit:"cover"}} src={"/img/img3.jpg"} alt=""/></SwiperSlide>
                        <SwiperSlide><img className={"w-full"} style={{maxHeight:"80vh",objectFit:"cover"}} src={"/img/img4.jpg"} alt=""/></SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </Authenticated>
    );
}
