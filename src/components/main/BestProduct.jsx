import { useState, useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "../scss/bestProduct.scss";
import { Navigation } from "swiper/modules";
import SectionTitle from "../SectionTitle";
import SlideInSection from "../SlideInSection";
import FadeInSection from "../FadeInSection";
import { Link, useNavigate } from "react-router-dom";
import { items } from "../../data/finalData";

const BPmain = [
    {
        src: "./images/main/bestproduct/BP/Bp04.png", alt: "slider1",
        moreLink: "/accessory/strap?sort=popular",
        Bpproduct: [
            { id: "CTF-36679186-16011071", BPimage: "./images/main/bestproduct/BpProduct003.png" },
            { id: "CTF-36452952-16011010", BPimage: "./images/main/bestproduct/BpProduct004.png" },
            { id: "CTF-33115881-16008152", BPimage: "./images/main/bestproduct/BpProduct005.png" },
            { id: "CTF-34735868-16010810", BPimage: "./images/main/bestproduct/BpProduct006.png" },
        ]
    },
    {
        src: "./images/main/bestproduct/BP/Bp02.png", alt: "slider2",
        moreLink: "/case/device?sort=popular",
        Bpproduct: [
            { id: "CTF-32503883-16009386", BPimage: "./images/main/bestproduct/BpProduct001.png" },
            { id: "CTF-27729581-16009387", BPimage: "./images/main/bestproduct/BpProduct002.png" },
            { id: "CTF-30331173-16009649", BPimage: "./images/main/bestproduct/BpProduct011.png" },
            { id: "CTF-37498812-16010942", BPimage: "./images/main/bestproduct/BpProduct012.png" }
        ]
    },
    {
        src: "./images/main/bestproduct/BP/Bp03.png", alt: "slider3",
        moreLink: "/case/device?sort=popular",
        Bpproduct: [
            { id: "CTF-29949652-16007368", BPimage: "./images/main/bestproduct/BpProduct009.png" },
            { id: "CTF-35969300-16006863", BPimage: "./images/main/bestproduct/BpProduct010.png" },
            { id: "CTF-34678235-16010212", BPimage: "./images/main/bestproduct/BpProduct007.png" },
            { id: "CTF-34518386-16010217", BPimage: "./images/main/bestproduct/BpProduct008.png" },
        ]
    },
    {
        src: "./images/main/bestproduct/BP/Bp01.png", alt: "slider4",
        moreLink: "/travel/suitcase?sort=popular",
        Bpproduct: [
            { id: "CTF-36811745-16008063", BPimage: "./images/main/bestproduct/BpProduct013.png" },
            { id: "CTF-36130084-16010001", BPimage: "./images/main/bestproduct/BpProduct014.png" },
            { id: "CTF-35270620-16010001", BPimage: "./images/main/bestproduct/BpProduct015.png" },
            { id: "CTF-36130099-16008065", BPimage: "./images/main/bestproduct/BpProduct016.png" }
        ]
    }
];

const [slide1, slide2, slide3, slide4] = BPmain;

export default function BestProduct() {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const productMap = useMemo(() => {
        const map = {};
        items.forEach((item) => { map[String(item.id)] = item; });
        return map;
    }, []);

    return (
        <section className="bp-wrap">
            <div className="inner">
                {/* <FadeInSection direction="up" delay={0.2}> */}
                <SectionTitle title="Best Product" subtitle="지금 케이스티파이에서 가장핫한 제품" />
                {/* </FadeInSection> */}

                <div className="all">
                    <div className="left">
                        <SlideInSection direction="left" delay={0.4}>
                            <div className="bp-swiper-wrap">
                                <Swiper
                                    modules={[Navigation]}
                                    navigation={{
                                        nextEl: ".bp-btn-next",
                                        prevEl: ".bp-btn-prev",
                                    }}
                                    grabCursor={true}
                                    loop={true}
                                    onSlideChange={(swiper) => { setActiveIndex(swiper.realIndex); }}
                                >
                                    <SwiperSlide><img src={slide1.src} alt={slide1.alt} /></SwiperSlide>
                                    <SwiperSlide><img src={slide2.src} alt={slide2.alt} /></SwiperSlide>
                                    <SwiperSlide><img src={slide3.src} alt={slide3.alt} /></SwiperSlide>
                                    <SwiperSlide><img src={slide4.src} alt={slide4.alt} /></SwiperSlide>
                                </Swiper>
                                <button className="bp-btn-prev bp-nav-btn" type="button" aria-label="이전">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                                </button>
                                <button className="bp-btn-next bp-nav-btn" type="button" aria-label="다음">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                </button>
                                <div className="bp-slide-counter">
                                    {String(activeIndex + 1).padStart(2, '0')} / {String(BPmain.length).padStart(2, '0')}
                                </div>
                            </div>
                        </SlideInSection>
                    </div>

                    <SlideInSection className="right" direction="right" delay={0.4}>
                        <ul>
                            {BPmain[activeIndex]?.Bpproduct.map((bpItem) => {
                                const product = productMap[String(bpItem.id)];
                                return (
                                    <li key={bpItem.id}>
                                        <Link to={`/detail/${bpItem.id}`}>
                                            <div>
                                                <img src={bpItem.BPimage} alt={product?.productName || "best product"} />
                                            </div>
                                            <div>
                                                <p className="name">{product?.productName || "상품명 없음"}</p>
                                                <p className="price">
                                                    {product?.price != null
                                                        ? `${Number(product.price).toLocaleString()}원`
                                                        : "가격 정보 없음"}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                        <button
                            type="button"
                            onClick={() => navigate(BPmain[activeIndex]?.moreLink)}
                        >
                            더보기
                        </button>
                    </SlideInSection>
                </div>
            </div>
        </section>
    );
}