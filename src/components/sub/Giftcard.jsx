import React, { useState } from 'react'
import MypageTitle from './MypageTitle'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore';
import './scss/Giftcard.scss';
import GiftCardModal from './GiftCardModal';
import EmptyState from './EmptyState';

export default function Giftcard() {
    const { user } = useAuthStore();

    const getValidCoupons = (coupons) => {
        if (!coupons) return [];

        const today = new Date();

        return coupons.filter((coupon) => {
            // 1. 이미 사용한 쿠폰 제외
            if (!coupon.use) return false;

            // 2. 유효기간 만료 체크
            // "2026년 7월 27일" -> "2026-7-27" 포맷으로 변환
            const limitDateStr = coupon.limit
                .replace(/년|월/g, "-")
                .replace(/일/g, "")
                .trim();

            const limitDate = new Date(limitDateStr);

            // 사용 가능 조건: used가 true이고, 오늘이 만료일보다 전이거나 같아야 함
            return coupon.use && today <= limitDate;
        });
    };

    const validCoupons = getValidCoupons(user?.coupons);

    const getTotalGiftCardBalance = (giftCards) => {
        if (!giftCards || giftCards.length === 0) return 0;

        const today = new Date();

        return giftCards
            .filter((card) => {

                if (!card.use) return false;

                // 1. 유효기간 만료 체크
                const limitDateStr = card.limit
                    .replace(/년|월/g, "-")
                    .replace(/일/g, "")
                    .trim();
                const limitDate = new Date(limitDateStr);

                // 오늘 날짜가 만료일 이전인 것만 포함
                return today <= limitDate;
            })
            .reduce((acc, cur) => acc + Number(cur.price), 0); // 금액 합산
    };

    const handleAmountChange = (e) => {
        const value = Number(e.target.value.replace(/[^0-9]/g, ""));

        // 잔액보다 큰 금액을 입력하지 못하도록 제한
        if (value > totalBalance) {
            setUseAmount(totalBalance);
        } else {
            setUseAmount(value);
        }
    };

    const totalBalance = getTotalGiftCardBalance(user?.giftCard);
    const [useAmount, setUseAmount] = useState(0);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

    return (
        <div className='benefits-container'>
            <div className='gift-card-section'>
                <MypageTitle title={"기프트 카드"} />
                <div className="card-top-grid">
                    <div className="balance-box">
                        <img src="/images/gift/gift-card6.png" alt="기프트카드" />
                        <div className="balance-info">
                            <span>잔액</span>
                            <span className="amount">{totalBalance.toLocaleString()}원</span>
                        </div>
                    </div>
                    <div className="add-box" onClick={() => setIsGiftModalOpen(true)}>
                        <div className="icon">+</div>
                        <p>기프트카드 등록하기</p>
                    </div>
                </div>
                <div className="info-text">
                    <p>케이스티파이 계정에 기프트 카드 추가 시, 기프트 카드의 전체 금액이 계정 잔액에 추가됩니다.</p>
                    <p>기프트 카드 잔액은 사용 기한이 정해져 있으며, 다른 계정으로 양도하거나 다른 기프트 카드를 구매하는 데 사용할 수 없고, 법에서 요구하는 경우를 제외하고는 현금으로 교환할 수 없습니다. </p>
                    <p>기프트 카드를 사용하여 주문 금액의 일부를 결제하였지만 해당 제품이 아직 배송되지 않은 경우, 새로 추가되는 금액은 해당 주문이 완료된 후에 추가되어 잔액으로 확인하실 수 있습니다. </p>
                    <p>자세한 사항은 <span><Link to="/brand/qna" state={{ activeTab: 'terms' }}>이용약관</Link></span>을 참고해 주세요.</p>
                </div>
            </div>
            <div className='coupon-section'>
                <MypageTitle title={"보유 쿠폰"} />
                <div className="coupon-grid">
                    {validCoupons.length > 0 ? (
                        <>{validCoupons.map(coupon => (
                            <div key={coupon.id} className="coupon-item">
                                <div className="coupon-icon"><img src="/images/mypage/gift/icon-coupon.svg" alt="쿠폰" /></div>
                                <div className="coupon-info">
                                    <p className="title">{coupon.title} <span>{coupon.id !== "birth" ? `${coupon.rate}% 할인` : ""}</span></p>
                                    <span className="date">{coupon.limit}까지</span>
                                </div>
                            </div>
                        ))}</>
                    ) : (
                        <EmptyState icon="%" strong="사용 가능한 쿠폰" title="이 없습니다." desc="진행 중인 이벤트와 혜택을 확인해 보세요." btnText="홈으로 돌아가기" btnLink="/" />
                    )}
                </div>
            </div>
            <GiftCardModal
                isOpen={isGiftModalOpen}
                onClose={() => setIsGiftModalOpen(false)}
            />
        </div>
    )
}
