// Libraries
import React from 'react';
import styled from 'styled-components';

// Components
import HeroSlider, {
    Slide,
    SideNav,
    ButtonsNav,
    OverlayContainer,
} from 'hero-slider';



const StyledOverlayContainer = styled(OverlayContainer)`
  &&& {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-color: rgba(0, 0, 0, 0.33);
    text-align: center;
    H2, H3 {
      margin: 0 36px;
    }
  }
`;

export default function BlendModeSlider({images,titre}) {
    return (
        <HeroSlider
            slidingAnimation="fade"
            orientation="horizontal"
            initialSlide={1}
            style={{
                backgroundColor: '#000',
                color: '#FFF'
            }}
            settings={{
                slidingDuration: 400,
                slidingDelay: 100,
                shouldAutoplay: true,
                shouldDisplayButtons: true,
                autoplayDuration: 8000,
                height: '90vmin'
            }}
        >
            <StyledOverlayContainer>
                <div>

                    <div className="text-xl font-bold md:text-5xl sm:text-3xl text-2xl">
                        {
                            titre
                        }
                    </div>
                </div>
            </StyledOverlayContainer>

            {
                images.map((img,i)=>(

                    <Slide
                        key={i}
                        shouldRenderMask
                        navDescription={img.description}
                        background={{
                            backgroundColor: img.color,
                            backgroundBlendMode: 'luminosity',
                            maskBackgroundBlendMode: 'luminosity',
                            backgroundImage: img.link
                        }}
                    />
                ))
            }

            <ButtonsNav />
            <SideNav
                position={{
                    top: '0',
                    right: '0'
                }}
            />
        </HeroSlider>
    );
}

