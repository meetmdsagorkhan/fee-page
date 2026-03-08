'use client';

import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface MotionWrapperProps extends MotionProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  viewport?: boolean;
  once?: boolean;
  amount?: number;
}

// Animation variants
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export const slideDownVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0 }
};

export const slideLeftVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 }
};

export const slideRightVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 }
};

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

type AnimationType = 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'stagger';

const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  as = 'div',
  className = '',
  viewport = true,
  once = true,
  amount = 0.3,
  variants = fadeInVariants,
  ...motionProps
}) => {
  const MotionComponent = motion[as as keyof typeof motion];

  const defaultProps = {
    className,
    variants,
    initial: 'hidden',
    ...(viewport && {
      whileInView: 'visible',
      viewport: { once, amount }
    }),
    ...(!viewport && {
      animate: 'visible'
    }),
    transition: { duration: 0.6, ease: 'easeOut' },
    ...motionProps
  };

  return <MotionComponent {...defaultProps}>{children}</MotionComponent>;
};

export default MotionWrapper;
