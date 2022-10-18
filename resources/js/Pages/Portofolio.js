import React from 'react';
import MonImage from "../img/moi.jpeg"
import img1 from "../img/img1.jpg"
import Moi from "../img/Moi.png"

function Portofolio(props) {
    return (
        <div>
            <div>
                <div className={"flex justify-between w-full p-4 items-center gap-4"}>
                    <div className={"flex md:gap-10 gap-4 items-center w-8/12 md:ml-32"} style={{zIndex:30}}>
                        <span className="text-xl font-bold">
                            <span>
                                Port
                            </span>
                            <span className={"ml-1 p-2 bg-green-400 text-white"}>
                                folio
                            </span>
                        </span>
                        <div>
                            Home
                        </div>
                        <div>
                            About Us
                        </div>
                        <div>
                            Portfolio
                        </div>
                        <div>
                            Blog
                        </div>
                        <div>
                            Contact Us
                        </div>
                    </div>
                    <div style={{zIndex:30}} className={"mr-64"}>
                        <button className={"p-3 bg-white text-green-600 font-bold"}>
                            Hire me!
                        </button>
                    </div>
                </div>
                <div className="md:mx-32 mx-20">
                    <div className="relative md:mt-32 mt-64 flex items-center md:w-6/12" style={{zIndex:2}}>
                        <div className="font-bold absolute left-5">
                            <div>
                                F
                            </div>
                            <div>
                                T
                            </div>
                            <div>
                                B
                            </div>
                            <div>
                                I
                            </div>
                        </div>
                        <div className={"ml-20 gap-4"}>
                            <button className={"p-3 bg-green-100 text-green-600"}>
                                Welcome! I'M
                            </button>
                            <div className="text-4xl">
                                Maurice Mansaré
                            </div>
                            <div className="font-bold">
                                Developpeur web Full-Stack
                            </div>
                            <div className="mt-10">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex exercitationem fuga illo labore molestias saepe veritatis. Alias aliquid corporis dolor eius eveniet labore odit qui repudiandae sit. Animi, iure, officia.
                            </div>
                            <div className={"flex gap-4 mt-10"}>
                                <button className={"py-3 px-10 orangeVertBackground text-white"}>
                                    Hire Me
                                </button>
                                <button className={"py-3 px-10 border border-2  border-black"}>
                                    Explore
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={"absolute top-0 right-0 overflow-hidden"} style={{height: 700,width:700}}>
                        <div style={{width: 500, height: 700,transform:'rotate(60deg)',right:-88,top:-166}} className={"orangeVertBackground absolute "}>

                        </div>
                        <div className={"relative"} style={{top:100}}>
                            <div style={{border: '50px solid #22c55e',width:500,height:500}} className="border border-green-500 rounded-full">
                                <div style={{border: '20px solid white '}} className="rounded-full w-full h-full bg-blue-100">

                                </div>
                            </div>
                            <div style={{width:500,height:500}} className="absolute top-0 rounded-full">
                                <div style={{border: '20px solid #22c55e'}} className="rounded-full w-full h-full">
                                    <img style={{width: 420, height: "auto",left:40, bottom:85}} className="rounded-full absolute overflow-hidden" src={Moi} alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 md:gap-10 md:mx-32 mx-20 mt-64 mb-20">
                <div className={"h-full relative"}>
                    <div className={"rounded-full absolute"} style={{width:150,height:150,border:"15px solid #22c55e",top:-80,left:-80,zIndex:20 }}>

                    </div>
                    <div className="absolute p-2" style={{width:130,height:250,borderRight:"2px dotted #22c55e",borderTop:"2px dotted #22c55e",top:-13,right:-13}}>

                    </div>
                    <div className="absolute p-2" style={{width:122,height:242,borderRight:"2px dotted #22c55e",borderTop:"2px dotted #22c55e",top:-5,right:-5}}>

                    </div>
                    <img className="h-full" style={{objectFit:"cover",zIndex:19}} src={img1} alt=""/>

                </div>
                <div className={"space-y-5 h-full"}>
                    <button className={"p-3 bg-green-100 text-green-600"}>
                        A PROPOS DE MOI
                    </button>

                    <div className={"text-3xl"}>
                        Pourquoi me choisir pour vos projets?
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque autem consequatur deleniti doloremque harum ipsa iure magni necessitatibus, placeat quidem tempora voluptates! Culpa doloremque error explicabo nemo nesciunt odit voluptates.
                    </div>

                    <button className={"py-3 px-10 orangeVertBackground text-white"}>
                        Hire Me
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Portofolio;
