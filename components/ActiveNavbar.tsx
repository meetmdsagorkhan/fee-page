'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface ActiveNavbarProps {
  items: NavItem[];
}

const ActiveNavbar: React.FC<ActiveNavbarProps> = ({ items }) => {
  const [activeItem, setActiveItem] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -60% 0px',
      threshold: 0
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveItem(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe sections
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observerRef.current?.unobserve(element);
        }
      });
    };
  }, [items]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getActiveIndex = () => {
    return items.findIndex(item => item.id === activeItem);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#E61C5D] to-[#c9154e] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className={`font-bold text-xl transition-colors duration-300 ${
              isScrolled ? 'text-slate-900' : 'text-white'
            }`}>
              Priyo Pay
            </span>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-8">
            <div className="relative">
              <div className="flex items-center gap-8">
                {items.map((item, index) => {
                  const isActive = activeItem === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                        isActive
                          ? isScrolled ? 'text-[#E61C5D]' : 'text-white'
                          : isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      {item.label}
                      
                      {/* Active Underline */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E61C5D]"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>

              {/* Sliding Indicator Background */}
              <motion.div
                className="absolute bottom-0 h-0.5 bg-[#E61C5D]/20 transition-all duration-300"
                initial={false}
                animate={{
                  left: `${(getActiveIndex() / items.length) * 100}%`,
                  width: `${100 / items.length}%`
                }}
              />
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="https://pay.priyo.com"
              className={`inline-flex items-center gap-2 px-6 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                isScrolled
                  ? 'bg-[#E61C5D] text-white hover:bg-[#c9154e] shadow-lg shadow-[#E61C5D]/25'
                  : 'bg-white text-[#E61C5D] hover:bg-white/90'
              }`}
            >
              Get Started
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100/10 transition-colors duration-200"
            onClick={() => {
              // Mobile menu toggle logic here
            }}
          >
            <div className={`w-6 h-0.5 transition-colors duration-300 ${
              isScrolled ? 'bg-slate-900' : 'bg-white'
            }`} />
            <div className={`w-6 h-0.5 mt-1.5 transition-colors duration-300 ${
              isScrolled ? 'bg-slate-900' : 'bg-white'
            }`} />
            <div className={`w-6 h-0.5 mt-1.5 transition-colors duration-300 ${
              isScrolled ? 'bg-slate-900' : 'bg-white'
            }`} />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {/* Mobile menu implementation here if needed */}
      </AnimatePresence>
    </motion.nav>
  );
};

export default ActiveNavbar;
