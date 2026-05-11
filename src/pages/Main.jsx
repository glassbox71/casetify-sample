import React from 'react'
import Studio from '../components/main/Studio'
import Quality from '../components/main/Quality'
import NewArrival from '../components/main/NewArrival'
import BestProduct from '../components/main/BestProduct'
import Custom from '../components/main/Custom'
import MainTravel from '../components/main/Travel'
import Instagram from '../components/main/Instagram'
import MainSlider from '../components/main/MainSlider'
import Collab from '../components/main/Collab'
import Popup from '../components/main/Popup'
import { motion } from 'framer-motion';

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Main() {
  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
    <div className='main-wrap'>
        <Popup />
        <MainSlider />
        <BestProduct />
        <Collab />
        <NewArrival />
        <MainTravel />
        <Custom />
        <Instagram />
        <Studio />
        <Quality />
    </div>
    </motion.div>
  )
}
