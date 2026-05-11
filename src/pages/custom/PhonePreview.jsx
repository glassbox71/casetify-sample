import React from 'react'

const PHONE_BASE_MAP = {
    'impact': '/images/custom/model/impact',
    'magsafe-bounce': '/images/custom/model/bounce',
    'magsafe-compact': '/images/custom/model/ring',
}
const IPAD_BASE = '/images/custom/model/ipad'
const LAPTOP_BASE = '/images/custom/model/macbook'

const MODEL_FILE_MAP = {
    'iphone17promax': null, 'iphone17pro': 'iphone17pro', 'iphone17': 'IPHONE17',
    'iphone16promax': null, 'iphone16pro': 'iphone16pro', 'iphone16': 'IPHONE16',
    'iphone15pro': 'iphone15pro', 'iphone15': 'IPHONE15',
    'iphone14plus': null, 'iphone13promax': null, 'iphoneMini': null,
    's25ultra': null, 's25plus': 'GALAXYS25PLUS', 's25': 'galxeys25',
    's26plus': 'galxeys26plus', 's26': 'galxeys26', 's24': null,
    'z6fold': 'galxeysZfold6', 'z6flip': 'ZFLIP6', 'z7fold': 'galxeysZfold7', 'z7flip': 'ZFLIP7',
    'pixel9pro': 'GOOGLEPRO9', 'pixel9': 'GOOGLE9', 'pixel8pro': null,
    'pixel10pro': 'pixel10pro', 'pixel10': 'pixel10',
}

const CAMERA_FILE_OVERRIDE = {
    'GALAXYS25PLUS': 'GALAXYS25PLUS-CAMERA', 'GOOGLE9': 'GOOGLE9-CAMERA',
    'GOOGLEPRO9': 'GOOGLEPRO9-CAMERA', 'IPHONE15': 'IPHONE15-CAMERA',
    'IPHONE16': 'IPHONE16-CAMERA', 'IPHONE17': 'IPHONE17-CAMERA',
}

export const BOUNCE_FILE_MAP = {
    'iphone17promax': '17pro-bouce', 'iphone17pro': '17pro-bouce', 'iphone17': 'iphone17-bouce',
    'iphone16promax': '16pro-bouce', 'iphone16': 'iphone16-bouce', 'iphone15': 'iphone15-bouce',
    'iphone15promax': '15pro-bouce', 'iphone14plus': null, 'iphone13promax': null, 'iphoneMini': null,
    's25ultra': null, 's25plus': null, 's25': null, 's24': null,
    'z6fold': null, 'z6flip': null, 'pixel9pro': null, 'pixel9': null, 'pixel8pro': null,
}

export const RING_FILE_MAP = {
    'iphone17promax': '17pro-ring', 'iphone17pro': '17pro-ring', 'iphone17': 'iphone17-ring',
    'iphone16promax': '16pro-ring', 'iphone16': 'iphone16-ring', 'iphone15promax': '15pro-ring',
    'iphone15': 'iphone15-ring', 'iphone14plus': null, 'iphone13promax': null, 'iphoneMini': null,
    's25ultra': null, 's25plus': null, 's25': null, 's24': null,
    'z6fold': '26plus-ring', 'z6flip': '26-ring', 'pixel9pro': null, 'pixel9': null, 'pixel8pro': null,
}

const IPAD_FILE_MAP = {
    'ipad': 'ipad', 'ipadmini': 'ipadmini', 'ipadair4': 'ipadair4',
    'ipadair11': 'ipadair11', 'ipadair13': 'ipadair13', 'ipadpro11': 'ipadpro11',
    'ipadpro11s3': 'ipadpro11s3', 'ipadpro12.9': 'ipadpro12.9', 'ipadpro13': 'ipadpro13',
}

const IPAD_IMG_W = 590
const IPAD_IMG_H = 1000
const IPAD_DISPLAY_H = 900
const IPAD_DISPLAY_W = (IPAD_IMG_W / IPAD_IMG_H) * IPAD_DISPLAY_H

