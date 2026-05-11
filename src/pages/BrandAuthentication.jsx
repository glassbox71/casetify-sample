import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { AUTH_FAQS } from '../data/authFaqs'
import './scss/BrandAuthentication.scss'
import { motion } from 'framer-motion'
import ConfirmModal from '../components/ConfirmModal'
import ToastPopup from '../components/Toastpopup'

const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export default function BrandAuthentication() {
    const navigate = useNavigate()
    const { onAuthenticate, onFetchOrder, user } = useAuthStore()

    const [serialNumber, setSerialNumber] = useState('')
    const [openFaqId, setOpenFaqId] = useState(null)
    const [popup, setPopup] = useState(null)
    // popup: null | 'success' | 'already' | 'fail' | 'error'
    const [loginToastOpen, setLoginToastOpen] = useState(false)

    const handleAuthenticate = async () => {
        if (!serialNumber.trim()) return
        const result = await onAuthenticate(serialNumber)
        // 로그인 필요 → 토스트 후 로그인 페이지 이동
        if (result === 'login') {
            setLoginToastOpen(true)
            setTimeout(() => {
                setLoginToastOpen(false)
                navigate('/login')
            }, 1500)
            return
        }
        setPopup(result)
    }

    useEffect(() => {
        if (!user) return;
        onFetchOrder();
    }, [user]);

    const closePopup = () => setPopup(null)

    return (
        <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
        >
            <div className="brand-auth-page">

                {/* 히어로 배너 */}
                <div className="auth-hero">
                    <img src="/images/brand/auth-hero.png" alt="정품인증" />
                    <div className="auth-hero-text">
                        <p className="auth-hero-sub">AUTHENTIC PRODUCT</p>
                        <h2>정품인증</h2>
                        <div className="auth-hero-line" />
                        <p>정품인증을 통해서 보호하고 혜택을 즐기세요</p>
                    </div>
                </div>

                {/* 인증방법 */}
                <section className="auth-steps-section">
                    <h2 className="auth-section-title">인증방법</h2>
                    <div className="auth-steps">
                        <div className="auth-step-card">
                            <div className="auth-step-icon">
                                <img src="/images/brand/auth-step1.png" alt="일련번호 등록" />
                            </div>
                            <p>01: 제품의 일렬번호를 등록해주세요</p>
                        </div>
                        <div className="auth-step-card">
                            <div className="auth-step-icon">
                                <img src="/images/brand/auth-step2.png" alt="정품인증 확인" />
                            </div>
                            <p>02: 제품의 정품인증을 확인해보세요</p>
                        </div>
                        <div className="auth-step-card">
                            <div className="auth-step-icon">
                                <img src="/images/brand/auth-step3.png" alt="쿠폰 받기" />
                            </div>
                            <p>03: 인증 완료 후 쿠폰을 받으세요</p>
                        </div>
                    </div>
                </section>

                {/* 일련번호 입력 */}
                <section className="auth-input-section">
                    <div className="auth-input-wrap">
                        <input
                            type="text"
                            className="auth-serial-input"
                            placeholder="일련 번호를 입력"
                            value={serialNumber}
                            onChange={e => setSerialNumber(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAuthenticate()}
                        />
                        <button className="auth-submit-btn" onClick={handleAuthenticate}>
                            제품 인증 하기
                        </button>
                    </div>
                    <div className='text-center'>CTF-37711774-16010003</div>
                </section>

                {/* FAQ */}
                <section className="faq-section">
                    <div className="faq-inner">
                        <h2 className="section-heading">자주 묻는 질문(FAQ)</h2>
                        <div className="faq-accordion">
                            {AUTH_FAQS.map(faq => (
                                <div
                                    key={faq.id}
                                    className={`faq-item ${openFaqId === faq.id ? 'open' : ''}`}
                                >
                                    <button
                                        className="faq-question"
                                        onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                                    >
                                        <span>{faq.q}</span>
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
                                    </button>
                                    {openFaqId === faq.id && (
                                        <div className="faq-answer">
                                            {faq.a.split('\n\n').map((para, i) => (
                                                <p key={i}>{para}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 팝업: 로그인 필요 → ToastPopup으로 처리 */}
                <ToastPopup
                    isOpen={loginToastOpen}
                    message="로그인 후 정품인증을 진행해주세요."
                    onClose={() => setLoginToastOpen(false)}
                    duration={1500}
                />

                {/* 팝업: 인증 성공 + 쿠폰 발급 */}
                <ConfirmModal
                    isOpen={popup === 'success'}
                    message={'정품인증이 완료되었습니다! 🎉\n정품인증 감사 쿠폰 10%가 발급되었습니다.\n마이페이지에서 확인해보세요.'}
                    onClose={closePopup}
                    buttons={[
                        { label: '마이페이지 이동', onClick: () => { sessionStorage.setItem('mypageTab', '기프트 카드/쿠폰'); navigate('/mypage'); closePopup(); } },
                        { label: '계속 인증하기', onClick: () => { closePopup(); setSerialNumber('') }, variant: 'secondary' },
                    ]}
                />

                {/* 팝업: 이미 인증함 */}
                <ConfirmModal
                    isOpen={popup === 'already'}
                    message={'이미 정품인증 쿠폰을 받으셨습니다.\n마이페이지에서 쿠폰을 확인해주세요.'}
                    onClose={closePopup}
                    buttons={[
                        { label: '마이페이지 이동', onClick: () => { closePopup(); navigate('/mypage') } },
                        { label: '닫기', onClick: closePopup, variant: 'secondary' },
                    ]}
                />

                {/* 팝업: 인증 실패 */}
                <ConfirmModal
                    isOpen={popup === 'fail'}
                    message={'일련번호를 확인해주세요.\n입력하신 번호와 일치하는 제품을 찾을 수 없습니다.'}
                    onClose={closePopup}
                    buttons={[
                        { label: '닫기', onClick: closePopup },
                    ]}
                />

                {/* 팝업: 오류 */}
                <ConfirmModal
                    isOpen={popup === 'error'}
                    message={'일시적인 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.'}
                    onClose={closePopup}
                    buttons={[
                        { label: '닫기', onClick: closePopup },
                    ]}
                />
            </div>
        </motion.div>
    )
}