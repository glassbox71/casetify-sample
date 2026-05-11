import React, { useEffect, useState, useMemo } from "react";
import "./scss/DetailPage.scss";
import { modelColorOptions, colorMap, phoneModelOptions, items } from "../../../data/finalData";
import { getModelsByProductGroup } from "../../../utils/groupProducts";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useAuthStore } from "../../../store/useAuthStore";
import { useProductStore } from "../../../store/useProductStore";
import ConfirmModal from "../../ConfirmModal";
import ToastPopup from "../../Toastpopup";
import Breadcrumb from "../../Breadcrumb";

export default function DetailPage({ item }) {

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;

    // ==================== STATE ====================
    const { selectedModel: initialModel, selectedColor: initialColor } = location.state || {};;
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [modelAccordionOpen, setModelAccordionOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(state?.selectedModel || "");
    const [selectedColor, setSelectedColor] = useState(state?.selectedColor || "");
    const [userSelected, setUserSelected] = useState(!!state?.selectedModel);
    const [selectedDeviceColor, setSelectedDeviceColor] = useState("");
    const [selectedThumb, setSelectedThumb] = useState("main");
    const [quantity, setQuantity] = useState(1);
    const [selectedBrandTab, setSelectedBrandTab] = useState(item?.brand || "Apple");
    const [isWished, setIsWished] = useState(false);
    const [selectedBundles, setSelectedBundles] = useState({});
    const [showLoginBanner, setShowLoginBanner] = useState(false) // ✅ 추가
    const [showCartBanner, setShowCartBanner] = useState(false)   // ✅ 추가

    const { user, onAddWishlist, onAddToCart, wishlist } = useAuthStore();
    const isWishList = wishlist.some((wishItem) => wishItem.productId === item.id);

    // ==================== EFFECTS ====================
    useEffect(() => {
        if (!item) return;

        setQuantity(1);
        setSelectedBundles({});
        setAccordionOpen(false);
        setModelAccordionOpen(false);
        setIsWished(item.isWish || false);

        const modelOpts = getModelsByProductGroup(items, item);

        const targetModelLabel = state?.selectedModel || initialModel;
        const targetColor = state?.selectedColor || initialColor;

        if (targetModelLabel) {
            setSelectedModel(targetModelLabel);
            setUserSelected(true);

            const targetModelOpt = modelOpts.find(mo => mo.label === targetModelLabel);

            if (targetModelOpt) {
                setSelectedDeviceColor(modelColorOptions?.[targetModelOpt.key]?.[0]?.key || "");

                if (targetColor) {
                    setSelectedColor(targetColor);
                } else {
                    const matched = items.find(d =>
                        d.productName === item.productName &&
                        d.caseCategory === item.caseCategory &&
                        d.modelLabel === targetModelLabel
                    );
                    setSelectedColor(matched?.mainCaseColor || matched?.caseColors?.[0] || "");
                }
            }
        } else {
            setSelectedColor(item.mainCaseColor || item.caseColors?.[0] || "");
            setSelectedDeviceColor(modelColorOptions?.[item?.modelKey]?.[0]?.key || "");

            if (item.compatibleModels?.length === 1) {
                setSelectedModel(item.compatibleModels[0]);
            } else if (modelOpts?.length === 1) {
                setSelectedModel(modelOpts[0].label);
                setSelectedDeviceColor(modelColorOptions?.[modelOpts[0].key]?.[0]?.key || "");
                const matched = items.find(d =>
                    d.productName === item.productName &&
                    d.caseCategory === item.caseCategory &&
                    d.modelLabel === modelOpts[0].label
                );
                if (matched) setSelectedColor(matched.mainCaseColor || matched.caseColors?.[0] || "");
            } else {
                setSelectedModel("");
            }

            const hasNoOption = !phoneModelOptions[item?.brand] && !item?.compatibleModels?.length && !item?.caseColors?.length;
            const autoSelected = item.compatibleModels?.length === 1 || modelOpts?.length === 1 || item.caseColors?.length === 1;
            setUserSelected(hasNoOption || item.isWish || autoSelected || false);
        }

        const availableBrand = Object.keys(phoneModelOptions).find((brand) =>
            phoneModelOptions[brand].some((m) =>
                modelOpts.some((mo) => mo.key === m.key)
            )
        );
        if (availableBrand) setSelectedBrandTab(availableBrand);

    }, [item, state, initialModel, initialColor]);

    // ==================== MEMO ====================

    const bundleItems = useMemo(() => {
        if (!items || !item) return [];

        const accessories = items.filter((d) =>
            Array.isArray(d.mainCategory)
                ? d.mainCategory.includes("accessory")
                : d.mainCategory === "accessory"
        );

        const seed = item.id.replace(/\D/g, "").split("").reduce((acc, n) => acc + Number(n), 0);

        const len = accessories.length;
        const idx1 = seed % len;
        let idx2 = (seed * 3 + 7) % len;
        if (idx2 === idx1) idx2 = (idx2 + 1) % len;

        return [item, accessories[idx1], accessories[idx2]];
    }, [item, items]);

    const modelOptions = useMemo(() => {
        return getModelsByProductGroup(items, item);
    }, [item]);


    // ==================== HANDLERS ====================

    const handleBundleToggle = (bundleItem) => {
        setSelectedBundles((prev) => {
            const next = { ...prev };
            if (next[bundleItem.id]) {
                delete next[bundleItem.id];
            } else {
                next[bundleItem.id] = 1;
            }
            return next;
        });
    };

    const handleBundleQty = (bundleId, delta) => {
        setSelectedBundles((prev) => {
            const next = { ...prev };
            const current = next[bundleId] || 1;
            const nextQty = current + delta;
            if (nextQty <= 0) {
                delete next[bundleId];
            } else {
                next[bundleId] = nextQty;
            }
            return next;
        });
    };

    const getBundleImagePath = (b) => {
        const isPhoneB = b?.productTarget === "phone";
        const modelColorsB = isPhoneB ? modelColorOptions?.[b?.modelKey] || [] : [];
        const fixedDeviceColorB = isPhoneB ? modelColorsB?.[0]?.key || "" : "";
        if (isPhoneB) {
            return `/images/category/products/${b.id}_${b.modelKey}_${fixedDeviceColorB}_${b.mainCaseColor}_main.jpg`;
        } else if (b.modelKey) {
            return `/images/category/products/${b.id}_${b.modelKey}_${b.mainCaseColor}_main.jpg`;
        } else {
            return `/images/category/products/${b.id}${b.mainCaseColor ? `_${b.mainCaseColor}` : ""}_main.jpg`;
        }
    };

    // ✅ 로그인 토스트 표시 후 이동
    const showLoginAlert = () => {
        setShowLoginBanner(true)
        setTimeout(() => {
            setShowLoginBanner(false)
            navigate('/login')
        }, 1500)
    }

    // ✅ 옵션 미선택 토스트 표시
    const showCartAlert = () => {
        setShowCartBanner(true)
        setTimeout(() => {
            setShowCartBanner(false)
        }, 1500)
    }

    // ==================== EARLY RETURN ====================
    if (!item) {
        return (
            <div className="detail-page">
                <p>상품을 찾을 수 없습니다.</p>
            </div>
        );
    }


    // ==================== DERIVED VALUES ====================
    const isPhone = item?.productTarget === "phone";

    const selectedItem = (() => {
        if (!selectedModel || !isPhone) return item;
        return items.find(
            (d) =>
                d.productName === item.productName &&
                d.caseCategory === item.caseCategory &&
                d.modelLabel === selectedModel
        ) || item;
    })();

    const modelColors = isPhone ? modelColorOptions?.[selectedItem?.modelKey] || [] : [];
    const fixedThumbDeviceColor = isPhone ? modelColors?.[0]?.key || "" : "";

    const mainImagePath = isPhone
        ? `/images/category/products/${selectedItem.id}_${selectedItem.modelKey}_${selectedDeviceColor}_${selectedColor}_main.jpg`
        : item.modelKey
            ? `/images/category/products/${item.id}_${item.modelKey}_${selectedColor}_main.jpg`
            : `/images/category/products/${item.id}${selectedColor ? `_${selectedColor}` : ""}_main.jpg`;

    const imageList = [
        { key: "main", src: mainImagePath },
        {
            key: "1",
            src: isPhone
                ? `/images/category/products/${selectedItem.id}_${selectedItem.modelKey}_${fixedThumbDeviceColor}_${selectedColor}_1.jpg`
                : item.modelKey
                    ? `/images/category/products/${item.id}_${item.modelKey}_${selectedColor}_1.jpg`
                    : `/images/category/products/${item.id}${selectedColor ? `_${selectedColor}` : ""}_1.jpg`,
        },
        {
            key: "2",
            src: isPhone
                ? `/images/category/products/${selectedItem.id}_${selectedItem.modelKey}_${fixedThumbDeviceColor}_${selectedColor}_2.jpg`
                : item.modelKey
                    ? `/images/category/products/${item.id}_${item.modelKey}_${selectedColor}_2.jpg`
                    : `/images/category/products/${item.id}${selectedColor ? `_${selectedColor}` : ""}_2.jpg`,
        },
        {
            key: "3",
            src: isPhone
                ? `/images/category/products/${selectedItem.id}_${selectedItem.modelKey}_${fixedThumbDeviceColor}_${selectedColor}_3.jpg`
                : item.modelKey
                    ? `/images/category/products/${item.id}_${item.modelKey}_${selectedColor}_3.jpg`
                    : `/images/category/products/${item.id}${selectedColor ? `_${selectedColor}` : ""}_3.jpg`,
        },
    ];

    const mainImage = imageList.find((img) => img.key === selectedThumb)?.src || imageList[0].src;

    const [wishMsg, setWishMsg] = useState("");
    const [cartMsg, setCartMsg] = useState("");
    const [isWishPopupOpen, setIsWishPopupOpen] = useState(false);
    const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
    const [isPopupErr, setIsPopupErr] = useState(false);

    // ✅ 모든 옵션 선택 여부 체크
    const canAddCart = (() => {
        if (isPhone && modelOptions.length > 0 && !selectedModel) return false;
        // ✅ selectedModel이 compatibleModels 목록 안에 있는 값인지까지 체크
        if (!isPhone && item.compatibleModels?.length > 0) {
            const isValidModel = item.compatibleModels.includes(selectedModel);
            if (!isValidModel) return false;
        }
        if (item.caseColors?.length > 1 && !selectedColor) return false;
        return true;
    })();



    const handleAddWish = async (item) => {
        if (!user) {
            // ✅ 팝업 대신 배너 표시 후 로그인 이동
            showLoginAlert()
            return;
        }
        const modelKey = isPhone
            ? phoneModelOptions[selectedBrandTab]?.find((model) => selectedModel === model.label)?.key || ""
            : "";

        const wishItem = {
            id: item.id,
            productName: item.productName,
            price: item.price,
            device: selectedModel,
            deviceKey: isPhone ? modelKey : selectedModel,
            color: selectedColor,
            imgUrl: mainImagePath,
            caseCategory: item.caseCategory
        };

        const isWish = await onAddWishlist(wishItem);

        if (isWish === "del") {
            setWishMsg("위시리스트에서 삭제했습니다.");
            setIsWishPopupOpen(true);
        } else if (isWish === "add") {
            setWishMsg("위시리스트에 담겼습니다!");
            setIsWishPopupOpen(true);
        } else {
            setWishMsg("오류가 발생했습니다. 다시 시도해주세요.");
            setIsPopupErr(true);
        }
    };

    const handleAddCart = async (item) => {
        const modelKey = isPhone
            ? phoneModelOptions[selectedBrandTab]?.find((model) => selectedModel === model.label)?.key || ""
            : "";

        const cartItem = {
            id: item.id,
            productName: item.productName,
            price: item.price,
            device: selectedModel,
            deviceKey: isPhone ? modelKey : selectedModel,
            color: selectedColor,
            imgUrl: mainImagePath,
            colorList: item.caseColors,
            deviceList: isPhone ? modelOptions : item.compatibleModels ?? "",
            isPhone: isPhone,
            isWish: item.isWish,
            deviceBrand: selectedBrandTab,
            caseCategory: item.caseCategory
        };

        const isCart = await onAddToCart(cartItem);

        if (isCart) {
            setCartMsg("장바구니에 담겼습니다!");
            setIsCartPopupOpen(true);
        } else {
            setCartMsg("장바구니에 담기실패");
            setIsPopupErr(true);
        }
    };

    const handleBundleAddCart = async () => {
        try {
            const modelKey = isPhone
                ? phoneModelOptions[selectedBrandTab]?.find((model) => selectedModel === model.label)?.key || ""
                : "";

            const cartItem = {
                id: item.id,
                productName: item.productName,
                price: item.price,
                device: selectedModel,
                deviceKey: isPhone ? modelKey : selectedModel,
                color: selectedColor,
                imgUrl: mainImagePath,
                colorList: item.caseColors,
                deviceList: isPhone ? modelOptions : item.compatibleModels,
                isPhone: isPhone,
                isWish: item.isWish,
                deviceBrand: selectedBrandTab,
                caseCategory: item.caseCategory
            };

            const isCart = await onAddToCart(cartItem);

            if (!isCart) {
                setCartMsg("장바구니에 담기실패");
                setIsPopupErr(true);
            }

            const cartPromises = Object.entries(selectedBundles).map(async ([bundleKey, bundleValue]) => {
                const bundle = items.find((data) => String(data.id) === String(bundleKey));

                const bundleCartItem = {
                    id: bundle.id,
                    productName: bundle.productName,
                    price: bundle.price,
                    device: bundle.compatibleModels[0] ?? "",
                    deviceKey: bundle.modelKey ?? "",
                    color: bundle.mainCaseColor,
                    imgUrl: `/images/category/products/${bundle.id}${bundle.mainCaseColor ? `_${bundle.mainCaseColor}` : ""}_main.jpg`,
                    colorList: bundle.caseColors,
                    deviceList: bundle.compatibleModels,
                    isPhone: false,
                    isWish: bundle.isWish,
                    deviceBrand: "",
                    caseCategory: bundle.caseCategory
                };

                return onAddToCart(bundleCartItem);
            });

            const results = await Promise.all(cartPromises);
            const isAllSuccess = results.every(res => res === true);

            if (isAllSuccess) {
                setCartMsg("세트 상품이 장바구니에 담겼습니다!");
                setIsPopupErr(false);
                setIsCartPopupOpen(true);
            } else {
                setCartMsg("장바구니에 담기실패");
                setIsPopupErr(true);
            }
        } catch (error) {
            console.log("번들 추가 중 오류 발생:", error.message);
            setIsPopupErr(true);
        }
    }

    const optionSummary = [
        selectedColor,
        selectedModel,
    ].filter(Boolean).join(" / ");

    const bundleTotal = bundleItems
        .filter((b) => b.id !== item.id)
        .reduce((acc, b) => {
            const qty = selectedBundles[b.id] || 0;
            return acc + Math.round(b.price * 0.9) * qty;
        }, 0);

    const totalPrice = (item.price || 0) * quantity + bundleTotal;
    const totalQty = quantity + Object.values(selectedBundles).reduce((a, q) => a + q, 0);


    // ==================== RENDER ====================
    const { mainMenuList } = useProductStore();
    // mainCategory가 문자열인 경우도 처리
    const mainCategoryArr = Array.isArray(item?.mainCategory)
        ? item.mainCategory
        : (item?.mainCategory ? [item.mainCategory] : []);
    const mainCateKey = mainCategoryArr[0];

    // mainmenu 찾기
    const mainMenu = mainMenuList?.find(m => m.link === mainCateKey);

    // displaySubCategories의 첫 번째 값으로 submenu 찾기
    const subCateKey = item?.displaySubCategories?.[0];
    const subMenu = mainMenu?.sub?.find(s => s.link === subCateKey);

    // displayMiniCategories의 첫 번째 값으로 minimenu 찾기
    const miniCateKey = item?.displayMiniCategories?.[0];
    const MINI_LABEL_MAP = {
        phone: '핸드폰', earphone: '이어폰', laptop: '노트북', watch: '워치', tablet: '태블릿',
        color: '컬러', pattern: '패턴', signature: '시그니처', character: '캐릭터',
        art: '아트', movie: '영화&엔터', fashion: '패션&라이프스타일', sports: '스포츠',
        strap: '스트랩', charm: '참', protector: '보호필름', magsafe: '맥세이프',
        bag: '가방', stand: '스탠드', wallet: '지갑형', holder: '홀더', etc: '기타',
    };
    const miniLabel = miniCateKey ? MINI_LABEL_MAP[miniCateKey] : null;

    // 브레드크럼: 홈 > mainmenu(링크X) > submenu > minimenu (제품명 제거)
    // 실제 라우트: /:mainCate/:subCate?mini=xxx
    const breadcrumbItems = [
        { label: '홈', to: '/' },
        ...(mainMenu ? [{ label: mainMenu.name }] : []),
        ...(subMenu ? [{ label: subMenu.name, to: `/${mainCateKey}/${subCateKey}` }] : []),
        ...(miniLabel && miniCateKey !== subCateKey ? [{ label: miniLabel, to: `/${mainCateKey}/${subCateKey}?mini=${miniCateKey}` }] : []),
    ];

    return (
        <>
            <section className="detail-page">
                <div className="detail-inner">
                    <div className="detail-left">
                        {/* 브레드크럼 */}
                        <Breadcrumb items={breadcrumbItems} />
                        <div className="detail-image-wrap">
                            <div className="detail-main-image" style={{ position: "relative" }}>
                                <img src={mainImage} alt={item.productName} />

                                {/* ✅ 로그인 경고 토스트 */}
                                <ToastPopup
                                    isOpen={showLoginBanner}
                                    message="로그인후 이용 가능합니다."
                                    onClose={() => setShowLoginBanner(false)}
                                    duration={1500}
                                />

                                {/* ✅ 옵션 미선택 토스트 — 로그인 경고와 동일한 디자인 */}
                                <ToastPopup
                                    isOpen={showCartBanner}
                                    message="모든 옵션을 선택해주세요."
                                    onClose={() => setShowCartBanner(false)}
                                    duration={1500}
                                />

                                {isPhone && !!modelColors.length && (
                                    <div className="color-remote">
                                        {modelColors.map((deviceColor) => (
                                            <button
                                                key={deviceColor.key}
                                                type="button"
                                                className={selectedDeviceColor === deviceColor.key ? "active" : ""}
                                                onClick={() => {
                                                    setSelectedDeviceColor(deviceColor.key);
                                                    setSelectedThumb("main");
                                                    setUserSelected(true);
                                                }}
                                            >
                                                <span
                                                    className="remote-chip"
                                                    style={{ backgroundColor: colorMap[deviceColor.key] || "#ddd" }}
                                                />
                                                <span className="remote-label">{deviceColor.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <button
                                    className={`image-wish-btn ${isWishList ? "wished" : ""}`}
                                    onClick={() => {
                                        handleAddWish(item);
                                    }}
                                >
                                    <img
                                        src={isWishList ? "/images/icon/LIKE.svg" : "/images/icon/UNLIKE.svg"}
                                        alt="위시"
                                    />
                                </button>
                            </div>

                            <ul className="detail-thumb-list">
                                {imageList.map((img) => (
                                    <li key={img.key} className={selectedThumb === img.key ? "active" : ""}
                                        style={{ display: img.key === "main" ? "block" : "none" }}
                                        ref={(el) => {
                                            if (el && img.key !== "main") {
                                                const image = el.querySelector("img");
                                                if (image) {
                                                    image.onload = () => { el.style.display = "block"; };
                                                    image.onerror = () => { el.style.display = "none"; };
                                                }
                                            }
                                        }}
                                    >
                                        <button type="button" onClick={() => setSelectedThumb(img.key)}>
                                            <img src={img.src} alt={`${item.productName} 썸네일`} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="detail-right">
                        <div className="detail-meta">
                            {item.badge?.includes("무료 배송") && (
                                <span className="badge-free-ship">무료 배송</span>
                            )}
                            <span className="detail-product-id">{item.id}</span>
                        </div>
                        <h2 className="detail-title">{item.productName}</h2>
                        <p className="detail-price">
                            {Number(item.price || 0).toLocaleString()}원
                        </p>

                        <div className="right-info-wrap">
                            {!!item.caseCategory && (
                                <div className="detail-info-box">
                                    <p className="label"><span className="label">{item.caseCategory}</span></p>
                                </div>
                            )}

                            <div className="model-select-box">
                                {isPhone && modelOptions.length > 0 && (
                                    <div className="detail-info-box">
                                        <p className="label">기종</p>
                                        <div className="model-accordion">
                                            <button
                                                type="button"
                                                className="model-accordion-trigger"
                                                onClick={() => setModelAccordionOpen((prev) => !prev)}
                                            >
                                                <span>{selectedModel || "기종을 선택하세요"}</span>
                                                <span className={`model-accordion-arrow ${modelAccordionOpen ? "open" : ""}`}>▼</span>
                                            </button>
                                            {modelAccordionOpen && (
                                                <div className="model-accordion-list">
                                                    <div className="model-brand-tabs">
                                                        {Object.keys(phoneModelOptions)
                                                            .filter((brand) =>
                                                                phoneModelOptions[brand].some((m) =>
                                                                    modelOptions.some((mo) => mo.key === m.key)
                                                                )
                                                            )
                                                            .map((brand) => (
                                                                <button
                                                                    key={brand}
                                                                    type="button"
                                                                    className={selectedBrandTab === brand ? "active" : ""}
                                                                    onClick={() => setSelectedBrandTab(brand)}
                                                                >
                                                                    {brand}
                                                                </button>
                                                            ))}
                                                    </div>

                                                    <ul className="model-sub-list">
                                                        {modelOptions
                                                            .filter((mo) =>
                                                                (phoneModelOptions[selectedBrandTab] || []).some(
                                                                    (m) => m.key === mo.key
                                                                )
                                                            )
                                                            .map((model) => (
                                                                <li
                                                                    key={model.key}
                                                                    className={selectedModel === model.label ? "active" : ""}
                                                                    onClick={() => {
                                                                        setSelectedModel(model.label);
                                                                        setModelAccordionOpen(false);
                                                                        setUserSelected(true);
                                                                        setSelectedThumb("main");
                                                                        setSelectedDeviceColor(modelColorOptions?.[model.key]?.[0]?.key || "");
                                                                        const matched = items.find(
                                                                            (d) =>
                                                                                d.productName === item.productName &&
                                                                                d.caseCategory === item.caseCategory &&
                                                                                d.modelLabel === model.label
                                                                        );
                                                                        if (matched) setSelectedColor(matched.mainCaseColor || matched.caseColors?.[0] || "");
                                                                    }}
                                                                >
                                                                    {model.label}
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {!!item.caseColors?.length && (
                                <div className="detail-info-box">
                                    <p className="label">케이스 컬러</p>
                                    <div className="detail-colors">
                                        {item.caseColors.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={selectedColor === color ? "active" : ""}
                                                onClick={() => {
                                                    setSelectedColor(color);
                                                    setSelectedThumb("main");
                                                    setUserSelected(true);
                                                }}
                                            >
                                                <span
                                                    className="color-chip"
                                                    style={{ backgroundColor: colorMap[color] || "#ddd" }}
                                                />
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!!item.compatibleModels?.length && (
                                <div className="detail-info-box">
                                    <p className="label">옵션</p>
                                    <div className="accordion">
                                        <button
                                            type="button"
                                            className="accordion-trigger"
                                            onClick={() => setAccordionOpen((prev) => !prev)}
                                        >
                                            <span>{selectedModel || "옵션을 고르세요"}</span>
                                            <span className={`accordion-arrow ${accordionOpen ? "open" : ""}`}>▼</span>
                                        </button>
                                        {accordionOpen && (
                                            <ul className="accordion-list">
                                                {item.compatibleModels.map((model) => (
                                                    <li
                                                        key={model}
                                                        className={selectedModel === model ? "active" : ""}
                                                        onClick={() => {
                                                            setSelectedModel(model);
                                                            setAccordionOpen(false);
                                                            setUserSelected(true);
                                                        }}
                                                    >
                                                        {model}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ========== 주문 / 버튼 영역 ========== */}
                        <div className="right-btn-wrap">
                            {userSelected && (isPhone || !!item.compatibleModels?.length || !!item.caseColors?.length) && (
                                <div className="order-result">
                                    <hr className="left-line" />

                                    <div className="order-result-row">
                                        <span className="order-option-name">
                                            {item.productName}
                                            {optionSummary && (
                                                <em className="order-option-detail"> / {optionSummary}</em>
                                            )}
                                        </span>
                                        <div className="order-quantity">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    if (quantity > 1) {
                                                        setQuantity((q) => q - 1);
                                                    }
                                                    // quantity가 1이면 아무것도 안 함 → 선택값 유지
                                                }}
                                            >−</button>
                                            <span>{quantity}</span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setQuantity((q) => q + 1);
                                                }}
                                            >+</button>
                                        </div>
                                        <span className="order-row-price">
                                            {((item.price || 0) * quantity).toLocaleString()}원
                                        </span>
                                    </div>

                                    <div className="order-total">
                                        <span>총 상품금액 (수량 {quantity}개)</span>
                                        <strong>{((item.price || 0) * quantity).toLocaleString()}원</strong>
                                    </div>
                                </div>
                            )}

                            {/* ✅ userSelected → canAddCart 로 교체 */}
                            <button className="buy-btn" onClick={() => {
                                if (!user) {
                                    // ✅ 팝업 대신 배너 표시
                                    showLoginAlert()
                                    return;
                                }
                                if (!canAddCart) {
                                    // ✅ 팝업 대신 토스트 배너 표시
                                    showCartAlert()
                                    return;
                                }
                                handleAddCart(item);
                            }}>
                                <span className="icon"><img src="/images/icon/btn_shopping-cart.svg" alt="" /></span> 장바구니에 담기
                            </button>
                        </div>

                        {/* ========== 번들 섹션 ========== */}
                        {item?.productTarget === "phone" && bundleItems.length > 0 && (
                            <div className="budle-buy">
                                <div className="bundle-section">
                                    <p className="bundle-title">번들 할인</p>
                                    <ul className="bundle-list">
                                        {bundleItems.map((b, index) => {
                                            const isChecked = index === 0 || !!selectedBundles[b.id];
                                            const isFirst = index === 0;
                                            const bundlePrice = Math.round(b.price * 0.9);
                                            const isSelected = !!selectedBundles[b.id];

                                            return (
                                                <li
                                                    key={b.id}
                                                    className={`bundle-item ${isChecked ? "selected" : ""} ${isFirst ? "current" : ""}`}
                                                    onClick={() => !isFirst && handleBundleToggle(b)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="bundle-checkbox"
                                                        checked={isChecked}
                                                        onChange={() => { }}
                                                        disabled={isFirst}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!isFirst) handleBundleToggle(b);
                                                        }}
                                                    />
                                                    <div className="bundle-img-wrap">
                                                        <img src={getBundleImagePath(b)} alt={b.productName} />
                                                    </div>
                                                    <span className="bundle-name">{b.productName}</span>

                                                    <div className="bundle-price-wrap">
                                                        <span className="bundle-default-price">{b.price.toLocaleString()}원</span>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {Object.keys(selectedBundles).length > 0 && (
                                        <div className="bundle-total-wrap">
                                            <span className="bundle-total-label">번들 할인 총액</span>
                                            <div className="bundle-total-right">
                                                <em className="bundle-total-origin">
                                                    {(
                                                        (item.price || 0) +
                                                        bundleItems
                                                            .filter((b) => selectedBundles[b.id])
                                                            .reduce((acc, b) => acc + b.price * (selectedBundles[b.id] || 1), 0)
                                                    ).toLocaleString()}원
                                                </em>
                                                <strong className="bundle-total-discount">
                                                    {(
                                                        (item.price || 0) +
                                                        bundleItems
                                                            .filter((b) => b.id !== item.id && selectedBundles[b.id])
                                                            .reduce((acc, b) => acc + Math.round(b.price * 0.9) * (selectedBundles[b.id] || 1), 0)
                                                    ).toLocaleString()}원
                                                </strong>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ✅ userSelected → canAddCart 로 교체 */}
                                <button className="buy-btn" onClick={() => {
                                    if (!user) {
                                        // ✅ 팝업 대신 배너 표시
                                        showLoginAlert()
                                        return;
                                    }
                                    if (!canAddCart) {
                                        // ✅ 팝업 대신 토스트 배너 표시
                                        showCartAlert()
                                        return;
                                    }
                                    handleBundleAddCart();
                                }}>
                                    <span className="icon"><img src="/images/icon/btn_shopping-cart.svg" alt="" /></span>
                                    {Object.keys(selectedBundles).length > 0
                                        ? `번들 장바구니에 담기 (${Object.keys(selectedBundles).length})`
                                        : "장바구니에 담기"}
                                </button>
                            </div>
                        )}

                        {/* ========== 이미지 경로 확인용 (임시) ========== */}
                        {/* <div className="detail-desc">
                        <h3>상품 안내</h3>
                        <p>
                            현재 이 페이지는 데이터 연결과 이미지 경로 확인용 임시 상세페이지야.
                            <br /><br />
                            메인 이미지:<br />
                            {isPhone
                                ? `${selectedItem.id}_${selectedItem.modelKey}_${selectedDeviceColor}_${selectedColor}_main.jpg`
                                : item.modelKey
                                    ? `${item.id}_${item.modelKey}_${selectedColor}_main.jpg`
                                    : `${item.id}${selectedColor ? `_${selectedColor}` : ""}_main.jpg`}
                            <br /><br />
                            상세 이미지:<br />
                            {isPhone
                                ? `${selectedItem.id}_${selectedItem.modelKey}_${fixedThumbDeviceColor}_${selectedColor}_1.jpg`
                                : item.modelKey
                                    ? `${item.id}_${item.modelKey}_${selectedColor}_1.jpg`
                                    : `${item.id}${selectedColor ? `_${selectedColor}` : ""}_1.jpg`}
                            <br />
                            {isPhone
                                ? `${selectedItem.id}_${selectedItem.modelKey}_${fixedThumbDeviceColor}_${selectedColor}_2.jpg`
                                : item.modelKey
                                    ? `${item.id}_${item.modelKey}_${selectedColor}_2.jpg`
                                    : `${item.id}${selectedColor ? `_${selectedColor}` : ""}_2.jpg`}
                        </p>
                    </div> */}

                    </div>

                    {/* ✅ wishPopup - ConfirmModal */}
                    <ConfirmModal
                        isOpen={isWishPopupOpen}
                        message={wishMsg}
                        onClose={() => setIsWishPopupOpen(false)}
                        buttons={
                            isPopupErr
                                ? [{ label: '닫기', onClick: () => setIsWishPopupOpen(false) }]
                                : [
                                    { label: '계속 쇼핑하기', onClick: () => setIsWishPopupOpen(false), variant: 'secondary' },
                                    { label: '위시리스트 보기', onClick: () => navigate('/mypage', { state: { menu: "위시리스트" } }) },
                                ]
                        }
                    />
                </div>
            </section>

            {/* ✅ cartPopup - ConfirmModal */}
            <ConfirmModal
                isOpen={isCartPopupOpen}
                message={cartMsg}
                onClose={() => setIsCartPopupOpen(false)}
                buttons={
                    isPopupErr
                        ? [{ label: '닫기', onClick: () => setIsCartPopupOpen(false) }]
                        : [
                            { label: '계속 쇼핑하기', onClick: () => setIsCartPopupOpen(false), variant: 'secondary' },
                            { label: '장바구니 보기', onClick: () => navigate('/cart') },
                        ]
                }
            />
        </>
    );
}