const IPAD_CANVAS_MAP = {
    'ipad': { top: 202, left: 81, w: 427, h: 596, radius: 36 },
    'ipadmini': { top: 230.9, left: 101.6, w: 388, h: 535, radius: 34 },
    'ipadair4': { top: 189, left: 72, w: 438, h: 618, radius: 28 },
    'ipadpro11s3': { top: 189, left: 74, w: 445, h: 620, radius: 30 },
    'ipadpro12.9': { top: 136.9, left: 50, w: 490, h: 695, radius: 30 },
    'ipadpro13': { top: 150, left: 50.6, w: 492, h: 698, radius: 30 },
}

const IPAD_NO_CAMERA = ['ipadair11', 'ipadair13', 'ipadpro11']

const LAPTOP_FILE_MAP = {
    'macbook13': 'macbook13', 'macbook15': 'macbook15',
    'macbookair13': 'macbookair13', 'macbookair13s1': 'macbookair13s1',
    'macbookpro14': 'macbookpro14', 'macbookpro16': 'macbookpro16',
}

const MACBOOK_SIZE_MAP = {
    'macbook13': { imgW: 900, imgH: 789, displayW: 616.5, displayH: 450 },
    'macbook15': { imgW: 1097, imgH: 822, displayW: 600.5, displayH: 450 },
    'macbookair13': { imgW: 1115, imgH: 849, displayW: 591.0, displayH: 450 },
    'macbookair13s1': { imgW: 1133, imgH: 816, displayW: 624.8, displayH: 450 },
    'macbookpro14': { imgW: 1105, imgH: 783, displayW: 635.1, displayH: 450 },
    'macbookpro16': { imgW: 1100, imgH: 791, displayW: 625.8, displayH: 450 },
}

const MACBOOK_CANVAS_MAP = {
    'macbook13': { top: 19, left: 29, w: 338, h: 203, radius: 47 },
    'macbook15': { top: 29, left: 34, w: 370, h: 210, radius: 45 },
    'macbookair13': { top: 30, left: 35, w: 329, h: 191, radius: 46 },
    'macbookair13s1': { top: 21, left: 40, w: 320, h: 195, radius: 9 },
    'macbookpro14': { top: 17.6, left: 32, w: 348.8, h: 219, radius: 49.8 },
    'macbookpro16': { top: 25, left: 27, w: 388.8, h: 232.5, radius: 49 },
}

const BOUNCE_IMG_W = 780
const BOUNCE_IMG_H = 1360
const BOUNCE_DISPLAY_H = 600

const BOUNCE_CANVAS_MAP = {
    'iphone17pro': { top: 278, left: 200, w: 380, h: 810, radius: 60 },
    'iphone17': { top: 340, left: 230, w: 320, h: 678, radius: 55 },
    'iphone16': { top: 315, left: 223, w: 335, h: 730, radius: 55 },
    'iphone15': { top: 330, left: 224, w: 330, h: 698, radius: 54 },
}

const PHONE_IMG_W = 780
const PHONE_IMG_H = 1360
const PHONE_DISPLAY_H = 600

const IMPACT_CANVAS_MAP = {
    'iphone17pro': { top: 296, left: 208, w: 368, h: 781, radius: 55 },
    'iphone17': { top: 280, left: 204, w: 371, h: 800, radius: 65 },
    'iphone16pro': { top: 280, left: 200, w: 378, h: 808, radius: 75 },
    'iphone16': { top: 280, left: 200, w: 380, h: 800, radius: 74 },
    'iphone15pro': { top: 238, left: 170, w: 436, h: 918, radius: 66 },
    'iphone15': { top: 220, left: 170, w: 437, h: 924, radius: 67 },
    's25plus': { top: 283, left: 208, w: 368, h: 799, radius: 34 },
    's25': { top: 281, left: 210, w: 370, h: 800, radius: 40 },
    's26plus': { top: 280, left: 202, w: 378, h: 800, radius: 36 },
    's26': { top: 280, left: 208, w: 370, h: 800, radius: 27 },
    'z6fold': { top: 258, left: 218, w: 362, h: 853, radius: 18 },
    'z6flip': { top: 684, left: 215, w: 358, h: 410, radius: 10 },
    'z7fold': { top: 269, left: 214, w: 370, h: 822, radius: 11 },
    'z7flip': { top: 687, left: 220, w: 338, h: 375, radius: 10 },
    'pixel9pro': { top: 260, left: 198, w: 389, h: 845, radius: 56 },
    'pixel9': { top: 258, left: 198, w: 390, h: 845, radius: 60 },
    'pixel10': { top: 280, left: 210, w: 364, h: 799, radius: 54 },
    'pixel10pro': { top: 284, left: 210, w: 365, h: 795, radius: 54 },
}

