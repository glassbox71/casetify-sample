import React, { useEffect } from 'react'
import './scss/ToastPopup.scss'

/**
 * ToastPopup — 안내용 작은 빨간 토스트 팝업
 * 참고사진 2번 스타일: "로그인 후 이용 가능합니다" 배너
 *
 * Props:
 *   isOpen      {boolean}
 *   message     {string}
 *   onClose     {function}
 *   duration    {number}  ms, 0이면 자동 닫힘 없음 (기본 2500)
 */
export default function ToastPopup({ isOpen, message, onClose, duration = 2500 }) {
    useEffect(() => {
        if (!isOpen || duration === 0) return
        const t = setTimeout(onClose, duration)
        return () => clearTimeout(t)
    }, [isOpen, duration, onClose])

    if (!isOpen) return null

    return (
        <div className="toast-popup" onClick={onClose}>
            <span>{message}</span>
        </div>
    )
}