import React, {useState} from "react";
import PropTypes from "prop-types";
import Slick from "react-slick";
import {Overlay, CloseBtn, Global, Indicator, Header, SlickWrapper, ImageWrapper} from './styles';
const ImagesZoom = ({images, onClose}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <Overlay>
            <Global/>
            <Header>
                <h1>상세 이미지</h1>
                <CloseBtn onClick={onClose}>X</CloseBtn>
            </Header>
            <SlickWrapper>
                <div>
                    <Slick
                        infinite={true}
                        arrows={false}
                        afterChange={slide => setCurrentSlide(slide)}
                        speed={500}
                        slidesToShow={1}
                        slidesToScroll={1}
                    >
                        {images.map(v => (
                            <ImageWrapper key={v.src}>
                                <img src={v.src} alt={v.src}/>
                            </ImageWrapper>
                        ))}
                    </Slick>
                    <Indicator>
                        <div>
                            {`${currentSlide + 1} / ${images.length}`}
                        </div>
                    </Indicator>
                </div>
            </SlickWrapper>
        </Overlay>
    );
}

ImagesZoom.propTypes={
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired,
}
export default ImagesZoom;
