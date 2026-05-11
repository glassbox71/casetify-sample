import React, { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal';
import ToastPopup from '../Toastpopup';

const methodMap = {
  card: "신용/체크 카드",
  transfer: "무통장 입금",
  vbank: "가상계좌",
  mobile: "핸드폰 결제",
  kakaopay: "카카오페이",
  naverpay: "네이버페이"
};

const STATUS_MAP = {
  1: { text: "취소중", className: "cancel-ing" },
  2: { text: "취소완료", className: "cancel-done" },
  3: { text: "교환/반품중", className: "return-ing" },
  4: { text: "교환/반품완료", className: "return-done" },
};

const reasonOptions = ["단순 변심", "상품 불량/파손", "배송 오배송", "사이즈/옵션 잘못 선택", "기타"];

export default function OrderDetailModal({ order, onClose, initialAllChecked }) {
  // 데이터가 없을 경우 방어 코드
  if (!order) return null;

  // 1. 초기 체크 상태 설정
  // initialAllChecked가 true면 모든 아이템 인덱스를 넣고, 아니면 빈 배열
  const [checkedItems, setCheckedItems] = useState(() => {
    if (initialAllChecked) {
      return order.orderItems.map((_, idx) => idx);
    }
    return [];
  });

  // 배경 클릭 시 닫히게 하는 핸들러
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 체크박스 핸들러
  const handleCheck = (idx) => {
    if (checkedItems.includes(idx)) {
      setCheckedItems(checkedItems.filter(item => item !== idx));
    } else {
      setCheckedItems([...checkedItems, idx]);
    }
  };

  // 신청을 진행 중인 주문 데이터
  const [applyingOrder, setApplyingOrder] = useState(null);
  // 신청 폼 상태
  const [claimForm, setClaimForm] = useState({
    type: '', // '반품' 또는 '교환'
    reason: '' // 선택된 사유
  });
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("교환");
  const [selectedReason, setSelectedReason] = useState("사유를 선택해주세요");

  // 팝업 상태
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState('');
  const [confirmCallback, setConfirmCallback] = useState(null);

  const showToast = (msg) => { setToastMsg(msg); setToastOpen(true); };
  const showConfirm = (msg, callback) => { setConfirmMsg(msg); setConfirmCallback(() => callback); setConfirmOpen(true); };


  const onUpdateItemStatus = useAuthStore((state) => state.onUpdateItemStatus);

  const isCancelable = order.orderStatus === '배송준비중';

  const handleStatusChange = async () => {
    if (checkedItems.length === 0) {
      showToast("상품을 선택해주세요.");
      return;
    }

    const msg = isCancelable
      ? "선택한 상품을 취소하시겠습니까?"
      : "선택한 상품의 반품/교환을 신청하시겠습니까?";

    showConfirm(msg, async () => {
      const success = await onUpdateItemStatus(order.orderId, checkedItems, isCancelable);
      if (success) {
        setCheckedItems([]);
        onClose();
      }
    });
  };

  const handleSubmitClaim = async () => {
    if (!selectedType) { showToast("처리 유형(반품/교환)을 선택해주세요."); return; }
    if (selectedReason === "사유를 선택해주세요") { showToast("사유를 선택해주세요."); return; }

    showConfirm(`선택한 상품의 [${selectedType}]을 신청하시겠습니까?`, async () => {
      const success = await onUpdateItemStatus(
        order.orderId,
        checkedItems,
        isCancelable,
        { type: selectedType, reason: selectedReason }
      );
      if (success) {
        setCheckedItems([]);
        onClose();
      }
    });
  };

  const orderDate = new Date(order.orderDate.replace(/\. /g, '-'));

  // 2. 하루 더하기
  orderDate.setDate(orderDate.getDate() + 1);

  // 3. 포맷팅 (yyyy.mm.dd)
  const yyyy = orderDate.getFullYear();
  const mm = String(orderDate.getMonth() + 1);
  const dd = String(orderDate.getDate());

  const tomorrowDate = `${yyyy}. ${mm}. ${dd}`;
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {/* 헤더: 타이틀 & 닫기 버튼 */}
        <div className="modal-header">
          <h2>주문정보 상세</h2>
          <button className="close-btn" onClick={onClose}>
            &times; {/* X 아이콘 */}
          </button>
        </div>

        {/* 바디: 상세 내용 */}
        <div className="modal-body">
          {/* 1. 배송 및 구매자 정보 */}
          <section className="info-section customer-info">
            <div className="info-row">
              <span className="label">주문날짜</span>
              <span className="value">{order.orderDate.replace(/\.\s*$/, "")}</span>
            </div>
            <div className="info-row">
              <span className="label">주문번호</span>
              <span className="value">{order.orderId}</span>
            </div>
            <div className="info-row">
              <span className="label">받는 분</span>
              <span className="value">{order.deliveryInfo.username}</span>
            </div>
            <div className="info-row">
              <span className="label">연락처</span>
              <span className="value">{order.deliveryInfo.phone}</span>
            </div>
            <div className="info-row">
              <span className="label">주소</span>
              <span className="value">{order.deliveryInfo.zonecode + " " + order.deliveryInfo.address + order.deliveryInfo.detailaddress}</span>
            </div>
            <div className="info-row">
              <span className="label">배송 메모</span>
              <span className="value">{order.deliveryMemo === '배송 메모를 선택해주세요' ? "없음" : order.deliveryMemo || '없음'}</span>
            </div>
            <div className="info-row">
              <span className="label">주문 상태</span>
              <span className="value">{order.orderStatus}</span>
            </div>
          </section>

          {/* 2. 상품 리스트 영역 */}
          <section className="product-list-section">
            <div className="product-header">
              <div className="col-check">선택</div>
              <div className="col-name">상품명/옵션</div>
              <div className="col-price">가격/수량</div>
            </div>

            <div className="product-items">
              {order.orderItems.map((item, idx) => {
                const statusInfo = STATUS_MAP[item.status];
                return (
                  <div className={`product-item ${item.status ? 'has-status' : ''}`} key={idx}>
                    <div className="col-check">
                      {statusInfo ? (
                        // 상태 코드가 (1,2,3,4) 있으면 텍스트 표시
                        <span className={`status-badge ${statusInfo.className}`}>
                          {statusInfo.text}
                        </span>
                      ) : (
                        // 상태 코드가 없거나 0이면 체크박스 표시
                        <input
                          type="checkbox"
                          checked={checkedItems.includes(idx)}
                          onChange={() => handleCheck(idx)}
                        />
                      )}
                    </div>
                    <div className="col-name item-info">
                      <img src={item.imgUrl} alt={item.title} />
                      <div className="item-txt">
                        <p className="title">{item.title}</p>
                        <p className="option">{item.device && <span>{item.device}</span>}{item.color && <span>{item.color}</span>}</p>
                      </div>
                    </div>
                    <div className="col-price item-price-qty">
                      <p className="price">
                        {item.price.toLocaleString()}
                        {item.title.includes('OPANCHU') ? 'W' : '원'} {/* 이미지 맞춤 */}
                      </p>
                      <p className="qty">{item.quantity}개</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 3. 결제 및 금액 상세 */}
          <section className="info-section payment-info">
            <div className="info-row">
              <span className="label">결제방법</span>
              <span className="value">{methodMap[order.paymentMethod] || order.paymentMethod}</span>
            </div>
            {order.paymentMethod === "transfer" || order.paymentMethod === 'vbank' ?
              (<>
                <div className="info-row">
                  <span className="label">입금계좌</span>
                  <span className="value">이젠은행 0000-000-0000000 CASETIFY</span>
                </div>
                <div className="info-row">
                  <span className="label">입금기한</span>
                  <span className="value">{tomorrowDate}</span>
                </div>
              </>
              ) : ("")}
            <div className="info-row">
              <span className="label">쿠폰</span>
              <span className="value">{order.priceSummary.coupon ? order.priceSummary.coupon.title : '없음'}</span>
            </div>
            <div className="info-row">
              <span className="label">기프트카드</span>
              <span className="value">{order.priceSummary.giftCard ? `${order.priceSummary.giftCard.toLocaleString()}원` : '없음'}</span>
            </div>
            <div className="info-row">
              <span className="label">할인</span>
              <span className="value">
                {order.priceSummary.totalDiscount > 0 ? `-${order.priceSummary.totalDiscount.toLocaleString()}원` : '없음'}
              </span>
            </div>
            <div className="info-row total">
              <span className="label">총 금액</span>
              <span className="value final-price">{order.priceSummary.finalPayment.toLocaleString()}원</span>
            </div>
          </section>

          {checkedItems.length > 0 && (
            <div className="order-action-area">
              {isCancelable ? (
                <button className="action-btn cancel" onClick={handleStatusChange}>선택상품 주문취소</button>
              ) : (
                <>
                  <div className="claim-form-container">
                    {/* 1. 신청 유형 선택 */}
                    <div className="casetify-dropdown">
                      <button
                        className={`dropdown-label ${isTypeOpen ? 'active' : ''}`}
                        onClick={() => { setIsTypeOpen(!isTypeOpen); setIsReasonOpen(false); }}
                      >
                        {selectedType}
                        <span className="arrow">{isTypeOpen ? '▲' : '▼'}</span>
                      </button>
                      {isTypeOpen && (
                        <ul className="dropdown-list">
                          {["교환", "반품"].map((opt) => (
                            <li key={opt} onClick={() => {
                              setSelectedType(opt);
                              setClaimForm(prev => ({ ...prev, type: opt })); // 폼 업데이트
                              setIsTypeOpen(false);
                            }}>
                              {opt}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* 2. 사유 선택 */}
                    <div className="casetify-dropdown reason-select">
                      <button
                        className={`dropdown-label white-version ${isReasonOpen ? 'active' : ''}`}
                        onClick={() => { setIsReasonOpen(!isReasonOpen); setIsTypeOpen(false); }}
                      >
                        {selectedReason}
                        <span className="arrow">{isReasonOpen ? '▲' : '▼'}</span>
                      </button>
                      {isReasonOpen && (
                        <ul className="dropdown-list">
                          {reasonOptions.map((opt) => (
                            <li key={opt} onClick={() => {
                              setSelectedReason(opt);
                              setClaimForm(prev => ({ ...prev, reason: opt })); // 폼 업데이트
                              setIsReasonOpen(false);
                            }}>
                              {opt}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <button className="action-btn return" onClick={handleSubmitClaim}>선택상품 반품/교환 신청</button>
                </>
              )}
            </div>
          )}
          {/* 4. 하단 버튼 */}
          <div className="modal-footer">
            <Link to='/brand/qna' state={{ activeTab: 'order' }}><button className="faq-btn">주문배송 F&Q</button></Link>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={confirmOpen}
        message={confirmMsg}
        onClose={() => setConfirmOpen(false)}
        buttons={[
          { label: '취소', onClick: () => setConfirmOpen(false), variant: 'secondary' },
          { label: '확인', onClick: () => { setConfirmOpen(false); confirmCallback && confirmCallback(); } },
        ]}
      />
      <ToastPopup
        isOpen={toastOpen}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />
    </div>
  )
}