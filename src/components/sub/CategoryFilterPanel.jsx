import React, { useEffect, useMemo, useState } from "react";
import { colorMap } from "../../data/finalData";
import { MINI_QUERY_MAP } from "../../data/categoryMap";
import "./scss/CategoryFilterPanel.scss";

function uniqueModelOptions(items = []) {
    return Array.from(
        new Map(
            items
                .filter((item) => item.modelKey && item.modelLabel)
                .map((item) => [
                    item.modelKey,
                    { key: item.modelKey, label: item.modelLabel },
                ])
        ).values()
    );
}

function uniqueColorOptions(items = []) {
    return Array.from(
        new Set(items.flatMap((item) => item.caseColors || []).filter(Boolean))
    );
}

export default function CategoryFilterPanel({
    isOpen,
    onClose,
    onApply,
    mainCate,
    currentMain,
    currentSub,
    currentMini,
    allItems = [],
    selectedFilters,
}) {
    const [draft, setDraft] = useState({
        subCateLink: currentSub?.link || "",
        mini: currentMini || "",
        device: "",
        caseCategory: "",
        models: [],
        isCollabo: null,
        isMagSafe: null,
        stockOnly: false,
        minPrice: "",
        maxPrice: "",
        colors: [],
    });

    useEffect(() => {
        if (!isOpen) return;

        setDraft({
            subCateLink: currentSub?.link || "",
            mini: currentMini || "",
            device: selectedFilters.device || "",
            caseCategory: selectedFilters.caseCategory || "",
            models: selectedFilters.models || [],
            isCollabo: selectedFilters.isCollabo ?? null,
            isMagSafe: selectedFilters.isMagSafe ?? null,
            stockOnly: selectedFilters.stockOnly || false,
            minPrice: selectedFilters.minPrice || "",
            maxPrice: selectedFilters.maxPrice || "",
            colors: selectedFilters.colors || [],
        });
    }, [isOpen, currentSub, currentMini, selectedFilters]);

    const subOptions = useMemo(() => {
        return currentMain?.sub || [];
    }, [currentMain]);

    const selectedSubObj = useMemo(() => {
        return subOptions.find((sub) => sub.link === draft.subCateLink);
    }, [subOptions, draft.subCateLink]);

    // 콜라보는 서브카테고리가 아티스트 기반이라 디바이스 목록이 없음
    // → 케이스 > 디바이스의 mini를 고정으로 참조
    const CASE_DEVICE_OPTIONS = useMemo(() => {
        const caseMain = currentMain?.link === "colab"
            ? null  // colab이면 아래에서 별도 처리
            : null;
        void caseMain;
        return [
            { label: "핸드폰", key: "phone" },
            { label: "이어폰", key: "earphone" },
            { label: "노트북", key: "laptop" },
            { label: "워치", key: "watch" },
            { label: "태블릿", key: "tablet" },
        ];
    }, []);

    const deviceOptions = useMemo(() => {
        // 콜라보는 디바이스 목록 고정
        if (mainCate === "colab") return CASE_DEVICE_OPTIONS;

        const miniList = selectedSubObj?.mini || [];
        if (miniList.length > 0 && typeof miniList[0] === "object") {
            return miniList;
        }
        return miniList.map((miniLabel) => ({
            key: MINI_QUERY_MAP[miniLabel] || miniLabel,
            label: miniLabel,
        }));
    }, [mainCate, selectedSubObj, CASE_DEVICE_OPTIONS]);

    const sourceItems = useMemo(() => {
        return (allItems || []).filter((item) => {
            const matchMain =
                item.mainCategory === mainCate ||
                (Array.isArray(item.mainCategory) && item.mainCategory.includes(mainCate));

            const matchSub = draft.subCateLink
                ? (item.displaySubCategories || []).includes(draft.subCateLink)
                : true;

            const matchMini = draft.mini
                ? (item.displayMiniCategories || []).includes(draft.mini)
                : true;

            // 콜라보: 선택된 디바이스 기준으로 필터
            const matchDevice = (mainCate === "colab" && draft.device)
                ? (item.displayMiniCategories || []).includes(draft.device)
                : true;

            return matchMain && matchSub && matchMini && matchDevice;
        });
    }, [allItems, mainCate, draft.subCateLink, draft.mini, draft.device]);

    // 핸드폰 선택 시에만 모델 옵션 노출 (콜라보: device === "phone", 일반: mini === "phone")
    const showModelOptions = mainCate === "colab" ? draft.device === "phone" : draft.mini === "phone";
    const modelOptions = useMemo(() => showModelOptions ? uniqueModelOptions(sourceItems) : [], [sourceItems, showModelOptions]);
    const colorOptions = useMemo(() => uniqueColorOptions(sourceItems), [sourceItems]);

    // 케이스 > 디자인 > 시그니처 선택 시 caseCategory 목록 노출
    const showCaseCategoryOptions = mainCate === "case" && draft.subCateLink === "design" && draft.mini === "signature";
    const caseCategoryOptions = useMemo(() => {
        if (!showCaseCategoryOptions) return [];
        return [...new Set(sourceItems.map((i) => i.caseCategory).filter(Boolean))];
    }, [sourceItems, showCaseCategoryOptions]);

    const toggleArray = (key, value) => {
        setDraft((prev) => {
            const exists = prev[key].includes(value);

            return {
                ...prev,
                [key]: exists
                    ? prev[key].filter((item) => item !== value)
                    : [...prev[key], value],
            };
        });
    };

    const toggleSingle = (key, value) => {
        setDraft((prev) => ({
            ...prev,
            [key]: prev[key] === value ? null : value,
        }));
    };

    const onChangeSubCate = (subLink) => {
        setDraft((prev) => ({
            ...prev,
            subCateLink: subLink,
            mini: "",
            models: [],
            colors: [],
        }));
    };

    const onChangeDevice = (deviceKey) => {
        setDraft((prev) => ({
            ...prev,
            device: prev.device === deviceKey ? "" : deviceKey,
            models: [],
        }));
    };

    const onChangeMini = (miniKey) => {
        setDraft((prev) => ({
            ...prev,
            mini: prev.mini === miniKey ? "" : miniKey,
            device: "",
            caseCategory: "",
            models: [],
            colors: [],
        }));
    };

    const resetAll = () => {
        setDraft({
            subCateLink: currentSub?.link || "",
            mini: currentMini || "",
            models: [],
            isCollabo: null,
            isMagSafe: null,
            stockOnly: false,
            minPrice: "",
            maxPrice: "",
            colors: [],
        });
    };

    const applyFilters = () => {
        onApply({
            nextSubCateLink: draft.subCateLink || currentSub?.link || "",
            nextMini: draft.mini || "",
            filters: {
                device: draft.device || "",
                caseCategory: draft.caseCategory || "",
                models: draft.models,
                isCollabo: draft.isCollabo,
                isMagSafe: draft.isMagSafe,
                stockOnly: draft.stockOnly,
                minPrice: draft.minPrice,
                maxPrice: draft.maxPrice,
                colors: draft.colors,
            },
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="category-filter-dim" onClick={onClose}></div>

            <aside className="category-filter-panel">
                <div className="filter-panel-header">
                    <h3>필터</h3>

                    <div className="filter-panel-actions">
                        <button
                            type="button"
                            className="filter-reset-btn"
                            onClick={resetAll}
                        >
                            전체 취소
                        </button>

                        <button
                            type="button"
                            className="filter-close-btn"
                            onClick={onClose}
                        >
                            닫기
                        </button>
                    </div>
                </div>

                <div className="filter-panel-body filter-panel-scroll">
                    <section className="filter-section">
                        <h4 className="filter-section-title">카테고리</h4>

                        <div className="filter-chip-wrap">
                            {subOptions.map((sub) => (
                                <button
                                    type="button"
                                    key={sub.link}
                                    className={`filter-chip ${draft.subCateLink === sub.link ? "on" : ""}`}
                                    onClick={() => onChangeSubCate(sub.link)}
                                >
                                    {sub.name}
                                </button>
                            ))}
                        </div>
                    </section>

                    {!!deviceOptions.length && (
                        <section className="filter-section">
                            <h4 className="filter-section-title">디바이스</h4>

                            <div className="filter-chip-wrap">
                                {deviceOptions.map((device) => (
                                    <button
                                        type="button"
                                        key={device.key}
                                        className={`filter-chip ${mainCate === "colab"
                                                ? draft.device === device.key ? "on" : ""
                                                : draft.mini === device.key ? "on" : ""
                                            }`}
                                        onClick={() =>
                                            mainCate === "colab"
                                                ? onChangeDevice(device.key)
                                                : onChangeMini(device.key)
                                        }
                                    >
                                        {device.label}
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    {!!modelOptions.length && (
                        <section className="filter-section">
                            <h4 className="filter-section-title">모델 선택</h4>

                            <div className="filter-chip-wrap">
                                {modelOptions.map((model) => (
                                    <button
                                        type="button"
                                        key={model.key}
                                        className={`filter-chip ${draft.models.includes(model.key) ? "on" : ""}`}
                                        onClick={() => toggleArray("models", model.key)}
                                    >
                                        {model.label}
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    {!!caseCategoryOptions.length && (
                        <section className="filter-section">
                            <h4 className="filter-section-title">케이스 종류</h4>

                            <div className="filter-chip-wrap">
                                {caseCategoryOptions.map((cat) => (
                                    <button
                                        type="button"
                                        key={cat}
                                        className={`filter-chip ${draft.caseCategory === cat ? "on" : ""}`}
                                        onClick={() =>
                                            setDraft((prev) => ({
                                                ...prev,
                                                caseCategory: prev.caseCategory === cat ? "" : cat,
                                            }))
                                        }
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="filter-section">
                        <h4 className="filter-section-title">콜라보</h4>

                        <div className="filter-chip-wrap">
                            <button
                                type="button"
                                className={`filter-chip ${draft.isCollabo === true ? "on" : ""}`}
                                onClick={() => toggleSingle("isCollabo", true)}
                            >
                                콜라보상품
                            </button>

                            <button
                                type="button"
                                className={`filter-chip ${draft.isCollabo === false ? "on" : ""}`}
                                onClick={() => toggleSingle("isCollabo", false)}
                            >
                                일반 상품
                            </button>
                        </div>
                    </section>

                    <section className="filter-section">
                        <h4 className="filter-section-title">맥세이프 여부</h4>

                        <div className="filter-chip-wrap">
                            <button
                                type="button"
                                className={`filter-chip ${draft.isMagSafe === true ? "on" : ""}`}
                                onClick={() => toggleSingle("isMagSafe", true)}
                            >
                                맥세이프 가능
                            </button>

                            <button
                                type="button"
                                className={`filter-chip ${draft.isMagSafe === false ? "on" : ""}`}
                                onClick={() => toggleSingle("isMagSafe", false)}
                            >
                                일반 케이스
                            </button>
                        </div>
                    </section>

                    <section className="filter-section">
                        <h4 className="filter-section-title">가격범위</h4>

                        <div className="price-range-box">
                            <p className="price-range-label">최소 금액</p>
                            <input
                                type="number"
                                placeholder="0"
                                value={draft.minPrice}
                                onChange={(e) =>
                                    setDraft((prev) => ({
                                        ...prev,
                                        minPrice: e.target.value,
                                    }))
                                }
                            />
                            <span className="price-range-divider">~</span>
                            <p className="price-range-label">최대 금액</p>
                            <input
                                type="number"
                                placeholder="제한 없음"
                                value={draft.maxPrice}
                                onChange={(e) =>
                                    setDraft((prev) => ({
                                        ...prev,
                                        maxPrice: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </section>

                    <section className="filter-section">
                        <h4 className="filter-section-title">색상</h4>

                        <div className="filter-color-grid">
                            {colorOptions.map((color) => (
                                <button
                                    type="button"
                                    key={color}
                                    className={`color-swatch-btn ${draft.colors.includes(color) ? "on" : ""}`}
                                    onClick={() => toggleArray("colors", color)}
                                    title={color}
                                >
                                    <span
                                        className="color-swatch"
                                        style={{ backgroundColor: colorMap[color] || "#ddd" }}
                                    ></span>
                                    <span className="color-label">{color}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="filter-section">
                        <h4 className="filter-section-title">품절여부</h4>

                        <div className="filter-chip-wrap">
                            <button
                                type="button"
                                className={`filter-chip ${draft.stockOnly ? "on" : ""}`}
                                onClick={() =>
                                    setDraft((prev) => ({
                                        ...prev,
                                        stockOnly: !prev.stockOnly,
                                    }))
                                }
                            >
                                품절 제외
                            </button>
                        </div>
                    </section>
                </div>

                <div className="filter-panel-bottom">
                    <button
                        type="button"
                        className="filter-apply-btn"
                        onClick={applyFilters}
                    >
                        적용하기
                    </button>
                </div>
            </aside>
        </>
    );
}