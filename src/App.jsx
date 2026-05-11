import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import './App.scss'
import Header from './components/Header'
import Footer from './components/Footer'
import Main from './pages/Main'
import { useEffect } from 'react'
import { useProductStore } from './store/useProductStore'
import CategoryPage from './pages/CategoryPage'
import Login from './pages/Login'
import Mypage from './pages/Mypage'
import Join from './pages/Join'
import NaverCallBack from './pages/NaverCallBack'
import JoinMail from './pages/JoinMail'
import JoinComplete from './pages/JoinComplete'
import LoginFind from './pages/LoginFind'
import Cart from './pages/Cart'
import ProductDetailPage from './components/sub/product detail page/ProductDetailPage'
import CustomPage from './pages/custom/CustomPage'
import { useAuthStore } from './store/useAuthStore'
import Payment from './pages/Payment'
import PayComplete from './pages/PayComplete'
import BrandCasetify from './pages/BrandCasetify'
import SearchPage from './pages/SearchPage'
import SearchNavigator from './components/sub/SearchNavigator'
import BrandQna from './pages/BrandQna'
import Store from './pages/Store'
import ProductCustomizePage from './pages/custom/ProductCustomizePage'
import Gift from './pages/Gift'
import BrandAuthentication from './pages/BrandAuthentication'
import PrivateRoute from './components/PrivateRoute'
import Error from './pages/Error'

function App() {
  const { pathname } = useLocation();
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) return;

    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  //매장 지도 페이지 확인 변수
  const isStorePage = pathname === "/brand/store";

  return (
    <>
      <Header />
      <SearchNavigator />
      <Routes>
        <Route path='/' element={<Main />} />

        <Route path='/case/custom' element={<Navigate to="/custom" replace />} />

        <Route path='/:mainCate/:subCate' element={<CategoryPage />} />
        <Route path="/detail/:id" element={<ProductDetailPage />} />

        <Route path='/custom' element={<CustomPage />} />
        <Route path='/custom/studio' element={<ProductCustomizePage />} />

        <Route path='/login' element={<Login />} />
        <Route path='/login/naver' element={<NaverCallBack />} />
        <Route path='/login/find/:content' element={<LoginFind />} />
        <Route path='/join' element={<Join />} />
        <Route path='/join/mail' element={<JoinMail />} />
        <Route path='/join/complete' element={<JoinComplete />} />

        <Route path='/mypage' element={<PrivateRoute><Mypage /></PrivateRoute>} />
        <Route path='/cart' element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path='/payment' element={<PrivateRoute><Payment /></PrivateRoute>} />
        <Route path='/payment/complete' element={<PrivateRoute><PayComplete /></PrivateRoute>} />

        <Route path='/brand/casetify' element={<BrandCasetify />} />
        <Route path='/brand/qna' element={<BrandQna />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/brand/store' element={<Store />} />
        <Route path='/brand/certify' element={<BrandAuthentication />} />

        <Route path="/giftcard" element={<Gift />} />

        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer className={isStorePage ? "no-margin-top" : ""} />
    </>
  )
}

export default App