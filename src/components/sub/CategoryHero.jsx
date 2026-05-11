import React, { useMemo } from "react";
import "./scss/CategoryHero.scss";

const HERO_TEXT_MAP = {
    "case-device": {
        title: "디바이스",
        subtitle: "다양한 기종에 맞는 케이스를 만나보세요",
    },
    "case-design": {
        title: "디자인",
        subtitle: "감각적인 컬러와 패턴 컬렉션",
    },
    "case-magsafe": {
        title: "맥세이프",
        subtitle: "편리함과 안정감을 더한 MagSafe 컬렉션",
    },
    "case-set": {
        title: "세트",
        subtitle: "함께 사용할 때 더 완성되는 조합",
    },
    "case-collabo": {
        title: "콜라보",
        subtitle: "다양한 브랜드와 함께한 특별한 컬렉션",
    },
    "accessory-strap": {
        title: "스트랩",
        subtitle: "일상에 포인트를 더하는 스트랩 컬렉션",
    },
    "accessory-charm": {
        title: "참",
        subtitle: "작은 디테일로 완성하는 나만의 스타일",
    },
    "accessory-magsafe": {
        title: "맥세이프",
        subtitle: "실용성과 디자인을 모두 담은 아이템",
    },
    "accessory-protector": {
        title: "보호필름",
        subtitle: "선명함과 보호력을 동시에",
    },
    "accessory-etc": {
        title: "기타",
        subtitle: "일상에 더하는 감각적인 아이템",
    },
    "travel-pouch": {
        title: "테크 파우치",
        subtitle: "여행과 일상을 정리하는 스마트한 방식",
    },
    "travel-suitcase": {
        title: "캐리어",
        subtitle: "여행을 더 스타일리시하게",
    },
    "colab-character": {
        title: "캐릭터",
        subtitle: "사랑스러운 캐릭터 컬렉션",
    },
    "colab-art": {
        title: "아트",
        subtitle: "예술적인 감성을 담은 디자인",
    },
    "colab-fashion": {
        title: "패션 & 라이프스타일",
        subtitle: "브랜드 감성을 담은 스페셜 에디션",
    },
    "colab-movie": {
        title: "영화 & 엔터테인먼트",
        subtitle: "콘텐츠의 매력을 담은 컬렉션",
    },
    "colab-sports": {
        title: "스포츠",
        subtitle: "팀과 스포츠 감성을 담은 디자인",
    },
    "casetify-giftcard": {
        title: "디지털 기프트 카드",
        subtitle: "한 장의 카드로 전하는 무궁무진한 선물!",
    },
};

export default function CategoryHero({ mainCate, subCate, mainCateKo, subCateKo }) {
    const heroKey = subCate ? `${mainCate}-${subCate}` : mainCate;

    const heroText = useMemo(() => {
        return HERO_TEXT_MAP[heroKey] || {
            title: subCateKo || mainCateKo || "",
            subtitle: "",
        };
    }, [heroKey, mainCateKo, subCateKo]);

    return (
        <section className={`category-hero category-hero-${heroKey}`}>
            <div className="category-hero-bg" />

            <img
                className="category-hero-img"
                src={`/images/category/slider/${mainCate}-${subCate}.png`}
                alt={heroText.title}
            />

            <div className="category-hero-inner">
                <div className="category-hero-text">
                    <span>CASETiFY COLLECTION</span>
                    {heroText.subtitle && <p>{heroText.subtitle}</p>}
                    <h2>{heroText.title}</h2>
                </div>
            </div>
        </section>
    );
}