const RING_CANVAS_MAP = {
    'iphone17pro': { top: 286, left: 218, w: 348, h: 810, radius: 67 },
    'iphone17': { top: 269, left: 199, w: 380, h: 826, radius: 56 },
    'iphone16': { top: 277, left: 200, w: 380, h: 808, radius: 49 },
    'iphone15': { top: 275, left: 198, w: 383, h: 820, radius: 50 },
    'z6fold': { top: 260, left: 189, w: 408, h: 848, radius: 30 },
    'z6flip': { top: 274, left: 185, w: 410, h: 863, radius: 30 },
}

export function isCaseTypeSupported(modelId, caseTypeId) {
    if (caseTypeId === 'magsafe-bounce') return !!BOUNCE_FILE_MAP[modelId]
    if (caseTypeId === 'magsafe-compact') return !!RING_FILE_MAP[modelId]
    return true
}

function getFilterStyle(filterId, strength) {
    const s = strength / 100
    switch (filterId) {
        case 'retro': return { filter: `saturate(${1 + s * 1.5}) hue-rotate(${s * 30}deg)` }
        case 'digicam': return { filter: `saturate(${1 + s}) brightness(${1 + s * 0.3})` }
        case 'mono': return { filter: `grayscale(${s}) contrast(${1 + s * 0.5})` }
        default: return {}
    }
}

function scaleCanvas(canvasInfo, displayW, displayH, imgW, imgH) {
    if (!canvasInfo) return null
    const sx = displayW / imgW
    const sy = displayH / imgH
    return {
        top: canvasInfo.top * sy,
        left: canvasInfo.left * sx,
        w: canvasInfo.w * sx,
        h: canvasInfo.h * sy,
        radius: (canvasInfo.radius || 0) * sx,
    }
}

// ── 캔버스 콘텐츠 ────────────────────────────────
function CanvasContent({
    designType, previewURL, photoFilter, filterStrength,
    textValue, fontColor, photoTab, fontSize = 14,
    imageTransform, cropMode, onMouseDown, onTouchStart,
}) {
    if (designType === 'photo' && previewURL) {
        const t = imageTransform || { x: 0, y: 0, scale: 1 }
        return (
            <div
                style={{
                    width: '100%', height: '100%',
                    position: 'relative', overflow: 'hidden',
                    cursor: cropMode ? 'grab' : 'default',
                }}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
            >
                <img
                    src={previewURL}
                    alt="미리보기"
                    draggable={false}
                    style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: `translate(calc(-50% + ${t.x}px), calc(-50% + ${t.y}px)) scale(${t.scale})`,
                        transformOrigin: 'center center',
                        width: '100%', height: '100%', objectFit: 'cover',
                        userSelect: 'none',
                        ...(photoFilter && getFilterStyle(photoFilter, filterStrength)),
                    }}
                />
                {cropMode && (
                    <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        border: '2px dashed rgba(255,255,255,0.7)', borderRadius: 4,
                    }} />
                )}
            </div>
        )
    }
    if (designType === 'text' && textValue) {
        return (
            <span style={{
                color: fontColor || '#fff', fontSize, fontWeight: 600,
                textAlign: 'center', padding: 8,
                wordBreak: 'break-all', whiteSpace: 'pre-line',
            }}>{textValue}</span>
        )
    }
    return (
        <p style={{
            fontSize: fontSize - 2, color: 'rgba(255,255,255,0.4)',
            textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.4, margin: 0,
        }}>
            {designType === 'photo'
                ? (photoTab === 'sticker' ? '스티커를\n선택하세요' : '사진을\n업로드하세요')
                : designType === 'text' ? '텍스트를\n입력하세요'
                    : '커스텀 내용을\n선택하세요'}
        </p>
    )
}

