import React from 'react'
import { motion } from 'framer-motion';

export default function SlideInSection({ children, direction = "left", delay = 0, className = "" }) {
    // 방향에 따른 초기 x 위치 설정
    const initialX = direction === "left" ? -100 : 100;

    const variants = {
        hidden: { 
        opacity: 0, 
        x: initialX // 왼쪽(-100px) 또는 오른쪽(100px)에서 시작
        },
        visible: { 
        opacity: 1, 
        x: 0, // 제자리로 이동
        transition: { 
            duration: 0.8, 
            delay: delay, // 필요에 따라 지연 시간 설정
            ease: "easeOut" 
        }
        },
    };

    return (
        <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // 화면 30% 보일 때 실행
        variants={variants}
        style={{ overflow: 'hidden' }} // 슬라이드 시 가로 스크롤바 방지
        >
        {children}
        </motion.div>
    );
}
