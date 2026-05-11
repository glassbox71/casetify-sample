import React from 'react'
import { motion } from 'framer-motion';

export default function FadeInSection({ children, direction = "up", delay = 0.3, className = ""}) {
  const variants = {
    hidden: { opacity: 0, y: direction === "up" ? 100 : direction === "down" ? -100 : 0, x: direction === "left" ? 100 : direction === "right" ? -100 : 0 },
    visible: { opacity: 1, y: 0, x: 0 }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}