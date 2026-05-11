import "../scss/Popup.scss"
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Popup() {
    // 현재 보여줄 팝업의 ID (null, 'shipping', 'membership')
    const [activePopup, setActivePopup] = useState(null);
    const [isClosing, setIsClosing] = useState(false); // 닫히는 중인지 확인하는 상태

    useEffect(() => {
        // (기존 랜덤 로직 동일...)
        const now = new Date().getTime();
        const availablePopups = [];
        const hide1 = localStorage.getItem('popup_hidden_shipping');
        if (!hide1 || now > parseInt(hide1)) availablePopups.push('shipping');
        const hide2 = localStorage.getItem('popup_hidden_membership');
        if (!hide2 || now > parseInt(hide2)) availablePopups.push('membership');

        if (availablePopups.length > 0) {
            const randomIndex = Math.floor(Math.random() * availablePopups.length);
            setActivePopup(availablePopups[randomIndex]);
        }
    }, []);

    const hideToday = (id) => {
        const midnight = new Date().setHours(23, 59, 59, 999);
        localStorage.setItem(`popup_hidden_${id}`, midnight.toString());
        handleClose(); // 팝업 닫기
    };

    // 닫기 실행 함수
    const handleClose = (id, isPermanent = false) => {
        setIsClosing(true); // 닫기 애니메이션 시작
        
        // 애니메이션 시간(0.3초) 후에 실제로 DOM에서 제거
        setTimeout(() => {
            if (isPermanent) {
                const midnight = new Date().setHours(23, 59, 59, 999);
                localStorage.setItem(`popup_hidden_${id}`, midnight.toString());
            }
            setActivePopup(null);
            setIsClosing(false);
        }, 300);
    };

    // 활성화된 팝업이 없으면 아무것도 렌더링하지 않음
    if (!activePopup) return null;

    return (
        <div className={`main-popup-overlay ${isClosing ? 'fade-out' : ''}`}>
            <div className="popup-flex-container">
                
                {/* 팝업 1: 무료 배송 */}
                {activePopup === 'shipping' && (
                    <div className="main-popup-content">
                        <Link className="popup-link-area">
                            <div className="popup-body">
                                <img src="/images/main/popup_bg_01.png" alt="무료배송" />
                                <div className="popup-text type-shipping">
                                    <div className="title">
                                        <p>부담없는</p>
                                        <p>온라인쇼핑</p>
                                    </div>
                                    <div className="desc">
                                        <p>5만원이상 구매시</p>
                                        <p>무료 배송 서비스</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className="popup-footer">
                            <button onClick={() => hideToday('shipping')}>오늘 하루 열지않기</button>
                            <span className="divider">|</span>
                            <button onClick={() => handleClose()} className="close-btn">
                                <img src="/images/icon/close.svg" alt="닫기" />
                            </button>
                        </div>
                    </div>
                )}

                {/* 팝업 2: 멤버십 */}
                {activePopup === 'membership' && (
                    <div className="main-popup-content">
                        <Link to="/login" className="popup-link-area">
                            <div className="popup-body">
                                <img src="/images/main/popup_bg_02.png" alt="멤버십혜택" />
                                <div className="popup-text type-membership">
                                    <p className="greet">만나서 반가워요!</p>
                                    <div className="title">
                                        <p>지금 시작하고</p>
                                        <p>10% OFF</p>
                                    </div>
                                    <p className="info">멤버십 전용 혜택 정보도 보내드려요.</p>
                                    <p className="go-btn">혜택 받고 시작하기 <span>&gt;</span></p>
                                </div>
                            </div>
                        </Link>
                        <div className="popup-footer">
                            <button onClick={() => hideToday('membership')}>오늘 하루 열지않기</button>
                            <span className="divider">|</span>
                            <button onClick={() => handleClose()} className="close-btn">
                                <img src="/images/icon/close.svg" alt="닫기" />
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
