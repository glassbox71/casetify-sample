import React, { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore';
import { div } from 'framer-motion/client';
import { has2DTranslate, motion } from 'framer-motion';

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const methodMap = {
    card: "신용/체크 카드",
    transfer: "무통장 입금",
    vbank: "가상계좌",
    mobile: "핸드폰 결제",
    kakaopay: "카카오페이",
    naverpay: "네이버페이"
};

const gradeList = [
    {key: "bronze", label: "브론즈", rate: 15},
    {key: "silver", label: "실버", rate: 20},
    {key: "gold", label: "골드", rate: 30}
]

export default function PayComplete() {
    const location = useLocation();
    const { orderId, grade } = location.state || {};
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const navigate = useNavigate();

    // 스토어에서 주문 내역 가져오기
    const {orderList} = useAuthStore();
    
    // 내역 중 아이디가 일치하는 주문 찾기
    const currentOrder = orderList.find(order => order.orderId === orderId);


    // 만약 데이터가 없으면 예외 처리
    if (!currentOrder) {
        // replace: true는 뒤로가기 했을 때 다시 이 빈 페이지로 오지 않게 기록을 덮어씁니다.
        return <Navigate to="/error" replace />;
    }

    const hasGiftItem = currentOrder.orderItems.some(item => item.caseCategory === "gift");
    console.log(hasGiftItem)
    if (hasGiftItem) {
        setIsGiftModalOpen(true);
    }

    let gradeMsg = "";
    if(grade && grade !== ""){
        gradeMsg = gradeList.filter(g => g.key === grade)[0];
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // 오늘 날짜 + 1일
    
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1); // 월은 0부터 시작하므로 +1
    const dd = String(tomorrow.getDate());
    
    const tomorrowDate = `${yyyy}. ${mm}. ${dd}`;

    return (
        <motion.div
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
        >
            <div className="sub-page-wrap pay-page-wrap">
                {/* 페이지 상단 제목 */}
                <div className="inner">
                    {/* 상단 제목, 결제 과정 표시 영역 */}
                    <div className="title-wrap">
                        {/* 결제 과정 */}
                        <ul className="payment-progress-wrap">
                            <li className="payment-progress-item">
                                <div className="icon-box">
                                    <img src="/images/cart/cart-bag.svg" alt="장바구니" />
                                </div>
                                <p>장바구니</p>
                            </li>
                            <li className="payment-progress-item">
                                <div className="icon-box">
                                    <img src="/images/cart/bank-card.svg" alt="주문/결제" />
                                </div>
                                <p>주문/결제</p>
                            </li>
                            <li className="payment-progress-item active">
                                <div className="icon-box">
                                    <img src="/images/cart/order_completed.svg" alt="장바구니" />
                                </div>
                                <p>주문완료</p>
                            </li>
                        </ul>
                    </div>
                    <div className="complete-msg">
                        <span className='coupon'>주문이 완료 되었습니다</span>
                        <p>{gradeMsg !== "" ? `${gradeMsg?.label}등급 승급! ${gradeMsg?.rate}% 쿠폰이 발급됐습니다.` : ""}</p>
                        <p>{currentOrder.orderDate} 주문하신 상품의</p>
                        <p>주문번호는 {orderId}입니다.</p>

                        <div className='complete-details'>
                            {/* 배송지 정보 */}
                            <div>
                                <h3>배송지 정보</h3>
                                <div className='detail-row'>
                                    <span className='detail-title'>받는 분</span>
                                    <span>{currentOrder.deliveryInfo.username}</span>
                                </div>
                                <div className='detail-row'>
                                    <span className='detail-title'>연락처</span>
                                    <span>{currentOrder.deliveryInfo.phone}</span>
                                </div>
                                <div className='detail-row'>
                                    <span className='detail-title'>주소</span>
                                    <span>{currentOrder.deliveryInfo.address + currentOrder.deliveryInfo.detailaddress}</span>
                                </div>
                                <div className='detail-row'>
                                    <span className='detail-title'>배송 메모</span>
                                    <span>{currentOrder.deliveryMemo === '배송 메모를 선택해주세요' ? "없음" : currentOrder.deliveryMemo}</span>
                                </div>
                            </div>

                            {/* 결제 정보 */}
                            <div className='detail-section'>
                                <h3>결제 정보</h3>
                                <div className='detail-row'>
                                    <span className='detail-title'>결제 방법</span>
                                    <span>{methodMap[currentOrder.paymentMethod] || currentOrder.paymentMethod}</span>
                                </div>
                                <div className='detail-row final'>
                                    <span className='detail-title'>결제 금액</span>
                                    <span className='final-price'>{currentOrder.priceSummary.finalPayment.toLocaleString()}원</span>
                                </div>
                            </div>
                            {currentOrder.paymentMethod === "transfer" || currentOrder.paymentMethod === 'vbank' ? 
                            (<div className='detail-section'>
                                <h3>{methodMap[currentOrder.paymentMethod]}안내</h3>
                                <div className='detail-row'>
                                    <span className='detail-title'>입금 계좌</span>
                                    <span>이젠은행 0000-000-0000000 CASETIFY</span>
                                </div>
                                <div className='detail-row'>
                                    <span className='detail-title'>입금 기한</span>
                                    <span>{tomorrowDate}</span>
                                </div>
                            </div>
                            ) : ("")}
                        </div>
                        <Link to="/mypage" state={{ menu: "주문" }}><button className='input-btn'>주문 내역 보기</button></Link>
                    </div>
                </div>
                {isGiftModalOpen && (
                <div className="giftcom-modal-overlay">
                    {/* stopPropagation은 클릭 시 모달이 닫히지 않게 방지 */}
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="icon-wrapper">
                            <img src="/images/cart/paper-plane.svg" alt="기프트카드 전송완료" />
                        </div>

                        <h2 className="modal-title">
                            기프트카드 전송이<br />완료되었습니다!!
                        </h2>

                        <button className="close-button" onClick={()=>setIsGiftModalOpen(false)}>
                            닫기
                        </button>
                    </div>
                </div>
                )}
            </div>
        </motion.div>
    )
}
