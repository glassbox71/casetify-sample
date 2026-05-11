import React, { useEffect, useState } from 'react'
import "./scss/Payment.scss"
import { useAuthStore } from '../store/useAuthStore';
import AddressSearch from '../components/sub/AddressSearch'
import { Link, useNavigate } from 'react-router-dom';
import GiftCardModal from '../components/sub/GiftCardModal';
import CircularOverlay from '../components/CircularOverlay';
import { motion, AnimatePresence } from 'framer-motion';
import ToastPopup from '../components/Toastpopup';

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const memoList = [
  "부재 시 문 앞에 놓아주세요",
  "배송 전 미리 연락 바랍니다",
  "벨을 누르지 말고 문자로 남겨주세요",
  "직접 입력"
];

const payMethodCategories = [
  {
    id: 'easy',
    title: '간편결제',
    methods: [
      { id: 'kakaopay', label: '카카오페이' },
      { id: 'naverpay', label: '네이버페이' },
    ],
  },
  {
    id: 'general',
    title: '일반결제',
    methods: [
      { id: 'card', label: '신용/체크 카드' },
      { id: 'transfer', label: '무통장 입금' },
      { id: 'vbank', label: '가상계좌' },
      { id: 'mobile', label: '핸드폰 결제' },
    ],
  },
];

const carriers = ['SKT', 'KT', 'LG U+', '알뜰폰'];

