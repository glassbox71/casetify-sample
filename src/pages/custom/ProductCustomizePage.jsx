import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { BRANDS, TABLET_BRANDS, LAPTOP_BRANDS, CASE_TYPES, TABLET_CASE_TYPES, LAPTOP_CASE_TYPES, CASE_COLORS } from './constants'
import { PhonePreview, isCaseTypeSupported } from './PhonePreview'
import { TextInputSection } from './TextInputSection'
import { PhotoSection } from './PhotoSection'
import ShippingInfo from '../../components/sub/product detail page/ShippingInfo'
import './scss/ProductCustomizePage.scss'

const QUICK_MENUS = [
    { id: 'phone', label: 'Phone Case', sub: '폰 케이스 커스텀', icon: '📱' },
    { id: 'tablet', label: 'Tablet Case', sub: '태블릿 케이스 커스텀', icon: '⬛' },
    { id: 'laptop', label: 'MacBook Case', sub: '맥북 케이스 커스텀', icon: '💻' },
]

const COLOR_NAME_TABLE = [
    { name: '블랙', hex: '#000000' },
    { name: '화이트', hex: '#ffffff' },
    { name: '레드', hex: '#ff0000' },
    { name: '오렌지', hex: '#ff8000' },
    { name: '옐로우', hex: '#ffff00' },
    { name: '라임', hex: '#80ff00' },
    { name: '그린', hex: '#00ff00' },
    { name: '민트', hex: '#00ff80' },
    { name: '시안', hex: '#00ffff' },
    { name: '스카이블루', hex: '#0080ff' },
    { name: '블루', hex: '#0000ff' },
    { name: '바이올렛', hex: '#8000ff' },
    { name: '퍼플', hex: '#ff00ff' },
    { name: '마젠타', hex: '#ff0080' },
    { name: '핑크', hex: '#ffb6c1' },
    { name: '살몬', hex: '#fa8072' },
    { name: '코랄', hex: '#ff6b6b' },
    { name: '브라운', hex: '#8b4513' },
    { name: '베이지', hex: '#f5f5dc' },
    { name: '아이보리', hex: '#fffff0' },
    { name: '골드', hex: '#ffd700' },
    { name: '실버', hex: '#c0c0c0' },
    { name: '그레이', hex: '#808080' },
    { name: '다크그레이', hex: '#404040' },
    { name: '네이비', hex: '#001f5b' },
    { name: '틸', hex: '#008080' },
    { name: '올리브', hex: '#808000' },
    { name: '인디고', hex: '#4b0082' },
    { name: '마룬', hex: '#800000' },
    { name: '라벤더', hex: '#e6e6fa' },
]

const hexToRgb = (hex) => {
    const h = hex.replace('#', '')
    return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) }
}
const colorDistance = (hex1, hex2) => {
    const a = hexToRgb(hex1), b = hexToRgb(hex2)
    return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2)
}
const getColorLabel = (hex) => {
    if (!hex) return null
    const preset = CASE_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase())
    if (preset) return preset.label
    let minDist = Infinity, matched = COLOR_NAME_TABLE[0].name
    for (const color of COLOR_NAME_TABLE) {
        const dist = colorDistance(hex, color.hex)
        if (dist < minDist) { minDist = dist; matched = color.name }
    }
    return matched
}

function ColorPickerButton({ value, onChange, presetColors }) {
    const inputRef = useRef(null)
    const isCustom = value && !presetColors.some(c => c.hex.toLowerCase() === value.toLowerCase())
    const label = isCustom ? value.toUpperCase() : '직접 선택'
    return (
        <button type="button" className={`color-picker-btn ${isCustom ? 'active' : ''}`}
            onClick={() => inputRef.current?.click()} style={{ position: 'relative' }} title="직접 색상 선택">
            <span className="color-chip color-chip-custom" style={{
                background: isCustom ? value : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                border: '1px solid #ddd',
            }} />
            {label}
            <input ref={inputRef} type="color" value={isCustom ? value.toLowerCase() : '#ffffff'}
                onChange={e => onChange(e.target.value)}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }} tabIndex={-1} />
        </button>
    )
}

