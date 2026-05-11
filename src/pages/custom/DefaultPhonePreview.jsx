import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { BRANDS, TABLET_BRANDS, LAPTOP_BRANDS, CASE_TYPES, TABLET_CASE_TYPES, LAPTOP_CASE_TYPES, CASE_COLORS } from './constants'
import { PhonePreview, isCaseTypeSupported } from './PhonePreview'
import { TextInputSection } from './TextInputSection'
import { PhotoSection } from './PhotoSection'
import './scss/ProductCustomizePage.scss'

// ✅ 빠른 메뉴 데이터
const QUICK_MENUS = [
    { id: 'phone', label: 'Phone Case', sub: '폰 케이스 커스텀', icon: '📱' },
    { id: 'tablet', label: 'Tablet Case', sub: '태블릿 케이스 커스텀', icon: '⬛' },
    { id: 'laptop', label: 'MacBook Case', sub: '맥북 케이스 커스텀', icon: '💻' },
]

// ✅ 커스텀 컬러 피커 컴포넌트
function ColorPickerButton({ value, onChange, presetColors }) {
    const inputRef = useRef(null)
    const isCustom = value && !presetColors.some(c => c.hex === value)

    // 선택된 커스텀 컬러가 있으면 hex 코드 표시, 없으면 '직접 선택'
    const label = isCustom ? value.toUpperCase() : '직접 선택'

    return (
        <button
            type="button"
            className={`color-picker-btn ${isCustom ? 'active' : ''}`}
            onClick={() => inputRef.current?.click()}
            style={{ position: 'relative' }}
            title="직접 색상 선택"
        >
            <span
                className="color-chip color-chip-custom"
                style={{
                    background: isCustom
                        ? value
                        : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                    border: '1px solid #ddd',
                }}
            />
            {label}
            <input
                ref={inputRef}
                type="color"
                value={isCustom ? value : '#ffffff'}
                onChange={e => onChange(e.target.value)}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                tabIndex={-1}
            />
        </button>
    )
}


