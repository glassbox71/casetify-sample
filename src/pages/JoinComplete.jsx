import React from 'react'
import "./scss/Login.scss"
import SectionTitle from '../components/SectionTitle'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion';

const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export default function JoinMail() {
    return (
    <motion.div
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
    >
    <div className='login-wrap join-wrap join-complete-wrap'>
        <div className="inner">
            <SectionTitle title={"회원가입"} subtitle={""}/>
            <ul className="join-progress">
                <li>
                    <div><img src="/images/icon/join-60.svg" alt="정보입력 약관동의" /></div>
                    <span>정보입력 • 약관동의</span>
                </li>
                <li>
                    <div><img src="/images/icon/user-60.svg" alt="본인인증" /></div>
                    <span>본인인증</span>
                </li>
                <li className='active'>
                    <div><img src="/images/icon/login-60.svg" alt="회원가입 완료" /></div>
                    <span>회원가입 완료</span>
                </li>
            </ul>
            <div className="complete-msg join-complete">
                <span className='coupon'>15% 할인쿠폰이 발급되었습니다</span>
                <p>환영합니다!</p>
                <p>케이스티파이 가입이 완료되었습니다</p>
                <Link to="/"><button className='input-btn'>홈으로 이동하기</button></Link>
            </div>
            <span className='case1'><img src="/images/login/joincomplete2.png" alt="phone" /></span>
            <span className='case2'><img src="/images/login/joincomplete1.png" alt="phone" /></span>
        </div>
    </div>
    </motion.div>
    )
}
