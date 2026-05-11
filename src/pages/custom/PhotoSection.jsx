import React, { useRef, useState } from 'react'
import { PHOTO_FILTERS } from './constants'

const STICKERS = [
    { id: 'sticker1', src: '/images/custom/alonedog.png', label: '큰강아지' },
    { id: 'sticker2', src: '/images/custom/cat.png', label: '고양이' },
    { id: 'sticker3', src: '/images/custom/dogs.png', label: '강아지들' },
    { id: 'sticker4', src: '/images/custom/dossiba.png', label: '일본강아지' },
    { id: 'sticker5', src: '/images/custom/good.stiker.png', label: 'goodthing' },
    { id: 'sticker6', src: '/images/custom/happy.stiker.png', label: 'Happy' },
    { id: 'sticker7', src: '/images/custom/happytogether.png', label: '행복한 우리들' },
    { id: 'sticker8', src: '/images/custom/princecs.png', label: '시씨황후' },
    { id: 'sticker9', src: '/images/custom/starbrigtnight.png', label: '별이빛나는밤' }
]

function getFilterStyle(filterId, strength) {
    const s = strength / 100
    switch (filterId) {
        case 'retro': return { filter: `saturate(${1 + s * 1.5}) hue-rotate(${s * 30}deg)` }
        case 'digicam': return { filter: `saturate(${1 + s}) brightness(${1 + s * 0.3})` }
        case 'mono': return { filter: `grayscale(${s}) contrast(${1 + s * 0.5})` }
        default: return {}
    }
}

const DEFAULT_FILTER_ID = PHOTO_FILTERS[Math.floor(PHOTO_FILTERS.length / 2)]?.id

// ── 영역 고르기 컴포넌트 ─────────────────────────
function CropSection({ imageTransform, setImageTransform, cropMode, setCropMode, cropLocked, setCropLocked }) {
    return (
        <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p className="label" style={{ margin: 0 }}>영역 고르기</p>
                <div style={{ display: 'flex', gap: 6 }}>
                    {!cropLocked ? (
                        !cropMode ? (
                            <button onClick={() => setCropMode(true)} style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: '#222', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>✂️ 영역 고르기</button>
                        ) : (
                            <>
                                <button onClick={() => { setCropLocked(true); setCropMode(false) }} style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: '#111', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>✅ 고정</button>
                                <button onClick={() => { setCropMode(false); setImageTransform({ x: 0, y: 0, scale: 1 }) }} style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: '#eee', color: '#333', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>초기화</button>
                            </>
                        )
                    ) : (
                        <button onClick={() => { setCropLocked(false); setCropMode(true) }} style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: '#666', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>✏️ 다시 편집</button>
                    )}
                </div>
            </div>
            {cropMode && !cropLocked && (
                <div style={{ background: '#f5f5f5', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <p style={{ fontSize: 12, color: '#888', margin: 0, textAlign: 'center' }}>왼쪽 프리뷰에서 드래그하거나 아래로 조정하세요</p>
                    <div>
                        <label style={{ fontSize: 12, color: '#555', marginBottom: 4, display: 'block' }}>
                            확대/축소 <span style={{ color: '#222', fontWeight: 600 }}>{Math.round((imageTransform?.scale || 1) * 100)}%</span>
                        </label>
                        <input type="range" min={50} max={300} step={1}
                            value={Math.round((imageTransform?.scale || 1) * 100)}
                            onChange={e => setImageTransform(p => ({ ...p, scale: Number(e.target.value) / 100 }))}
                            className="custom-slider" style={{ width: '100%' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa' }}>
                            <span>50%</span><span>300%</span>
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, color: '#555', marginBottom: 6, display: 'block' }}>위치 미세조정</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, width: 96, margin: '0 auto' }}>
                            <div />
                            <button style={{ width: 28, height: 28, border: '1px solid #ddd', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 11 }} onClick={() => setImageTransform(p => ({ ...p, y: (p.y || 0) - 5 }))}>▲</button>
                            <div />
                            <button style={{ width: 28, height: 28, border: '1px solid #ddd', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 11 }} onClick={() => setImageTransform(p => ({ ...p, x: (p.x || 0) - 5 }))}>◀</button>
                            <button style={{ width: 28, height: 28, border: '1px solid #ddd', borderRadius: 6, background: '#ddd', cursor: 'pointer', fontSize: 11 }} onClick={() => setImageTransform(p => ({ x: 0, y: 0, scale: p.scale || 1 }))}>●</button>
                            <button style={{ width: 28, height: 28, border: '1px solid #ddd', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 11 }} onClick={() => setImageTransform(p => ({ ...p, x: (p.x || 0) + 5 }))}>▶</button>
                            <div />
                            <button style={{ width: 28, height: 28, border: '1px solid #ddd', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 11 }} onClick={() => setImageTransform(p => ({ ...p, y: (p.y || 0) + 5 }))}>▼</button>
                            <div />
                        </div>
                    </div>
                </div>
            )}
            {cropLocked && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#16a34a' }}>
                    ✅ 영역이 고정되었습니다. "다시 편집"을 눌러 수정할 수 있어요.
                </div>
            )}
        </div>
    )
}

