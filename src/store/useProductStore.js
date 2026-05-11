import { create } from "zustand";


export const useProductStore = create((set, get) => ({

    // items: [],

    // 검색 관련 변수(search)
    searchWord: "",
    onSetSearchWord: (word) => set({ searchWord: word }),

    // 검색 단어 저장 배열
    searchWordList: [],

    // 검색 페이지 이동 트리거 (SearchNavigator가 감지해서 navigate)
    pendingSearch: null,
    onClearPendingSearch: () => set({ pendingSearch: null }),

    //검색 단어 저장 메서드
    onAddSearchList: (keyword) => {
        set((state) => {
            const text = (keyword ?? state.searchWord).trim();
            if (!text) return {};
            // 중복 검색어 제거 후 맨 앞에 추가
            const filtered = state.searchWordList.filter((s) => s.text !== text);
            return {
                searchWordList: [{ id: Date.now(), text }, ...filtered].slice(0, 10),
                pendingSearch: text,
                // searchWord는 초기화하지 않아 검색창 재열었을 때 이전 검색어 유지
            };
        })
    },

    onRemoveSearchList: (id) => {
        set((state) => ({
            searchWordList: state.searchWordList.filter(((s) => s.id !== id))
        }))
    },
    onRemoveAllSearch: () => {
        set({ searchWordList: [] })
    },

    // 최근/인기 검색어 클릭 시 바로 검색 트리거
    onSearchByKeyword: (text) => {
        set({ pendingSearch: text })
    },

    // 검색창 열림/닫힘 상태 (Header 로컬 state → store로 이관)
    isSearchOpen: false,
    onOpenSearch: () => set({ isSearchOpen: true }),
    onCloseSearch: () => set({ isSearchOpen: false }),
    onToggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),


    // 메인메뉴랑 서브메뉴랑 미니메뉴
    mainMenuList: [
        {
            name: "케이스", link: "case",
            sub: [
                {
                    name: "디바이스", link: "device",
                    mini: [
                        "핸드폰", "이어폰", "노트북", "워치", "태블릿"
                    ]
                },
                {
                    name: "디자인", link: "design",
                    mini: [
                        "컬러", "패턴", "시그니처"
                    ]
                },
                { name: "맥세이프", link: "magsafe" },
                { name: "커스텀", link: "custom" }
            ]
        },
        {
            name: "악세서리", link: "accessory",
            sub: [
                { name: "스트랩", link: "strap" },
                { name: "참", link: "charm" },
                { name: "보호필름", link: "protector" },
                { name: "맥세이프", link: "magsafe" },
                { name: "기타", link: "etc" }
            ]
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
                { name: "캐릭터", link: "character" },
                { name: "아트", link: "art" },
                { name: "영화&엔터", link: "movie" },
                { name: "패션&라이프스타일", link: "fashion" },
                { name: "스포츠", link: "sports" }
            ]
        },
        { name: "기프트카드", link: "giftcard" },
        {
            name: "브랜드", link: "brand",
            sub: [
                { name: "케이스티파이", link: "casetify" },
                { name: "매장찾기", link: "store" },
                { name: "정품인증", link: "certify" },
                { name: "Q&A", link: "qna" }
            ]
        }
    ],



}));