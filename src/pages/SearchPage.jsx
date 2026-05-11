import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./scss/CategoryPage.scss";

import { useCategoryProductStore } from "../store/useCategoryProductStore";
import Breadcrumb from "../components/Breadcrumb";
import { groupModelsByProductName } from "../utils/groupProducts";

import CategoryPhoneProductCard from "../components/sub/CategoryPhoneProductCard";
import CategoryEtcProductCard from "../components/sub/CategoryEtcProductCard";
import CategoryFilterPanel from "../components/sub/CategoryFilterPanel";
import CategoryFilterButton from "../components/sub/CategoryFilterButton";
import EmptyState from "../components/sub/EmptyState"
import { motion } from 'framer-motion';

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
// 유틸 함수
// ─────────────────────────────────────────────
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

const getPageNumbers = (totalPages, currentPage) => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

// ─────────────────────────────────────────────
// 컴포넌트
// ─────────────────────────────────────────────
export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "recommend";

    const { items: allItems, mainMenuList } = useCategoryProductStore();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
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

    const isImageSearch = useMemo(() => keyword.toLowerCase() === "img", [keyword]);

    // ── 키워드 검색 필터링 ──
    const keywordFilteredItems = useMemo(() => {
        const kw = keyword.trim().toLowerCase();
        if (!kw) return [];
        let result = [];

        if (isImageSearch) {
            // [이미지 검색 모드] 전체 아이템 중 랜덤으로 20개 정도 추출하거나 전체를 섞음
            // 여기서는 전체를 섞는 방식을 사용합니다.
            result = [...allItems].sort(() => Math.random() - 0.5);
        } else {
            result = allItems.filter((item) =>
                (item.productName || "").toLowerCase().includes(kw) ||
                (item.artist || "").toLowerCase().includes(kw) ||
                (item.modelLabel || "").toLowerCase().includes(kw) ||
                (item.caseCategory || "").toLowerCase().includes(kw) ||
                (item.id || "").toLowerCase().includes(kw) ||
                (item.caseColors || []).some(color => 
                    (color || "").toLowerCase().includes(kw)
                )
            );
        }
        return result;
    }, [allItems, keyword, isImageSearch]);

    // ── 사이드 필터 ──
    const filteredItems = useMemo(() =>
        applyFilters(keywordFilteredItems, selectedFilters),
        [keywordFilteredItems, selectedFilters]
    );

    // ── 그룹 → 정렬 → 페이지 ──
    const sortedGroups = useMemo(() =>
        sortGroups(groupModelsByProductName(filteredItems), sort),
        [filteredItems, sort]
    );

    const totalPages = Math.ceil(sortedGroups.length / ITEMS_PER_PAGE);
    const pagedGroups = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedGroups.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedGroups, currentPage]);

    const pageNumbers = useMemo(() =>
        getPageNumbers(totalPages, currentPage),
        [totalPages, currentPage]
    );

    // ── 적용된 태그 ──
    const appliedTags = useMemo(() => {
        const tags = [];
        if (selectedFilters.model) {
            const found = keywordFilteredItems.find((i) => i.modelKey === selectedFilters.model);
            tags.push({ type: "model", value: selectedFilters.model, label: found?.modelLabel || selectedFilters.model });
        }
        if (selectedFilters.caseCategory)
            tags.push({ type: "caseCategory", value: selectedFilters.caseCategory, label: selectedFilters.caseCategory });
        if (selectedFilters.colorFilter)
            tags.push({ type: "colorFilter", value: selectedFilters.colorFilter, label: selectedFilters.colorFilter });
        if (selectedFilters.isCollabo === true) tags.push({ type: "isCollabo", value: true, label: "콜라보만" });
        if (selectedFilters.isCollabo === false) tags.push({ type: "isCollabo", value: false, label: "일반 상품만" });
        if (selectedFilters.isMagSafe === true) tags.push({ type: "isMagSafe", value: true, label: "맥세이프 가능" });
        if (selectedFilters.isMagSafe === false) tags.push({ type: "isMagSafe", value: false, label: "일반 케이스" });
        if (selectedFilters.stockOnly) tags.push({ type: "stockOnly", value: true, label: "품절 제외" });
        if (selectedFilters.minPrice || selectedFilters.maxPrice)
            tags.push({ type: "price", value: "price", label: `${selectedFilters.minPrice || 0}원 ~ ${selectedFilters.maxPrice || "∞"}원` });
        selectedFilters.colors.forEach((c) => tags.push({ type: "colors", value: c, label: c }));
        return tags;
    }, [selectedFilters, keywordFilteredItems]);

    // ── Effects ──
    useEffect(() => { setCurrentPage(1); }, [keyword, sort, selectedFilters]);
    useEffect(() => { setSelectedFilters(INITIAL_FILTERS); }, [keyword]);
    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    // ── 이벤트 핸들러 ──
    const onChangeSort = (e) => {
        const next = new URLSearchParams(searchParams);
        next.set("sort", e.target.value);
        setSearchParams(next);
    };

    const removeTag = (tag) => {
        const REMOVE_MAP = {
            model: () => setSelectedFilters((p) => ({ ...p, model: "" })),
            caseCategory: () => setSelectedFilters((p) => ({ ...p, caseCategory: "" })),
            colorFilter: () => setSelectedFilters((p) => ({ ...p, colorFilter: "" })),
            isCollabo: () => setSelectedFilters((p) => ({ ...p, isCollabo: null })),
            isMagSafe: () => setSelectedFilters((p) => ({ ...p, isMagSafe: null })),
            stockOnly: () => setSelectedFilters((p) => ({ ...p, stockOnly: false })),
            price: () => setSelectedFilters((p) => ({ ...p, minPrice: "", maxPrice: "" })),
            colors: () => setSelectedFilters((p) => ({ ...p, colors: p.colors.filter((c) => c !== tag.value) })),
        };
        REMOVE_MAP[tag.type]?.();
    };

    const handleApplyFilters = ({ filters }) => {
        setSelectedFilters(filters);
        setIsFilterOpen(false);
    };

    // ── 카드 렌더 ──
    const renderCard = ({ items: groupItems = [], modelLabels }) => {
        const item = groupItems[0];
        if (!item) return null;
        return item.productTarget === "phone"
            ? <CategoryPhoneProductCard item={item} modelLabels={modelLabels} />
            : <CategoryEtcProductCard item={item} modelLabels={modelLabels} />;
    };

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
            <div className="sub-page-wrap category-wrap search-page">
                <div className="inner">
                    {/* 브레드크럼 */}
                    <Breadcrumb items={[
                        { label: '홈', to: '/' },
                        { label: '검색 결과' }
                    ]} />

                    {/* 검색어 헤더 */}
                    <div className="search-page-header">
                        <h2 className="search-page-keyword">
                            {isImageSearch ? (
                                `이미지 검색 결과`
                            ) : (
                                `"${keyword}"`
                            )}
                        </h2>
                        <p className="search-page-count">
                            총 <strong>{sortedGroups.length}</strong>개의 상품
                        </p>
                    </div>

                    {/* 상단 필터 / 정렬 바 */}
                    <div className="category-top-row">
                        <div className="category-top-left">
                            <CategoryFilterButton onClick={() => setIsFilterOpen(true)} />
                            {/* <p className="result-count">총 <strong>{sortedGroups.length}</strong>개</p> */}
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

                    {/* 상품 목록 or 결과 없음 */}
                    {sortedGroups.length > 0 ? (
                        <ul className="category-product-list">
                            {pagedGroups.map((group) => (
                                <li key={`${group.productName}-${group.caseCategory}`}>
                                    {renderCard(group)}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState
                            icon="?"
                            strong={isImageSearch ? "이미지 분석 결과" : `"${keyword}"`}
                            title="에 대한 검색 결과가 없습니다."
                            desc="다른 검색어로 다시 시도해 보세요."
                            btnText="홈으로 돌아가기"
                            btnLink="/"
                        />
                    )}

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

                {/* 필터 패널 */}
                <CategoryFilterPanel
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    onApply={handleApplyFilters}
                    mainCate="search"
                    currentMain={null}
                    currentSub={null}
                    currentMini=""
                    allItems={keywordFilteredItems}
                    selectedFilters={selectedFilters}
                />
            </div>
        </motion.div>
    );
}