import React from "react";
import "./scss/detailProductCard.scss";
import { modelColorOptions, colorMap } from "../../../data/practiceData";

export default function CategoryProductCard({ item }) {
    if (!item) return null;

    const colors = Array.isArray(item.caseColors) ? item.caseColors : [];
    const visibleColors = colors.slice(0, 5);
    const extraCount = colors.length - visibleColors.length;

    const modelLabel = item.modelLabel || "";
    const modelKey = item.modelKey || "";
    const productTarget = item.productTarget || "phone";
    const mainCaseColor = item.mainCaseColor || colors[0] || "Black";

    const modelColors =
        productTarget === "phone" ? modelColorOptions?.[modelKey] || [] : [];

    const deviceColorKey =
        productTarget === "phone"
            ? modelColors[0]?.key || "Black"
            : "Default";

    const primaryImagePath =
        productTarget === "phone"
            ? `/images/category/products/${item.id}_${modelKey}_${deviceColorKey}_${mainCaseColor}_main.jpg`
            : `/images/category/products/${item.id}_${modelKey}_${mainCaseColor}_main.jpg`;

    const fallbackImagePath = "/images/common/no-image.jpg";

    const handleImageError = (e) => {
        if (e.currentTarget.dataset.fallback === "true") return;
        e.currentTarget.dataset.fallback = "true";
        e.currentTarget.src = fallbackImagePath;
    };

    return (
        <li className="product-card">
            <div className="card-img">
                <img
                    src={primaryImagePath}
                    alt={item.productName}
                    onError={handleImageError}
                />
            </div>

            <div className="card-info">
                <p className="card-name">{item.productName}</p>

                {!!modelLabel && (
                    <p className="card-selectedDevice">{modelLabel}</p>
                )}

                {!!item.caseCategory && (
                    <p className="card-category">{item.caseCategory}</p>
                )}

                <p className="card-price">
                    {Number(item.price || 0).toLocaleString()}원
                </p>

                {!!colors.length && (
                    <div className="card-colors">
                        {visibleColors.map((color) => (
                            <span
                                key={color}
                                className="color-chip"
                                title={color}
                                style={{ backgroundColor: colorMap[color] || "#ddd" }}
                            />
                        )
                        )}

                        {extraCount > 0 && (
                            <span className="color-more">+{extraCount}</span>
                        )}
                    </div>
                )}
            </div>
        </li>
    );
}