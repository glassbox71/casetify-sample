import React, { useState, useMemo, useEffect } from 'react'
import { useAuthStore } from '../../store/useAuthStore';
import { getModelsByProductGroupCartItem } from "../../utils/groupProducts";
import { useCategoryProductStore } from '../../store/useCategoryProductStore';
import { div } from 'framer-motion/client';

export default function CartOption({item, colorMap, phoneModelOptions, onClose}) {
    const [selectedColor, setSelectedColor] = useState(item.color);
    const [selectedModel, setSelectedModel] = useState(item.device);
    const [modelAccordionOpen, setModelAccordionOpen] = useState(false);
    const [selectedBrandTab, setSelectedBrandTab] = useState(item.deviceBrand);
    const { onUpdateOption } = useAuthStore();
    const {items} = useCategoryProductStore();

    // 같은 상품명+케이스카테고리 그룹에서 기종 목록 추출
    const modelOptions = useMemo(() => {
        return getModelsByProductGroupCartItem(items, item);
    }, [item, items]);

    useEffect(() => {
        // 팝업이 mount될 때 스크롤 막기
        document.body.style.overflow = "hidden";
        
        // 팝업이 unmount될 때(닫힐 때) 스크롤 복구
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleOptionChange = ()=>{
        const selectedModelData = phoneModelOptions[selectedBrandTab]?.find(m => m.label === selectedModel);
    
        // 스토어의 메서드 호출
        onUpdateOption(
            item,           // 기존 아이템 정보
            selectedModel,  // 새로 선택한 기종 이름
            selectedColor,  // 새로 선택한 컬러
            selectedModelData?.key || item.deviceKey // 새로 선택한 기종 키
        );

        onClose();
    }
  return (
    <div className="option-overlay">
        <div className="option-modal">
            <div className="option-box">
                <div className='option-box-title'>
                    <h3>옵션</h3>
                    <span onClick={onClose} className='close-btn'><img src="/images/icon/close.svg" alt="닫기" /></span>
                </div>
                <div className="model-select-box">
                    {!!selectedModel && (
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

                                        <ul className="model-sub-list">
                                            {item.isPhone ? (
                                                <>
                                                <div className="model-brand-tabs">
                                                    {Object.keys(phoneModelOptions).map((brand) => {
                                                        // 해당 브랜드의 기종들 중 현재 상품 그룹(modelOptions)에 존재하는 기종이 하나라도 있는지 확인
                                                        const hasModelsInGroup = phoneModelOptions[brand].some((m) =>
                                                            modelOptions.some((mo) => mo.key === m.key)
                                                        );

                                                        if (!hasModelsInGroup) return null;
                                                        <button
                                                            key={brand}
                                                            type="button"
                                                            className={selectedBrandTab === brand ? "active" : ""}
                                                            onClick={() => setSelectedBrandTab(brand)}
                                                        >
                                                            {brand}
                                                        </button>
                                                    })}
                                                </div>
                                                {phoneModelOptions[selectedBrandTab]?.filter((m) => modelOptions.some((mo) => mo.key === m.key)).map((model) => (
                                                    <li
                                                        key={model.key}
                                                        className={selectedModel === model.label ? "active" : ""}
                                                        onClick={() => {
                                                            setSelectedModel(model.label);
                                                            setModelAccordionOpen(false);
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
                                                </>
                                            ):(
                                                <>
                                                {item.deviceList.map((model) => (
                                                    <li
                                                        key={model}
                                                        className={selectedModel === model ? "active" : ""}
                                                        onClick={() => {
                                                            setSelectedModel(model);
                                                            setModelAccordionOpen(false);
                                                        }}
                                                    >
                                                        {model}
                                                    </li>
                                                ))}
                                                </>
                                            )}
                                            
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {!!item.colorList?.length && (
                <div className="detail-info-box">
                    <p className="label">케이스 컬러</p>
                    <div className="detail-colors">
                        {item.colorList.map((color) => (
                            <button
                            key={color}
                            type="button"
                            className={selectedColor === color ? "active" : ""}
                            onClick={() => {
                                setSelectedColor(color);
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
                <button type='button' className='input-btn' onClick={() => handleOptionChange()}>옵션 변경</button>
            </div>
        </div>
    </div>
  )
}
