// components/AnimatedDots.tsx
'use client';
import Image from 'next/image';
import bgLine from './bgLine.png';
import { motion } from 'framer-motion';
import styles from './landing.module.css'; // We'll create this next

export default function VerticalImageScroll() {
    return (
      <div className={styles.wrapper}>
        <motion.div
          className={styles.scrollContainer}
          animate={{ y: ['0%', '-100%'] }}
          transition={{
            duration: 10,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          <Image src={bgLine} alt="bg line" className={styles.image} />
          <Image src={bgLine} alt="bg line" className={styles.image} />
        </motion.div>
      </div>
    );
  }