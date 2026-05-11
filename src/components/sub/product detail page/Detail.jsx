import React from 'react'
import Benefit from '../../Benefit'
import ShippingInfo from './ShippingInfo'
import "./scss/detail.scss"

const detailImages = {
    // ── 핸드폰 ──────────────────────────────────────────
    phone: [
        "/images/detail/case-detail.png",
    ],

    // ── 이어폰 ──────────────────────────────────────────
    earbuds: [
        "/images/detail/earphone-detail.png",
    ],

    // ── 노트북 ──────────────────────────────────────────
    laptop: [
        "/images/detail/laptop-detail.png",
    ],

    // ── 워치 ────────────────────────────────────────────
    watch: [
        "/images/detail/watch-detail.png",
    ],

    // ── 태블릿 ──────────────────────────────────────────
    tablet: [
        "/images/detail/ipad-detail.png",
    ],

    // ── 스트랩 ──────────────────────────────────────────
    strap: [
        "/images/detail/strap-detail.png",
    ],

    // ── 참 ──────────────────────────────────────────────
    charm: [
        "/images/detail/charm-detail.png",
    ],

    // ── 카메라 렌즈 프로텍터 ─────────────────────────────
    "lens-protector": [
        "/images/detail/lens-protector-detail.png",
    ],

    // ── 스크린 프로텍터 ──────────────────────────────────
    protector: [
        "/images/detail/protector-detail.png",
    ],

    // ── 링홀더 ──────────────────────────────────────────
    "ring-holder": [
        "/images/detail/ring-holder-detail.png",
    ],

    // ── 카드홀더 ─────────────────────────────────────────
    cardholder: [
        "/images/detail/cardholder-detail.png",
    ],

    // ── 스탠드 랩탑 폰 마운트 ────────────────────────────
    "stand-laptop-phone-mount": [
        "/images/detail/stand-detail.png",
    ],

    // ── 그립 ────────────────────────────────────────────
    grip: [
        "/images/detail/grip-detail.png",
    ],

    // ── 마우스패드 ───────────────────────────────────────
    "mouse-pad": [
        "/images/detail/mouse-pad-detail.png",
    ],

    // ── 데스크 매트 ──────────────────────────────────────
    "desk-mat": [
        "/images/detail/desk-mat-detail.png",
    ],

    // ── 충전기 ──────────────────────────────────────────
    charger: [
        "/images/detail/charger-detail.png",
    ],

    // ── 에어태그 케이스 ──────────────────────────────────
    airtag: [
        "/images/detail/airtag-detail.png",
    ],

    // ── 스티커팩 ─────────────────────────────────────────
    sticker: [
        "/images/detail/sticker-detail.png",
    ],

    // ── 기본 fallback ─────────────────────────────────────
    etc: [
        "/images/detail/etc-detail.png",
    ],
    travel: [
        "/images/detail/travel-detail.png",
    ],
}

// productTarget + caseCategory + displayMiniCategories로 카테고리 판별
function getDetailCategory(item) {
    const target = item?.productTarget || 'etc'
    const cc = item?.caseCategory || ''
    const mini = Array.isArray(item?.displayMiniCategories)
        ? item.displayMiniCategories
        : []

    // productTarget으로 1차 분류
    if (target === 'phone') return 'phone'
    if (target === 'earbuds') return 'earbuds'
    if (target === 'laptop') return 'laptop'
    if (target === 'watch') return 'watch'
    if (target === 'tablet') return 'tablet'

    // etc / travel → caseCategory & miniCategory로 세분화
    if (cc === 'lens-protector' || mini.includes('lens-protector')) return 'lens-protector'
    if (mini.includes('protector')) return 'protector'
    if (mini.includes('strap') || cc === 'strap') return 'strap'
    if (mini.includes('charm') || cc === 'charm') return 'charm'
    if (cc === 'ring-holder') return 'ring-holder'
    if (cc === 'cardholder') return 'cardholder'
    if (cc === 'stand-laptop-phone-mount' || cc === 'stand') return 'stand-laptop-phone-mount'
    if (cc === 'grip') return 'grip'
    if (cc === 'mouse-pad' || mini.includes('mouse-pad')) return 'mouse-pad'
    if (cc === 'desk-mat') return 'desk-mat'
    if (cc === 'charger') return 'charger'
    if (cc === 'airtag') return 'airtag'
    if (cc === 'sticker' || cc === 'sticker-pack') return 'sticker'
    if (target === 'travel') return 'travel'

    return 'etc'
}

export default function Detail({ item }) {
    const category = getDetailCategory(item)
    const images = detailImages[category] || detailImages['etc']

    return (
        <div className="detail">
            <div className="img-box">
                {images.map((src, idx) => (
                    <img key={idx} src={src} alt={`상세이미지 ${idx + 1}`} />
                ))}
            </div>
            <ShippingInfo />
            <Benefit />
        </div>
    )
}