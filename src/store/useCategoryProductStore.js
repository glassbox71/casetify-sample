import { create } from "zustand";
import { items } from "../data/finalData";

export const useCategoryProductStore = create((set, get) => ({
    items,
    categoryItems: items,

    mainMenuList: [
        {
            name: "케이스",
            link: "case",
            sub: [
                {
                    name: "디바이스",
                    link: "device",
                    mini: [
                        { label: "핸드폰", key: "phone" },
                        { label: "이어폰", key: "earphone" },
                        { label: "노트북", key: "laptop" },
                        { label: "워치", key: "watch" },
                        { label: "태블릿", key: "tablet" },
                    ],
                },
                {
                    name: "디자인",
                    link: "design",
                    mini: [
                        { label: "컬러", key: "color" },
                        { label: "패턴", key: "pattern" },
                        { label: "시그니처", key: "signature" },
                    ],
                },
                { name: "맥세이프", link: "magsafe" },
                { name: "커스텀", link: "custom" },
            ],
        },

        {
            name: "악세서리",
            link: "accessory",
            sub: [
                { name: "스트랩", link: "strap" },
                { name: "참", link: "charm" },

                {
                    name: "보호필름",
                    link: "protector",
                    mini: [
                        { label: "카메라 렌즈 프로텍터", key: "lens-protector" },
                        { label: "스크린 프로텍터", key: "screen-protector" },
                    ],
                },

                {
                    name: "맥세이프",
                    link: "magsafe",
                    mini: [
                        { label: "링 홀더", key: "ring-holder" },
                        { label: "카드홀더 스탠드", key: "cardholder" },
                        { label: "랩탑 폰 마운트", key: "laptop-mount" },
                        { label: "그립", key: "grip" },
                    ],
                },

                {
                    name: "기타",
                    link: "etc",
                    mini: [
                        { label: "마우스 패드", key: "mouse-pad" },
                        { label: "데스크 매트", key: "desk-mat" },
                        { label: "충전기", key: "charger" },
                        { label: "에어태그 케이스", key: "airtag-case" },
                        { label: "스티커팩", key: "sticker-pack" },
                    ],
                },
            ],
        },
        {
            name: "트래블", link: "travel",
            sub: [
                { name: "캐리어", link: "suitcase" },
                { name: "테크파우치", link: "pouch" }
            ]
        },

        {
            name: "콜라보", link: "colab",
            sub: [
                {
                    name: "캐릭터", link: "character",
                    mini: [
                        { label: "YOUNG FOREST", key: "young-forest" },
                        { label: "namsee", key: "namsee" },
                        { label: "Skater JOHN", key: "skater-john" },
                        { label: "INAPSQUARE", key: "inapsquare" },
                        { label: "DUCKOO", key: "duckoo" },
                        { label: "SOSO FAMILY", key: "soso-family" },
                        { label: "MEO MONSTERS", key: "meo-monsters" },
                        { label: "SSEBONG", key: "ssebong" },
                        { label: "Esther Bunny", key: "esther-bunny" },
                        { label: "foxy illustrations", key: "foxy-illustrations" },
                        { label: "The Powerpuff Girls", key: "the-powerpuff-girls" },
                        { label: "Zootopia2", key: "zootopia2" },
                        { label: "miffy", key: "miffy" },
                        { label: "DISNEY", key: "disney" },
                        { label: "BBNEXDO", key: "bbnexdo" },
                        { label: "Stitch", key: "stitch" },
                        { label: "Crayon Shinchan", key: "crayon-shinchan" },
                    ]
                },

                {
                    name: "아트", link: "art",
                    mini: [
                        { label: "Takashi Murakami", key: "takashi-murakami" },
                        { label: "Andy Warhol", key: "andy-warhol" },
                    ]
                },

                {
                    name: "영화&엔터", link: "movie",
                    mini: [
                        { label: "Stitch", key: "stitch" },
                        { label: "Crayon Shinchan", key: "crayon-shinchan" },
                        { label: "The Powerpuff Girls", key: "the-powerpuff-girls" },
                        { label: "Bridgerton", key: "bridgerton" },
                        { label: "DISNEY", key: "disney" },
                    ]
                },

                {
                    name: "패션&라이프스타일", link: "fashion",
                    mini: [
                        { label: "SPRING IN BLOOM", key: "spring-in-bloom" },
                        { label: "DENIM MANIFESTO", key: "denim-manifesto" },
                        { label: "PILLOW CASE", key: "pillow-case" },
                        { label: "HI! FOREST", key: "hi-forest" },
                        { label: "Maison Kitsune", key: "maison-kitsune" },
                        { label: "SUSAN FANG", key: "susan-fang" },
                        { label: "Meri Meri", key: "meri-meri" },
                    ]
                },

                {
                    name: "스포츠", link: "sports",
                    mini: [
                        { label: "FIFA WORLD CUP", key: "fifa-world-cup" },
                        { label: "KBO", key: "kbo" },
                    ]
                }
            ]
        }
    ],

    onFilterCategory: (mainCate, subCate, mini) => {
        const { items } = get();

        const filtered = items.filter((item) => {
            const matchMain = item.mainCategory.includes(mainCate);

            const matchSub = subCate
                ? (item.displaySubCategories || []).includes(subCate)
                : true;

            const matchMini = mini
                ? (item.displayMiniCategories || []).includes(mini)
                : true;

            return matchMain && matchSub && matchMini;
        });

        set({ categoryItems: filtered });
    },
}));