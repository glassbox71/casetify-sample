import React, { useState } from 'react'
import "./scss/GiftCardModal.scss"
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import ToastPopup from '../Toastpopup';

export default function GiftCardModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [cardCode, setCardCode] = useState("");
    const [msg, setMsg] = useState("");
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const { registerGiftCard } = useAuthStore();

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setMsg("");
        if (cardCode.trim()) {
            const isGift = await registerGiftCard(cardCode);

            if (isGift === true) {
                setMsg("등록 완료!");
            } else if (isGift === "코드") {
                setMsg("유효하지 않은 코드입니다.");
            } else {
                setMsg("등록실패");
            }
        } else {
            setToastMsg("모든 정보를 입력해주세요.");
            setToastOpen(true);
        }
    };
    return (
        <div className="modal-overlay">
            <div className="gift-card-popup">
                <p className="close-btn" onClick={onClose}><img src="/images/icon/close.svg" alt="닫기" /></p>
                <div className="popup-header">
                    <span className="card-icon"><img src="/images/mypage/gift/gift-card.svg" alt="기프트카드" /></span>
                    <h2>기프트 카드 계정에 추가하기</h2>
                </div>

                <p className="popup-description">
                    기프트 카드 코드를 입력하면 케이스티파이 클럽 계정에 추가됩니다. 기프트 카드는 다른 계정으로 양도하는 데 사용할 수 없으며, 법이 요청하는 경우를 제외하고 현금으로 교환할 수 없습니다. 기프트 카드 잔액과 사용 기한은 기프트 카드 크레딧에서 확인할 수 있습니다.
                    <Link>이용약관</Link>
                </p>

                <div className="input-container">
                    <input
                        type="text"
                        placeholder="일련번호 (10 숫자)"
                        value={cardCode}
                        maxLength="10"
                        onChange={(e) => setCardCode(e.target.value)}
                    />
                </div>
                <div>
                    0000020000 : 2만원<br />
                    0000050000 : 5만원<br />
                    0000080000 : 8만원<br />
                    0000100000 : 10만원<br />
                    0000150000 : 15만원<br />
                </div>
                <div className="popup-buttons">
                    <p>{msg}</p>
                    <button className="confirm-btn" onClick={handleSubmit}>확인</button>
                    <button className="cancel-btn" onClick={onClose}>취소</button>
                </div>
            </div>
            <ToastPopup
                isOpen={toastOpen}
                message={toastMsg}
                onClose={() => setToastOpen(false)}
            />
        </div>
    )
}