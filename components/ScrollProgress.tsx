'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Section {
  id: string;
  label: string;
}

interface ScrollProgressProps {
  sections: Section[];
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      observerRef.current?.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observerRef.current?.unobserve(section);
      });
    };
  }, []);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
    >
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200">
          <motion.div
            className="absolute top-0 left-0 w-full bg-[#E61C5D] origin-top"
            style={{ height: `${scrollProgress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Section Dots */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const isActive = activeSection === section.id;
            const sectionProgress = sections.indexOf(section) / (sections.length - 1);
            const hasPassed = scrollProgress >= sectionProgress * 100;

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Dot */}
                <motion.button
                  onClick={() => scrollToSection(section.id)}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-[#E61C5D] border-[#E61C5D] shadow-lg shadow-[#E61C5D]/25'
                      : hasPassed
                      ? 'bg-white border-[#E61C5D]'
                      : 'bg-white border-slate-300 hover:border-[#E61C5D]/50'
                  `}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute inset-0 rounded-full bg-[#E61C5D] animate-ping"
                      />
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Label */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: isActive || hasPassed ? 1 : 0,
                    x: isActive || hasPassed ? 0 : -10
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap"
                >
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    isActive ? 'text-[#E61C5D]' : hasPassed ? 'text-slate-700' : 'text-slate-500'
                  }`}>
                    {section.label}
                  </span>
                </motion.div>

                {/* Hover Tooltip */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-12 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10"
                >
                  {section.label}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Scroll Percentage */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute -bottom-16 left-0 text-xs text-slate-500 font-medium"
        >
          {Math.round(scrollProgress)}%
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScrollProgress;
