import React, { useState } from 'react'
import "./scss/Gift.scss"
import Benefit from '../components/Benefit'
import { Link, useNavigate } from 'react-router-dom'
import GiftCardModal from '../components/sub/GiftCardModal'
import { useAuthStore } from '../store/useAuthStore'
import ActionPopup from '../components/sub/product detail page/ActionPopup'
import { motion } from 'framer-motion';
import { FAQ_LIST } from '../data/QnaData';
import ToastPopup from '../components/Toastpopup';
import CategoryHero from '../components/sub/CategoryHero'

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const designs = [
  { id: 1, src: "./images/gift/gift-card1.png" },
  { id: 2, src: "./images/gift/gift-card2.png" },
  { id: 3, src: "./images/gift/gift-card3.png" },
  { id: 4, src: "./images/gift/gift-card4.png" },
  { id: 5, src: "./images/gift/gift-card5.png" },
  { id: 6, src: "./images/gift/gift-card6.png" },
]

const amounts = [20000, 50000, 80000, 100000, 150000, 200000]

// QnaData에서 gift 카테고리 FAQ만 필터링 (상위 6개)
const faqList = FAQ_LIST
  .filter(f => f.category === 'gift')
  .slice(0, 6)
  .map(f => ({ q: f.question, a: f.answer }))

