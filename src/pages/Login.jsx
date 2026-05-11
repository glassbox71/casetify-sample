import React, { useEffect, useState } from 'react'
import "./scss/Login.scss"
import SectionTitle from '../components/SectionTitle'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { div, img } from 'framer-motion/client';

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loginErr, setLoginErr] = useState("");
    const [rememberEmail, setRememberEmail] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [birthMsg, setBirthMsg] = useState(null);

    const {user, onLogin, onGoogleLogin, onKakaoLogin, onNaverLogin} = useAuthStore();

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    // 로그인하면 첫화면으로 이동하기
    const navigate = useNavigate();

    useEffect(() => {
      const savedEmail = localStorage.getItem('savedEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberEmail(true);
      }
    }, []);

    // 기본 로그인
    const handleSubmit = async(e)=>{
      e.preventDefault();
      console.log("이메일 로그인");

      setBirthMsg(null);
      setLoginErr("");
      setEmailVerified(false);

      if (rememberEmail) {
          // 체크박스가 체크되어 있으면 저장
          localStorage.setItem('savedEmail', email);
        } else {
          // 체크 안 되어 있으면 기존 저장된 값 삭제
          localStorage.removeItem('savedEmail');
      }

      const isLogin = await onLogin(email, password);

      if(isLogin === true){
        // 1. 로그인 성공 가정
        setIsModalOpen(true);

        // 2. 2초 후 홈으로 이동
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }else if(isLogin === "첫로그인"){
        navigate("/join/complete");
      }else if(isLogin === "생일"){
        // 1. 로그인 성공 가정
        setIsModalOpen(true);
        setBirthMsg("생일 축하드립니다! 생일쿠폰이 발급됐습니다.");

        // 2. 2초 후 홈으로 이동
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }else if(isLogin === "첫로그인생일"){
        setIsModalOpen(true);
        setBirthMsg("생일 축하드립니다! 생일쿠폰이 발급됐습니다.");

        // 2. 2초 후 홈으로 이동
        setTimeout(() => {
          navigate("/join/complete");
        }, 2000);
      }else if(isLogin === "메일인증"){
        // console.log("here veri")
        setIsModalOpen(true);
        setEmailVerified(true);
      } else {
        // 실패: 에러 메시지
        setLoginErr("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    }

    // 구글 로그인
    const handleGoogleLogin = async()=>{
      console.log("구글 로그인");
      const isLogin = await onGoogleLogin();

      if(isLogin === true){
        // 1. 로그인 성공 가정
        setIsModalOpen(true);

        // 2. 2초 후 홈으로 이동
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }else if(isLogin === "생일"){
        // 1. 로그인 성공 가정
        setIsModalOpen(true);
        setBirthMsg("생일 축하드립니다! 생일쿠폰이 발급됐습니다.");

        // 2. 2초 후 홈으로 이동
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        // 실패: 에러 메시지
        setLoginErr("구글로그인 실패");
      }
    }

    // 카카오 로그인
    const handleKakaoLogin = async()=>{
      console.log("카카오 로그인");
      const isLogin = await onKakaoLogin();

      if(isLogin === true){
        // 1. 로그인 성공 가정
        setIsModalOpen(true);

        // 2. 2초 후 홈으로 이동
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }else if(isLogin === "생일"){
        // 1. 로그인 성공 가정
        setIsModalOpen(true);
        setBirthMsg("생일 축하드립니다! 생일쿠폰이 발급됐습니다.");

        // 2. 2초 후 홈으로 이동
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        // 실패: 에러 메시지
        setLoginErr("카카오로그인 실패");
      }
    }

    // 네이버 로그인
    const handleNaverLogin = async()=>{
      console.log("네이버 로그인");
      const isLogin = await onNaverLogin();

      if(isLogin === true){
        // 1. 로그인 성공 가정
        setIsModalOpen(true);

        // 2. 2초 후 홈으로 이동
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }else if(isLogin === "생일"){
        // 1. 로그인 성공 가정
        setIsModalOpen(true);
        setBirthMsg("생일 축하드립니다! 생일쿠폰이 발급됐습니다.");

        // 2. 2초 후 홈으로 이동
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        // 실패: 에러 메시지
        setLoginErr("네이버로그인 실패");
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
    <div className='login-wrap'>
      <div className="inner">
        <SectionTitle title={"로그인"} subtitle={""} />
        <form onSubmit={handleSubmit}>
          <div className='input-div'>
              <input type="email" name="email" id='email' required="required" value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="email" placeholder=""/>
              <label htmlFor='email'>이메일</label>
              <span></span>
          </div>
          <div className='input-div'>
              <input type={showPassword ? 'text' : 'password'} name="password" id='password' required="required" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder=""/>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className='eye-btn'
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? (
                  <img src='/images/login/eye-off.png' alt='비밀번호 숨기기'/>
                ) : (
                  <img src='/images/login/eye-open.png' alt='비밀번호 보기'/>
                )}
              </button>
              <label htmlFor='password'>비밀번호</label>
              <span></span>
          </div>
          <div className="login-check">
              <input type="checkbox" id="login-idcheck" className="login-idcheck screen-reader" checked={rememberEmail} onChange={(e) => setRememberEmail(e.target.checked)}/>
              <div className="label-box">
                  <span className="check-icon" aria-hidden="true"></span>
                  <label htmlFor="login-idcheck">아이디 저장</label>
              </div>
          </div>
          <div>
            <p>아이디 : yelota3643@pertok.com</p>
            <p>비밀번호 : ezen123456</p>
          </div>
          <div className='err-box'>
            <p>{loginErr}</p>
            <button className='input-btn'>로그인하기</button>
          </div>
        </form>
        <div className='login-option'>
          <div><Link to="/login/find/id">아이디 찾기</Link></div>
          <div><Link to="/login/find/pass">비밀번호 찾기</Link></div>
          <div><Link to="/join">회원가입</Link></div>
        </div>
        <p className='or-line'>또는</p>
        <div className='login-sns-box'>
          <p>간편로그인으로 1초 회원가입</p>
          <div className='login-sns'>
            <button onClick={handleGoogleLogin}><img src="/images/login/sns_btn_google.png" alt="google login" /></button>
            <button onClick={handleKakaoLogin}><img src="/images/login/sns_btn_kakao.png" alt="kakao login" /></button>
            <button onClick={handleNaverLogin}><img src="/images/login/sns_btn_naver.png" alt="naver login" /></button>
          </div>
        </div>
        <div className="banner-item">
            <img src="/images/login/ad-bg.png" alt="casetify 광고" />
            <div className="text-box">
                <p className="text1">당신의 개성을 맘껏 펼쳐보세요</p>
                <p className="text2">케이스티파이로 표현하는 독창성있는</p>
                <p className='text2'>나만의 디자인</p>
            </div>
        </div>
        {isModalOpen && (
          <div className='modal-wrap'>
            <div className="modal-overlay">
              <div className="modal-content">
                {emailVerified ? 
                  (<><p>인증 이메일이 재발송되었습니다.</p>
                  <p>계정을 활성화하려면 인증 이메일을 확인해주세요.</p>
                  <button className='input-btn' onClick={() => setIsModalOpen(false)}>닫기</button></>)
                :
                  (<><p>안녕하세요, {user !== null ? user.name || user.email || '게스트' : '게스트'} 님!</p>
                  {birthMsg !== null ? (<><p>{birthMsg}</p><p>곧 이동합니다...</p></>) : (<p>곧 홈으로 이동합니다...</p>)}
                  </>)
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </motion.div>
  )
}
