import React, { useRef } from 'react'
import { FONT_COLORS } from './constants'

const EMOJIS = ['😀', '😊', '😍', '🥰', '😎', '🤩', '❤️', '🧡', '💛', '💚', '💙', '💜',
    '🔥', '✨', '🎉', '🌸', '🐶', '🐱', '🍕', '🍔', '⭐', '🏆', '🎁', '👍']

export function TextInputSection({
    textValue, setTextValue,
    fontColor, setFontColor,
    showEmojiPicker, setShowEmojiPicker,
}) {
    const fontColorInputRef = useRef(null)

    // 프리셋에 없는 값이면 커스텀 컬러로 간주
    const isCustomColor = fontColor && !FONT_COLORS.some(c => c.hex === fontColor)

    return (
        <div className="detail-info-box">
            <p className="label">텍스트 입력</p>
            <div className="custom-text-input-wrap">
                <input
                    type="text"
                    className="custom-text-input"
                    placeholder="원하시는 글씨를 입력하세요 (최대 10자)"
                    value={textValue}
                    maxLength={9}
                    onChange={e => setTextValue(e.target.value)}
                />
                <div style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex', alignItems: 'center', gap: 6,
                }}>
                    <span className="custom-char-count" style={{ position: 'static', transform: 'none' }}>
                        {textValue.length} / 10
                    </span>
                    <button
                        onClick={() => setShowEmojiPicker(p => !p)}
                        style={{
                            background: 'none', border: 'none',
                            cursor: 'pointer', fontSize: 18,
                            padding: 0, lineHeight: 1,
                        }}
                    >
                        😊
                    </button>
                </div>

                {showEmojiPicker && (
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: 4,
                        padding: 8, borderTop: '1px solid #eee', marginTop: 48,
                    }}>
                        {EMOJIS.map((e, i) => (
                            <button key={i}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, padding: 2 }}
                                onClick={() => {
                                    if (textValue.length < 9) setTextValue(p => p + e)
                                    setShowEmojiPicker(false)
                                }}>
                                {e}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <p className="label" style={{ marginTop: 16 }}>폰트 색상</p>
            <div className="detail-colors">
                {FONT_COLORS.map(c => (
                    <button key={c.id}
                        className={fontColor === c.hex ? 'active' : ''}
                        onClick={() => setFontColor(c.hex)}>
                        <span className="color-chip" style={{
                            backgroundColor: c.hex,
                            border: c.id === 'white' ? '1px solid #ddd' : 'none'
                        }} />
                        {c.label}
                    </button>
                ))}

                {/* ✅ 직접 선택 버튼 - 선택 후엔 hex 코드로 텍스트 변경 */}
                <button
                    className={isCustomColor ? 'active' : ''}
                    onClick={() => fontColorInputRef.current?.click()}
                    style={{ position: 'relative' }}
                    title="직접 색상 선택"
                >
                    <span className="color-chip" style={{
                        background: isCustomColor
                            ? fontColor
                            : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                        border: '1px solid #ddd',
                    }} />
                    {isCustomColor ? fontColor.toUpperCase() : '직접 선택'}
                    <input
                        ref={fontColorInputRef}
                        type="color"
                        value={isCustomColor ? fontColor : '#ffffff'}
                        onChange={e => setFontColor(e.target.value)}
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                        tabIndex={-1}
                    />
                </button>
            </div>
        </div>
    )
}