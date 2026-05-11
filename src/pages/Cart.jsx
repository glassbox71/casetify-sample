import React, { useEffect, useState } from 'react'
import "./scss/Cart.scss"
import { useAuthStore } from '../store/useAuthStore';
import { modelColorOptions, colorMap, phoneModelOptions } from '../data/finalData';
import CartOption from '../components/sub/CartOption';
import { Link, useNavigate } from 'react-router-dom';
import BundleRecommend from '../components/sub/product detail page/Recommend';
import { li } from 'framer-motion/client';
import EmptyState from '../components/sub/EmptyState'
import ToastPopup from '../components/Toastpopup';
import { motion, AnimatePresence } from "framer-motion";

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// 추천상품용
const tempRecoItem = { id: "CTF-34942803-16006188" }

export default function Cart() {
  const navigate = useNavigate();
  const { user, cart, onUpdateCheckedCart, onFetchCart, onRemoveSelected, onClearCart, updateQuantity } = useAuthStore();
  const [cartItemList, setCartItemList] = useState([]);
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 체크박스 선택 확인
  const [chekedItems, setCheckedItems] = useState([]);
  const [toastMsg, setToastMsg] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const getItemKey = (item) => `${item.productId}-${item.deviceKey}-${item.color}`;
  // 체크박스 실행 메서드
  const handleChecked = (item) => {
    const key = getItemKey(item);
    setCheckedItems((prev) => {
      if (prev.includes(key)) {
        return prev.filter((v) => v !== key);
      } else {
        return [...prev, key];
      }
    });
  };
  // 전체 체크 메서드
  const handleAllChecked = (e) => {
    if (e.target.checked) {
      const allKeys = cart.map((item) => getItemKey(item));
      setCheckedItems(allKeys);
    } else {
      setCheckedItems([]);
    }
  };

  const handleUpdateQty = (index, delta, item) => {
    // 수량이 1 미만으로 내려가지 않도록 방어 로직
    if (item.quantity + delta < 1) return;
    updateQuantity(index, delta);
  };

  // 장바구니 정보 가져오기
  useEffect(() => {
    if (!user) return;
    onFetchCart();
  }, [user]);

  // 선택 제품
  const selectedItems = cart.filter((item) => chekedItems.includes(getItemKey(item)));
  // 선택 제품 총가격 
  const selectedTotal = selectedItems.reduce((acc, cur) =>
    acc + cur.price * cur.quantity, 0);

  // 번들 할인
  // isPhone이 true인 제품이 하나라도 있는지 체크
  const hasPhone = selectedItems.some(item => item.isPhone);

  // 2. 할인 금액 계산
  const discount = selectedItems.reduce((acc, item) => {
    // 폰이 포함되어 있고, 현재 아이템이 폰이 아닌 경우에만 10% 할인 적용
    if (hasPhone && !item.isPhone && item.price < 300000) {
      return acc + (item.price * 0.1);
    }
    return acc;
  }, 0);

  // 최종 결제 금액
  const finalPayment = Math.max(0, selectedTotal - discount);

  // 배송비 기본 7000원
  const [shipping, setShipping] = useState(7000);
  useEffect(() => {
    if (finalPayment >= 50000) {
      setShipping(0);
    } else {
      setShipping(7000)
    }
  }, [finalPayment]);

  const handleRemoveCart = () => {
    onRemoveSelected(selectedItems);
    setCheckedItems([]);
  }

  const handleCheckedOrder = () => {
    if (chekedItems.length === 0) {
      setToastMsg("주문할 상품을 선택해주세요.");
      setToastOpen(true);
      return;
    }

    // 현재 체크된 상품 객체들만 추출
    const orderData = cart.filter(item =>
      chekedItems.includes(`${item.productId}-${item.deviceKey}-${item.color}`)
    );

    // 스토어의 checkedCart에 저장
    onUpdateCheckedCart(orderData);

    // 결제 페이지로 이동
    navigate("/payment");
  };

  const handleAllOrder = () => {
    // 스토어의 checkedCart에 저장
    onUpdateCheckedCart(cart);

    // 결제 페이지로 이동
    navigate("/payment");
  };

  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <div className="sub-page-wrap cart-page-wrap">
        {/* 페이지 상단 제목 */}
        <div className="inner">
          {/* 상단 제목, 결제 과정 표시 영역 */}
          <div className="title-wrap">
            {/* 제목 */}
            <h2 className="title">장바구니</h2>
            {/* 결제 과정 */}
            <ul className="payment-progress-wrap">
              <li className="payment-progress-item active">
                <div className="icon-box">
                  <img src="./images/cart/cart-bag.svg" alt="장바구니" />
                </div>
                <p>장바구니</p>
              </li>
              <li className="payment-progress-item">
                <div className="icon-box">
                  <img src="./images/cart/bank-card.svg" alt="주문/결제" />
                </div>
                <p>주문/결제</p>
              </li>
              <li className="payment-progress-item">
                <div className="icon-box">
                  <img src="./images/cart/order_completed.svg" alt="장바구니" />
                </div>
                <p>주문완료</p>
              </li>
            </ul>
          </div>
          {/* 장바구니 상품 리스트 영역 */}
          <div className="cart-list-wrap">
            {/* 좌측 - 장바구니 목록 */}
            <div className="cart-list-area">
              {/* 장바구니 제목 */}
              <div className="cart-title">
                <div className="cart-title-left">
                  <label className="checkbox-label">
                    <input type="checkbox"
                      checked={cart.length > 0 && chekedItems.length === cart.length}
                      onChange={handleAllChecked} />
                    <span className={`checkbox-icon ${cart.length > 0 && chekedItems.length === cart.length ? "on" : "off"}`}></span>
                  </label>
                  <p>상품정보</p>
                </div>
                <div className="cart-title-right">
                  <p>수량</p>
                  <p>가격</p>
                </div>
              </div>
              {/* 장바구니 제품 목록 */}
              <ul className="cart-item-list">
                {cart.length > 0 ? (
                  <>
                    {cart.map((item, index) => {
                      const itemKey = getItemKey(item);
                      const isChecked = chekedItems.includes(itemKey);
                      const hasGiftCustomItem = item.caseCategory === "gift" || item.caseCategory === "custom";
                      return (
                        <li key={itemKey} className="cart-item">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleChecked(item)}
                            />
                            <span className={`checkbox-icon ${isChecked ? "on" : "off"}`}></span>
                          </label>
                          <div className="cart-card-wrap">
                            <div className="cart-goods-info">
                              <div className="goods-img">
                                {!hasGiftCustomItem ? 
                                <Link to={`/detail/${item.productId}`}>
                                  <img
                                    src={`${item.imgUrl}`}
                                    alt={item.title} />
                                </Link>
                                :
                                <a>
                                  <img
                                  src={`${item.imgUrl}`}
                                  alt={item.title} />
                                </a>}
                              </div>
                              <div className="goods-text">
                                <p className="title">{item.title}</p>
                                <div className="goods-detail-product">
                                  <p>{item.device}</p>
                                  <p>{item.color}</p>
                                </div>
                                {(!item.isWish && (item.device || item.color)) ?
                                  (<button onClick={() => setEditingItem(item)}>옵션변경</button>) : (<p> </p>)}
                              </div>
                            </div>
                            <div className="cart-goods-count-price">
                              <div className="cart-count-ctrl">
                                <button onClick={() => handleUpdateQty(index, -1, item)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleUpdateQty(index, 1, item)}>+</button>
                              </div>
                              <p className="price"><span>{(item.price * item.quantity).toLocaleString()}원</span></p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </>
                ) : (
                  <li>
                    <EmptyState icon="🛒" strong="장바구니" title="가 비어 있습니다." desc="마음에 드는 상품을 담아보세요." btnText="쇼핑하러 가기" btnLink="/case/device" />
                  </li>
                )}
              </ul>
              {editingItem && (
                <CartOption item={editingItem} colorMap={colorMap} phoneModelOptions={phoneModelOptions} onClose={() => setEditingItem(null)} />
              )}
              {/* 체크박스 취소 버튼 */}
              <div className="cart-cancel-btn-wrap">
                <button onClick={() => handleRemoveCart()}>선택 상품 삭제</button>
                <button onClick={() => onClearCart()}>전체 상품 삭제</button>
              </div>
            </div>
            {/* 우측 - 주문 컨트롤 */}
            <div className="payment-ctrl-area">
              {/* 장바구니 제목 */}
              <div className="cart-title">
                <p>주문 예상 금액</p>
              </div>
              <div className="price-info-wrap">
                {/* 총 금액 */}
                <div className="price-detail">
                  <p className="price-sum">총 금액<span>{Number(selectedTotal).toLocaleString()}원</span></p>
                  <p className="price-discount">할인 금액<span>{discount === 0 ? 0 : Number(-discount).toLocaleString()}원</span></p>
                  <p className="price-delevery">배송비<span>{shipping === 0 ? "무료" : `${Number(shipping).toLocaleString()}원`}</span></p>
                </div>
                <div className="price-total">
                  <p className="free-info">50,000원 이상 배송비 무료</p>
                  <p className="est-price">결제예정금액
                    <AnimatePresence mode="popLayout">
                    <motion.span
                    key={finalPayment} // 가격이 바뀔 때마다 컴포넌트를 재생성하여 애니메이션 트리거
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    >
                    {shipping === 0 ? Number(finalPayment).toLocaleString() : Number(finalPayment + shipping).toLocaleString()}원
                    </motion.span></AnimatePresence>
                  </p>
                </div>
              </div>
              {/* 주문 버튼 */}
              <ul className="order-btn-wrap">
                <li><button className="order-all" onClick={() => handleAllOrder()}>전체 상품 주문</button></li>
                <li><button onClick={() => handleCheckedOrder()}>선택 상품 주문</button></li>
              </ul>
            </div>
          </div>
          {/* 추천상품 */}
          <div className="recommend-wrap">
            <BundleRecommend item={tempRecoItem} />
          </div>
        </div>
      </div>
      <ToastPopup
        isOpen={toastOpen}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />
    </motion.div>
  )
}