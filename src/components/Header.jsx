import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useProductStore } from '../store/useProductStore';
import "../components/scss/Header.scss"
import { useMainSlider } from '../store/useMainSlider';
import { useAuthStore } from '../store/useAuthStore';
import SearchOverlay from './SearchOverlay';
import ToastPopup from './Toastpopup';
import CircularOverlay from './CircularOverlay';

export default function Header() {
  const { mainMenuList, isSearchOpen, onToggleSearch, onCloseSearch } = useProductStore();
  const { user, onLogout, cart, onFetchCart } = useAuthStore();
  const [MenuActive, setMenuActive] = useState(null);
  const [loginToastOpen, setLoginToastOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // 스크롤 체크 변수
  const [isScrolled, setIsScrolled] = useState(false);
  // 현재 위치 체크 함수 hook useLocation()
  const location = useLocation();
  const isHome = location.pathname === "/";

  //헤더글자색 변경
  const { headerColor, setHeaderColor } = useMainSlider();

  let leaveTimeout;

  const handleMouseEnter = (link) => {
    clearTimeout(leaveTimeout);
    setMenuActive(link);
  };

  const handleMouseLeave = () => {
    leaveTimeout = setTimeout(() => {
      setMenuActive(null);
    }, 50); // 0.05초 정도의 유예를 줌
  };

  // 장바구니 정보 가져오기
  useEffect(() => {
    if (!user) return;
    onFetchCart();
  }, [user]);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      setHeaderColor("#2f2f2f");
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const handleLogout = async () => {
    setIsLoading(true);
    const isLogout = await onLogout();
    

    if (isLogout) {
      navigate("/");
      setTimeout(()=>{
        setIsLoading(false);
      }, 1500);
    }
  }

  const handleProtectedClick = (e) => {
    if (!user) {
      e.preventDefault();
      setLoginToastOpen(true);
      setTimeout(() => {
        setLoginToastOpen(false);
        navigate('/login');
      }, 1500);
    }
  };

  return (
    <>
      <header className={`${isScrolled || MenuActive !== null ? "active" : ""} ${headerColor}`}>
        <div className="header-left">
          <h1 className="logo"><Link to="/"><img src="/images/casetify-logo-15th.png" alt="casetify" /></Link></h1>
          <nav>
            <ul className="main-menu">
              {mainMenuList.map(menu => (
                <li key={menu.link} onMouseEnter={() => setMenuActive(menu.link)} onMouseLeave={() => setMenuActive(null)}>
                  {menu.sub?.length > 0 ? (
                    <>
                      <span className="main-menu-label">{menu.name}</span>
                      <ul className={`sub-menu ${MenuActive === menu.link ? 'active' : ''}`}>
                        {menu.sub.map((s) => (
                          <li key={s.link}>
                            <Link to={`/${menu.link}/${s.link}`} onClick={() => setMenuActive(null)}>
                              <div>
                                <span><img src={`/images/header-footer/menu/${menu.link}-${s.link}.png`} alt={s.name} /></span>
                                <span>{s.name}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link to={`/${menu.link}`}>{menu.name}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="header-right">
          <ul className="gnb-list">
            <li>
              <Link className={`search-icon ${isSearchOpen ? "active" : ""}`} onClick={onToggleSearch} ><img src={isSearchOpen ? "/images/icon/close-24dp.svg" : "/images/icon/search_var.svg"} alt={isSearchOpen ? "검색닫기" : "검색"} /></Link>
            </li>
            {user ? (
              <>
                <li onMouseEnter={() => setMenuActive("gnb")} onMouseLeave={() => setMenuActive(null)}>
                  <a className='mypage-icon'><img src="/images/icon/user.svg" alt="내정보" /></a>
                  <ul className={`user-menu ${MenuActive === "gnb" ? "active" : ""}`}>
                    <li>
                      <Link to="/mypage" state={{ menu: "회원정보" }}>회원정보</Link>
                    </li>
                    <li>
                      <Link to="/mypage" state={{ menu: "주문" }}>주문</Link>
                    </li>
                    <li>
                      <Link to="/brand/certify">정품인증</Link>
                    </li>
                    <li>
                      <Link to="/mypage" state={{ menu: "기프트 카드/쿠폰" }}>기프트카드</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className='logout-icon' onClick={handleLogout}><img src="/images/icon/logout.svg" alt="로그아웃" /></a>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className='user-icon'><img src="/images/icon/user.svg" alt="로그인" /></Link>
              </li>
            )}
            <li>
              <Link to="/cart" onClick={(e) => handleProtectedClick(e)}><img src="/images/icon/btn_shopping-cart.svg" alt="장바구니" /><span className='cart-num'>{cart.length}</span></Link>
            </li>
            <li>
              <Link to="/mypage" state={{ menu: "위시리스트" }} onClick={(e) => handleProtectedClick(e)}><img src="/images/icon/icon_favorite.svg" alt="위시리스트" /></Link>
            </li>
          </ul>
        </div>
      </header>
      <SearchOverlay isActive={isSearchOpen} onClose={onCloseSearch} />
      {isLoading ? (
      <CircularOverlay />
      ) : ("")}
      <ToastPopup
        isOpen={loginToastOpen}
        message="로그인 후 이용 가능합니다."
        onClose={() => setLoginToastOpen(false)}
        duration={1500}
      />
    </>
  )
}