function ProductCustomizeContent({ deviceType }) {
    const navigate = useNavigate()
    const { user, onAddToCart } = useAuthStore()

    const brandList = deviceType === 'tablet' ? TABLET_BRANDS : deviceType === 'laptop' ? LAPTOP_BRANDS : BRANDS
    const caseTypeList = deviceType === 'tablet' ? TABLET_CASE_TYPES : deviceType === 'laptop' ? LAPTOP_CASE_TYPES : CASE_TYPES
    const isNonPhone = deviceType === 'tablet' || deviceType === 'laptop'

    const [selectedBrand, setSelectedBrand] = useState(brandList[0]?.id || null)
    const [selectedModel, setSelectedModel] = useState(null)
    const [selectedCaseColor, setSelectedCaseColor] = useState(null)
    const [selectedCaseType, setSelectedCaseType] = useState(isNonPhone ? caseTypeList[0]?.id : null)
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
    const [showScrollAlert, setShowScrollAlert] = useState(false)
    const [imageTransform, setImageTransform] = useState({ x: 0, y: 0, scale: 1 })
    const [cropMode, setCropMode] = useState(false)
    const dragRef = useRef(null)

    const onCanvasMouseDown = useCallback((e) => {
        if (!cropMode) return
        e.preventDefault()
        const startX = e.clientX - (imageTransform?.x || 0)
        const startY = e.clientY - (imageTransform?.y || 0)
        dragRef.current = { startX, startY }
        const onMove = (ev) => {
            const drag = dragRef.current
            if (!drag) return
            setImageTransform(prev => ({ ...prev, x: ev.clientX - drag.startX, y: ev.clientY - drag.startY }))
        }
        const onUp = () => { dragRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }, [cropMode, imageTransform])

    const onCanvasTouchStart = useCallback((e) => {
        if (!cropMode) return
        const touch = e.touches[0]
        const startX = touch.clientX - (imageTransform?.x || 0)
        const startY = touch.clientY - (imageTransform?.y || 0)
        dragRef.current = { startX, startY }
        const onMove = (ev) => {
            const drag = dragRef.current
            if (!drag) return
            const t = ev.touches[0]
            setImageTransform(prev => ({ ...prev, x: t.clientX - drag.startX, y: t.clientY - drag.startY }))
        }
        const onEnd = () => { dragRef.current = null; window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd) }
        window.addEventListener('touchmove', onMove, { passive: false })
        window.addEventListener('touchend', onEnd)
    }, [cropMode, imageTransform])

    const step1Ref = useRef(null)
    const step2Ref = useRef(null)
    const step3Ref = useRef(null)
    const step4Ref = useRef(null)
    const step5Ref = useRef(null)
    const rightPanelRef = useRef(null)
    const filterSectionRef = useRef(null)
    const isMounted = useRef(false)

    useEffect(() => { isMounted.current = true }, [])

    // ✅ 진입 시 스크롤이 top이 아니면 안내 팝업
    useEffect(() => {
        const timer = setTimeout(() => {
            if (window.scrollY > 80) {
                setShowScrollAlert(true)
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [])

    const scrollToStep = (ref, extra = 80) => {
        const el = ref?.current, panel = rightPanelRef.current
        if (!el || !panel) return
        const offset = el.getBoundingClientRect().bottom - panel.getBoundingClientRect().bottom + panel.scrollTop + extra
        panel.scrollTo({ top: offset, behavior: 'smooth' })
    }
    const scrollToFilter = () => {
        const el = filterSectionRef.current, panel = rightPanelRef.current
        if (!el || !panel) return
        const offset = el.getBoundingClientRect().bottom - panel.getBoundingClientRect().bottom + panel.scrollTop + 120
        panel.scrollTo({ top: offset, behavior: 'smooth' })
    }

    const price = 89000
    const selectedModelLabel = brandList.flatMap(b => b.models).find(m => m.id === selectedModel)?.label
    const models = brandList.find(b => b.id === selectedBrand)?.models || []
    const selectedCaseLabel = caseTypeList.find(c => c.id === selectedCaseType)?.label
    const deviceTypeLabel = { phone: 'Phone Custom Case', laptop: 'MacBook Custom Case', tablet: 'Tablet Custom Case' }[deviceType] || ''
    const previewURL = photoTab === 'sticker' ? selectedSticker?.src || null : photoURL

    const resetDesign = () => {
        setDesignType(null); setPhotoFile(null); setPhotoURL(null); setPhotoFilter(null)
        setFilterStrength(50); setTextValue(''); setFontColor(null); setPhotoTab('upload'); setSelectedSticker(null)
    }

    const isModelSupportedByCaseType = (modelId) => !selectedCaseType || isCaseTypeSupported(modelId, selectedCaseType)
    const isCaseTypeSupportedByModel = (caseTypeId) => !selectedModel || isCaseTypeSupported(selectedModel, caseTypeId)

    useEffect(() => {
        if (!selectedCaseType) return
        const ok = (brandList.find(b => b.id === selectedBrand)?.models || []).some(m => isCaseTypeSupported(m.id, selectedCaseType))
        if (!ok) {
            const first = brandList.find(b => b.models.some(m => isCaseTypeSupported(m.id, selectedCaseType)))
            if (first) setSelectedBrand(first.id)
        }
    }, [selectedCaseType])

    // ── 자동 스크롤 ──
    // phone:    ① 기종 → ② 케이스컬러 → ③ 케이스타입 → ④ 커스텀타입 → ⑤ 사진/텍스트
    // nonPhone: ① 기종 → ② 케이스타입(자동) → ③ 케이스컬러 → ④ 커스텀타입 → ⑤ 사진/텍스트
    useEffect(() => {
        if (!isMounted.current) return
        if (selectedModel) setTimeout(() => scrollToStep(isNonPhone ? step3Ref : step2Ref), 150)
    }, [selectedModel])

    useEffect(() => {
        if (!isMounted.current) return
        if (selectedCaseColor) setTimeout(() => scrollToStep(step4Ref), 150)
    }, [selectedCaseColor])

    useEffect(() => {
        if (!isMounted.current) return
        if (selectedCaseType && selectedCaseColor && !isNonPhone) setTimeout(() => scrollToStep(step4Ref), 150)
    }, [selectedCaseType])

    useEffect(() => {
        if (!isMounted.current) return
        if (designType) setTimeout(() => scrollToStep(step5Ref), 150)
    }, [designType])

    const canAddCart = selectedModel && selectedCaseColor && selectedCaseType && designType &&
        (designType === 'photo' ? (photoTab === 'upload' ? (photoFile && photoFilter) : selectedSticker) : (textValue.trim().length > 0 && fontColor))

    const totalSteps = 5
    const doneSteps = [
        !!selectedModel, !!selectedCaseColor, !!selectedCaseType, !!designType,
        designType === 'photo' ? (photoTab === 'upload' ? !!(photoFile && photoFilter) : !!selectedSticker)
            : designType === 'text' ? !!(textValue.trim().length > 0 && fontColor) : false,
    ].filter(Boolean).length
    const percent = Math.round((doneSteps / totalSteps) * 100)
    const isAllDone = doneSteps === totalSteps

    useEffect(() => {
        let wasMobile = window.innerWidth <= 860
        const apply = () => {
            const isMobile = window.innerWidth <= 860
            if (wasMobile && !isMobile) window.scrollTo({ top: 0, behavior: 'smooth' })
            wasMobile = isMobile
            if (isMobile) { document.body.style.overflow = ''; return }
            document.body.style.overflow = canAddCart ? '' : 'hidden'
        }
        apply()
        window.addEventListener('resize', apply)
        return () => { window.removeEventListener('resize', apply); document.body.style.overflow = '' }
    }, [canAddCart])

    // ✅ 다시선택으로 완료 해제 시 top으로
    const prevIsAllDone = useRef(false)
    useEffect(() => {
        if (prevIsAllDone.current === true && !isAllDone) {
            const isMobile = window.innerWidth <= 860
            setTimeout(() => {
                if (isMobile) {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                } else {
                    rightPanelRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
                }
            }, 80)
        }
        prevIsAllDone.current = isAllDone
    }, [isAllDone])

    const optionSummary = [
        selectedModelLabel,
        selectedCaseColor ? getColorLabel(selectedCaseColor) : null,
        selectedCaseLabel,
        designType === 'photo' ? (photoTab === 'sticker' ? '스티커 커스텀' : '포토 커스텀') : designType === 'text' ? '텍스트 커스텀' : null,
    ].filter(Boolean).join(' / ')

    const handleAddCart = async () => {
        if (!user) { navigate('/login'); return }
        const cartImgUrl = deviceType === 'tablet' ? '/images/custom/cart/ipad-cart-go.png' : deviceType === 'laptop' ? '/images/custom/cart/macbbok-cart-go.png' : '/images/custom/cart/phone-cart-go.png'
        const productName = deviceType === 'tablet' ? '태블릿 커스텀 케이스' : deviceType === 'laptop' ? '맥북 커스텀 케이스' : '폰 커스텀 케이스'
        const customContent = designType === 'text' ? textValue : photoTab === 'sticker' ? selectedSticker?.src : photoURL
        const result = await onAddToCart({
            id: `CUSTOM-${Date.now()}`, productName, title: productName, price,
            device: selectedModelLabel || '', deviceKey: selectedModel || '',
            color: getColorLabel(selectedCaseColor) || '', imgUrl: cartImgUrl,
            colorList: [], deviceList: [], isPhone: deviceType === 'phone',
            deviceBrand: selectedBrand || '', caseCategory: 'custom' || '',
            quantity: 1, isCustom: true, customMode: designType, customContent, isWish: true
        })
        if (result) { setCartMsg('장바구니에 담겼습니다!'); setIsPopupErr(false) }
        else { setCartMsg('장바구니 담기에 실패했습니다.'); setIsPopupErr(true) }
        setIsCartPopupOpen(true)
    }

    const previewProps = { selectedModel, selectedCaseType, deviceType, designType, previewURL, photoFilter, filterStrength, textValue, fontColor, photoTab, selectedCaseColor, imageTransform, cropMode, onCanvasMouseDown, onCanvasTouchStart }
    const quickMenus = QUICK_MENUS.filter(m => m.id !== deviceType)

    const QuickMenu = () => (
        <div className="custom-quick-menu">
            <p className="quick-menu-label">다른 커스텀 하러가기</p>
            <div className="quick-menu-list">
                {quickMenus.map(menu => (
                    <button key={menu.id} className="quick-menu-item"
                        onClick={() => navigate('/custom/studio', { state: { deviceType: menu.id } })}>
                        <span className="quick-menu-icon">{menu.icon}</span>
                        <span className="quick-menu-text"><strong>{menu.label}</strong><small>{menu.sub}</small></span>
                        <span className="quick-menu-arrow">→</span>
                    </button>
                ))}
            </div>
        </div>
    )

    // ── stepClass ─────────────────────────────────────────────────────
    // phone:    ① locked=false/done=model  ② locked=!model/done=color  ③ locked=!color/done=type  ④ locked=!type/done=design  ⑤ locked=!design
    // nonPhone: ① locked=false/done=model  ② locked=!model/done=model(자동)  ③ locked=!model/done=color  ④ locked=!color/done=design  ⑤ locked=!design
    const stepClass = (locked, done) => locked ? 'step-locked' : done ? 'step-done' : 'step-active'

    return (
        <section className="custom detail-page-custom">

            {/* ✅ 스크롤 위치 안내 팝업 */}
            {showScrollAlert && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: '36px 32px',
                        textAlign: 'center', maxWidth: 320, width: 'calc(100% - 48px)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                        animation: 'slideUp 0.3s ease',
                    }}>
                        {/* 스와이퍼 아이콘 */}
                        <div style={{ fontSize: 40, marginBottom: 12 }}>↕</div>
                        <p style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 8 }}>
                            페이지 상단으로 이동해주세요
                        </p>
                        <p style={{ fontSize: 13, color: '#888', marginBottom: 24, lineHeight: 1.6 }}>
                            커스텀 스튜디오는 상단에서<br />시작해야 합니다.
                        </p>
                        <button
                            onClick={() => {
                                setShowScrollAlert(false)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            style={{
                                width: '100%', padding: '14px 0',
                                background: '#111', color: '#fff',
                                border: 'none', borderRadius: 8,
                                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                            }}
                        >
                            맨 위로 이동
                        </button>
                        <button
                            onClick={() => setShowScrollAlert(false)}
                            style={{
                                width: '100%', padding: '10px 0', marginTop: 8,
                                background: 'none', color: '#aaa',
                                border: 'none', fontSize: 13, cursor: 'pointer',
                            }}
                        >
                            그냥 계속하기
                        </button>
                    </div>
                </div>
            )}
            <div className="inner">
                <div className="detail-inner-custom">

                    {/* 왼쪽: 프리뷰 */}
                    <div className="detail-left-custom">
                        <div className="detail-image-wrap">
                            <div className="detail-main-image custom-preview-main" style={{ minHeight: '70vh' }}>
                                <PhonePreview {...previewProps} />
                            </div>
                            <div className="progress-bar-wrap">
                                <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                            </div>
                            <p className={`progress-complete-msg ${isAllDone ? 'visible' : ''}`}>
                                COMPLETE! · 모든 단계를 완료했습니다
                            </p>
                        </div>
                        {isAllDone && <div className="quick-menu-desktop"><QuickMenu /></div>}
                    </div>

                    {/* 오른쪽: 옵션 패널 */}
                    <div className="detail-right-custom" ref={rightPanelRef}>
                        <div className="detail-meta">
                            <span className="badge-free-ship">무료 배송</span>
                            <span className="detail-product-id">CUSTOM · {deviceTypeLabel}</span>
                        </div>
                        <h2 className="detail-title">{deviceTypeLabel}</h2>
                        <p className="detail-price">{price.toLocaleString()}원</p>

                        <div className="right-info-wrap">

                            {/* ① 기종 — 공통 */}
                            <div ref={step1Ref} className={`detail-info-box step-block ${stepClass(false, !!selectedModel)}`}>
                                <div className="step-label-row">
                                    <p className="label">① 기종</p>
                                    {selectedModel && (
                                        <button type="button" className="step-back-btn" onClick={() => {
                                            setSelectedModel(null); setModelOpen(true); resetDesign()
                                            setSelectedCaseColor(null)
                                            setSelectedCaseType(isNonPhone ? caseTypeList[0]?.id : null)
                                        }}>← 다시 선택</button>
                                    )}
                                </div>
                                <div className="model-accordion">
                                    <button type="button" className="model-accordion-trigger"
                                        disabled={!!selectedModel}
                                        style={{ cursor: selectedModel ? 'default' : 'pointer' }}
                                        onClick={() => { setModelOpen(v => !v); setCaseTypeOpen(false) }}>
                                        <span>{selectedModelLabel || '기종을 선택하세요'}</span>
                                        {!selectedModel && <span className={`model-accordion-arrow ${modelOpen ? 'open' : ''}`}>▼</span>}
                                    </button>
                                    {modelOpen && (
                                        <div className="model-accordion-list">
                                            <div className="model-brand-tabs">
                                                {brandList.filter(b => b.models.some(m => isModelSupportedByCaseType(m.id))).map(b => (
                                                    <button key={b.id} type="button"
                                                        className={selectedBrand === b.id ? 'active' : ''}
                                                        onClick={() => { setSelectedBrand(b.id); setSelectedModel(null) }}>
                                                        {b.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <ul className="model-sub-list">
                                                {models.filter(m => isModelSupportedByCaseType(m.id)).map(m => (
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

                            {/* ② 케이스 타입 — nonPhone만 (자동고정, 기종 후 활성) */}
                            {isNonPhone && (
                                <div ref={step2Ref} className={`detail-info-box step-block ${stepClass(!selectedModel, !!selectedModel)}`}>
                                    <div className="step-label-row">
                                        <p className="label">② 케이스 타입</p>
                                    </div>
                                    <div className="model-accordion">
                                        <button className="model-accordion-trigger" style={{ cursor: 'default', background: '#f7f7f7' }}>
                                            <span>{selectedCaseLabel || '케이스 타입'}</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ② 케이스 컬러 (phone) / ③ 케이스 컬러 (nonPhone) */}
                            <div
                                ref={isNonPhone ? step3Ref : step2Ref}
                                className={`detail-info-box step-block ${stepClass(!selectedModel, !!selectedCaseColor)}`}
                            >
                                <div className="step-label-row">
                                    <p className="label">{isNonPhone ? '③' : '②'} 케이스 컬러</p>
                                    {selectedCaseColor && (
                                        <button type="button" className="step-back-btn" onClick={() => {
                                            setSelectedCaseColor(null)
                                        }}>← 다시 선택</button>
                                    )}
                                </div>
                                <div className="detail-colors">
                                    {CASE_COLORS.map(c => (
                                        <button key={c.id}
                                            disabled={!selectedModel}
                                            className={selectedCaseColor?.toLowerCase() === c.hex.toLowerCase() ? 'active' : ''}
                                            onClick={() => setSelectedCaseColor(c.hex)}>
                                            <span className="color-chip" style={{
                                                backgroundColor: c.hex,
                                                border: c.id === 'white' ? '1px solid #ddd' : 'none',
                                            }} />
                                            {c.label}
                                        </button>
                                    ))}
                                    {selectedModel && (
                                        <ColorPickerButton value={selectedCaseColor} onChange={setSelectedCaseColor} presetColors={CASE_COLORS} />
                                    )}
                                </div>
                            </div>

                            {/* ③ 케이스 타입 (phone only) */}
                            {!isNonPhone && (
                                <div ref={step3Ref} className={`detail-info-box step-block ${stepClass(!selectedCaseColor, !!selectedCaseType)}`}>
                                    <div className="step-label-row">
                                        <p className="label">③ 케이스 타입</p>
                                        {selectedCaseType && (
                                            <button type="button" className="step-back-btn" onClick={() => {
                                                setSelectedCaseType(null); resetDesign()
                                            }}>← 다시 선택</button>
                                        )}
                                    </div>
                                    <div className="model-accordion">
                                        <button className="model-accordion-trigger"
                                            onClick={() => {
                                                if (!selectedCaseColor) return
                                                setCaseTypeOpen(v => !v); setModelOpen(false)
                                            }}
                                            style={{ cursor: !selectedCaseColor ? 'default' : 'pointer' }}>
                                            <span>{selectedCaseLabel || '케이스 타입을 선택하세요'}</span>
                                            <span className={`model-accordion-arrow ${caseTypeOpen ? 'open' : ''}`}>▼</span>
                                        </button>
                                        {caseTypeOpen && (
                                            <div className="model-accordion-list">
                                                <ul className="model-sub-list">
                                                    {caseTypeList.filter(ct => isCaseTypeSupportedByModel(ct.id)).map(ct => (
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
                            )}

                            {/* ④ 커스텀 타입 */}
                            <div
                                ref={step4Ref}
                                className={`detail-info-box step-block ${stepClass(
                                    isNonPhone ? !selectedCaseColor : !selectedCaseType,
                                    !!designType
                                )}`}
                            >
                                <div className="step-label-row">
                                    <p className="label">④ 커스텀 타입</p>
                                    {designType && (
                                        <button type="button" className="step-back-btn" onClick={() => {
                                            resetDesign()
                                        }}>← 다시 선택</button>
                                    )}
                                </div>
                                <div className="custom-type-btns">
                                    <button
                                        disabled={isNonPhone ? !selectedCaseColor : !selectedCaseType}
                                        className={`custom-type-btn ${designType === 'photo' ? 'active' : ''}`}
                                        onClick={() => setDesignType('photo')}>
                                        포토 커스텀
                                    </button>
                                    <button
                                        disabled={isNonPhone ? !selectedCaseColor : !selectedCaseType}
                                        className={`custom-type-btn ${designType === 'text' ? 'active' : ''}`}
                                        onClick={() => setDesignType('text')}>
                                        텍스트 커스텀
                                    </button>
                                </div>
                            </div>

                            {/* ⑤ 사진 / 텍스트 */}
                            <div ref={step5Ref} className={`detail-info-box step-block ${stepClass(!designType, false)}`}>
                                {designType === 'photo' && (
                                    <PhotoSection
                                        photoTab={photoTab} setPhotoTab={setPhotoTab}
                                        photoURL={photoURL} setPhotoURL={setPhotoURL} setPhotoFile={setPhotoFile}
                                        photoFilter={photoFilter} setPhotoFilter={setPhotoFilter}
                                        filterStrength={filterStrength} setFilterStrength={setFilterStrength}
                                        selectedSticker={selectedSticker} setSelectedSticker={setSelectedSticker}
                                        filterSectionRef={filterSectionRef} onScrollToFilter={scrollToFilter}
                                        imageTransform={imageTransform} setImageTransform={setImageTransform}
                                        cropMode={cropMode} setCropMode={setCropMode} />
                                )}
                                {designType === 'text' && (
                                    <TextInputSection
                                        textValue={textValue} setTextValue={setTextValue}
                                        fontColor={fontColor} setFontColor={setFontColor}
                                        showEmojiPicker={showEmojiPicker} setShowEmojiPicker={setShowEmojiPicker}
                                    />
                                )}
                            </div>

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
                                        <span className="icon"><img src="/images/icon/btn_shopping-cart.svg" alt="" /></span>
                                        장바구니에 담기
                                    </button>
                                </>
                            ) : (
                                <button className="buy-btn buy-btn-disabled" onClick={() => {
                                    setCartMsg('모든 옵션을 선택해주세요.'); setIsPopupErr(true); setIsCartPopupOpen(true)
                                }}>
                                    <span className="icon"><img src="/images/icon/btn_shopping-cart.svg" alt="" /></span>
                                    장바구니에 담기
                                </button>
                            )}
                        </div>

                        {isAllDone && <div className="quick-menu-mobile"><QuickMenu /></div>}
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

                <div className='shipping-margin' style={{ marginTop: '60px' }}>
                    <ShippingInfo />
                </div>
            </div>

        </section>
    )
}

export function ProductCustomizePage() {
    const location = useLocation()
    const deviceType = location.state?.deviceType || 'phone'
    return <ProductCustomizeContent key={deviceType} deviceType={deviceType} />
}

export default ProductCustomizePage