// ── Placeholder ──────────────────────────────────
function DevicePlaceholder({ deviceType, selectedModel, selectedCaseType, bodySrc, selectedCaseColor }) {
    const line1 = !selectedModel ? '기종을' : !selectedCaseType ? '케이스 타입을' : !bodySrc ? '이미지' : '커스텀 내용을'
    const line2 = !selectedModel ? '선택하세요' : !selectedCaseType ? '선택하세요' : !bodySrc ? '준비 중입니다' : '선택하세요'
    const cc = selectedCaseColor || '#888'

    if (deviceType === 'laptop') {
        return (
            <svg width="510" height="345" viewBox="0 0 510 345" style={{ display: 'block', margin: '0 auto' }}>
                <rect x="15" y="15" width="480" height="300" rx="14" fill={cc} fillOpacity="0.12" stroke={cc} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="6 4" />
                <rect x="36" y="33" width="438" height="264" rx="8" fill={cc} fillOpacity="0.07" stroke={cc} strokeOpacity="0.2" strokeWidth="1" />
                <circle cx="255" cy="45" r="6" fill={cc} fillOpacity="0.4" />
                <rect x="0" y="318" width="510" height="12" rx="4" fill={cc} fillOpacity="0.15" />
                <text x="255" y="156" textAnchor="middle" fontSize="18" fill={cc} fillOpacity="0.5" fontFamily="sans-serif">{line1}</text>
                <text x="255" y="180" textAnchor="middle" fontSize="18" fill={cc} fillOpacity="0.5" fontFamily="sans-serif">{line2}</text>
            </svg>
        )
    }
    if (deviceType === 'tablet') {
        return (
            <svg width="270" height="390" viewBox="0 0 270 390" style={{ display: 'block', margin: '0 auto' }}>
                <rect x="15" y="15" width="240" height="360" rx="24" fill={cc} fillOpacity="0.12" stroke={cc} strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="6 4" />
                <circle cx="135" cy="36" r="7" fill={cc} fillOpacity="0.4" />
                <rect x="33" y="54" width="204" height="294" rx="8" fill={cc} fillOpacity="0.07" stroke={cc} strokeOpacity="0.2" strokeWidth="1" />
                <text x="135" y="192" textAnchor="middle" fontSize="18" fill={cc} fillOpacity="0.5" fontFamily="sans-serif">{line1}</text>
                <text x="135" y="216" textAnchor="middle" fontSize="18" fill={cc} fillOpacity="0.5" fontFamily="sans-serif">{line2}</text>
            </svg>
        )
    }
    return (
        <div className="custom-phone-preview" style={{ '--case-color': selectedCaseColor || '#111111' }}>
            <div className="custom-phone-body">
                <div className="custom-phone-camera">
                    <div className="custom-phone-lens" />
                    <div className="custom-phone-lens" />
                    <div className="custom-phone-lens" />
                </div>
                <div className="custom-phone-screen">
                    <p className="custom-phone-placeholder">
                        {!selectedModel ? '기종을\n선택하세요'
                            : !selectedCaseType ? '케이스 타입을\n선택하세요'
                                : !bodySrc ? '해당 케이스 타입의\n이미지 준비 중입니다'
                                    : '커스텀 내용을\n선택하세요'}
                    </p>
                </div>
                <div className="custom-phone-grid" />
            </div>
        </div>
    )
}

