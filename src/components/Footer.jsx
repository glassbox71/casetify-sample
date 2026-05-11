import React, { useEffect, useState } from 'react'
import "./scss/Footer.scss"
import { Link, useNavigate } from 'react-router-dom'
import RecentAside from './RecentAside';

export default function Footer({ className }) {
  const [topBtn, setTopBtn] = useState(false);
  const navigate = useNavigate();

  const handleToTop = () => {
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  // 윈도우 스크롤 이벤트 + 스크롤 위치 체크
  useEffect(() => {
    const handleTopbtn = () => {
      // 스크롤의 위치가 830px 넘어가면 isScrolled → true 반환
      setTopBtn(window.scrollY > 830);
    }
    window.addEventListener("scroll", handleTopbtn)

    // 처음 값 체크
    handleTopbtn();
    return () => window.removeEventListener("scroll", handleTopbtn);
  }, []);

  const handleToCustom = () => {
    navigate("/custom");
  }

  return (
    <>
      <footer className={className || ""}>
        <div className="inner">
          <div className="footer-left">
            <div className="app-info-wrap">
              <div className="casetify-15th-anniversary">
                <img src="/images/header-footer/casetify-15th-icon.png" alt="casetify-15th-icon" />
                <span>CASETIFY: 15 for 15<br />15년의 여정</span>
              </div>
              <div className="sns-list-wrap">
                <p>케이스티파이를 팔로우 해주세요!</p>
                <ul className="sns-list">
                  <li><a href="https://www.instagram.com/casetify_kr/" target='_blank'><img src="/images/header-footer/sns_instagram.png" alt="인스타그램" /></a></li>
                  <li><a href="https://www.facebook.com/casetify" target='_blank'><img src="/images/header-footer/sns_facebook.png" alt="페이스북" /></a></li>
                  <li><a href="https://twitter.com/casetify" target='_blank'><img src="/images/header-footer/sns_twitter.png" alt="인스타그램" /></a></li>
                  <li><a href="https://www.pinterest.com/casetify/" target='_blank'><img src="/images/header-footer/sns_pinterest.png" alt="핀터레스트" /></a></li>
                  <li><a href="https://www.tiktok.com/@casetify?lang=en" target='_blank'><img src="/images/header-footer/sns_tiktok.png" alt="틱톡" /></a></li>
                </ul>
              </div>
            </div>
            <div className="app-info-wrap">
              <div className="mobile-app-colab">
                <img src="/images/app-icon-colab.png" alt="App-Colab" />
                <div className="text-area">
                  <span>CASETiFY Colab</span>
                  <p>독점 콜라보제품 구매하기</p>
                </div>
                <ul className="app-store-bedge">
                  <li><a href='https://casetify.onelink.me/x0vh?af_js_web=true&af_ss_ver=2_10_0&pid=null&af_ss_ui=true&af_ss_gtm_ui=true' target='_blank'><img src="/images/header-footer/badge_getapp_apple.svg" alt="애플스토어" /></a></li>
                </ul>
              </div>
              <div className="mobile-app">
                <img src="/images/app-icon.png" alt="App-Offical" />
                <div className="text-area">
                  <span>CASETiFY</span>
                  <p>나만의 커스텀 케이스 만들기</p>
                </div>
                <ul className="app-store-bedge">
                  <li><a href='https://casetify.onelink.me/x0vh?af_js_web=true&af_ss_ver=2_10_0&pid=null&af_ss_ui=true&af_ss_gtm_ui=true' target='_blank'><img src="/images/header-footer/badge_getapp_apple.svg" alt="애플스토어" /></a></li>
                  <li><a href='https://play.google.com/store/apps/details?id=com.casetagram.casetagram&pt=1616560&ct=casetify_club_landing&mt=8' target='_blank'><img src="/images/header-footer/badge_getapp_google.svg" alt="구글스토어" /></a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-right">
            <div className="company-info">
              <p className="title">회사소개</p>
              <ul className="info-list">
                <li>케이스티파이 : 케이스타그램 리미티드(Casetify: Casetagram Limited)</li>
                <li>케이스티파이 유한회사 (CASETiFY)</li>
                <li>대표: 응푸이순 웨슬리 (Wesley Ng)</li>
                <li>사업자등록번호: 580-88-02026</li>
                <li>통신판매업 신고번호: 제 2021-서울강남-03049 호</li>
                <li>주소: 서울 강남구 영동대로 616 아남빌딩 2층, 케이스티파이</li>
              </ul>
              <ul className="payment">
                <li><img src="/images/icon/payment_visa.svg" alt="결제수단:VISA" /></li>
                <li><img src="/images/icon/payment_mastercard.svg" alt="결제수단:Master Card" /></li>
                <li><img src="/images/icon/payment_AMEX.svg" alt="결제수단:AMEX" /></li>
                <li><img src="/images/icon/payment_apple-pay.svg" alt="결제수단:Apple Pay" /></li>
                <li><img src="/images/icon/payment_kakao-pay.svg" alt="결제수단:카카오페이" /></li>
                <li><img src="/images/icon/payment_naver-pay.svg" alt="결제수단:네이버페이" /></li>
              </ul>
              <p className="remark"><Link to="/brand/qna" state={{ activeTab: 'privacy' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span>개인정보처리방침</span></Link>
                <Link to="/brand/qna" state={{ activeTab: 'terms' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span>약관</span></Link></p>
              <p className='copy'>Copyright © 2026 CASETiFY</p>
            </div>
            <div className="cs-info">
              <p className="title">CS Center</p>
              <ul className="contact-list info-list">
                <li><a href="mailto:hello@casetify.com">hello@casetify.com</a></li>
                <li><a href="tel:1833-6292">1833-6292</a></li>
                <li>토요일, 일요일, 공휴일 휴무</li>
              </ul>
              <ul className="cs-menu-list info-list">
                <li><Link to="/brand/qna#inquiry">문의하기</Link></li>
                <li><Link to="/brand/qna" state={{ activeTab: 'all' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>FAQs</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-title">Show Your Colors CASETiFY</div>
      </footer>
      <div className={topBtn ? "top-btn active" : "top-btn"} onClick={handleToTop}>
        <img src="/images/icon/icon-top-btn.svg" alt="top" />
        <p>TOP</p>
      </div>
      <RecentAside />
      <div className="aside-custom-btn" onClick={handleToCustom}>
        <div>
          <img src="/images/asideCustom.png" alt="custom" />
          <p>커스텀하기</p>
        </div>
      </div>
    </>
  )
}