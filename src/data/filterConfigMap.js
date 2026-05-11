export const filterConfigMap = {
    case: {
        device: {
            phone: ["model", "magsafe", "price", "color", "stock"],
            earphone: ["model", "price", "color", "stock"],
            laptop: ["model", "price", "color", "stock"],
            watch: ["model", "price", "color", "stock"],
            tablet: ["model", "price", "color", "stock"],
        },
        design: {
            color: ["model", "magsafe", "price", "color", "stock"],
            pattern: ["model", "magsafe", "price", "color", "stock"],
            signature: ["model", "magsafe", "price", "color", "stock"],
        },
        magsafe: {
            default: ["model", "price", "color", "stock"],
        },
        screenprotector: {
            default: ["model", "price", "stock"],
        },
    },

    accessory: {
        strap: {
            default: ["price", "color", "stock"],
        },
        magsafe: {
            default: ["price", "color", "stock"],
        },
        carrier: {
            default: ["price", "color", "stock"],
        },
        etc: {
            default: ["price", "color", "stock"],
        },
    },
};

export const filterLabelMap = {
    model: "기종선택",
    magsafe: "맥세이프 여부",
    price: "가격범위",
    color: "색상",
    stock: "품절여부",
};

export const MINI_QUERY_MAP = {
    // 디바이스
    핸드폰: "phone",
    이어폰: "earphone",
    노트북: "laptop",
    워치: "watch",
    태블릿: "tablet",

    // 디자인
    컬러: "color",
    패턴: "pattern",
    시그니처: "signature",

    // 악세서리 - protector
    "미러 카메라 렌즈 프로텍터": "lens-protector",
    "카메라 렌즈 프로텍터": "lens-protector",
    "스크린 프로텍터": "screen-protector",

    // 악세서리 - magsafe
    "맥세이프 링 홀더": "magsafe-ring-holder",
    "맥세이프 카드홀더 스탠드": "magsafe-cardholder-stand",
    "랩탑 폰 마운트 맥세이프 호환": "magsafe-laptop-mount",
    "맥세이프 미러 카드홀더 스탠드": "magsafe-mirror-cardholder",
    "그립 홀더": "grip-holder",
    "Magnetic Stylus": "magnetic-stylus",
    "맥세이프 미러 링 홀더": "magsafe-mirror-ring",
    "리플 지갑": "ripple-wallet",
    "그립 스탠드": "grip-stand",

    // 악세서리 - etc
    "마우스 패드": "mouse-pad",
    "데스트 매트": "desk-mat",
    "마그네틱 무선 충전기": "wireless-charger",
    "맥세이프 호환 차량용 무선 충전기": "car-magsafe-charger",
    "2-in-1 충전기 스탠드": "2in1-charger-stand",
    "충전기헤드": "charger-head",
    "충전케이블": "charging-cable",
    "에어태그 케이스": "airtag-case",
    "스티커팩": "sticker-pack",
};