export default function Payment() {
  const navigate = useNavigate();
  const {user, cart, checkedCart, onAddOrder, onFetchCart} = useAuthStore();
  const [cartItemList, setCartItemList] = useState([]);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState('배송 메모를 선택해주세요');
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [customMemo, setCustomMemo] = useState('');
  const [activeCategory, setActiveCategory] = useState('easy'); 
  const [selectedMethod, setSelectedMethod] = useState(''); 
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isPhoneSelectOpen, setIsPhoneSelectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvc: '' });
  const [mobileInfo, setMobileInfo] = useState({ carrier: '', payphone: '' });

  const [toastMsg, setToastMsg] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  const toggleCategory = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const [formData, setFormData] = useState({
    username: user.name,
    phone: user.phone,
    zonecode: user.zonecode,
    address: user.address,
    detailaddress: user.detailaddress
  });

  const [touched, setTouched] = useState({
      username: false, 
      detailaddress: false,
      phone: false
  });

  const [joinErr, setJoinErr] = useState("");
  const [joinAllErr, setJoinAllErr] = useState({
      username: "",
      phone: "",
      zonecode: "",
      address: "",
      detailaddress: ""
  });

  const [phoneErrors, setPhoneErrors] = useState({
      carrier: '', payphone: ''});

  const [cardErrors, setCardErrors] = useState({
      number: '', expiry: '', cvc: '' });

  const handleCarrierSelect = (carrier) => {
    setMobileInfo({ ...mobileInfo, carrier });
    setIsPhoneSelectOpen(false); // 선택 후 닫기

    const error = validatePhone('carrier', carrier);
    setPhoneErrors(prev => ({ ...prev, carrier: error }));
  };

  // 전화번호 입력 핸들러
  const handlePhoneChange = (e) => {
    const { value } = e.target;
    setMobileInfo({ ...mobileInfo, payphone: value });
    
    // 입력 즉시 검증
    const error = validatePhone('payphone', value);
    setPhoneErrors(prev => ({ ...prev, payphone: error }));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    // 상태 업데이트
    setCardInfo(prev => ({ ...prev, [name]: value }));

    // 실시간 검증 실행
    const error = validateCard(name, value);
    setCardErrors(prev => ({ ...prev, [name]: error }));
  };

  // 각각 입력한 input요소를 name속성으로 찾아서 값 변경시키기
  const handleChange = (e)=>{
      const {name, value} = e.target;
      // console.log(name, value);
      setFormData({...formData, [name]:value});

      // 검증 결과 업데이트
      const error = validate(name, value);
      setJoinAllErr(prev => ({ ...prev, [name]: error }));
  }

  const handleBlur = (e) => {
      // 입력창에서 나가는 순간, 해당 필드를 '터치'한 것으로 간주
      setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const setAddressData = (data) => {
    setFormData((prev) => ({
    ...prev,
    zonecode: data.zonecode,
    address: data.address,
    }));
  };

  // 실시간 검증 로직
  const validate = (name, value) => {
      let error = '';
      if (name === 'username') {
          if (!value || value.trim() === '') error = '필수 입력 항목입니다.';
      }
      if (name === 'zonecode'){
          if(!value || value.trim() === '') error = '필수 입력 항목입니다.';
      }
      if (name === 'address'){
          if(!value || value.trim() === '') error = '필수 입력 항목입니다.';
      }
      if (name === 'detailaddress'){
          if(!value || value.trim() === '') error = '필수 입력 항목입니다.';
      }
      if (name === 'phone'){
          const numberRegex = /^[0-9]+$/;
          if(!numberRegex.test(value) || value.includes('-') || !value || value.trim() === '') error = '-없이 숫자만 입력해주세요.';
      }
      return error;
  };

  const validatePhone = (name, value) => {
    let error = '';
    if (name === 'carrier') {
      if (!value || value.trim() === '') error = '통신사를 선택해주세요.';
    }
    if (name === 'payphone') {
      const numberRegex = /^[0-9]+$/;
      if (!value || value.trim() === '' || !numberRegex.test(value) || value.includes('-')) {
        error = '-없이 숫자만 입력해주세요.';
      }
    }
    return error;
  };

  const validateCard = (name, value) => {
    let error = '';

    switch (name) {
      case 'cardNumber':
        // 16자리 숫자 검증
        if (!/^[0-9]{16}$/.test(value)) {
          error = '카드 번호 16자리를 -없이 숫자만 입력해주세요.';
        }
        break;
      case 'cardExpiry':
        // MM/YY 형식 검증 (01~12월 / 00~99년)
        if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) {
          error = '유효기간을 MM/YY 형식으로 입력해주세요.';
        }
        break;
      case 'cardCvc':
        // 3자리 숫자 검증
        if (!/^[0-9]{3}$/.test(value)) {
          error = 'CVC 번호 3자리를 입력해주세요.';
        }
        break;
      default:
        if (!value || value.trim() === '') error = '필수 입력 항목입니다.';
    }
    return error;
  };
  
  // 장바구니 정보 가져오기
  useEffect(()=>{ 
      if (!user) return;
      onFetchCart();

      setFormData({
        username: user.name || "",
        phone: user.phone || "",
        zonecode: user.zonecode || "",
        address: user.address || "",
        detailaddress: user.detailaddress || ""
      });
  }, [user]);

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

  // 선택 제품 총가격 
  const selectedTotal = checkedCart.reduce((acc, cur) =>
    acc + cur.price * cur.quantity, 0);

  // 번들 할인
  // isPhone이 true인 제품이 하나라도 있는지 체크
  const hasPhone = checkedCart.some(item => item.isPhone);
  
  // 2. 할인 금액 계산
  const discount = checkedCart.reduce((acc, item) => {
    // 폰이 포함되어 있고, 현재 아이템이 폰이 아닌 경우에만 10% 할인 적용
    if (hasPhone && !item.isPhone) {
      return acc + (item.price * 0.1);
    }
    return acc;
  }, 0);

  const discountedTotal = selectedTotal - discount;
  
  // 생일 쿠폰 처리
  const isBirthCoupon = selectedCoupon?.id === 'birth';
  
  let birthDiscount = 0;
  if(isBirthCoupon){
    const phoneItems = checkedCart.filter(item => item.isPhone);
    // 가격순으로 내림차순 정렬하여 가장 비싼 제품 추출
    const expensivePhone = [...phoneItems].sort((a, b) => b.price - a.price)[0];
    birthDiscount = expensivePhone.price;
  }

  const couponRate = selectedCoupon ? selectedCoupon.rate : 0;
  const couponDiscount = isBirthCoupon ? birthDiscount : discountedTotal * (couponRate / 100);
  const giftDiscount = useAmount;

  // 총 할인액 합계
  const totalDiscount = discount + couponDiscount + giftDiscount;
  // 최종 결제 금액
  const finalPayment = Math.max(0, selectedTotal - totalDiscount);

  // 배송비 기본 7000원
  const [shipping, setShipping] = useState(7000);
  useEffect(()=>{ 
    if(finalPayment >= 50000){
      setShipping(0);
    }else{
      setShipping(7000)
    }
  }, [finalPayment]);

  const handlePayment = async()=>{

    // 제출 시 최종 검증 (모든 필드에 대해)
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validate(key, formData[key]);
    });
    setJoinAllErr(newErrors);

    if(!selectedMethod){
      setToastMsg("결제 수단을 선택해주세요");
      setToastOpen(true);
      return;
    }

    let cardErrors = {};
    let phoneErrors = {};
  
    if (selectedMethod === 'card') {
      // 카드 정보 검증
      cardErrors.cardNumber = validateCard('cardNumber', cardInfo.cardNumber);
      cardErrors.cardExpiry = validateCard('cardExpiry', cardInfo.cardExpiry);
      cardErrors.cardCvc = validateCard('cardCvc', cardInfo.cardCvc);
    } else if (selectedMethod === 'mobile') {
      // 휴대폰 결제 정보 검증
      phoneErrors.carrier = validatePhone('carrier', mobileInfo.carrier);
      phoneErrors.payphone = validatePhone('payphone', mobileInfo.payphone);
    }

    // 모든 에러 합치기
    const finalErrors = { ...newErrors, ...cardErrors, ...phoneErrors };
    setJoinAllErr(finalErrors); // 에러 상태 업데이트 (UI 출력용)
    setPhoneErrors(phoneErrors);
    setCardErrors(cardErrors);

    const allTouched = {
        username: true,
        detailaddress: true,
        phone: true
    };
    setTouched(allTouched);

    // 에러가 하나도 없는지 확인
    let isFormValid = Object.values(finalErrors).every(err => err === '');

    if(!isFormValid){
        setToastMsg("입력 오류가 있습니다.");
        setToastOpen(true);
        return;
    }

    const easyPayIds = payMethodCategories
        .find(cat => cat.id === 'easy')
        .methods.map(m => m.id);

    // 3. 현재 선택된 수단이 간편결제 목록에 있는지 확인
    if (easyPayIds.includes(selectedMethod)) {
      // 간편결제 모달 오픈
      setIsPayModalOpen(true); 
    }else{
      paymentComplete();
    }
  };

  const paymentComplete = async()=>{
    setIsLoading(true);
    const orderId = Date.now();

    const orderItemsWithStatus = checkedCart.map(item => ({
      ...item,
      status: 0 // 각 상품별 개별 상태
    }));

    // 주문 객체 생성
    const newOrder = {
      orderId: orderId,
      orderItems: orderItemsWithStatus,
      deliveryInfo: formData,
      deliveryMemo: selectedMemo === '직접 입력' ? customMemo : selectedMemo,
      priceSummary: { 
        totalPrice: selectedTotal,
        totalDiscount: totalDiscount, 
        finalPayment: finalPayment,
        coupon: selectedCoupon,
        giftCard: useAmount
      },
      paymentMethod: selectedMethod,
      orderStatus: "배송준비중",
      orderDate: new Date().toLocaleDateString(),
    };

    // 스토어(회원정보/주문내역)에 저장
    const isOrder = await onAddOrder(newOrder); 

    if(isOrder){
      // 완료 페이지로 '아이디'만 넘겨주며 이동
      if(isOrder !== true){
        setTimeout(() => {
          navigate("/payment/complete", { state: { orderId: orderId, grade: isOrder } });
        }, 3000);
      }
      setTimeout(() => {
        navigate("/payment/complete", { state: { orderId: orderId } });
      }, 3000);
    }else{
      alert("결제실패")
    }
  }

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
          {/* 제목 */}
          <h2 className="title">주문/결제</h2>
          {/* 결제 과정 */}
          <ul className="payment-progress-wrap">
            <li className="payment-progress-item">
              <div className="icon-box">
                <img src="./images/cart/cart-bag.svg" alt="장바구니" />
              </div>
              <p>장바구니</p>
            </li>
            <li className="payment-progress-item active">
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
            {/* 배송지 정보 */}
            <div className="cart-title">
              <div className="cart-title-left">
                <p>배송지 정보</p>
              </div>
            </div>
            <div className='gray-box'>
              <div className='user-info-wrap'>
                <div className='input-box'>
                    <div className='label-div'><label htmlFor='username'>받는 분</label></div>
                    <div className='input-div'>
                        <input type="text" id='username' name='username' placeholder='수령인' value={formData.username} onBlur={handleBlur} onChange={handleChange}/>
                        <p className='err-box'>{touched.username && joinAllErr.username}</p>
                    </div>
                </div>
                <div className='input-box'>
                    <div className='label-div'><label htmlFor='phone'>연락처</label></div>
                    <div className='input-div'>
                        <input type="text" id='phone' name='phone' placeholder='-없이 입력' value={formData.phone} onBlur={handleBlur} onChange={handleChange}/>
                        <p className='err-box'>{touched.phone && joinAllErr.phone}</p>
                    </div>
                </div>
                <div className='input-box'>
                    <div className='label-div'><label htmlFor='detailaddress'>주소</label></div>
                    <div className='input-div address-box'>
                        <div className='zonecode-box'>
                            <input value={formData.zonecode} readOnly placeholder="우편번호" />
                            <AddressSearch setAddressData={setAddressData} />
                        </div>
                        <input value={formData.address} readOnly placeholder="기본주소" />
                        <input type="text" id='detailaddress' name='detailaddress' placeholder="상세주소" value={formData.detailaddress} onBlur={handleBlur} onChange={handleChange}/>
                        <p className='err-box'>{touched.detailaddress && joinAllErr.detailaddress || joinAllErr.zonecode || joinAllErr.address}</p>
                    </div>
                </div>
                <div className='input-box'>
                    <div className='label-div'><label>배송 메모</label></div>
                    <div className='input-div'>
                        <div className={`deli-memo ${selectedMemo === '배송 메모를 선택해주세요' ? 'placeholder' : ''}`} onClick={() => setIsMemoOpen(!isMemoOpen)}>
                          {selectedMemo}
                          <span className={`accordion-arrow ${isMemoOpen ? "open" : ""}`}>
                            <svg
                                className="faq-chevron"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </span>
                        </div>
                        {isMemoOpen && (
                          <div className='option-box'>
                            <div onClick={() => {
                                  setSelectedMemo('배송 메모를 선택해주세요');
                                  setIsMemoOpen(false);
                                  setCustomMemo('');
                                }}>--</div>
                            {memoList.map((item, index) => (
                              <div 
                                key={index} 
                                onClick={() => {
                                  setSelectedMemo(item);
                                  setIsMemoOpen(false);
                                  if (item !== '직접 입력') setCustomMemo('');
                                }}
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                </div>
                {/* '직접 입력' 선택 시 나타나는 Input 창 */}
                {selectedMemo === '직접 입력' && (
                  <div className='input-box custom-memo'>
                    <div className='label-div'><label></label></div>
                    <div className="input-div">
                      <input 
                        type="text" 
                        className="custom-memo-input"
                        placeholder="배송 메모를 직접 입력해주세요"
                        value={customMemo}
                        onChange={(e) => setCustomMemo(e.target.value)}
                        maxLength={50}
                        
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* 장바구니 */}
            <div className="cart-title">
              <div className="cart-title-left">
                <p>주문 상품정보</p>
              </div>
            </div>
            <div className='gray-box'>
              <ul className="cart-item-list">
                {checkedCart.map((item, id) => (
                  <li key={`${item.productId}-${item.deviceKey}-${item.color}`} className="cart-item">
                    <div className="cart-card-wrap">
                      <div className="cart-goods-info">
                        <div className="goods-img">
                          <img
                            src={`${item.imgUrl}`}
                            alt={item.title} />
                        </div>
                        <div className="goods-text">
                          <p className="title">{item.title}</p>
                          <div className="goods-detail-product">
                            <p>{item.device}</p>
                            <p>{item.color}</p>
                            <p>{item.quantity}개</p>
                          </div>
                        </div>
                      </div>
                      <div className="cart-goods-count-price">
                        <p className="price"><span>{Number(item.price * item.quantity).toLocaleString()}원</span></p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className='cart-price'>소계 <span>{Number(selectedTotal).toLocaleString()}원</span></div>
            </div>
            {/* 쿠폰/기프트 카드 */}
            <div className="cart-title">
              <div className="cart-title-left">
                <p>쿠폰/기프트 카드</p>
              </div>
            </div>
            <div className='gray-box'>
              <div className='coupon-wrap'>
                <div className='input-box'>
                  <div className='label-div'><label>쿠폰 선택</label></div>
                  <div className='input-div'>
                      <div className={`coupon-div ${!selectedCoupon ? 'placeholder' : ''}`} onClick={() => setIsCouponOpen(!isCouponOpen)}>
                        {selectedCoupon ? selectedCoupon.title : '쿠폰을 선택하세요'}
                        <span className={`accordion-arrow ${isCouponOpen ? "open" : ""}`}>
                          <svg
                              className="faq-chevron"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                          >
                              <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </div>
                      {isCouponOpen && (
                        <div className='option-box'>
                          <div onClick={() => {
                                setSelectedCoupon(null);
                                setIsCouponOpen(false);
                              }}>--</div>
                          {validCoupons?.map((item, index) => (
                            <div className='coupon-select'
                              key={item.id} 
                              onClick={() => {
                                setSelectedCoupon(item);
                                setIsCouponOpen(false);
                              }}
                            >
                              <div>
                                <div className='coupon-title'>{item.title}<span>{item.id !== "birth" ? `${item.rate}% 할인` : ""}</span></div>
                                <div className='limit'>{item.limit}까지</div>
                              </div>
                              <div>사용가능</div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
                <div className='input-box'>
                  <div className='label-div'><label>기프트 카드</label></div>
                  <div><label>잔액: {totalBalance.toLocaleString()}원</label></div>
                  <div className='input-div gift-div'>
                      <div className='gift-selsct'>
                        <div className="input-group">
                          <input 
                            type="text" 
                            value={useAmount.toLocaleString()} 
                            onChange={handleAmountChange}
                            placeholder="사용할 금액 입력"
                          />
                        </div>
                      </div>
                      <button className='add-btn' onClick={() => setUseAmount(totalBalance)}>전액 사용</button>
                      <button className='add-btn' onClick={() => setIsGiftModalOpen(true)}>등록하기</button>
                  </div>
                </div>
              </div>
            </div>
            {/* 결제 수단 선택 */}
            <div className="cart-title">
              <div className="cart-title-left">
                <p>결제 수단</p>
              </div>
            </div>
            <div className="gray-box payment-method-box">
              {payMethodCategories.map((category) => (
                <div key={category.id} className="accordion-section">
                  {/* 아코디언 헤더 */}
                  <div 
                    className={`accordion-header ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.title}
                    <span className={`accordion-arrow ${activeCategory === category.id ? 'open' : ''}`}>
                      <svg
                          className="faq-chevron"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                      >
                          <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </div>

                  {/* 아코디언 내용 (선택된 카테고리일 때만 표시) */}
                  {activeCategory === category.id && (
                    <div className='' style={{ padding: '15px', background: '#f9f9f9' }}>
                      <ul className="payment-method-list" style={{ listStyle: 'none', padding: 0 }}>
                        {category.methods.map((method) => (
                          <li key={method.id}>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              <input 
                                type="radio" 
                                name="paymentMethod" 
                                value={method.id}
                                checked={selectedMethod === method.id}
                                onChange={(e) => setSelectedMethod(e.target.value)}
                                style={{ marginRight: '10px' }}
                              />
                              <span>{method.label}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              {/* 1. 신용카드 선택 시 */}
              {selectedMethod === 'card' && (
                <div className="detail-box card-input">
                  <h4>카드 정보 입력</h4>
                  <div className="input-box">
                    <input 
                      type="text" 
                      name="cardNumber"
                      placeholder="카드 번호 16자리 (- 제외)" 
                      maxLength="16"
                      onChange={handleCardInputChange}
                    />
                    {cardErrors.cardNumber && <p className="error-text">{cardErrors.cardNumber}</p>}
                  </div>
                  
                  <div className="input-group">
                    <div className="input-box">
                      <input 
                        type="text" 
                        name="cardExpiry"
                        placeholder="유효기간 (MM/YY)" 
                        maxLength="5"
                        onChange={handleCardInputChange}
                      />
                      {cardErrors.cardExpiry && <p className="error-text">{cardErrors.cardExpiry}</p>}
                    </div>
                    <div className="input-box">
                      <input 
                        type="password" 
                        name="cardCvc"
                        placeholder="CVC" 
                        maxLength="3"
                        onChange={handleCardInputChange}
                      />
                      {cardErrors.cardCvc && <p className="error-text">{cardErrors.cardCvc}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. 휴대폰 결제 선택 시 */}
              {selectedMethod === 'mobile' && (
                <div className="detail-box mobile-input">
                  <h4>휴대폰 결제 정보</h4>
                  <div className={`custom-select-container ${isPhoneSelectOpen ? 'active' : ''}`}>
                    <div 
                      className="select-selected" 
                      onClick={() => setIsPhoneSelectOpen(!isPhoneSelectOpen)}
                    >
                      {mobileInfo.carrier || "통신사 선택"}
                      <span className="arrow-icon"></span>
                    </div>
                    
                    {isPhoneSelectOpen && (
                      <ul className="select-options">
                        {carriers.map((carrier) => (
                          <li key={carrier} onClick={() => handleCarrierSelect(carrier)}>
                            {carrier}
                          </li>
                        ))}
                      </ul>
                    )}
                    {phoneErrors.carrier && <p className="error-text">{phoneErrors.carrier}</p>}
                  </div>
                  <div className="input-box">
                    <input 
                      type="tel" 
                      className="phone-input"
                      placeholder="휴대폰 번호 (- 제외)" 
                      value={mobileInfo.payphone}
                      maxLength="20"
                      onChange={handlePhoneChange}
                    />                  
                    {phoneErrors.payphone && <p className="error-text">{phoneErrors.payphone}</p>}
                  </div>
                </div>
              )}

              {/* 3. 무통장 입금 등 기타 안내가 필요한 경우 */}
              {selectedMethod === 'vbank' || selectedMethod === 'transfer' ? (
                <div className="detail-box notice-input">
                  <p>결제 완료 후 입금 계좌를 안내해 드립니다.</p>
                </div>
              ) : ("")}
              </div>
          </div>
          {/* 우측 - 주문 컨트롤 */}
          <div className="payment-ctrl-area">
            {/* 장바구니 제목 */}
            <div className="cart-title">
              <p>주문 금액</p>
            </div>
            <div className="price-info-wrap">
              {/* 총 금액 */}
              <div className="price-detail">
                <p className="price-sum">총 금액<span>{Number(selectedTotal).toLocaleString()}원</span></p>
                <p className="price-discount">할인 금액{discount === 0 ? "" : "(번들할인)"}<span>{discount === 0 ? 0 : Number(-discount).toLocaleString()}원</span></p>
                <p className="price-discount">쿠폰 할인<span>{couponDiscount === 0 ? 0 : Number(-couponDiscount).toLocaleString()}원</span></p>
                <p className="price-discount">기프트 카드<span>{useAmount === 0 ? 0 : Number(-giftDiscount).toLocaleString()}원</span></p> 
                <p className="price-delevery">배송비<span>{shipping === 0 ? "무료" : `${Number(shipping).toLocaleString()}원`}</span></p>
              </div>
              <div className="price-total">
                <p className="free-info">50,000원 이상 배송비 무료</p>
                <p className="est-price">최종결제금액
                  <AnimatePresence mode="popLayout">
                    <motion.span
                    key={finalPayment} // 가격이 바뀔 때마다 컴포넌트를 재생성하여 애니메이션 트리거
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    >
                    {shipping === 0 ? Number(finalPayment).toLocaleString() : Number(finalPayment+shipping).toLocaleString()}원
                    </motion.span>
                  </AnimatePresence>
                </p>
              </div>
            </div>
            {/* 주문 버튼 */}
            <div className="order-btn-wrap">
              <p className='err-p'>{joinErr}</p>
              <div><button onClick={()=>handlePayment()} className="order-all">결제하기</button></div>
            </div>
            <div className='agree-div'>
              <p>주문을 완료함으로써,</p>
              <p><span><Link to="/brand/qna" state={{activeTab: 'terms'}}>이용약관</Link></span> 및 <span><Link to="/brand/qna" state={{activeTab: 'privacy'}}>개인정보 처리방침</Link></span>에 동의합니다.</p>
            </div>
          </div>
        </div>
      </div>
      {isPayModalOpen && (
        <div className="payment-modal-overlay">
          <div className="modal-content">
            <div className={selectedMethod === 'kakaopay' ? 'modal-header kakao' : 'modal-header naver'}>
              <img src={selectedMethod === 'kakaopay' ? '/images/icon/payment_kakao-pay.svg' : '/images/icon/payment_naver-pay.svg'} alt="결제방법" />
              <button className="close-btn" onClick={() => setIsPayModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="method-name">
                <p className="price-sum">총 금액<span>{Number(selectedTotal).toLocaleString()}원</span></p>
                <p className="price-discount">할인 금액{discount === 0 ? "" : "(번들할인)"}<span>{discount === 0 ? 0 : Number(-discount).toLocaleString()}원</span></p>
                <p className="price-discount">쿠폰 할인<span>{couponDiscount === 0 ? 0 : Number(-couponDiscount).toLocaleString()}원</span></p>
                <p className="price-discount">기프트 카드<span>{useAmount === 0 ? 0 : Number(-giftDiscount).toLocaleString()}원</span></p>
                <p className="price-delevery">배송비<span>{shipping === 0 ? "무료" : `${Number(shipping).toLocaleString()}원`}</span></p>
              </div>
              <p className="total-amount">
                결제 금액: <span>{Number(finalPayment + shipping).toLocaleString()}원</span>
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-confirm" onClick={() => paymentComplete()}>결제하기</button>
              <button className="btn-cancel" onClick={() => setIsPayModalOpen(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
      <GiftCardModal 
        isOpen={isGiftModalOpen} 
        onClose={() => setIsGiftModalOpen(false)}
      />

      {isLoading ? (
      <CircularOverlay />
      ) : ("")}

    </div>
    <ToastPopup
      isOpen={toastOpen}
      message={toastMsg}
      onClose={() => setToastOpen(false)}
    />
    </motion.div>
  )
}
