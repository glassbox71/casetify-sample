import React from 'react'
import './scss/ConfirmModal.scss'

/**
 * ConfirmModal — 버튼 선택이 필요한 모달 (흰 배경 + 검은 버튼)
 * 참고사진 1번 스타일: 장바구니 담겼습니다 팝업
 *
 * Props:
 *   isOpen   {boolean}
 *   message  {string|ReactNode}
 *   buttons  {Array<{ label: string, onClick: function, variant?: 'primary'|'secondary' }>}
 *   onClose  {function}  오버레이 클릭 시 닫기 (optional)
 */
export default function ConfirmModal({ isOpen, message, buttons = [], onClose }) {
    if (!isOpen) return null

    return (
        <div className="confirm-modal-overlay" onClick={onClose}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                <p className="confirm-modal-message">{message}</p>
                <div className="confirm-modal-buttons">
                    {buttons.map((btn, i) => (
                        <button
                            key={i}
                            type="button"
                            className={`confirm-modal-btn${btn.variant === 'secondary' ? ' secondary' : ''}`}
                            onClick={btn.onClick}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}