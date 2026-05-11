import React from 'react'
import CircularText from '../components/CircularText';
import { AnimatePresence, motion } from 'framer-motion';
import './scss/CircularText.scss';

export default function CircularOverlay() {
  return (
    <div className="loader-container">
      <AnimatePresence mode="wait">
        {/* // 로딩 중일 때 보여줄 화면 */}
        <motion.div 
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='loader-motion'
        >
            <CircularText 
                text="CASETiFY*CASETiFY*CASETiFY*" 
                spinDuration={8} 
                className="casetify-loader"
            />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
