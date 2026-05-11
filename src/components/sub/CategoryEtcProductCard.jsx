import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./scss/categoryProductCard.scss";
import { useAuthStore } from "../../store/useAuthStore";

export default function CategoryEtcProductCard({ item, modelLabels = [] }) {
    const [isImageError, setIsImageError] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const { user, onAddToCart, onAddWishlist, wishlist } = useAuthStore();
    const navigate = useNavigate();

    if (!item) return null;

    const colors = Array.isArray(item.caseColors) ? item.caseColors : [];
    const mainColor = item.mainCaseColor || colors[0] || "";
    const compatibleModels = Array.isArray(item.compatibleModels) ? item.compatibleModels : [];

    const imagePath = mainColor
        ? item.modelKey
            ? `/images/category/products/${item.id}_${item.modelKey}_${mainColor}_main.jpg`
            : `/images/category/products/${item.id}_${mainColor}_main.jpg`
        : item.modelKey
            ? `/images/category/products/${item.id}_${item.modelKey}_main.jpg`
            : `/images/category/products/${item.id}_main.jpg`;

    const hoverImagePath = mainColor
        ? item.modelKey
            ? `/images/category/products/${item.id}_${item.modelKey}_${mainColor}_1.jpg`
            : `/images/category/products/${item.id}_${mainColor}_1.jpg`
        : item.modelKey
            ? `/images/category/products/${item.id}_${item.modelKey}_1.jpg`
            : `/images/category/products/${item.id}_1.jpg`;

    const displayModelText = useMemo(() => {
        if (modelLabels.length > 0) {
            return modelLabels.length > 2
                ? `${modelLabels[0]} 외 ${modelLabels.length - 1}`
                : modelLabels.join(" / ");
        }
        if (item.modelLabel) return item.modelLabel;
        if (compatibleModels.length > 0) return compatibleModels[0];
        return "";
    }, [modelLabels, item.modelLabel, compatibleModels]);

    const isWished = wishlist.some((w) => w.productId === item.id);

    const showFeedback = (type) => {
        setFeedback(type);
        setTimeout(() => setFeedback(null), 1500);
    };

    const handleWish = async (e) => {
        e.preventDefault();
        if (!item.isWish) {
            showFeedback("needDetail");
            setTimeout(() => navigate(`/detail/${item.id}`), 1500);
            return;
        }
        if (!user) {
            showFeedback("login");
            setTimeout(() => navigate("/login"), 1500);
            return;
        }
        const result = await onAddWishlist({
            id: item.id,
            productName: item.productName,
            price: item.price,
            device: "",
            color: mainColor,
            imgUrl: imagePath,
            caseCategory: item.caseCategory,
        });
        showFeedback(result === "del" ? "unwish" : "wish");
    };

    const handleCart = async (e) => {
        e.preventDefault();
        if (!item.isWish) {
            showFeedback("needDetail");
            setTimeout(() => navigate(`/detail/${item.id}`), 1500);
            return;
        }
        if (!user) {
            showFeedback("login");
            setTimeout(() => navigate("/login"), 1500);
            return;
        }
        await onAddToCart({
            id: item.id,
            productName: item.productName,
            price: item.price,
            device: displayModelText || "",
            deviceKey: item.modelKey || "",
            color: mainColor,
            imgUrl: imagePath,
            colorList: colors,
            deviceList: Array.isArray(item.compatibleModels) ? item.compatibleModels : [],
            isPhone: false,
            deviceBrand: "",
            caseCategory: item.caseCategory,
        });
        showFeedback("cart");
    };

    return (
        <article className="product-card">
            <div className="card-img-wrap">
                <Link to={`/detail/${item.id}`} className="card-link">
                    <div className="card-img">
                        {!isImageError ? (
                            <>
                                <img
                                    className="img-main"
                                    src={imagePath}
                                    alt={item.productName}
                                    onError={() => setIsImageError(true)}
                                />
                                <img
                                    className="img-hover"
                                    src={hoverImagePath}
                                    alt=""
                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                />
                            </>
                        ) : (
                            <p className="image-error-path">{imagePath}</p>
                        )}
                    </div>
                </Link>

                <button
                    className={`btn-wish${isWished ? " wished" : ""}`}
                    onClick={handleWish}
                    title="찜하기"
                >
                    <img
                        src={isWished ? "/images/icon/LIKE.svg" : "/images/icon/UNLIKE.svg"}
                        alt="찜하기"
                    />
                </button>

                <div className="card-hover-actions">
                    <button className="btn-cart" onClick={handleCart} title="장바구니">
                        <img src="/images/icon/btn_shopping-cart.svg" alt="장바구니" />
                        <span>장바구니 담기</span>
                    </button>
                </div>

                {feedback && (
                    <div className={`card-feedback${feedback === "needDetail" || feedback === "login" ? " need-detail" : ""}`}>
                        {feedback === "cart" && "장바구니에 담겼어요"}
                        {feedback === "wish" && "찜 목록에 추가됐어요"}
                        {feedback === "unwish" && "찜 목록에서 제거됐어요"}
                        {feedback === "needDetail" && "상세 내역을 선택해 주세요"}
                        {feedback === "login" && "로그인 후 이용 가능합니다."}
                    </div>
                )}
            </div>

            <div className="card-info">
                <p className="card-name">{item.productName}</p>

                {!!item.caseCategory && !!displayModelText && (
                    <p className="card-sub">{displayModelText} · {item.caseCategory}</p>
                )}
                {!!item.caseCategory && !displayModelText && (
                    <p className="card-sub">{item.caseCategory}</p>
                )}
                {!item.caseCategory && !!displayModelText && (
                    <p className="card-sub">{displayModelText}</p>
                )}

                <div className="card-price-row">
                    <p className="card-price">
                        {Number(item.price || 0).toLocaleString()}원
                    </p>
                    {Array.isArray(item.badge) && item.badge.length > 0 && (
                        <div className="card-badges">
                            {item.badge.map((b) => (
                                <span key={b} className="badge">{b}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}