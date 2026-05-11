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
    <div className='login-wrap join-wrap'>
        <div className="inner">
            <SectionTitle title={"회원가입"} subtitle={""}/>
            <ul className="join-progress">
                <li>
                    <div><img src="/images/icon/join-60.svg" alt="정보입력 약관동의" /></div>
                    <span>정보입력 • 약관동의</span>
                </li>
                <li className='active'>
                    <div><img src="/images/icon/user-60.svg" alt="본인인증" /></div>
                    <span>본인인증</span>
                </li>
                <li>
                    <div><img src="/images/icon/login-60.svg" alt="회원가입 완료" /></div>
                    <span>회원가입 완료</span>
                </li>
            </ul>
            <div className="complete-msg">
                <p>이메일로 메일이 발송되었습니다</p>
                <p>메일함을 확인하여 회원가입을 완료하세요</p>
                <Link to="/login"><button className='input-btn'>로그인으로 이동하기</button></Link>
            </div>
        </div>
    </div>
    </motion.div>
  )
}