export default function Gift() {
  const [selectedDesign, setSelectedDesign] = useState(designs[0])
  const [selectedAmount, setSelectedAmount] = useState(amounts[0])
  const [openIndex, setOpenIndex] = useState(null)
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { onAddToCart, user } = useAuthStore()

  const [popupOpen, setPopupOpen] = useState(false)
  const [popupMsg, setPopupMsg] = useState('')
  const [popupError, setPopupError] = useState(false)
  const [loginToastOpen, setLoginToastOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('');

  const [errors, setErrors] = useState({})
  const [toName, setToName] = useState('')
  const [toEmail, setToEmail] = useState('')
  const [fromName, setFromName] = useState('')
  const [fromEmail, setFromEmail] = useState('')

  const handleAddToCart = async () => {
    const newErrors = {}
    if (!toName) newErrors.toName = '받는 분 성함을 입력해주세요.'
    if (!toEmail) newErrors.toEmail = '받는 분 이메일 주소를 입력해주세요.'
    if (!fromName) newErrors.fromName = '보내는 분 성함을 입력해주세요.'
    if (!fromEmail) newErrors.fromEmail = '보내는 분 이메일 주소를 입력해주세요.'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0){
      setToastMsg("입력 오류가 있습니다.")
      setLoginToastOpen(true)
      return
    } 

    const giftProduct = {
      id: `gift-${selectedDesign.id}-${selectedAmount}`,
      productName: `디지털 기프트 카드 (${selectedAmount.toLocaleString()}원)`,
      price: selectedAmount,
      imgUrl: selectedDesign.src,
      device: '',
      deviceKey: '',
      color: '',
      colorList: [],
      deviceList: [],
      isPhone: false,
      isWish: true,
      deviceBrand: '-',
      caseCategory: 'gift',
      toName,
      toEmail,
      fromName,
      fromEmail,
    }

    const result = await onAddToCart(giftProduct)
    if (result) {
      setPopupMsg('장바구니에 담겼습니다!')
      setPopupError(false)
      setPopupOpen(true)
    } else {
      // 로그인 안 된 경우 → 토스트 표시 후 로그인 페이지 이동
      setToastMsg("로그인 후 이용 가능합니다.")
      setLoginToastOpen(true)
      setTimeout(() => {
        setLoginToastOpen(false)
        navigate('/login')
      }, 1500)
    }
  }

  const handleGiftModal = ()=>{
    if(!user){
      setToastMsg("로그인 후 이용 가능합니다.")
      setLoginToastOpen(true)
      setTimeout(() => {
        setLoginToastOpen(false)
        navigate('/login')
      }, 1500)
    }else{
      setIsModalOpen(true);
    }
  }

  return (
    <>
      <motion.div
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
      >
        <div className="giftcard-page">
          <CategoryHero
              mainCate={"casetify"}
              subCate={"giftcard"}
              mainCateKo={"디지털 기프트 카드"}
              subCateKo={"디지털 기프트 카드"}
          />
          {/* <div className='sub-page-wrap'>
            <div className='gift-title'>
              <h2>디지털 기프트 카드</h2>
              <p>한 장의 카드로 전하는 무궁무진한 선물!</p>
            </div>
          </div> */}

          <div className='banner-wrap'>
            <div className="gift-card-wrap">
              <div className="gift-card-info instant">
                <p>즉시 사용 가능</p>
                <img src="./images/gift/giftcard-instant.png" alt="" />
                <p>기프트 카드는 받는 분의 이메일로 바로 전달됩니다 <br />
                  웹사이트와 매장에서 사용 가능합니다</p>
              </div>
              <div className="gift-card-info custom">
                <p>커스텀 디자인</p>
                <img src="./images/gift/giftcard-custom.png" alt="" />
                <p>마음을 담은 메시지를 작성하고, <br />
                  다양한 디자인을 더해 특별한 선물을 완성해 보세요.</p>
              </div>
              <div className="gift-card-info register">
                <p>이미 기프트 카드를 보유하고 계시나요?</p>
                <button onClick={() => handleGiftModal()}>
                  기프트 카드 등록하기
                </button>
              </div>
            </div>
          </div>

          <div className="gift-purchase-wrap">
            <div className="gift-purchase-left">
              <div className="gift-thumbnail-wrap">
                <img src={selectedDesign.src} alt="선택된 기프트카드" />
                {selectedAmount && (
                  <span className="gift-amount-badge">
                    {selectedAmount.toLocaleString()}원
                  </span>
                )}
              </div>
              <div className="gift-design-select">
                <p>기프트 카드 디자인</p>
                <div className="gift-design-list">
                  {designs.map((design) => (
                    <div
                      key={design.id}
                      className={`gift-design-item ${selectedDesign.id === design.id ? 'active' : ''}`}
                      onClick={() => setSelectedDesign(design)}
                    >
                      <img src={design.src} alt="" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="gift-amount-select">
                <p>금액 선택하기</p>
                <div className="gift-amount-list">
                  {amounts.map((amount) => (
                    <button
                      key={amount}
                      className={`gift-amount-btn ${selectedAmount === amount ? 'active' : ''}`}
                      onClick={() => setSelectedAmount(amount)}
                    >
                      {amount.toLocaleString()}원
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="gift-purchase-right">
              <div className="gift-form">
                <p className="gift-form-label">To</p>
                <div className="gift-input-wrap">
                  <input type="text" placeholder="받는 분 성함" value={toName} onChange={(e) => {
                    setToName(e.target.value)
                    if (errors.toName) setErrors(prev => ({ ...prev, toName: '' }))
                  }} />
                  {errors.toName && <p className="gift-form-error">{errors.toName}</p>}
                </div>
                <div className="gift-input-wrap">
                  <input type="email" placeholder="받는 분 이메일 주소" value={toEmail} onChange={(e) => {
                    setToEmail(e.target.value)
                    if (errors.toEmail) setErrors(prev => ({ ...prev, toEmail: '' }))
                  }} />
                  {errors.toEmail && <p className="gift-form-error">{errors.toEmail}</p>}
                </div>

                <p className="gift-form-label">From</p>
                <div className="gift-input-wrap">
                  <input type="text" placeholder="보내는 분 성함" value={fromName} onChange={(e) => {
                    setFromName(e.target.value)
                    if (errors.fromName) setErrors(prev => ({ ...prev, fromName: '' }))
                  }} />
                  {errors.fromName && <p className="gift-form-error">{errors.fromName}</p>}
                </div>
                <div className="gift-input-wrap">
                  <input type="email" placeholder="보내는 분 이메일 주소" value={fromEmail} onChange={(e) => {
                    setFromEmail(e.target.value)
                    if (errors.fromEmail) setErrors(prev => ({ ...prev, fromEmail: '' }))
                  }} />
                  {errors.fromEmail && <p className="gift-form-error">{errors.fromEmail}</p>}
                </div>

                <p className="gift-form-label">메시지 (옵션)</p>
                <textarea placeholder="특별한 선물을 준비해 봤어요! 마음에 들었으면 좋겠네요." maxLength={160} />

                <button className="gift-cart-btn" onClick={handleAddToCart}>
                  <img src="/images/icon/btn_shopping-cart.svg" alt="" />
                  장바구니에 담기
                </button>
              </div>
            </div>
          </div>

          <div className="gift-notice-wrap">
            <p className="gift-notice-title">Please Note:</p>
            <ul>
              <li>해당 제품은 케이스티파이 보증 프로그램과 10일 이내 무조건 반품 및 교환 정책에서 제외됩니다.</li>
              <li>기프트 카드는 다른 통화를 사용하는 지역에서 사용할 수 없습니다.</li>
              <li>환불 불가</li>
              <li>현금으로 환급 불가</li>
              <li>기프트 카드 구매 시, 프로모션 코드나 할인 코드를 적용해 구매할 수 없습니다.</li>
              <li>자세한 내용은 이용약관을 확인해 주세요.</li>
            </ul>
          </div>

          <div className="gift-faq-wrap">
            <h2>자주 묻는 질문(FAQ)</h2>
            <div className="faq-list">
              {faqList.map((item, idx) => (
                <div key={idx} className={`faq-item ${openIndex === idx ? 'open' : ''}`}>
                  <div className="faq-question" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                    <span className='faq-text'>{item.q}</span>
                    <span className="faq-arrow">
                      {openIndex === idx
                        ? <svg className="faq-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                        : <svg className="faq-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      }
                    </span>
                  </div>
                  <div className="faq-answer-wrap">
                    <div className="faq-answer">{item.a}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="gift-faq-more">
              <Link to="/brand/qna" state={{ activeTab: 'gift' }}><button>더 알아보기</button></Link>
            </div>
          </div>

          <GiftCardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          <ActionPopup
            isOpen={popupOpen}
            message={popupMsg}
            isError={popupError}
            type="cart"
            onClose={() => setPopupOpen(false)}
          />
          <ToastPopup
            isOpen={loginToastOpen}
            message={toastMsg}
            onClose={() => setLoginToastOpen(false)}
            duration={1500}
          />
          <Benefit />
        </div>
      </motion.div>
    </>
  )
}