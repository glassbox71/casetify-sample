import React from 'react';
import { motion } from 'framer-motion';

// 1. 부모 컨테이너 variants: 자식들의 애니메이션 시점을 제어
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // 자식 요소들이 0.2초 간격으로 차례로 나타남 (계단 효과 핵심)
      staggerChildren: 0.4, 
    },
  },
};

// 2. 개별 자식 요소 variants: 실제 움직임 정의
const itemVariants = {
  hidden: { opacity: 0, y: 50 }, // 초기 상태 (아래에 위치)
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } // 부모의 staggerChildren 설정을 따름
  },
};

// 리스트 전체를 감싸는 부모 컴포넌트
export const StaggerContainer = ({ children, className ='' }) => {
  return (
    <motion.ul
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // 화면 30% 보일 때 실행
      variants={containerVariants}
    >
      {children}
    </motion.ul>
  );
};

// 리스트 내 개별 아이템을 감싸는 컴포넌트
export const StaggerItem = ({ children, className = '', onClick, onMouseEnter }) => {
  return (
    <motion.li variants={itemVariants} className={className} onClick={onClick}
    onMouseEnter={onMouseEnter}>
      {children}
    </motion.li>
  );
};

// 리스트 내 개별 아이템을 감싸는 컴포넌트
export const StaggerItemInsta = ({ children, className = ''}) => {
  return (
    <motion.li variants={itemVariants} className={className}>
      {children}
    </motion.li>
  );
};