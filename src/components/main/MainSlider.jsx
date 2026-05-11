import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'

import 'swiper/css'

import "../scss/MainSlider.scss"
import { useMainSlider } from '../../store/useMainSlider'

export default function MainSlider() {
    //헤더글자색 변경
    const { headerColor, setHeaderColor } = useMainSlider();
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        {
            src: "./images/main/main-slider/main-slider5.png", alt: "main-slider5",
            titleImg: "./images/main/main-slider/main-slider-title5.png",
            text: "단 하나의 마그네틱 스타, 단 하나의 독보적인 에딧. \n 아일릿 원희의 감성으로 채운 Y2K",
            sub: "", color: "#fff", headerColor: "white"
        },
        {
            src: "./images/main/main-slider/main-slider1.png", alt: "main-slider1",
            titleImg: "./images/main/main-slider/main-slider-title1.png",
            text: "나를 만난 모든 순간, 그 모든 여정에 함께.",
            color: "#fff", headerColor: "white"
        },
        {
            src: "./images/main/main-slider/main-slider2.png", alt: "main-slider2",
            titleImg: "./images/main/main-slider/main-slider-title2.png",
            text: "에스더 버니와 함께하는 즐거운 여정!",
            color: "#2f2f2f", headerColor: "black"
        },
        {
            src: "./images/main/main-slider/main-slider3.png", alt: "main-slider3",
            titleImg: "./images/main/main-slider/main-slider-title3.png",
            text: "Infinity In Bloom Collection",
            sub: "천상의 리본과 끝없는 가능성이 만나는 곳",
            color: "#2f2f2f", headerColor: "black"
        },
        {
            src: "./images/main/main-slider/main-slider4.png", alt: "main-slider4",
            titleImg: "./images/main/main-slider/main-slider-title4.png",
            text: "완벽하게 당신다운, 세상에 없던 단 하나의 케이스.",
            sub: "", color: "#2f2f2f", headerColor: "black"
        },
    ]

    return (
        <div className="main-slider-wrap">
            <Swiper
                className='main-slider-img'
                modules={[Autoplay]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                onSwiper={(swiper) => {
                    setHeaderColor(slides[swiper.realIndex].headerColor);
                    setCurrentIndex(swiper.realIndex);
                }}
                onSlideChange={(swiper) => {
                    setHeaderColor(slides[swiper.realIndex].headerColor);
                    setCurrentIndex(swiper.realIndex);
                }}
            >
                {slides.map((slide, i) => (
                    <SwiperSlide key={i}>
                        <img src={slide.src} alt={slide.alt} />

                        <div className="slide-title">
                            <div className="title-img">
                                <img src={slide.titleImg} alt="title" />
                            </div>

                            <div className="title-text">
                                {slide.text && <p className="main-text" style={{ color: slide.color }}>{slide.text}</p>}
                                {slide.sub && <p className='sub-text' style={{ color: slide.color }}>{slide.sub}</p>}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 🔥 여기로 이동 */}
            <div className={`slide-counter ${headerColor}`}>
                {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
        </div>
    )
}