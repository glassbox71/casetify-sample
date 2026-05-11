import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css";
import "swiper/css/navigation";
import "../scss/bestProduct.scss"
import "../scss/custom.scss"
// import { Autoplay } from 'swiper/modules'            // ← autoplay 필요 시 재활성화
import { Navigation } from 'swiper/modules'
import SectionTitle from '../SectionTitle';
import SlideInSection from '../SlideInSection';
import FadeInSection from '../FadeInSection';
import { useNavigate } from 'react-router-dom';

// id별 커스텀 스튜디오 진입 device 매핑
const CU_DEVICE_MAP = {
    1: 'phone',
    2: 'phone',
    3: 'phone',
    4: 'tablet',
    5: 'laptop',
    6: 'phone',
    7: 'phone',
    8: 'phone',
};

const CUmain = [
    {
        src: "./images/main/custom/CU/custom1.png", alt: "slider1",
        Cuproduct: [
            { id: 1, title: "S26 포토 커스텀 케이스", price: 102000, CUimage: "/images/main/custom/CUProduct05.png" },
            { id: 2, title: "아이폰 텍스트 커스텀 케이스", price: 58000, CUimage: "/images/main/custom/CUProduct06.png" },
            { id: 3, title: "아이폰 스티커 커스텀 케이스", price: 83000, CUimage: "/images/main/custom/CUProduct07.png" },
            { id: 4, title: "태블릿 스티커 커스텀 케이스", price: 101000, CUimage: "/images/main/custom/CUProduct08.png" }
        ]
    },
    {
        src: "./images/main/custom/CU/custom2.png", alt: "slider2",
        Cuproduct: [
            { id: 5, title: "랩탑 케이스 커스터마이징", price: 89000, CUimage: "/images/main/custom/CUProduct09.png" },
            { id: 6, title: "울트라 바운스 케이스", price: 45000, CUimage: "/images/main/custom/CUProduct10.png" },
            { id: 7, title: "울트라 바운스 케이스", price: 51000, CUimage: "/images/main/custom/CUProduct11.png" },
            { id: 8, title: "아이폰 포토 커스터마이징", price: 83000, CUimage: "/images/main/custom/CUProduct12.png" }
        ]
    }
];

const [slide1, slide2] = CUmain;

export default function Custom() {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const goToCustomStudio = (id) => {
        const device = CU_DEVICE_MAP[id] || 'phone';
        navigate('/custom/studio', { state: { deviceType: device } });
    };

    return (
        <section className='custom-wrap bp-wrap'>
            <div className="inner">
                <div className="all">
                    <div className="left">
                        <SlideInSection direction="left" delay={0.4} className='w-100'>
                            <div className="cu-swiper-wrap">
                                <Swiper
                                    modules={[Navigation]}
                                    navigation={{
                                        nextEl: ".cu-btn-next",
                                        prevEl: ".cu-btn-prev",
                                    }}
                                    grabCursor={true}
                                    loop={true}
                                    onSlideChange={(swiper) => { setActiveIndex(swiper.realIndex); }}
                                >
                                    <SwiperSlide><img src={slide1.src} alt={slide1.alt} /></SwiperSlide>
                                    <SwiperSlide><img src={slide2.src} alt={slide2.alt} /></SwiperSlide>
                                </Swiper>
                                <button className="cu-btn-prev cu-nav-btn" type="button" aria-label="이전">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                                </button>
                                <button className="cu-btn-next cu-nav-btn" type="button" aria-label="다음">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                </button>
                                <div className="cu-slide-counter">
                                    {String(activeIndex + 1).padStart(2, '0')} / {String(CUmain.length).padStart(2, '0')}
                                </div>

                            </div>
                        </SlideInSection>
                    </div>
                    <div className="right">
                        {/* <FadeInSection direction="up" delay={0.2}> */}
                        <SectionTitle title="Customize Your Case" subtitle="케이스티파이에서 나만의 케이스를 제작해보세요" />
                        {/* </FadeInSection> */}
                        <SlideInSection direction="right" delay={0.4} className='w-100'>
                            <ul>
                                {CUmain[activeIndex]?.Cuproduct.map((item) => (
                                    <li key={item.id} onClick={() => goToCustomStudio(item.id)} style={{ cursor: 'pointer' }}>
                                        <div>
                                            <img src={item.CUimage} alt="" />
                                        </div>
                                        <div>
                                            <p className='name'>{item.title}</p>
                                            <p className='price'>{item.price.toLocaleString()}원</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => navigate('/custom')}>
                                커스텀하기
                            </button>
                        </SlideInSection>
                    </div>
                </div>
            </div>
        </section>
    )
}