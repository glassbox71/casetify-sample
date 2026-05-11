import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./scss/CategoryPage.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Breadcrumb from "../components/Breadcrumb";
import "swiper/css";
import "swiper/css/pagination";

import { MINI_QUERY_MAP } from "../data/categoryMap";
import { colorMap } from "../data/finalData";
import { useCategoryProductStore } from "../store/useCategoryProductStore";
import { groupModelsByProductName } from "../utils/groupProducts";

import CategoryHero from "../components/sub/CategoryHero";
import CategoryMiniIcon from "../components/sub/CategoryMiniIcon";
import CategoryPhoneProductCard from "../components/sub/CategoryPhoneProductCard";
import CategoryEtcProductCard from "../components/sub/CategoryEtcProductCard";
import CategoryFilterPanel from "../components/sub/CategoryFilterPanel";
import CategoryFilterButton from "../components/sub/CategoryFilterButton";

import { motion } from "framer-motion";

const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};


// ─────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────
const ITEMS_PER_PAGE = 20;

const SORT_OPTIONS = [
    { key: "recommend", label: "추천순" },
    { key: "popular", label: "인기순" },
    { key: "priceLow", label: "낮은 가격순" },
    { key: "priceHigh", label: "높은 가격순" },
    { key: "new", label: "신상품순" },
];

const INITIAL_FILTERS = {
    device: "",
    model: "",
    caseCategory: "",
    colorFilter: "",
    isCollabo: null,
    isMagSafe: null,
    stockOnly: false,
    minPrice: "",
    maxPrice: "",
    colors: [],
};

// ─────────────────────────────────────────────
// 순수 함수 유틸
// ─────────────────────────────────────────────
const getMainCategories = (item) => {
    if (Array.isArray(item.mainCategory)) return item.mainCategory;
    if (Array.isArray(item.mainCategories)) return item.mainCategories;
    if (item.mainCategory) return [item.mainCategory];
    if (item.mainCategories) return [item.mainCategories];
    return [];
};

const getMiniMode = (mainCate, subCate) => {
    if (mainCate === "accessory") {
        return ["protector", "magsafe", "etc"].includes(subCate) ? "caseCategory" : "none";
    }
    return "displayMini";
};

/** route(mainCate/subCate) 에 해당하는 아이템만 추린다 */
const filterByRoute = (items, mainCate, subCate) =>
    items.filter((item) => {
        const mains = getMainCategories(item);
        const subs = Array.isArray(item.displaySubCategories) ? item.displaySubCategories : [];

        if (mainCate === "colab") {
            if (!mains.includes("colab")) return false;
            // displaySubCategories 또는 collaboCategory로 서브 매칭
            if (!subCate) return true;
            return subs.includes(subCate) || item.collaboCategory === subCate;
        }

        if (!mains.includes(mainCate)) return false;
        return !subCate || subs.includes(subCate);
    });

/** 미니 카테고리 필터 */
const filterByMini = (items, mini, miniMode, mainCate) => {
    if (!mini) return items;
    if (mainCate === "colab") return items.filter((i) => {
        const mains = getMainCategories(i);
        return mains.includes("colab") && i.artist && makeArtistIconKey(i.artist) === mini;
    });
    if (miniMode === "caseCategory") return items.filter((i) => i.caseCategory === mini);
    return items.filter((i) => (i.displayMiniCategories || []).includes(mini));
};

/** 사이드 필터 패널 조건 */
const applyFilters = (items, filters) => {
    const { device, model, caseCategory, colorFilter, isCollabo, isMagSafe, stockOnly, minPrice, maxPrice, colors } = filters;

    return items.filter((item) => {
        if (device && !(item.displayMiniCategories || []).includes(device)) return false;
        if (model && item.modelKey !== model) return false;
        if (caseCategory && item.caseCategory !== caseCategory) return false;
        if (colorFilter && !(item.caseColors || []).includes(colorFilter)) return false;
        if (isCollabo !== null && Boolean(item.collabo) !== isCollabo) return false;
        if (isMagSafe !== null && Boolean(item.isMagSafe) !== isMagSafe) return false;
        if (stockOnly && item.stockStatus !== "inStock") return false;
        if (minPrice !== "" && Number(item.price) < Number(minPrice)) return false;
        if (maxPrice !== "" && Number(item.price) > Number(maxPrice)) return false;
        if (colors.length > 0 && !colors.some((c) => (item.caseColors || []).includes(c))) return false;
        return true;
    });
};

