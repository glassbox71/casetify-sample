import React, { useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "../scss/Collab.scss";
import { items } from "../../data/finalData";

// artist 키 생성 함수 (CategoryPagePractice와 동일)
const makeArtistIconKey = (artist = "") =>
    artist.trim().toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

export default function Collab() {
    const slides = [
        {
            id: "CTF-37408746-16011285",
            colImg: "./images/main/collab/collab-prod1.png",
            themeImg: "./images/main/collab/collab-th1.png",
            subCate: "character",
        },
        {
            id: "CTF-36428690-16010993",
            colImg: "./images/main/collab/collab-prod2.png",
            themeImg: "./images/main/collab/collab-th2.png",
            subCate: "character",
        },
        {
            id: "CTF-35993212-16010877",
            colImg: "./images/main/collab/collab-prod3.png",
            themeImg: "./images/main/collab/collab-th3.png",
            subCate: "character",
        },
        {
            id: "CTF-37499781-16011325",
            colImg: "./images/main/collab/collab-prod4.png",
            themeImg: "./images/main/collab/collab-th4.png",
            subCate: "movie",
        },
        {
            id: "CTF-36419745-16010991",
            colImg: "./images/main/collab/collab-prod5.png",
            themeImg: "./images/main/collab/collab-th5.png",
            subCate: "fashion",
        },
        {
            id: "CTF-37898905-16011462",
            colImg: "./images/main/collab/collab-prod6.png",
            themeImg: "./images/main/collab/collab-th6.png",
            subCate: "fashion",
        },
        {
            id: "CTF-36136601-16010921",
            colImg: "./images/main/collab/collab-prod7.png",
            themeImg: "./images/main/collab/collab-th7.png",
            subCate: "art",
        },
        {
            id: "CTF-37473568-16011322",
            colImg: "./images/main/collab/collab-prod8.png",
            themeImg: "./images/main/collab/collab-th8.png",
            subCate: "fashion",
        },
        {
            id: "CTF-34890170-16009687",
            colImg: "./images/main/collab/collab-prod9.png",
            themeImg: "./images/main/collab/collab-th9.png",
            subCate: "character",
        },
        {
            id: "CTF-37354478-16011267",
            colImg: "./images/main/collab/collab-prod10.png",
            themeImg: "./images/main/collab/collab-th10.png",
            subCate: "sports",
        },
        {
            id: "CTF-37880847-16011447",
            colImg: "./images/main/collab/collab-prod11.png",
            themeImg: "./images/main/collab/collab-th11.png",
            subCate: "character",
        },
        {
            id: "CTF-35114497-16009996",
            colImg: "./images/main/collab/collab-prod12.png",
            themeImg: "./images/main/collab/collab-th12.png",
            subCate: "sports",
        },
    ];

    const swiperRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const productMap = useMemo(() => {
        const map = {};
        items.forEach((item) => {
            map[String(item.id)] = item;
        });
        return map;
    }, []);

    return (
        <section className="collab-wrap">
            <div className="collab-swiper-wrap">
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
                    loop={true}
                    slidesPerView={5}
                    spaceBetween={30}
                >
                    {slides.map((item) => {
                        const product = productMap[String(item.id)];

                        // 아티스트 기반 컬렉션 링크 생성
                        const artistKey = product?.artist
                            ? makeArtistIconKey(product.artist)
                            : null;
                        const collectionLink = artistKey
                            ? `/colab/${item.subCate}?mini=${artistKey}`
                            : `/colab/${item.subCate}`;

                        return (
                            <SwiperSlide key={item.id}>
                                <div
                                    className="card"
                                    onMouseEnter={() => swiperRef.current?.autoplay.stop()}
                                    onMouseLeave={() => swiperRef.current?.autoplay.start()}
                                >
                                    <div className="card-inner">
                                        <div className="card-brand">
                                            <img
                                                src={item.themeImg}
                                                alt={product?.productName || "collab brand"}
                                                className="theme-img"
                                            />
                                        </div>

                                        <div className="card-back">
                                            <Link to={`/detail/${item.id}`}>
                                                <div className="card-img">
                                                    <img
                                                        src={item.colImg}
                                                        alt={product?.productName || "collab product"}
                                                    />
                                                </div>

                                                <div className="card-content">
                                                    <div>
                                                        <p>
                                                            {product?.productName || "상품명 없음"}
                                                        </p>
                                                        <p className="price">
                                                            {product?.price != null
                                                                ? `${Number(product.price).toLocaleString()}원`
                                                                : "가격 정보 없음"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>

                                            <Link to={collectionLink}>
                                                <button type="button" className="more-btn">
                                                    컬렉션 더보기 +
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                {/* <div className="collab-slide-counter">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </div> */}
            </div>
        </section>
    );
}