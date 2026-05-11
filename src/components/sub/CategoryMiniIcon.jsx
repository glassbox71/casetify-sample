import React, { useState } from "react";

export default function CategoryMiniIcon({
    miniKey,
    label,
    isActive,
    onClick,
}) {
    const [isError, setIsError] = useState(false);

    const iconName = miniKey || "etc";
    const imagePath = `/images/category/mini/${iconName}.png`;

    // 이미지 없는 케이스(caseCategory 등): 텍스트만 노출
    const showImageOnly = !isError;

    return (
        <li
            className={`mini-icon-item ${isActive ? "active" : ""} ${isError ? "text-only" : ""}`}
            onClick={onClick}
        >
            {showImageOnly && (
                <div className="mini-icon-img">
                    <img
                        src={imagePath}
                        alt={label}
                        onError={() => setIsError(true)}
                    />
                </div>
            )}
            <p className="mini-icon-text">{label}</p>
        </li>
    );
}