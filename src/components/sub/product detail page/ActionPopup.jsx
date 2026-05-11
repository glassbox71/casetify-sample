import React from 'react'
import { useNavigate } from 'react-router-dom'
import './scss/ActionPopup.scss'

export default function ActionPopup({ isOpen, message, isError, type, onClose }) {
    const navigate = useNavigate()
    if (!isOpen) return null

    return (
        <div className="popup-overlay">
            <div className="popup-wrap">
                <div className="popup">
                    <p>{message}</p>
                    {isError ? (
                        <div className="popup-buttons">
                            <button className="btn-close" onClick={onClose}>닫기</button>
                        </div>
                    ) : (
                        <div className="popup-buttons">
                            <button className="btn-continue" onClick={onClose}>계속 쇼핑하기</button>
                            <button
                                className="btn-go-wish"
                                onClick={() =>
                                    type === 'wish'
                                        ? navigate('/mypage', { state: { menu: '위시리스트' } })
                                        : navigate('/cart')
                                }
                            >
                                {type === 'wish' ? '위시리스트 보기' : '장바구니 보기'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
