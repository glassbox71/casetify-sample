import React from "react";

// 필터 버튼을 표시할 메인 카테고리 목록
// 케이스(case), 악세서리(acc), 트래블(travel), 콜라보(colab)
const FILTER_ALLOWED_CATES = ["case", "acc", "travel", "colab"];

export default function CategoryFilterButton({ onClick, mainCate }) {
    // 허용된 카테고리가 아니면 렌더링하지 않음
    if (!FILTER_ALLOWED_CATES.includes(mainCate)) return null;

    return (
        <button
            type="button"
            className="floating-filter-btn"
            onClick={onClick}
        >
            필터
        </button>
    );
}