import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './scss/UnauthorizedPage.scss';

const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export default function Error() {
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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="invalid-access-icon">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>

                    <p className="unauthorized-code">INVALID ACCESS</p>
                    <h1 className="unauthorized-title">올바른 접속이 아닙니다</h1>
                    <p className="unauthorized-desc">
                        필요한 정보가 없거나 잘못된 접근입니다.<br />
                        정상적인 경로를 통해 다시 접속해 주세요.
                    </p>

                    <div className="unauthorized-btn-wrap">
                        <button
                            className="btn-home"
                            onClick={() => navigate('/')}
                        >
                            홈으로 돌아가기
                        </button>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}