// ✅ 내부 컨텐츠 컴포넌트 (key로 완전 리마운트 트리거)
function ProductCustomizeContent({ deviceType }) {
    const navigate = useNavigate()
    const { user, onAddToCart } = useAuthStore()

    const brandList =
        deviceType === 'tablet' ? TABLET_BRANDS :
            deviceType === 'laptop' ? LAPTOP_BRANDS :
                BRANDS

    const caseTypeList =
        deviceType === 'tablet' ? TABLET_CASE_TYPES :
            deviceType === 'laptop' ? LAPTOP_CASE_TYPES :
                CASE_TYPES

    const isNonPhone = deviceType === 'tablet' || deviceType === 'laptop'

    const [selectedBrand, setSelectedBrand] = useState(brandList[0]?.id || null)
    const [selectedModel, setSelectedModel] = useState(null)
    const [selectedCaseColor, setSelectedCaseColor] = useState(null)
    const [selectedCaseType, setSelectedCaseType] = useState(
        isNonPhone ? caseTypeList[0]?.id : null
    )
    const [designType, setDesignType] = useState(null)
    const [photoFile, setPhotoFile] = useState(null)
    const [photoURL, setPhotoURL] = useState(null)
    const [photoFilter, setPhotoFilter] = useState(null)
    const [filterStrength, setFilterStrength] = useState(50)
    const [textValue, setTextValue] = useState('')
    const [fontColor, setFontColor] = useState(null)
    const [photoTab, setPhotoTab] = useState('upload')
    const [selectedSticker, setSelectedSticker] = useState(null)
    const [modelOpen, setModelOpen] = useState(false)
    const [caseTypeOpen, setCaseTypeOpen] = useState(false)
    const [cartMsg, setCartMsg] = useState('')
    const [isCartPopupOpen, setIsCartPopupOpen] = useState(false)
    const [isPopupErr, setIsPopupErr] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    const price = 89000

    const selectedModelLabel = brandList.flatMap(b => b.models).find(m => m.id === selectedModel)?.label
    const models = brandList.find(b => b.id === selectedBrand)?.models || []
    const selectedCaseLabel = caseTypeList.find(c => c.id === selectedCaseType)?.label
    const deviceTypeLabel = {
        phone: 'Phone Custom Case',
        laptop: 'MacBook Custom Case',
        tablet: 'Tablet Custom Case',
    }[deviceType] || ''

    const previewURL = photoTab === 'sticker' ? selectedSticker?.src || null : photoURL

    // ✅ 커스텀 디자인 상태 초기화
    const resetDesign = () => {
        setDesignType(null)
        setPhotoFile(null)
        setPhotoURL(null)
        setPhotoFilter(null)
        setFilterStrength(50)
        setTextValue('')
        setFontColor(null)
        setPhotoTab('upload')
        setSelectedSticker(null)
    }

    // ── 필터 함수 ─────────────────────────────────────────
    const isModelSupportedByCaseType = (modelId) => {
        if (!selectedCaseType) return true
        return isCaseTypeSupported(modelId, selectedCaseType)
    }

    const isCaseTypeSupportedByModel = (caseTypeId) => {
        if (!selectedModel) return true
        return isCaseTypeSupported(selectedModel, caseTypeId)
    }

    // ── Effects ───────────────────────────────────────────
    useEffect(() => {
        if (!selectedCaseType) return
        const ok = (brandList.find(b => b.id === selectedBrand)?.models || [])
            .some(m => isCaseTypeSupported(m.id, selectedCaseType))
        if (!ok) {
            const first = brandList.find(b => b.models.some(m => isCaseTypeSupported(m.id, selectedCaseType)))
            if (first) setSelectedBrand(first.id)
        }
    }, [selectedCaseType])

    // ── canAddCart ────────────────────────────────────────
    const canAddCart =
        selectedModel && selectedCaseColor && selectedCaseType && designType &&
        (designType === 'photo'
            ? (photoTab === 'upload' ? (photoFile && photoFilter) : selectedSticker)
            : (textValue.trim().length > 0 && fontColor))

    // ── 진행도 ────────────────────────────────────────────
    const totalSteps = 5
    const doneSteps = [
        !!selectedModel,
        !!selectedCaseColor,
        !!selectedCaseType,
        !!designType,
        designType === 'photo'
            ? (photoTab === 'upload' ? !!(photoFile && photoFilter) : !!selectedSticker)
            : designType === 'text' ? !!(textValue.trim().length > 0 && fontColor) : false,
    ].filter(Boolean).length
    const percent = Math.round((doneSteps / totalSteps) * 100)
    const isAllDone = doneSteps === totalSteps

    // ── overflow 제어 ─────────────────────────────────────
    useEffect(() => {
        const apply = () => {
            if (window.innerWidth <= 860) { document.body.style.overflow = ''; return }
            document.body.style.overflow = canAddCart ? '' : 'hidden'
        }
        apply()
        window.addEventListener('resize', apply)
        return () => { window.removeEventListener('resize', apply); document.body.style.overflow = '' }
    }, [canAddCart])

    // ── optionSummary ─────────────────────────────────────
    const optionSummary = [
        selectedModelLabel,
        selectedCaseColor ? (CASE_COLORS.find(c => c.hex === selectedCaseColor)?.label || '커스텀 컬러') : null,
        selectedCaseLabel,
        designType === 'photo'
            ? (photoTab === 'sticker' ? '스티커 커스텀' : '포토 커스텀')
            : designType === 'text' ? '텍스트 커스텀' : null,
    ].filter(Boolean).join(' / ')

    // ── handleAddCart ─────────────────────────────────────
    const handleAddCart = async () => {
        if (!user) { navigate('/login'); return }
        const cartImgUrl =
            deviceType === 'tablet' ? '/images/custom/cart/ipad-cart-go.png' :
                deviceType === 'laptop' ? '/images/custom/cart/macbbok-cart-go.png' :
                    '/images/custom/cart/phone-cart-go.png'
        const customContent = designType === 'text'
            ? textValue
            : photoTab === 'sticker' ? selectedSticker?.src : photoURL
        const result = await onAddToCart({
            id: `CUSTOM-${Date.now()}`,
            productName: '커스텀 케이스', price,
            device: selectedModelLabel || '', deviceKey: selectedModel || '',
            color: selectedCaseColor || '', imgUrl: cartImgUrl,
            colorList: [], deviceList: [], isPhone: deviceType === 'phone',
            deviceBrand: selectedBrand || '', caseCategory: selectedCaseType || '',
            quantity: 1, isCustom: true, customMode: designType, customContent,
        })
        if (result) { setCartMsg('장바구니에 담겼습니다!'); setIsPopupErr(false) }
        else { setCartMsg('장바구니 담기에 실패했습니다.'); setIsPopupErr(true) }
        setIsCartPopupOpen(true)
    }

    const previewProps = {
        selectedModel, selectedCaseType,
        deviceType,
        designType, previewURL, photoFilter, filterStrength,
        textValue, fontColor, photoTab, selectedCaseColor,
    }

    // ── 빠른 메뉴 ─────────────────────────────────────────
    const quickMenus = QUICK_MENUS.filter(m => m.id !== deviceType)

    const QuickMenu = () => (
        <div className="custom-quick-menu">
            <p className="quick-menu-label">다른 커스텀 하러가기</p>
            <div className="quick-menu-list">
                {quickMenus.map(menu => (
                    <button
                        key={menu.id}
                        className="quick-menu-item"
                        onClick={() => navigate('/custom/studio', { state: { deviceType: menu.id } })}
                    >
                        <span className="quick-menu-icon">{menu.icon}</span>
                        <span className="quick-menu-text">
                            <strong>{menu.label}</strong>
                            <small>{menu.sub}</small>
                        </span>
                        <span className="quick-menu-arrow">→</span>
                    </button>
                ))}
            </div>
        </div>
    )

    return (
        <section className="custom detail-page">
            <div className="detail-inner">

                {/* 왼쪽: 프리뷰 */}
                <div className="detail-left">
                    <div className="detail-image-wrap">
                        <div className="detail-main-image custom-preview-main" style={{ minHeight: '70vh' }}>
                            <PhonePreview {...previewProps} />
                        </div>

                        {/* 게이지 바 */}
                        <div className="progress-bar-wrap">
                            <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                        </div>
                        <p className={`progress-complete-msg ${isAllDone ? 'visible' : ''}`}>
                            COMPLETE! · 모든 단계를 완료했습니다
                        </p>
                    </div>

                    {isAllDone && (
                        <div className="quick-menu-desktop">
                            <QuickMenu />
                        </div>
                    )}
                </div>

                {/* 오른쪽: 옵션 */}
                <div className="detail-right-custom">
                    <div className="detail-meta">
                        <span className="badge-free-ship">무료 배송</span>
                        <span className="detail-product-id">CUSTOM · {deviceTypeLabel}</span>
                    </div>
                    <h2 className="detail-title">{deviceTypeLabel}</h2>
                    <p className="detail-price">{price.toLocaleString()}원</p>

                    <div className="right-info-wrap">

                        {/* 1. 기종 */}
                        <div className="detail-info-box">
                            <p className="label">기종</p>
                            <div className="model-accordion">
                                <button type="button" className="model-accordion-trigger"
                                    onClick={() => { setModelOpen(v => !v); setCaseTypeOpen(false) }}>
                                    <span>{selectedModelLabel || '기종을 선택하세요'}</span>
                                    <span className={`model-accordion-arrow ${modelOpen ? 'open' : ''}`}>▼</span>
                                </button>
                                {modelOpen && (
                                    <div className="model-accordion-list">
                                        {selectedModel && (
                                            <button type="button" className="reset-btn"
                                                onClick={() => { setSelectedModel(null); setModelOpen(false) }}>
                                                기종 다시 고르기
                                            </button>
                                        )}
                                        <div className="model-brand-tabs">
                                            {brandList
                                                .filter(b => b.models.some(m => isModelSupportedByCaseType(m.id)))
                                                .map(b => (
                                                    <button key={b.id} type="button"
                                                        className={selectedBrand === b.id ? 'active' : ''}
                                                        onClick={() => { setSelectedBrand(b.id); setSelectedModel(null) }}>
                                                        {b.label}
                                                    </button>
                                                ))}
                                        </div>
                                        <ul className="model-sub-list">
                                            {models
                                                .filter(m => isModelSupportedByCaseType(m.id))
                                                .map(m => (
                                                    <li key={m.id}
                                                        className={selectedModel === m.id ? 'active' : ''}
                                                        onClick={() => { setSelectedModel(m.id); setModelOpen(false); resetDesign() }}>
                                                        {m.label}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. 케이스 컬러 ✅ 직접선택 버튼 추가 */}
                        <div className="detail-info-box">
                            <p className="label">케이스 컬러</p>
                            <div className="detail-colors">
                                {CASE_COLORS.map(c => (
                                    <button key={c.id}
                                        className={selectedCaseColor === c.hex ? 'active' : ''}
                                        onClick={() => setSelectedCaseColor(c.hex)}>
                                        <span className="color-chip" style={{
                                            backgroundColor: c.hex,
                                            border: c.id === 'white' ? '1px solid #ddd' : 'none',
                                        }} />
                                        {c.label}
                                    </button>
                                ))}
                                {/* ✅ 직접 선택 버튼 - 선택 후엔 hex 코드로 텍스트 변경 */}
                                <ColorPickerButton
                                    value={selectedCaseColor}
                                    onChange={setSelectedCaseColor}
                                    presetColors={CASE_COLORS}
                                />
                            </div>

                            {/* 3. 케이스 타입 */}
                            <div className="detail-info-box">
                                <p className="label">케이스 타입</p>
                                <div className="model-accordion">
                                    <button className="model-accordion-trigger"
                                        onClick={() => { if (isNonPhone) return; setCaseTypeOpen(v => !v); setModelOpen(false) }}
                                        style={{ cursor: isNonPhone ? 'default' : 'pointer', background: isNonPhone ? '#f7f7f7' : '#fff' }}>
                                        <span>{selectedCaseLabel || '케이스 타입을 선택하세요'}</span>
                                        {!isNonPhone && <span className={`model-accordion-arrow ${caseTypeOpen ? 'open' : ''}`}>▼</span>}
                                    </button>
                                    {!isNonPhone && caseTypeOpen && (
                                        <div className="model-accordion-list">
                                            {selectedCaseType && (
                                                <button type="button" className="reset-btn"
                                                    onClick={() => { setSelectedCaseType(null); setCaseTypeOpen(false) }}>
                                                    케이스타입 다시 고르기
                                                </button>
                                            )}
                                            <ul className="model-sub-list">
                                                {caseTypeList
                                                    .filter(ct => isCaseTypeSupportedByModel(ct.id))
                                                    .map(ct => (
                                                        <li key={ct.id}
                                                            className={selectedCaseType === ct.id ? 'active' : ''}
                                                            onClick={() => { setSelectedCaseType(ct.id); setCaseTypeOpen(false); resetDesign() }}>
                                                            {ct.label}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 4. 커스텀 타입 */}
                            <div className="detail-info-box">
                                <p className="label">커스텀 타입</p>
                                <div className="custom-type-btns">
                                    <button className={`custom-type-btn ${designType === 'photo' ? 'active' : ''}`}
                                        onClick={() => setDesignType('photo')}>포토 커스텀</button>
                                    <button className={`custom-type-btn ${designType === 'text' ? 'active' : ''}`}
                                        onClick={() => setDesignType('text')}>텍스트 커스텀</button>
                                </div>
                            </div>

                            {/* 5-a. 사진 */}
                            {designType === 'photo' && (
                                <PhotoSection
                                    photoTab={photoTab} setPhotoTab={setPhotoTab}
                                    photoURL={photoURL} setPhotoURL={setPhotoURL} setPhotoFile={setPhotoFile}
                                    photoFilter={photoFilter} setPhotoFilter={setPhotoFilter}
                                    filterStrength={filterStrength} setFilterStrength={setFilterStrength}
                                    selectedSticker={selectedSticker} setSelectedSticker={setSelectedSticker}
                                />
                            )}

                            {/* 5-b. 텍스트 ✅ fontColor에 직접선택 추가는 TextInputSection에서 처리 */}
                            {designType === 'text' && (
                                <TextInputSection
                                    textValue={textValue} setTextValue={setTextValue}
                                    fontColor={fontColor} setFontColor={setFontColor}
                                    showEmojiPicker={showEmojiPicker} setShowEmojiPicker={setShowEmojiPicker}
                                    // ✅ 직접선택 피커 컴포넌트 주입
                                    colorPickerSlot={
                                        <FontColorPickerButton
                                            value={fontColor}
                                            onChange={setFontColor}
                                            label="직접 선택"
                                        />
                                    }
                                />
                            )}
                        </div>

                        {/* 주문 요약 + 장바구니 */}
                        <div className="right-btn-wrap">
                            {canAddCart ? (
                                <>
                                    <div className="order-result">
                                        <hr className="left-line" />
                                        <div className="order-result-row">
                                            <span className="order-option-name">
                                                커스텀 케이스
                                                {optionSummary && <em className="order-option-detail"> / {optionSummary}</em>}
                                            </span>
                                            <div className="order-quantity">
                                                <button type="button">−</button>
                                                <span>1</span>
                                                <button type="button">+</button>
                                            </div>
                                            <span className="order-row-price">{price.toLocaleString()}원</span>
                                        </div>
                                        <div className="order-total">
                                            <span>총 상품금액 (수량 1개)</span>
                                            <strong>{price.toLocaleString()}원</strong>
                                        </div>
                                    </div>
                                    <button className="buy-btn" onClick={handleAddCart}>
                                        <span className="icon">
                                            <img src="/images/icon/btn_shopping-cart.svg" alt="" />
                                        </span>
                                        장바구니에 담기
                                    </button>
                                </>
                            ) : (
                                <button className="buy-btn buy-btn-disabled" onClick={() => {
                                    setCartMsg('모든 옵션을 선택해주세요.')
                                    setIsPopupErr(true)
                                    setIsCartPopupOpen(true)
                                }}>
                                    <span className="icon">
                                        <img src="/images/icon/btn_shopping-cart.svg" alt="" />
                                    </span>
                                    장바구니에 담기
                                </button>
                            )}
                        </div>

                        {isAllDone && (
                            <div className="quick-menu-mobile">
                                <QuickMenu />
                            </div>
                        )}
                    </div>

                    {/* 팝업 */}
                    {isCartPopupOpen && (
                        <div className="popup-overlay">
                            <div className="popup-wrap">
                                <div className="popup">
                                    <p>{cartMsg}</p>
                                    {isPopupErr ? (
                                        <div className="popup-buttons">
                                            <button className="btn-close" onClick={() => setIsCartPopupOpen(false)}>닫기</button>
                                        </div>
                                    ) : (
                                        <div className="popup-buttons">
                                            <button className="btn-continue" onClick={() => setIsCartPopupOpen(false)}>계속 쇼핑하기</button>
                                            <button className="btn-go-wish" onClick={() => navigate('/cart')}>장바구니 보기</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
        </section>
    )
}

// ✅ 외부 래퍼: deviceType이 바뀌면 key가 바뀌어 내부 컴포넌트 완전 리마운트 → 모든 state 자동 초기화
export function ProductCustomizePage() {
    const location = useLocation()
    const deviceType = location.state?.deviceType || 'phone'

    return <ProductCustomizeContent key={deviceType} deviceType={deviceType} />
}

export default ProductCustomizePage