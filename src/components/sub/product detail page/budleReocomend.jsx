import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "./scss/recomand.scss";

import { items as allItems, modelColorOptions } from "../../../data/finalData";

// ✅ 이미지 로딩 상태를 카드별로 분리 관리 (깜빡임 원인)
function RecommendCard({ p, onClick }) {
    const [loaded, setLoaded] = useState(false);

    // 후보 경로 목록 생성
    const getCandidates = (p) => {
        const base = `/images/category/products/${p.id}`;
        const modelColors = modelColorOptions[p.modelKey];
        const firstModelColor = modelColors?.[0]?.key ?? "";
        const mainColor = p.mainCaseColor ?? "";
        const modelKey = p.modelKey ?? "";

        return [
            // {id}_{modelKey}_{firstModelColor}_{mainCaseColor}_main.jpg
            modelKey && firstModelColor && mainColor
                ? `${base}_${modelKey}_${firstModelColor}_${mainColor}_main.jpg`
                : null,
            // {id}_{modelKey}_{mainCaseColor}_main.jpg
            modelKey && mainColor
                ? `${base}_${modelKey}_${mainColor}_main.jpg`
                : null,
            // {id}_{mainCaseColor}_main.jpg
            mainColor ? `${base}_${mainColor}_main.jpg` : null,
            // {id}_main.jpg
            `${base}_main.jpg`,
            // 최종 폴백
            "/images/no-image.png",
        ].filter(Boolean);
    };

    const candidates = getCandidates(p);
    const [src, setSrc] = useState(candidates[0]);
    const [triedIdx, setTriedIdx] = useState(0);

    const handleError = () => {
        const nextIdx = triedIdx + 1;
        if (nextIdx < candidates.length) {
            setTriedIdx(nextIdx);
            setSrc(candidates[nextIdx]);
        }
    };

    return (
        <div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
            {/* ✅ 이미지를 감싸는 wrapper로 스켈레톤을 absolute 겹침 처리 */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
                {!loaded && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "8px",
                            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.2s infinite",
                        }}
                    />
                )}
                <img
                    src={src}
                    alt={p.productName}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setLoaded(true)}
                    onError={handleError}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                        display: "block",
                        opacity: loaded ? 1 : 0,
                        transition: "opacity 0.25s ease",
                    }}
                />
            </div>
            <p className="name">{p.productName}</p>
            <p className="price">{Number(p.price).toLocaleString()}원</p>
        </div>
    );
}

export default function budleReocomend({ item }) {
    const navigate = useNavigate();

   const recommendedItems = useMemo(() => {
    return allItems
        .filter((p) => p.id !== item.id && Array.isArray(p.mainCategory) 
                ? p.mainCategory.includes("accessory") 
                : p.mainCategory === "accessory")
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);
}, [item.id]);

    if (!item) return null;

    return (
        <div className="recommend-list">
            <h3 className="title">번들 상품</h3>
            <Swiper slidesPerView={5} spaceBetween={20} grabCursor={true}>
                {recommendedItems.map((p) => (
                    <SwiperSlide key={p.id}>
                        <RecommendCard
                            p={p}
                            onClick={() => navigate(`/detail/${p.id}`)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}