// ── PhonePreview ─────────────────────────────────
export function PhonePreview({
    selectedModel, selectedCaseType, designType,
    previewURL, photoFilter, filterStrength,
    textValue, fontColor, photoTab, selectedCaseColor, deviceType,
    imageTransform, cropMode, onCanvasMouseDown, onCanvasTouchStart,
}) {
    const isTablet = deviceType === 'tablet'
    const isLaptop = deviceType === 'laptop'

    let bodySrc = null
    let cameraSrc = null

    if (isTablet) {
        const fileKey = IPAD_FILE_MAP[selectedModel]
        if (fileKey) {
            bodySrc = `${IPAD_BASE}/${fileKey}.png`
            if (!IPAD_NO_CAMERA.includes(selectedModel)) cameraSrc = `${IPAD_BASE}/${fileKey}-camera.png`
        }
    } else if (isLaptop) {
        const fileKey = LAPTOP_FILE_MAP[selectedModel]
        if (fileKey) bodySrc = `${LAPTOP_BASE}/${fileKey}.png`
    } else {
        if (selectedCaseType === 'magsafe-bounce') {
            const fileKey = BOUNCE_FILE_MAP[selectedModel]
            if (fileKey) {
                bodySrc = `${PHONE_BASE_MAP['magsafe-bounce']}/${fileKey}.png`
                cameraSrc = `${PHONE_BASE_MAP['magsafe-bounce']}/${fileKey}-camera.png`
            }
        } else if (selectedCaseType === 'magsafe-compact') {
            const fileKey = RING_FILE_MAP[selectedModel]
            if (fileKey) {
                bodySrc = `${PHONE_BASE_MAP['magsafe-compact']}/${fileKey}.png`
                cameraSrc = `${PHONE_BASE_MAP['magsafe-compact']}/${fileKey}-camera.png`
            }
        } else {
            const phoneBase = PHONE_BASE_MAP['impact']
            const fileKey = MODEL_FILE_MAP[selectedModel]
            bodySrc = fileKey ? `${phoneBase}/${fileKey}.png` : null
            const camKey = fileKey ? (CAMERA_FILE_OVERRIDE[fileKey] || `${fileKey}-camera`) : null
            cameraSrc = camKey ? `${phoneBase}/${camKey}.png` : null
        }
    }

    const showPreview = !!selectedModel && (isTablet ? !!bodySrc : isLaptop ? !!bodySrc : !!selectedCaseType && !!bodySrc)

    if (!showPreview) {
        return (
            <DevicePlaceholder
                deviceType={deviceType} selectedModel={selectedModel}
                selectedCaseType={selectedCaseType} bodySrc={bodySrc}
                selectedCaseColor={selectedCaseColor}
            />
        )
    }

    const CaseColorOverlay = ({ src }) => selectedCaseColor ? (
        <div style={{
            position: 'absolute', inset: 0,
            background: selectedCaseColor,
            mixBlendMode: 'multiply', opacity: 0.45,
            zIndex: 2, pointerEvents: 'none',
            WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
            WebkitMaskSize: '100% 100%', maskSize: '100% 100%',
        }} />
    ) : null

    // 공통 CanvasContent props
    const ccProps = {
        designType, previewURL, photoFilter, filterStrength,
        textValue, fontColor, photoTab,
        imageTransform, cropMode,
        onMouseDown: onCanvasMouseDown,
        onTouchStart: onCanvasTouchStart,
    }

    // ── 아이패드 ──────────────────────────────────
    if (isTablet) {
        const scaledCanvas = scaleCanvas(IPAD_CANVAS_MAP[selectedModel], IPAD_DISPLAY_W, IPAD_DISPLAY_H, IPAD_IMG_W, IPAD_IMG_H)
        return (
            <div style={{ position: 'relative', width: IPAD_DISPLAY_W, height: IPAD_DISPLAY_H, margin: '0 auto', flexShrink: 0 }}>
                <img src={bodySrc} alt={selectedModel} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 1, pointerEvents: 'none' }} />
                <CaseColorOverlay src={bodySrc} />
                {scaledCanvas && (
                    <div style={{ position: 'absolute', top: scaledCanvas.top, left: scaledCanvas.left, width: scaledCanvas.w, height: scaledCanvas.h, borderRadius: scaledCanvas.radius, overflow: 'hidden', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CanvasContent {...ccProps} fontSize={16} />
                    </div>
                )}
                {cameraSrc && <img src={cameraSrc} alt="camera" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 4, pointerEvents: 'none' }} />}
            </div>
        )
    }

    // ── 맥북 ─────────────────────────────────────
    if (isLaptop) {
        const info = MACBOOK_SIZE_MAP[selectedModel]
        const displayW = info ? info.displayW : 620
        const displayH = info ? info.displayH : 450
        const imgW = info ? info.imgW : 900
        const imgH = info ? info.imgH : 789
        const scaledCanvas = scaleCanvas(MACBOOK_CANVAS_MAP[selectedModel], displayW, displayH, imgW, imgH)
        return (
            <div style={{ position: 'relative', width: displayW, height: displayH, margin: '0 auto', flexShrink: 0 }}>
                <img src={bodySrc} alt={selectedModel} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 1, pointerEvents: 'none' }} />
                {scaledCanvas ? (
                    <div style={{ position: 'absolute', top: scaledCanvas.top, left: scaledCanvas.left, width: scaledCanvas.w, height: scaledCanvas.h, borderRadius: scaledCanvas.radius, overflow: 'hidden', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CanvasContent {...ccProps} fontSize={18} />
                    </div>
                ) : (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <CanvasContent {...ccProps} fontSize={18} />
                    </div>
                )}
            </div>
        )
    }

    // ── 바운스 ────────────────────────────────────
    if (selectedCaseType === 'magsafe-bounce' && bodySrc) {
        const displayH = BOUNCE_DISPLAY_H * 1.5
        const displayW = (BOUNCE_IMG_W / BOUNCE_IMG_H) * displayH
        const scaledCanvas = scaleCanvas(BOUNCE_CANVAS_MAP[selectedModel], displayW, displayH, BOUNCE_IMG_W, BOUNCE_IMG_H)
        return (
            <div style={{ position: 'relative', width: displayW, height: displayH, margin: '0 auto', flexShrink: 0 }}>
                <img src={bodySrc} alt={selectedModel} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 1, pointerEvents: 'none' }} />
                <CaseColorOverlay src={bodySrc} />
                {scaledCanvas && (
                    <div style={{ position: 'absolute', top: scaledCanvas.top, left: scaledCanvas.left, width: scaledCanvas.w, height: scaledCanvas.h, borderRadius: scaledCanvas.radius, overflow: 'hidden', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CanvasContent {...ccProps} fontSize={14} />
                    </div>
                )}
                {cameraSrc && <img src={cameraSrc} alt="camera" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 4, pointerEvents: 'none' }} />}
            </div>
        )
    }

    // ── 폰 impact/ring ────────────────────────────
    {
        const SCALE = 1.5
        const displayH = PHONE_DISPLAY_H * SCALE
        const displayW = (PHONE_IMG_W / PHONE_IMG_H) * displayH
        const canvasMap = selectedCaseType === 'magsafe-compact' ? RING_CANVAS_MAP : IMPACT_CANVAS_MAP
        const scaledCanvas = scaleCanvas(canvasMap[selectedModel], displayW, displayH, PHONE_IMG_W, PHONE_IMG_H)
        return (
            <div style={{ position: 'relative', width: displayW, height: displayH, margin: '0 auto', flexShrink: 0 }}>
                <img src={bodySrc} alt={selectedModel} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 1, pointerEvents: 'none' }} />
                <CaseColorOverlay src={bodySrc} />
                {scaledCanvas ? (
                    <div style={{ position: 'absolute', top: scaledCanvas.top, left: scaledCanvas.left, width: scaledCanvas.w, height: scaledCanvas.h, borderRadius: scaledCanvas.radius, overflow: 'hidden', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CanvasContent {...ccProps} fontSize={16} />
                    </div>
                ) : (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <CanvasContent {...ccProps} fontSize={16} />
                    </div>
                )}
                {cameraSrc && <img src={cameraSrc} alt="camera" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 4, pointerEvents: 'none' }} />}
            </div>
        )
    }
}

export default PhonePreview