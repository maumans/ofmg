
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Components
import HeroSlider, {
    SideNav,
    Slide,
    MenuNav,
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

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  height: 70px;
  border-bottom: 1px solid rgba(215, 225, 235, 0.6);
  text-align: center;
  font-size: 1rem;
  font-weight: 600;

  & * {
    cursor: pointer;
    margin: 0 12px;
  }

  .fake-navbar-title {
    text-transform: uppercase;
  }

  @media (max-width: 644px) {
    .fake-navbar-links {
      font-size: 0.7rem;
    }
  }
`;

function FakeNavbar(props) {
    const { children } = props;
    return (
        <StyledNav>
            <span className="fake-navbar-title">Fake Navbar</span>
            <div className="fake-navbar-links">
                <span>Home</span>
                <span>Link A</span>
                <span>Link B</span>
            </div>
            {children}
        </StyledNav>
    );
}

FakeNavbar.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
    ]),
};

FakeNavbar.defaultProps = {
    children: null,
};

export default function NavBarSlider({images,titre}) {
    return (
        <HeroSlider
            slidingAnimation="top_to_bottom"
            orientation="vertical"
            initialSlide={1}
            style={{
                color: '#FFF',
            }}
            settings={{
                slidingDuration: 750,
                slidingDelay: 250,
                shouldAutoplay: true,
                shouldDisplayButtons: false,
                autoplayDuration: 4000,
                height: '90vmin',
            }}
        >
            <FakeNavbar />
            <StyledOverlayContainer>
                <div>

                    <div className="text-xl font-bold md:text-5xl sm:text-3xl text-2xl uppercase" style={{lineHeight:2}}>
                        {
                            titre
                        }
                    </div>
                </div>
            </StyledOverlayContainer>

            {
                images.map(img=>(
                    <Slide
                        shouldRenderMask
                        navDescription={img.description}
                        background={{
                            backgroundColor: '#6D9B98',
                            backgroundImage: img.image
                        }}
                    />
                ))
            }


            <MenuNav />
            <SideNav
                position={{
                    top: '0',
                    right: '0'
                }}
            />
        </HeroSlider>
    );
}