// ── PhotoSection ─────────────────────────────────
export function PhotoSection({
    photoTab, setPhotoTab,
    photoURL, setPhotoURL, setPhotoFile,
    photoFilter, setPhotoFilter,
    filterStrength, setFilterStrength,
    selectedSticker, setSelectedSticker,
    filterSectionRef,
    onScrollToFilter,
    imageTransform, setImageTransform,
    cropMode, setCropMode,
}) {
    const fileInputRef = useRef(null)
    const [cropLocked, setCropLocked] = useState(false)

    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setPhotoFile(file)
        const reader = new FileReader()
        reader.onload = (ev) => {
            setPhotoURL(ev.target.result)
            setPhotoFilter(DEFAULT_FILTER_ID)
            setTimeout(() => onScrollToFilter?.(), 200)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="detail-info-box">
            <div className="photo-tab">
                <div className="photo-tab-wrap">
                    <button
                        className={`photo-tab-btn ${photoTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setPhotoTab('upload')}
                    >
                        📷 사진 업로드
                    </button>
                    <button
                        className={`photo-tab-btn ${photoTab === 'sticker' ? 'active' : ''}`}
                        onClick={() => {
                            setPhotoTab('sticker')
                            if (!selectedSticker) setSelectedSticker(STICKERS[0])
                        }}
                    >
                        🐾 스티커
                    </button>
                </div>
            </div>

            {photoTab === 'upload' && (
                <>
                    <div className="custom-upload-zone" onClick={() => fileInputRef.current?.click()}>
                        {photoURL
                            ? <img src={photoURL} alt="업로드 사진" />
                            : <><span className="custom-upload-icon">+</span><p>클릭해서 사진을 업로드해주세요</p></>
                        }
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*"
                        style={{ display: 'none' }} onChange={handlePhotoUpload} />
                    {photoURL && (
                        <button className="custom-reupload-btn"
                            onClick={() => fileInputRef.current?.click()}>다시 업로드</button>
                    )}
                    {photoURL && (
                        <div ref={filterSectionRef}>
                            <p className="label" style={{ marginTop: 16 }}>필터 선택</p>
                            <div className="custom-filter-grid">
                                {PHOTO_FILTERS.map(f => (
                                    <button key={f.id}
                                        className={`custom-filter-card ${photoFilter === f.id ? 'active' : ''}`}
                                        onClick={() => setPhotoFilter(f.id)}>
                                        <div className="custom-filter-img-wrap">
                                            <img src={photoURL} alt={f.label}
                                                style={getFilterStyle(f.id, filterStrength)} />
                                        </div>
                                        <span>{f.label}</span>
                                    </button>
                                ))}
                            </div>
                            {photoFilter && (
                                <div className="custom-slider-wrap">
                                    <label className="label">필터 강도</label>
                                    <input type="range" min={0} max={100} step={1}
                                        value={filterStrength}
                                        onChange={e => setFilterStrength(Number(e.target.value))}
                                        className="custom-slider" />
                                    <div className="custom-slider-ticks">
                                        <span>약</span><span>강</span>
                                    </div>
                                </div>
                            )}
                            {photoFilter && setImageTransform && (
                                <CropSection
                                    imageTransform={imageTransform} setImageTransform={setImageTransform}
                                    cropMode={cropMode} setCropMode={setCropMode}
                                    cropLocked={cropLocked} setCropLocked={setCropLocked}
                                />
                            )}
                        </div>
                    )}
                </>
            )}

            {photoTab === 'sticker' && (
                <>
                    <div className="custom-filter-grid">
                        {STICKERS.map(s => (
                            <button key={s.id}
                                className={`custom-filter-card ${selectedSticker?.id === s.id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedSticker(s)
                                    setPhotoFilter(DEFAULT_FILTER_ID)
                                    setTimeout(() => onScrollToFilter?.(), 150)
                                }}>
                                <div className="custom-filter-img-wrap">
                                    <img src={s.src} alt={s.label} />
                                </div>
                                <span>{s.label}</span>
                            </button>
                        ))}
                    </div>
                    {selectedSticker && (
                        <div ref={filterSectionRef}>
                            <p className="label" style={{ marginTop: 16 }}>필터 선택</p>
                            <div className="custom-filter-grid">
                                {PHOTO_FILTERS.map(f => (
                                    <button key={f.id}
                                        className={`custom-filter-card ${photoFilter === f.id ? 'active' : ''}`}
                                        onClick={() => setPhotoFilter(f.id)}>
                                        <div className="custom-filter-img-wrap">
                                            <img src={selectedSticker.src} alt={f.label}
                                                style={getFilterStyle(f.id, filterStrength)} />
                                        </div>
                                        <span>{f.label}</span>
                                    </button>
                                ))}
                            </div>
                            {photoFilter && (
                                <div className="custom-slider-wrap">
                                    <label className="label">필터 강도</label>
                                    <input type="range" min={0} max={100} step={1}
                                        value={filterStrength}
                                        onChange={e => setFilterStrength(Number(e.target.value))}
                                        className="custom-slider" />
                                    <div className="custom-slider-ticks">
                                        <span>약</span><span>강</span>
                                    </div>
                                </div>
                            )}
                            {photoFilter && setImageTransform && (
                                <CropSection
                                    imageTransform={imageTransform} setImageTransform={setImageTransform}
                                    cropMode={cropMode} setCropMode={setCropMode}
                                    cropLocked={cropLocked} setCropLocked={setCropLocked}
                                />
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}