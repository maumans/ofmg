// Libraries
import React from 'react';

// Components
import HeroSlider, {
    Slide,
    Nav,
    OverlayContainer,
} from 'hero-slider';

export default function BasicSlider({images,titre}) {
    return (
        <HeroSlider
            slidingAnimation="left_to_right"
            orientation="horizontal"
            initialSlide={1}
            style={{
                color: '#FFF'
            }}
            settings={{
                slidingDuration: 250,
                shouldAutoplay: true,
                shouldDisplayButtons: true,
                autoplayDuration: 5000,
                height: '90vmin',
            }}
        >
            <OverlayContainer
                style={{
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.33)',
                    textAlign: 'center',
                }}
            >
                <div>

                    <div className="text-xl font-bold md:text-5xl sm:text-3xl text-2xl">
                        {
                            titre
                        }
                    </div>
                </div>
            </OverlayContainer>
            {
                images.map(img=>(
                    <Slide
                        background={{
                            backgroundImage: img,
                            backgroundAttachment: 'fixed',
                            backgroundPosition: 'center center',
                        }}
                    />
                ))
            }

            <Nav />
        </HeroSlider>
    );
}