/** 그룹 정렬 */
const sortGroups = (groups, sort) => {
    const SORT_FN = {
        popular: (a, b) => (b.popularity || 0) - (a.popularity || 0),
        priceLow: (a, b) => (a.price || 0) - (b.price || 0),
        priceHigh: (a, b) => (b.price || 0) - (a.price || 0),
        new: (a, b) => Number(b.isNew) - Number(a.isNew),
        recommend: (a, b) => (a.recommendRank || 9999) - (b.recommendRank || 9999),
    };

    const fn = SORT_FN[sort] || SORT_FN.recommend;
    return [...groups].sort((ga, gb) => {
        const a = ga.items?.[0];
        const b = gb.items?.[0];
        return (!a || !b) ? 0 : fn(a, b);
    });
};

/** 페이지 번호 배열 */
const getPageNumbers = (totalPages, currentPage) => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const makeArtistIconKey = (artist = "") =>
    artist.trim().toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

// ─────────────────────────────────────────────
// 컴포넌트
// ─────────────────────────────────────────────
export default function CategoryPagePractice() {
    const { mainCate, subCate } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const mini = searchParams.get("mini") || "";
    const sort = searchParams.get("sort") || "recommend";

    const { mainMenuList, items: allItems } = useCategoryProductStore();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeviceModelPopupOpen, setIsDeviceModelPopupOpen] = useState(false);
    const [isCaseCategoryPopupOpen, setIsCaseCategoryPopupOpen] = useState(false);
    const [isColorFilterPopupOpen, setIsColorFilterPopupOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState("Apple");
    const [selectedFilters, setSelectedFilters] = useState(INITIAL_FILTERS);
    const sortDropdownRef = useRef(null);

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
                setIsSortOpen(false);
            }
        };
        if (isSortOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSortOpen]);

    // ── 메뉴 참조 ──
    const currentMain = useMemo(() =>
        mainMenuList?.find((m) => m.link === mainCate),
        [mainMenuList, mainCate]);

    const currentSub = useMemo(() =>
        currentMain?.sub?.find((s) => s.link === subCate),
        [currentMain, subCate]);

    const miniMode = useMemo(() => getMiniMode(mainCate, subCate), [mainCate, subCate]);

    // ── 상품 파이프라인 (route → mini → filter → group → sort → page) ──
    const routeItems = useMemo(() =>
        filterByRoute(allItems, mainCate, subCate),
        [allItems, mainCate, subCate]);

    const miniFilteredItems = useMemo(() =>
        filterByMini(routeItems, mini, miniMode, mainCate),
        [routeItems, mini, miniMode, mainCate]);

    const filteredItems = useMemo(() =>
        applyFilters(miniFilteredItems, selectedFilters),
        [miniFilteredItems, selectedFilters]);

    const sortedGroups = useMemo(() =>
        sortGroups(groupModelsByProductName(filteredItems), sort),
        [filteredItems, sort]);

    const totalPages = Math.ceil(sortedGroups.length / ITEMS_PER_PAGE);
    const pagedGroups = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedGroups.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedGroups, currentPage]);

    const pageNumbers = useMemo(() =>
        getPageNumbers(totalPages, currentPage),
        [totalPages, currentPage]);

    // ── 미니 아이콘 목록 ──
    const visibleMiniItems = useMemo(() => {
        if (!currentSub) return [];

        if (mainCate === "colab") {
            // store의 mini 배열은 { label: "YOUNG FOREST", key: "young-forest" } 형태
            // mainCategory에 "colab" 포함 + artist 매칭 둘 다 확인
            return (currentSub.mini || [])
                .filter((m) => routeItems.some((i) => {
                    const mains = getMainCategories(i);
                    return mains.includes("colab") && i.artist && makeArtistIconKey(i.artist) === m.key;
                }));
        }

        if (miniMode === "none") return [];

        if (miniMode === "caseCategory") {
            // store의 mini 배열({ label: "링 홀더", key: "ring-holder" })을 기준으로
            // 실제 상품에 해당 caseCategory가 존재하는 항목만 노출
            return (currentSub.mini || [])
                .filter((m) => routeItems.some((i) => i.caseCategory === m.key));
        }

        // store의 mini 배열은 이미 { label: "핸드폰", key: "phone" } 형태
        return (currentSub.mini || [])
            .filter((m) => routeItems.some((i) => (i.displayMiniCategories || []).includes(m.key)));
    }, [currentSub, miniMode, routeItems, mainCate]);

    const currentMiniLabel = useMemo(() =>
        visibleMiniItems.find((m) => m.key === mini)?.label || "",
        [visibleMiniItems, mini]);

    // 케이스 > 디자인 > 시그니처 선택 시 외부에 caseCategory 버튼 노출
    const showExternalCaseCategory = mainCate === "case" && subCate === "design" && mini === "signature";
    const externalCaseCategoryOptions = useMemo(() => {
        if (!showExternalCaseCategory) return [];
        return [...new Set(miniFilteredItems.map((i) => i.caseCategory).filter(Boolean))];
    }, [showExternalCaseCategory, miniFilteredItems]);

    // 케이스 > 디자인 > 컬러 선택 시 외부에 색상 버튼 노출
    const showColorFilter = mainCate === "case" && subCate === "design" && mini === "color";
    const colorFilterOptions = useMemo(() => {
        if (!showColorFilter) return [];
        return [...new Set(miniFilteredItems.flatMap((i) => i.caseColors || []).filter(Boolean))];
    }, [showColorFilter, miniFilteredItems]);

    // ── 모델 선택 옵션 ──
    const deviceModelOptions = useMemo(() => {
        const filtered = routeItems.filter(
            (i) => i.modelKey && i.modelLabel && (!selectedBrand || i.brand === selectedBrand)
        );
        return [...new Map(filtered.map((i) => [i.modelKey, { key: i.modelKey, label: i.modelLabel }])).values()];
    }, [routeItems, selectedBrand]);

    // ── 적용된 태그 ──
    const appliedTags = useMemo(() => {
        const tags = [];
        if (currentSub?.name) tags.push({ type: "sub", value: currentSub.link, label: currentSub.name });
        if (currentMiniLabel) tags.push({ type: "mini", value: mini, label: currentMiniLabel });
        if (selectedFilters.caseCategory) {
            tags.push({ type: "caseCategory", value: selectedFilters.caseCategory, label: selectedFilters.caseCategory });
        }
        if (selectedFilters.colorFilter) {
            tags.push({ type: "colorFilter", value: selectedFilters.colorFilter, label: selectedFilters.colorFilter });
        }

        if (selectedFilters.model) {
            const found = routeItems.find((i) => i.modelKey === selectedFilters.model);
            tags.push({ type: "model", value: selectedFilters.model, label: found?.modelLabel || selectedFilters.model });
        }
        if (selectedFilters.isCollabo === true) tags.push({ type: "isCollabo", value: true, label: "콜라보만" });
        if (selectedFilters.isCollabo === false) tags.push({ type: "isCollabo", value: false, label: "일반 상품만" });
        if (selectedFilters.isMagSafe === true) tags.push({ type: "isMagSafe", value: true, label: "맥세이프 가능" });
        if (selectedFilters.isMagSafe === false) tags.push({ type: "isMagSafe", value: false, label: "일반 케이스" });
        if (selectedFilters.stockOnly) tags.push({ type: "stockOnly", value: true, label: "품절 제외" });
        if (selectedFilters.minPrice || selectedFilters.maxPrice)
            tags.push({ type: "price", value: "price", label: `${selectedFilters.minPrice || 0}원 ~ ${selectedFilters.maxPrice || "∞"}원` });
        selectedFilters.colors.forEach((c) => tags.push({ type: "colors", value: c, label: c }));
        return tags;
    }, [currentSub, currentMiniLabel, mini, selectedFilters, routeItems]);

    // ── Effects ──
    useEffect(() => { setCurrentPage(1); }, [mainCate, subCate, mini, sort, selectedFilters]);

    useEffect(() => {
        setSelectedFilters(INITIAL_FILTERS);
        setIsFilterOpen(false);
        setIsDeviceModelPopupOpen(false);
    }, [mainCate, subCate]);

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    useEffect(() => {
        setIsDeviceModelPopupOpen(false);
        setIsCaseCategoryPopupOpen(false);
        if (mini !== "phone" && selectedFilters.model) {
            setSelectedFilters((prev) => ({ ...prev, model: "" }));
        }
        if (mini !== "signature" && selectedFilters.caseCategory) {
            setSelectedFilters((prev) => ({ ...prev, caseCategory: "" }));
        }
        if (mini !== "color" && selectedFilters.colorFilter) {
            setSelectedFilters((prev) => ({ ...prev, colorFilter: "" }));
        }
        setIsColorFilterPopupOpen(false);
    }, [mini, selectedFilters.model, selectedFilters.caseCategory, selectedFilters.colorFilter]);

    // ── 이벤트 핸들러 ──
    const onHandleMiniCategory = (miniValue) => {
        const next = new URLSearchParams(searchParams);
        mini === miniValue ? next.delete("mini") : next.set("mini", miniValue);
        if (sort) next.set("sort", sort);
        setSearchParams(next);
    };

    const onChangeSort = (e) => {
        const next = new URLSearchParams(searchParams);
        next.set("sort", e.target.value);
        if (mini) next.set("mini", mini);
        setSearchParams(next);
    };

    const removeTag = (tag) => {
        const REMOVE_MAP = {
            mini: () => { const n = new URLSearchParams(searchParams); n.delete("mini"); if (sort) n.set("sort", sort); setSearchParams(n); },
            model: () => setSelectedFilters((p) => ({ ...p, model: "" })),
            isCollabo: () => setSelectedFilters((p) => ({ ...p, isCollabo: null })),
            isMagSafe: () => setSelectedFilters((p) => ({ ...p, isMagSafe: null })),
            stockOnly: () => setSelectedFilters((p) => ({ ...p, stockOnly: false })),
            price: () => setSelectedFilters((p) => ({ ...p, minPrice: "", maxPrice: "" })),
            caseCategory: () => setSelectedFilters((p) => ({ ...p, caseCategory: "" })),
            colorFilter: () => setSelectedFilters((p) => ({ ...p, colorFilter: "" })),
            colors: () => setSelectedFilters((p) => ({ ...p, colors: p.colors.filter((c) => c !== tag.value) })),
        };
        REMOVE_MAP[tag.type]?.();
    };

    const handleApplyFilters = ({ nextSubCateLink, nextMini, filters }) => {
        const nextParams = new URLSearchParams();
        if (nextMini) nextParams.set("mini", nextMini);
        if (sort) nextParams.set("sort", sort);
        setSelectedFilters(filters);
        setIsFilterOpen(false);
        navigate(`/${mainCate}/${nextSubCateLink}${nextParams.toString() ? `?${nextParams}` : ""}`);
    };

    // ── 카드 렌더 ──
    const renderCard = ({ items: groupItems = [], modelLabels }) => {
        const item = groupItems[0];
        if (!item) return null;
        return item.productTarget === "phone"
            ? <CategoryPhoneProductCard item={item} modelLabels={modelLabels} />
            : <CategoryEtcProductCard item={item} modelLabels={modelLabels} />;
    };

    // ── 미니아이콘 key 계산 (공통) ──
    // store.mini의 key가 항상 영어 슬러그이므로 공통으로 사용
    const getMiniIconKey = (miniItem) => miniItem.key || "etc";

    // ─────────────────────────────────────────
    // JSX
    // ─────────────────────────────────────────
    return (
        <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
        >
            <div className="sub-page-wrap category-wrap">
                <CategoryHero
                    mainCate={mainCate}
                    subCate={subCate}
                    mainCateKo={currentMain?.name}
                    subCateKo={currentSub?.name}
                />

                <div className="inner">
                    {/* 브레드크럼 */}
                    <Breadcrumb items={[
                        { label: '홈', to: '/' },
                        ...(currentMain?.name ? [{ label: currentMain.name }] : [])
                    ]} />

                    {/* 미니 카테고리 슬라이더 */}
                    {!!visibleMiniItems.length && (
                        visibleMiniItems.length > 9 ? (
                            <div className="category-mini-swiper-wrap">
                                <Swiper
                                    modules={[Pagination]}
                                    pagination={{ clickable: true }}
                                    slidesPerView={9}
                                    spaceBetween={32}
                                    loop={visibleMiniItems.length >= 9}
                                    grabCursor
                                    className={`category-mini-swiper ${mini ? "has-active" : ""}`}
                                >
                                    {visibleMiniItems.map((m, i) => (
                                        <SwiperSlide key={`${m.key}-${i}`}>
                                            <CategoryMiniIcon
                                                miniKey={getMiniIconKey(m)}
                                                label={m.label}
                                                isActive={mini === m.key}
                                                onClick={() => onHandleMiniCategory(m.key)}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        ) : (
                            <ul className={`category-sub-slider ${mini ? "has-active" : ""}`}>
                                {visibleMiniItems.map((m, i) => (
                                    <CategoryMiniIcon
                                        key={`${m.key}-${i}`}
                                        miniKey={getMiniIconKey(m)}
                                        label={m.label}
                                        isActive={mini === m.key}
                                        onClick={() => onHandleMiniCategory(m.key)}
                                    />
                                ))}
                            </ul>
                        )
                    )}



                    {/* 상단 필터 / 정렬 바 */}
                    <div className="category-top-row">
                        <div className="category-top-left">
                            <CategoryFilterButton onClick={() => setIsFilterOpen(true)} mainCate={mainCate} />

                            {/* 케이스 종류 선택 팝업 (케이스 > 디자인 > 시그니처) */}
                            {showExternalCaseCategory && !!externalCaseCategoryOptions.length && (
                                <div className="device-model-popup-wrap">
                                    <button
                                        type="button"
                                        className={`device-model-inline-box ${isCaseCategoryPopupOpen ? "on" : ""}`}
                                        onClick={() => setIsCaseCategoryPopupOpen((p) => !p)}
                                    >
                                        <span className="device-model-label">케이스 종류</span>
                                        <span className="device-model-value">
                                            {selectedFilters.caseCategory || ""}
                                        </span>
                                    </button>

                                    {isCaseCategoryPopupOpen && (
                                        <div className="device-model-popup-panel">
                                            <div className="device-popup-header-inline">
                                                <span className="device-model-label">케이스 종류</span>
                                                <button
                                                    type="button"
                                                    className="device-popup-close"
                                                    onClick={() => setIsCaseCategoryPopupOpen(false)}
                                                >✕</button>
                                            </div>

                                            <ul className="device-model-list">
                                                {externalCaseCategoryOptions.map((cat) => (
                                                    <li
                                                        key={cat}
                                                        className={selectedFilters.caseCategory === cat ? "on" : ""}
                                                        onClick={() => {
                                                            setSelectedFilters((prev) => ({
                                                                ...prev,
                                                                caseCategory: prev.caseCategory === cat ? "" : cat,
                                                            }));
                                                        }}
                                                    >
                                                        {cat}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 색상 선택 팝업 (케이스 > 디자인 > 컬러) */}
                            {showColorFilter && !!colorFilterOptions.length && (
                                <div className="color-chip-filter-wrap">
                                    {colorFilterOptions.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`color-chip-btn${selectedFilters.colorFilter === color ? " on" : ""}`}
                                            title={color}
                                            onClick={() =>
                                                setSelectedFilters((prev) => ({
                                                    ...prev,
                                                    colorFilter: prev.colorFilter === color ? "" : color,
                                                }))
                                            }
                                        >
                                            <span
                                                className="color-chip-circle"
                                                style={{ backgroundColor: colorMap[color] || "#ddd" }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* 모델 선택 팝업 (phone mini + 콜라보 제외) */}
                            {mini === "phone" && mainCate !== "colab" && (
                                <div className="device-model-popup-wrap">
                                    <button
                                        type="button"
                                        className={`device-model-inline-box ${isDeviceModelPopupOpen ? "on" : ""}`}
                                        onClick={() => setIsDeviceModelPopupOpen((p) => !p)}
                                    >
                                        <span className="device-model-label">모델 선택</span>
                                        <span className="device-model-value">
                                            {selectedFilters.model
                                                ? routeItems.find((i) => i.modelKey === selectedFilters.model)?.modelLabel || "선택됨"
                                                : "선택 안됨"}
                                        </span>
                                    </button>

                                    {isDeviceModelPopupOpen && (
                                        <div className="device-model-popup-panel">
                                            <div className="device-popup-header-inline">
                                                <div className="device-brand-tabs">
                                                    {["Apple", "Samsung", "Google"].map((brand) => (
                                                        <button
                                                            key={brand}
                                                            className={selectedBrand === brand ? "on" : ""}
                                                            onClick={() => setSelectedBrand(brand)}
                                                        >
                                                            {brand}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    type="button"
                                                    className="device-popup-close"
                                                    onClick={() => setIsDeviceModelPopupOpen(false)}
                                                >✕</button>
                                            </div>

                                            <ul className="device-model-list">
                                                {deviceModelOptions.map((model) => (
                                                    <li
                                                        key={model.key}
                                                        className={selectedFilters.mㅁodel === model.key ? "on" : ""}
                                                        onClick={() =>
                                                            setSelectedFilters((p) => ({
                                                                ...p,
                                                                model: p.model === model.key ? "" : model.key,
                                                            }))
                                                        }
                                                    >
                                                        {model.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            <p className="result-count">총 <strong>{sortedGroups.length}</strong>개</p>
                        </div>

                        <div className="sort-select-wrap">
                            <div ref={sortDropdownRef} className={`sort-dropdown${isSortOpen ? " open" : ""}`}>
                                <button
                                    type="button"
                                    className="sort-dropdown-trigger"
                                    onClick={() => setIsSortOpen((p) => !p)}
                                >
                                    <span>{SORT_OPTIONS.find((o) => o.key === sort)?.label || "추천순"}</span>
                                    <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 8L1 3h10z" fill="currentColor" />
                                    </svg>
                                </button>
                                {isSortOpen && (
                                    <ul className="sort-dropdown-list">
                                        {SORT_OPTIONS.map((o) => (
                                            <li
                                                key={o.key}
                                                className={sort === o.key ? "on" : ""}
                                                onClick={() => {
                                                    const next = new URLSearchParams(searchParams);
                                                    next.set("sort", o.key);
                                                    if (mini) next.set("mini", mini);
                                                    setSearchParams(next);
                                                    setIsSortOpen(false);
                                                }}
                                            >
                                                {o.label}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 적용된 필터 태그 */}
                    {!!appliedTags.length && (
                        <div className="selected-tags-row">
                            {appliedTags.map((tag, i) => (
                                <button
                                    type="button"
                                    key={`${tag.type}-${tag.value}-${i}`}
                                    className="selected-tag"
                                    onClick={() => removeTag(tag)}
                                >
                                    {tag.label} ×
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 상품 목록 */}
                    <ul className="category-product-list">
                        {pagedGroups.map((group) => (
                            <li key={`${group.productName}-${group.caseCategory}`}>
                                {renderCard(group)}
                            </li>
                        ))}
                    </ul>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div className="category-pagination">
                            <button type="button" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>&laquo;</button>
                            <button type="button" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>&lsaquo;</button>

                            {pageNumbers[0] > 1 && (
                                <>
                                    <button type="button" onClick={() => setCurrentPage(1)}>1</button>
                                    {pageNumbers[0] > 2 && <span className="page-ellipsis">…</span>}
                                </>
                            )}

                            {pageNumbers.map((n) => (
                                <button
                                    type="button"
                                    key={n}
                                    className={currentPage === n ? "on" : ""}
                                    onClick={() => setCurrentPage(n)}
                                >{n}</button>
                            ))}

                            {pageNumbers.at(-1) < totalPages && (
                                <>
                                    {pageNumbers.at(-1) < totalPages - 1 && <span className="page-ellipsis">…</span>}
                                    <button type="button" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
                                </>
                            )}

                            <button type="button" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>&rsaquo;</button>
                            <button type="button" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>&raquo;</button>
                        </div>
                    )}
                </div>

                <CategoryFilterPanel
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    onApply={handleApplyFilters}
                    mainCate={mainCate}
                    currentMain={currentMain}
                    currentSub={currentSub}
                    currentMini={mini}
                    allItems={allItems}
                    selectedFilters={selectedFilters}
                />
            </div>
        </motion.div>
    );
}