import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './scss/UnauthorizedPage.scss';

const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export default function UnauthorizedPage() {
    const navigate = useNavigate();

    return (
        <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
        >
            <div className="unauthorized-page">
                <div className="unauthorized-inner">

                    <div className="unauthorized-icon-wrap">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="unauthorized-lock-icon">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>

                    <p className="unauthorized-code">403</p>
                    <h1 className="unauthorized-title">로그인이 필요한 페이지예요</h1>
                    <p className="unauthorized-desc">
                        이 페이지는 로그인 후 이용할 수 있어요.<br />
                        로그인하고 다시 시도해 주세요.
                    </p>

                    <div className="unauthorized-btn-wrap">
                        <button
                            className="btn-login"
                            onClick={() => navigate('/login')}
                        >
                            로그인하기
                        </button>
                        <button
                            className="btn-home"
                            onClick={() => navigate('/')}
                        >
                            홈으로 돌아가기
                        </button>
                    </div>

                    <p className="unauthorized-join">
                        아직 계정이 없으신가요?&nbsp;
                        <span onClick={() => navigate('/join')}>회원가입</span>
                    </p>

                </div>
            </div>
        </motion.div>
    );
}
