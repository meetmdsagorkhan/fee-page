'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

const SUB_NAV_ITEMS = [
  { id: 'maintenance-service-fees', label: 'Maintenance & Service Fees' },
  { id: 'receive-money', label: 'Receive Money' },
  { id: 'send-money-payments', label: 'Payments & Transfers' },
  { id: 'additional-resources', label: 'Additional Resources' },
  { id: 'limits', label: 'Account & Usage Limits' },
];

const TRANSACTION_AMOUNT_SERVICES = [
  'incoming-ach',
  'outgoing-ach',
  'incoming-wire',
  'outgoing-wire',
  'incoming-wire-intl',
  'p2p',
  'third-party',
  'cross-border',
  'usd-to-bdt',
  'atm',
];

// ----------------------------------------------------------------------
// 1. Reusable Components (Theme-matched)
// ----------------------------------------------------------------------

const FeeRow = ({ label, desc, price, period }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-4 group">
    <div className="flex-1">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-slate-900 dark:text-[#f0f4f8] group-hover:text-[#00e68a] transition-colors">
          {label}
        </span>
      </div>
      {desc && <p className="text-xs text-slate-500 dark:text-[#8899aa] mt-1 leading-relaxed max-w-sm">{desc}</p>}
    </div>
    
    <div className="text-left sm:text-right shrink-0">
      <div className={`text-base font-bold ${price === 'FREE' || price === '$0.00' ? 'text-[#00e68a]' : 'text-slate-900 dark:text-[#f0f4f8]'}`}>
        {price}
      </div>
      {period && <div className="text-[10px] font-semibold text-slate-400 dark:text-[#8899aa] uppercase tracking-wide mt-0.5">{period}</div>}
    </div>
  </div>
);

const FeeSubsection = ({ title, children, id }: any) => (
  <div className="mb-8" id={id}>
    <h4 className="text-lg font-bold text-center text-[#00e68a] mb-4 pb-2 border-b border-slate-200 dark:border-white/10">{title}</h4>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);


const AccountTypeNavigation = ({ activeAccountType, setActiveAccountType }: any) => {
  const accountTypes = [
    { 
      id: 'personal', 
      label: 'Personal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'business', 
      label: 'Business',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  return (
    <div className="sticky top-[64px] sm:top-[68px] z-40 bg-gradient-to-b from-white/90 to-white/60 dark:from-[#0a0e17]/90 dark:to-[#0f1a2e]/80 backdrop-blur-lg border-b border-white/20 dark:border-white/10 shadow-lg rounded-2xl">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 sm:gap-8 py-3 sm:py-4">
          {accountTypes.map((account) => (
            <button
              key={account.id}
              onClick={() => setActiveAccountType(account.id)}
              className={`px-4 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 ${
                activeAccountType === account.id
                  ? 'bg-[#00e68a] text-[#0a0e17] shadow-lg shadow-[#00e68a]/25'
                  : 'text-slate-600 dark:text-[#c5d0db] hover:text-[#00e68a] hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {account.icon}
              {account.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SubNavigation = ({ activeSection, setActiveSection, accountType }: any) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = window.innerWidth >= 1024 ? 145 : 118;
      
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 10; // 10px extra spacing

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setActiveSection(sectionId);
  };

  // Auto-detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for better detection
      
      for (const item of SUB_NAV_ITEMS) {
        const sectionId = `${accountType}-${item.id}`;
        const element = document.getElementById(sectionId);
        
        if (element) {
          const { offsetTop, offsetHeight } = element;
          
          // Check if current scroll position is within this section
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (activeSection !== sectionId) {
              setActiveSection(sectionId);
            }
            break;
          }
        }
      }
    };

    // Initial check
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, accountType, setActiveSection]);

  return (
    <div className="lg:sticky lg:top-[145px] z-30 bg-gradient-to-b from-white/90 to-white/60 dark:from-[#0f1a2e]/90 dark:to-[#141e33]/80 backdrop-blur-lg border border-white/20 dark:border-white/10 lg:border-r lg:border-l-0 shadow-lg rounded-2xl">
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex lg:flex-col items-start gap-2 overflow-x-auto lg:overflow-y-auto pb-1 lg:pb-0">
          {SUB_NAV_ITEMS.map((item) => {
            const sectionId = `${accountType}-${item.id}`;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(sectionId)}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-medium whitespace-nowrap rounded-lg transition-all duration-200 text-left w-auto lg:w-full shrink-0 ${
                  activeSection === sectionId
                    ? 'bg-[#00e68a] text-[#0a0e17] shadow-md'
                    : 'text-slate-600 dark:text-[#c5d0db] hover:text-[#00e68a] hover:bg-white dark:hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AccountTypeSection = ({ children }: any) => (
  <div className="bg-white dark:bg-[rgba(15,26,46,0.6)] rounded-[2rem] border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-[#00e68a]/10 transition-all duration-500">
    <div className="p-5 sm:p-8">
      {children}
    </div>
  </div>
);


// ----------------------------------------------------------------------
// 2. Main Page Content
// ----------------------------------------------------------------------

// Fee Calculator State and Functions
const useFeeCalculator = () => {
  const [calculatorAccount, setCalculatorAccount] = useState('personal');
  const [calculatorService, setCalculatorService] = useState('');
  const [calculatorAmount, setCalculatorAmount] = useState('');
  const [transactionCount, setTransactionCount] = useState('1');

  const getCalculatorLabel = () => {
    const labels: Record<string, string> = {
      'virtual-card': 'Number of Cards',
      'physical-card': 'Number of Cards',
      'card-shipping': 'Number of Shipments',
      'maintenance': 'Number of Accounts',
      'additional-account': 'Number of Accounts',
      'incoming-ach': 'Transaction Amount ($)',
      'outgoing-ach': 'Transaction Amount ($)',
      'incoming-wire': 'Transaction Amount ($)',
      'outgoing-wire': 'Transaction Amount ($)',
      'incoming-wire-intl': 'Transaction Amount ($)',
      'p2p': 'Transaction Amount ($)',
      'third-party': 'Transaction Amount ($)',
      'cross-border': 'Transaction Amount ($)',
      'usd-to-bdt': 'Transaction Amount ($)',
      'atm': 'Transaction Amount ($)'
    };
    return labels[calculatorService] || 'Amount';
  };

  const getFeeRate = () => {
    const rates: Record<string, string> = {
      'virtual-card': calculatorAccount === 'personal' ? '$3.00 per card' : 'FREE (first 50)',
      'physical-card': '$19.95 per year + $5.00 shipping (included)',
      'card-shipping': '$5.00 per shipment',
      'maintenance': calculatorAccount === 'personal' ? '$10 per 6 months' : 'FREE',
      'additional-account': calculatorAccount === 'personal' ? '$10 per 6 months' : '$10 per 6 months',
      'incoming-ach': calculatorAccount === 'business' ? 'FREE for business accounts' : '$0.25 per transaction (first 10 free monthly)',
      'outgoing-ach': calculatorAccount === 'business'
        ? '1% of transaction amount (max $5.00)'
        : '1% of transaction amount',
      'incoming-wire': '$10.00 per transaction',
      'outgoing-wire': calculatorAccount === 'business'
        ? '$10.00 + 1% of amount (max $20.00)'
        : '$10.00 + 1% of amount',
      'incoming-wire-intl': '$25.00 per transaction',
      'p2p': calculatorAccount === 'personal'
        ? '1% of transaction amount (min $1.00, max $1,000 transfer)'
        : '1% of transaction amount (min $1.00, max $10,000 transfer)',
      'third-party': '2% of transaction amount (min $1.00)',
      'cross-border': '1% of transaction amount',
      'usd-to-bdt': '1% of transaction amount (min $0.99)',
      'atm': '1% of transaction amount (min $3.00)'
    };
    return rates[calculatorService] || '';
  };

  const calculateFee = () => {
    const amount = parseFloat(calculatorAmount || '0');
    const transactions = parseFloat(transactionCount || '1');
    if (!amount || !calculatorService) return 0;

    // Always use the actual entered amount for calculation
    switch (calculatorService) {
      case 'virtual-card':
        return calculatorAccount === 'personal' ? amount * 3 : Math.max(0, (amount - 50) * 3);
      case 'physical-card':
        // Physical card fee includes shipping
        const cardFee = amount * 19.95;
        const shippingFee = amount * 5; // $5 per shipment
        return cardFee + shippingFee;
      case 'card-shipping':
        return amount * 5;
      case 'maintenance':
        return calculatorAccount === 'personal' ? Math.ceil(amount / 2) * 10 : 0;
      case 'additional-account':
        if (calculatorAccount === 'personal') {
          // Personal accounts: $10 per account (no free accounts)
          return amount * 10;
        } else {
          // Business accounts: First 5 free, then $10 each
          const freeAccounts = 5;
          return Math.max(0, (amount - freeAccounts) * 10);
        }
      case 'incoming-ach':
        // Business accounts: FREE, Personal accounts: $0.25 per transaction (first 10 free)
        if (calculatorAccount === 'business') {
          return 0; // Completely FREE for business accounts
        } else {
          const achFee = Math.max(0, (transactions - 10) * 0.25);
          return achFee;
        }
      case 'outgoing-ach':
        // Business has a $5 cap; Personal uses 1% without cap.
        const achOutFee = calculatorAccount === 'business'
          ? Math.min(5, amount * 0.01)
          : amount * 0.01;
        return achOutFee * transactions;
      case 'incoming-wire':
        // $10 per transaction
        return 10 * transactions;
      case 'outgoing-wire':
        // Business has a $20 cap; Personal uses $10 + 1% without cap.
        const wireFee = calculatorAccount === 'business'
          ? Math.min(20, 10 + (amount * 0.01))
          : 10 + (amount * 0.01);
        return wireFee * transactions;
      case 'incoming-wire-intl':
        // $25 per transaction
        return 25 * transactions;
      case 'p2p':
        // 1% with $1 min and $1,000 max per transaction
        const p2pFee = Math.min(1000, Math.max(1, amount * 0.01));
        return p2pFee * transactions;
      case 'third-party':
        // 2% with $1 min per transaction
        const thirdPartyFee = Math.max(1, amount * 0.02);
        return thirdPartyFee * transactions;
      case 'cross-border':
        // 1% per transaction
        return (amount * 0.01) * transactions;
      case 'usd-to-bdt':
        // 1% with $0.99 min per transaction
        const bdtFee = Math.max(0.99, amount * 0.01);
        return bdtFee * transactions;
      case 'atm':
        // 1% with $3 min per transaction
        const atmFee = Math.max(3, amount * 0.01);
        return atmFee * transactions;
      default:
        return 0;
    }
  };

  const getAccountLimits = () => {
    const amount = parseFloat(calculatorAmount || '0');
    if (!amount || !calculatorService) return null;

    const limits: Record<string, Record<string, { max: number; current: string; description: string }>> = {
      personal: {
        'virtual-card': { max: 2, current: 'Virtual Card', description: 'Maximum 2 virtual cards per USD account' },
        'physical-card': { max: 1, current: 'Physical Card', description: 'Maximum 1 physical card per USD account' },
        'additional-account': { max: 2, current: 'USD Account', description: 'Maximum 2 USD accounts per profile' },
        'p2p': { max: 1000, current: 'P2P Transfer', description: 'Maximum $1,000 per P2P transaction' },
        'atm': { max: 500, current: 'ATM Withdrawal', description: 'Maximum $500 per 24 hours for withdrawals to MFS' }
      },
      business: {
        'virtual-card': { max: 50, current: 'Virtual Card', description: 'Maximum 50 virtual cards per USD account' },
        'physical-card': { max: 1, current: 'Physical Card', description: 'Maximum 1 physical card per USD account' },
        'p2p': { max: 10000, current: 'P2P Transfer', description: 'Maximum $10,000 per P2P transaction' },
        'atm': { max: 500, current: 'ATM Withdrawal', description: 'Maximum $500 per 24 hours for withdrawals to MFS' }
      }
    };

    const accountLimits = limits[calculatorAccount];
    if (accountLimits && accountLimits[calculatorService]) {
      const limit = accountLimits[calculatorService];
      if (amount > limit.max) {
        return {
          current: amount,
          max: limit.max,
          description: limit.description,
          service: limit.current
        };
      }
    }
    return null;
  };

  const getFeeNote = () => {
    const limitInfo = getAccountLimits();
    if (limitInfo) {
      return `?? Limit exceeded: ${limitInfo.description}. You requested ${limitInfo.current} but maximum is ${limitInfo.max}.`;
    }

    const notes: Record<string, string> = {
      'virtual-card': calculatorAccount === 'personal' ? 'First virtual card is FREE for personal accounts only. Business accounts get first 50 cards FREE.' : 'First 50 virtual cards are FREE for business accounts.',
      'maintenance': calculatorAccount === 'business' ? 'FREE for up to 5 USD accounts for business accounts.' : 'FREE for personal accounts if you bring $5,000/year in deposits.',
      'additional-account': calculatorAccount === 'personal' ? 'Additional USD accounts cost $10 each for personal accounts.' : 'First 5 USD accounts are FREE for business accounts.',
      'incoming-ach': calculatorAccount === 'business' ? 'FREE for all business account transactions.' : 'First 10 transactions are FREE every month for personal accounts.',
      'outgoing-ach': calculatorAccount === 'business'
        ? 'Maximum fee is $5.00 regardless of transaction amount.'
        : 'Outgoing ACH fee is 1% per transaction.',
      'outgoing-wire': calculatorAccount === 'business'
        ? 'Maximum fee is $20.00 regardless of transaction amount.'
        : 'Outgoing domestic wire fee is $10.00 + 1% per transaction.',
      'p2p': calculatorAccount === 'business'
        ? 'Business-to-Business transfers only. Maximum $10,000 per transaction.'
        : 'Maximum $1,000 per transaction for personal accounts.'
    };
    return notes[calculatorService] || '';
  };

  return {
    calculatorAccount,
    setCalculatorAccount,
    calculatorService,
    setCalculatorService,
    calculatorAmount,
    setCalculatorAmount,
    transactionCount,
    setTransactionCount,
    getCalculatorLabel,
    getFeeRate,
    calculateFee,
    getAccountLimits,
    getFeeNote
  };
};

export default function FeesPage() {
  const [activeAccountType, setActiveAccountType] = useState('personal');
  const [activeSection, setActiveSection] = useState('personal-maintenance-service-fees');
  const shouldReduceMotion = useReducedMotion();
  const heroParticles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        left: `${8 + ((i * 17) % 84)}%`,
        top: `${12 + ((i * 23) % 76)}%`,
        driftX: ((i % 2 === 0 ? 1 : -1) * (12 + i * 4)),
        duration: 3.2 + i * 0.45,
        delay: i * 0.28,
      })),
    []
  );
  const calculatorParticles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        left: `${12 + ((i * 14) % 76)}%`,
        top: `${14 + ((i * 19) % 70)}%`,
        driftX: (i % 2 === 0 ? 4 : -4) + i,
        duration: 2.4 + i * 0.35,
        delay: i * 0.22,
      })),
    []
  );
  
  const {
    calculatorAccount,
    setCalculatorAccount,
    calculatorService,
    setCalculatorService,
    calculatorAmount,
    setCalculatorAmount,
    transactionCount,
    setTransactionCount,
    getCalculatorLabel,
    getFeeRate,
    calculateFee,
    getAccountLimits,
    getFeeNote
  } = useFeeCalculator();

  const isTransactionAmountService = TRANSACTION_AMOUNT_SERVICES.includes(calculatorService);

  useEffect(() => {
    setActiveSection(`${activeAccountType}-maintenance-service-fees`);
  }, [activeAccountType]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e17] font-inter text-slate-900 dark:text-[#f0f4f8] selection:bg-[#00e68a] selection:text-[#0a0e17]">
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:60px_60px]" />
      
      {/* --- HEADER --- */}
      <header className="bg-white/80 dark:bg-[#0a0e17]/85 backdrop-blur-md border-b border-slate-200 dark:border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
             <span className="text-xl font-extrabold text-slate-900 dark:text-[#f0f4f8] tracking-tight">Priyo Pay</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="https://pay.priyo.com/get-started" className="bg-[#00e68a] text-[#0a0e17] px-4 sm:px-5 py-2 rounded-xl font-semibold text-xs sm:text-sm hover:bg-[#00cc7a] transition-all shadow-lg shadow-[#00e68a]/10">
                Open Account
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-white dark:bg-[#0a0e17] min-h-[72vh] sm:min-h-[80vh] flex items-center">
        {/* Aceternity-style background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-36 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full bg-emerald-400/16 dark:bg-[#00e68a]/10 blur-[105px]"
            animate={shouldReduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.45, 0.7, 0.45] }}
            transition={shouldReduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 -left-24 w-[24rem] h-[24rem] rounded-full bg-teal-300/16 dark:bg-[#00cc7a]/8 blur-[78px]"
            animate={shouldReduceMotion ? undefined : { x: [0, 26, 0], y: [0, -18, 0] }}
            transition={shouldReduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 -right-24 w-[22rem] h-[22rem] rounded-full bg-cyan-300/12 dark:bg-cyan-500/8 blur-[72px]"
            animate={shouldReduceMotion ? undefined : { x: [0, -20, 0], y: [0, 15, 0] }}
            transition={shouldReduceMotion ? undefined : { duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.14)_1px,transparent_0)] [background-size:22px_22px] opacity-40"></div>
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_48%,transparent_86%)] bg-[linear-gradient(to_right,rgba(16,185,129,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.14)_1px,transparent_1px)] [background-size:68px_68px] opacity-45"></div>

          {heroParticles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/55"
              style={{ left: particle.left, top: particle.top }}
              animate={shouldReduceMotion ? undefined : { y: [0, -50, 0], x: [0, particle.driftX * 0.6, 0], opacity: [0.3, 1, 0.3] }}
              transition={shouldReduceMotion ? undefined : { duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
            />
          ))}

          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/70 dark:to-slate-900/80"></div>
        </div>

        <div className="relative z-10 w-full py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-0">
          <div className="mx-auto flex flex-col lg:flex-row gap-12 relative z-10 max-w-5xl 2xl:max-w-[1500px] items-center">
            {/* Left Column - Hero Content */}
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl text-slate-600 dark:text-[#c5d0db] tracking-tight mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                No Hidden Charges
              </motion.div>
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-8xl max-w-4xl font-extrabold text-slate-900 dark:text-[#f0f4f8] tracking-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                Fees & Pricing
              </motion.h1>
              <motion.div 
                className="text-base md:text-lg lg:text-xl 2xl:text-2xl mb-6 md:mb-8 2xl:max-w-2xl lg:max-w-xl max-w-sm leading-relaxed text-slate-600 dark:text-[#c5d0db] mt-2 md:mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                Explore a clear breakdown of Priyo Pay fees for cards, accounts, and international transfers. Designed to help you manage costs and make informed financial decisions.
                <br /><br />
                Our calculator shows real-time fees for all services including account limits and special offers for both personal and business accounts.
              </motion.div>
              <motion.a 
                target="_blank" 
                href="https://pay.priyo.com/get-started" 
                className="inline-flex items-center gap-2 bg-[#00e68a] text-[#0a0e17] px-6 py-3 rounded-xl font-semibold text-base hover:bg-[#00cc7a] hover:shadow-lg hover:shadow-[#00e68a]/16 transition-all duration-300 w-fit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              >
                Open Account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.a>
            </motion.div>
            
            {/* Right Column - Fee Calculator */}
            <motion.div 
              className="flex-1 lg:max-w-xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              {/* Eye-catching badge with modern gradient animation */}
              <motion.div
                className="mb-4 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              >
                <div className="instant-calc-badge">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    INSTANT CALCULATION
                  </span>
                </div>
              </motion.div>

              <div className="relative">
                {/* Main calculator container with border animation */}
                <div className="relative bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 dark:from-slate-900 dark:via-emerald-950/20 dark:to-teal-950/20 rounded-3xl border-2 border-emerald-200/50 dark:border-emerald-800/40 shadow-2xl p-5 sm:p-8 backdrop-blur-sm overflow-hidden">
                  {/* Animated fintech border effect */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    <motion.div
                      className="absolute inset-0 rounded-3xl"
                      animate={shouldReduceMotion ? undefined : { rotate: [0, 180, 360] }}
                      transition={shouldReduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: "linear" }}
                      style={{
                        background:
                          'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(0,230,138,0.42) 332deg, rgba(0,204,122,0.45) 350deg, rgba(0,184,111,0.35) 360deg)',
                        filter: 'blur(0.8px)',
                      }}
                    />
                    
                    {/* Border cutout to reveal only border area */}
                    <div className="absolute inset-[2px] rounded-3xl bg-white dark:bg-[#0f1a2e]"></div>
                  </div>
                  {/* Fintech texture layers */}
                  <div className="absolute inset-0 opacity-35 bg-[linear-gradient(to_right,rgba(16,185,129,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.12)_1px,transparent_1px)] [background-size:28px_28px]"></div>
                  <motion.div
                    className="absolute -top-12 right-4 w-44 h-44 rounded-full bg-gradient-to-br from-[#00e68a]/12 to-cyan-500/8 blur-[52px]"
                    animate={shouldReduceMotion ? undefined : { x: [0, 14, 0], y: [0, -10, 0] }}
                    transition={shouldReduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute -bottom-10 left-2 w-40 h-40 rounded-full bg-gradient-to-br from-[#00cc7a]/10 to-blue-500/8 blur-[48px]"
                    animate={shouldReduceMotion ? undefined : { x: [0, -10, 0], y: [0, 12, 0] }}
                    transition={shouldReduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* Floating sparkles */}
                  {calculatorParticles.map((particle, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-emerald-400/60 rounded-full"
                      style={{
                        left: particle.left,
                        top: particle.top,
                      }}
                      animate={shouldReduceMotion ? undefined : {
                        y: [0, -20, 0],
                        x: [0, particle.driftX, 0],
                        opacity: [0.2, 0.7, 0.2],
                        scale: [0.9, 1.2, 0.9],
                      }}
                      transition={shouldReduceMotion ? undefined : {
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  
                  {/* Header */}
                  <motion.div 
                    className="relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div 
                        className="w-14 h-14 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00e68a]/30"
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.06, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-[#f0f4f8]">Fee Calculator</h3>
                        <p className="text-sm text-slate-600 dark:text-[#c5d0db]">Calculate your costs instantly</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="space-y-5 relative z-10">
                    {/* Account Type Selection */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                    >
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#00e68a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Account Type
                      </label>
                      <div className="flex gap-3">
                        <motion.button
                          onClick={() => setCalculatorAccount('personal')}
                          className={`flex-1 px-5 py-3 rounded-xl font-bold text-base transition-all duration-300 transform ${
                            calculatorAccount === 'personal'
                              ? 'bg-gradient-to-r from-[#00e68a] to-[#00cc7a] text-[#0a0e17] shadow-xl shadow-[#00e68a]/24 ring-2 ring-[#00e68a]/35 scale-105'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 hover:shadow-lg'
                          }`}
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Personal
                          </span>
                        </motion.button>
                        <motion.button
                          onClick={() => setCalculatorAccount('business')}
                          className={`flex-1 px-5 py-3 rounded-xl font-bold text-base transition-all duration-300 transform ${
                            calculatorAccount === 'business'
                              ? 'bg-gradient-to-r from-[#00e68a] to-[#00cc7a] text-[#0a0e17] shadow-xl shadow-[#00e68a]/24 ring-2 ring-[#00e68a]/35 scale-105'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 hover:shadow-lg'
                          }`}
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Business
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Service Type Selection */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
                    >
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#00e68a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Service Type
                      </label>
                      <motion.select
                        value={calculatorService}
                        onChange={(e) => setCalculatorService(e.target.value)}
                        className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 focus:border-[#00e68a] focus:ring-2 focus:ring-[#00e68a]/20 transition-all duration-300 text-sm text-slate-900 dark:text-[#f0f4f8] bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-white/5 font-medium"
                        whileFocus={shouldReduceMotion ? undefined : { scale: 1.005 }}
                      >
                        <option value="">Select a service</option>
                        <optgroup label="💳 Card Services">
                          <option value="virtual-card">Virtual Card</option>
                          <option value="physical-card">Physical Card (includes shipping)</option>
                        </optgroup>
                        <optgroup label="🏦 Account Services">
                          <option value="maintenance">Maintenance Fee</option>
                          <option value="additional-account">Additional USD Account</option>
                        </optgroup>
                        <optgroup label="💸 Money Transfers">
                          <option value="incoming-ach">Incoming ACH</option>
                          <option value="outgoing-ach">Outgoing ACH</option>
                          <option value="incoming-wire">Incoming Wire (Domestic)</option>
                          <option value="outgoing-wire">Outgoing Wire (Domestic)</option>
                          <option value="incoming-wire-intl">Incoming Wire (International)</option>
                          <option value="p2p">P2P Transfer</option>
                          <option value="third-party">Third-Party Payment</option>
                          <option value="cross-border">Cross-Border Payment</option>
                          <option value="usd-to-bdt">USD to BDT Conversion</option>
                          <option value="atm">ATM Withdrawal</option>
                        </optgroup>
                      </motion.select>
                    </motion.div>

                    {/* Amount Input */}
                    <AnimatePresence>
                      {calculatorService && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#00e68a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {getCalculatorLabel()}
                          </label>
                          <div className="relative">
                            {isTransactionAmountService && (
                              <span className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-slate-500 dark:text-[#8899aa] font-bold text-base">$</span>
                            )}
                            <motion.input
                              type="number"
                              value={calculatorAmount}
                              onChange={(e) => setCalculatorAmount(e.target.value)}
                              placeholder={isTransactionAmountService ? "0.00" : "0"}
                              className={`relative z-0 w-full pr-5 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 focus:border-[#00e68a] focus:ring-2 focus:ring-[#00e68a]/20 transition-all duration-300 text-base text-slate-900 dark:text-[#f0f4f8] bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-white/5 font-medium ${isTransactionAmountService ? 'pl-10' : 'px-5'}`}
                              whileFocus={shouldReduceMotion ? undefined : { scale: 1.005 }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Transaction Count Input */}
                    <AnimatePresence>
                      {calculatorService && isTransactionAmountService && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                        >
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#00e68a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Number of Transactions
                          </label>
                          <motion.input
                            type="number"
                            value={transactionCount}
                            onChange={(e) => setTransactionCount(e.target.value)}
                            placeholder="1"
                            min="1"
                            className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 focus:border-[#00e68a] focus:ring-2 focus:ring-[#00e68a]/20 transition-all duration-300 text-base text-slate-900 dark:text-[#f0f4f8] bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-white/5 font-medium"
                            whileFocus={shouldReduceMotion ? undefined : { scale: 1.005 }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Results Section */}
                    <AnimatePresence>
                      {calculatorService && calculatorAmount && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                          {getAccountLimits() ? (
                            <div className="space-y-3">
                              <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-900/40 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                  </svg>
                                  <span className="text-sm font-bold text-red-700 dark:text-red-300">Account Limit Exceeded</span>
                                </div>
                                <p className="text-xs text-red-600 dark:text-red-300">{getFeeNote()}</p>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-[#c5d0db]">Fee Rate:</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-[#f0f4f8]">{getFeeRate()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-base font-bold text-slate-900 dark:text-[#f0f4f8]">Total Fee:</span>
                                <span className="text-xl font-bold text-[#00e68a]">
                                  ${calculateFee().toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center py-3 border-b-2 border-slate-200 dark:border-white/10">
                                <span className="text-sm text-slate-600 dark:text-[#c5d0db]">Fee Rate:</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-[#f0f4f8]">{getFeeRate()}</span>
                              </div>
                              <motion.div 
                                className="flex justify-between items-center"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <span className="text-base font-bold text-slate-900 dark:text-[#f0f4f8]">Total Fee:</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-[#00e68a] to-[#00cc7a] bg-clip-text text-transparent">
                                  ${calculateFee().toLocaleString()}
                                </span>
                              </motion.div>
                              {getFeeNote() && (
                                <motion.div 
                                  className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-900/40"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                                    <svg className="w-4 h-4 text-[#00e68a] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {getFeeNote()}
                                  </p>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- DETAILED FEE LISTS --- */}
      <section className="py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          
          {/* Account Type Navigation */}
          <AccountTypeNavigation 
            activeAccountType={activeAccountType} 
            setActiveAccountType={setActiveAccountType} 
          />
          
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mt-6">
            {/* Sub Navigation - Vertical Left Sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <SubNavigation 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                accountType={activeAccountType}
              />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeAccountType}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
              {/* Personal Account Section */}
              {activeAccountType === 'personal' && (
                <AccountTypeSection>
                  <FeeSubsection title="Maintenance & Service Fees" id="personal-maintenance-service-fees">
                <FeeRow 
                  label="Maintenance Fee (1 USD, 1 Virtual Card & 1 BDT Account)" 
                  desc={<> <span className="text-[#00e68a] font-bold">FREE</span> If you bring $5,000 / year <a href="https://pay.priyo.com/fee-waiver" target="_blank" rel="noopener noreferrer" className="text-[#00e68a] hover:text-emerald-600 underline font-bold">Learn more</a>. </>} 
                  price="$10" 
                  period="Every 6 months"
                />
                <FeeRow 
                  label="Maintenance Fee (BDT Account Only)" 
                  desc={<>Payable in every 12 months. <span className='text-[#00e68a] font-bold'>FREE</span> for USD Account Holder.</>} 
                  price="?199.00" 
                  period="Yearly"
                />
                <FeeRow 
                  label="Virtual Card (Debit)" 
                  desc={<>The first virtual debit card for your personal account is <span className='text-[#00e68a] font-bold'>FREE</span>. Any additional cards incur a fee.</>} 
                  price="$3.00" 
                  period="One-time"
                />
                <FeeRow 
                  label="Physical Card (Plastic)" 
                  desc="You can order Physical Mastercard from your account. This is a yearly fee for a single card. Shipping charge is separate." 
                  price="$19.95" 
                  period="Yearly"
                />
                <FeeRow 
                  label="Physical Card Shipping (Standard)" 
                  desc="Regular shipping takes 3-5 business days in the USA, and 3-6 weeks globally. If you want FedEx, then the fee is $40." 
                  price="$5.00" 
                  period="Per shipment"
                />
              </FeeSubsection>

              <FeeSubsection title="Receive Money" id="personal-receive-money">
                <FeeRow 
                  label="From another Priyo Pay user (P2P)" 
                  desc="You can receive money from another Priyo Pay user." 
                  price="FREE" 
                />
                <FeeRow 
                  label="Incoming ACH - from Any Bank in the USA" 
                  desc={<>First 10 transactions are <span className='text-[#00e68a] font-bold'>FREE</span> every month.</>} 
                  price="$0.25" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Incoming Wire (Domestic)" 
                  desc="Receiving Wire from any Bank in the USA." 
                  price="$10.00" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Incoming Wire - International (SWIFT)" 
                  desc="Receiving Wire from anywhere in the world via SWIFT." 
                  price="$25.00" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Incoming Credit (via Card) - from any Source" 
                  desc="Minimum Fee $1.00." 
                  price="2.00%" 
                  period="Per transaction"
                />
              </FeeSubsection>

              <FeeSubsection title="Payments & Transfers" id="personal-send-money-payments">
                <FeeRow 
                  label="Payment (via Card) - to Third-Party Money Transmitters" 
                  desc="Payment via Card to third-party money transmitters such as Western Union, Remitly, MoneyGram, Taptap Send, PayPal, and similar platforms. Minimum Fee $1.00." 
                  price="2.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Cross Border Payment (via Card) - outside of USA" 
                  desc="Payment via Card outside of the USA. No Minimum Fee." 
                  price="1.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Outgoing ACH (USA Only)" 
                  desc="Any Bank in the USA." 
                  price="1.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Outgoing Domestic Wire" 
                  desc="Sending Wire to any Bank in the USA." 
                  price="$10.00 + 1%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Payment to another Priyo Pay user (P2P)" 
                  desc="Minimum Fee: $1.00. Maximum $1,000.00." 
                  price="1.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Transfer/Convert from USD to BDT" 
                  desc="Minimum Fee $0.99. The transaction fee is also displayed during the transaction." 
                  price="1.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="ATM Withdrawal (Globally)" 
                  desc="Minimum fee $3.00." 
                  price="1.00%" 
                  period="Per transaction"
                />
              </FeeSubsection>

              <FeeSubsection title="Additional Resources" id="personal-additional-resources">
                <FeeRow 
                  label="Additional USD Accounts"
                  desc="Charged per additional account."  
                  price="$10.00" 
                  period="Every 6 months"
                />
                <FeeRow 
                  label="Additional Virtual Cards" 
                  desc="Charged per additional card." 
                  price="$3.00" 
                  period="One-time"
                />
              </FeeSubsection>

              <FeeSubsection title="Account & Usage Limits" id="personal-limits">
                <div className="border-b border-slate-200 dark:border-white/10 pb-2 mb-4">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-[#8899aa] uppercase tracking-wider">Resource Limits</h5>
                </div>
                
                <FeeRow 
                  label="USD Account" 
                  desc="Maximum number of active USD accounts per profile." 
                  price="2" 
                  period="Accounts"
                />
                <FeeRow 
                  label="Virtual Card" 
                  desc="Maximum number of non-terminated virtual cards per USD account." 
                  price="2" 
                  period="Cards"
                />
                <FeeRow 
                  label="Physical Card" 
                  desc="Maximum number of physical cards per USD account." 
                  price="1" 
                  period="Card"
                />
                
                <div className="border-b border-slate-200 dark:border-white/10 pb-2 mb-4 mt-6">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-[#8899aa] uppercase tracking-wider">Transaction Limits</h5>
                </div>
                
                <FeeRow 
                  label="General Transaction - Withdraw/Transfer (< 30 days)" 
                  desc="Maximum transaction amount for withdrawals/transfers in past 24 hours, when account is less than 30 days old." 
                  price="$1,000" 
                  period="Per 24 hours"
                />
                <FeeRow 
                  label="General Transaction - Withdraw/Transfer (30+ days)" 
                  desc="Maximum transaction amount for withdrawals/transfers in past 24 hours, when account is 30 days or older." 
                  price="$4,000" 
                  period="Per 24 hours"
                />
                <FeeRow 
                  label="Card Transaction (< 30 days)" 
                  desc="Maximum transaction amount and count for card transactions in past 24 hours, when account is less than 30 days old." 
                  price="$1,000" 
                  period="Max 10 transactions"
                />
                <FeeRow 
                  label="Card Transaction (30+ days)" 
                  desc="Maximum transaction amount and count for card transactions in past 24 hours, when account is 30 days or older." 
                  price="$3,000" 
                  period="Max 30 transactions"
                />
                <FeeRow 
                  label="Withdraw to MFS (Bkash)" 
                  desc="Maximum transaction amount for withdrawals to Mobile Financial Services." 
                  price="$500" 
                  period="Per 24 hours"
                />
              </FeeSubsection>
            </AccountTypeSection>
          )}

          {/* Business Account Section */}
          {activeAccountType === 'business' && (
            <AccountTypeSection>
              <FeeSubsection title="Maintenance & Service Fees" id="business-maintenance-service-fees">
                <FeeRow 
                  label="Maintenance Fee" 
                  desc={<>Zero monthly fee. <span className='text-[#00e68a] font-bold'>FREE</span> forever.</>}
                  price="FREE" 
                  period="Up to 5 USD Accounts"
                  
                />
                
                <FeeRow 
                  label="Virtual Card (Debit)" 
                  desc={<>Zero monthly fee. <span className='text-[#00e68a] font-bold'>FREE</span> forever.</>}
                  price="FREE" 
                  period="Up to 50 Cards"
                />
                <FeeRow 
                  label="Physical Card (Plastic)" 
                  desc="You can order Physical Mastercard from your account. This is a yearly fee for a single card. Shipping charge is separate." 
                  price="$19.95" 
                  period="Yearly"
                />
                <FeeRow 
                  label="Physical Card Shipping (Standard)" 
                  desc="Regular shipping takes 3-5 business days in the USA, and 3-6 weeks globally. If you want FedEx, then the fee is $40." 
                  price="$5.00" 
                  period="Per shipment"
                />
              </FeeSubsection>

              <FeeSubsection title="Receive Money" id="business-receive-money">
                <FeeRow 
                  label="From another Priyo Pay user (P2P)" 
                  desc="You can receive money from another Priyo Pay user. Business to Business only." 
                  price="FREE" 
                />
                <FeeRow 
                  label="Incoming ACH - from Any Bank in the USA" 
                  desc={<><span className='text-[#00e68a] font-bold'>Totally FREE</span> for all business account transactions.</>} 
                  price="FREE" 
                  period=""
                />
                <FeeRow 
                  label="Incoming Wire (Domestic)" 
                  desc="Receiving Wire from any Bank in the USA." 
                  price="$10.00" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Incoming Wire - International (SWIFT)" 
                  desc="Receiving Wire from anywhere in the world via SWIFT." 
                  price="$25.00" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Incoming Credit (via Card) - from any Source" 
                  desc="Minimum Fee $1.00." 
                  price="2.00%" 
                  period="Per transaction"
                />
              </FeeSubsection>

              <FeeSubsection title="Payments & Transfers" id="business-send-money-payments">
                <FeeRow 
                  label="Payment (via Card) - to Third-Party Money Transmitters" 
                  desc="Payment via Card to third-party money transmitters such as Western Union, Remitly, MoneyGram, Taptap Send, PayPal, and similar platforms. Minimum Fee $1.00." 
                  price="2.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Cross Border Payment (via Card) - outside of USA" 
                  desc="Payment via Card outside of the USA. No Minimum Fee." 
                  price="1.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Outgoing ACH (USA Only)" 
                  desc={<>Any Bank in the USA. <span className='text-[#00e68a] font-bold'>Maximum Fee $5.00</span>, You&apos;ll never pay more than $5, regardless of the transaction amount.</>} 
                  price="1.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Outgoing Domestic Wire" 
                  desc={<>Sending Wire to any Bank in the USA. <span className='text-[#00e68a] font-bold'>Maximum Fee $20.00</span>, You&apos;ll never pay more than $20, regardless of the transaction amount.</>} 
                  price="$10.00 + 1%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Payment to another Priyo Pay user (P2P)" 
                  desc="Minimum Fee: $1.00. Maximum $10,000.00. Business to Business only" 
                  price="1.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Transfer/Convert from USD to BDT" 
                  desc="Minimum Fee $0.99. The transaction fee is also displayed during the transaction." 
                  price="1.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="ATM Withdrawal (Globally)" 
                  desc="Minimum fee $3.00." 
                  price="1.00%" 
                  period="Per transaction"
                />
              </FeeSubsection>

              <FeeSubsection title="Additional Resources" id="business-additional-resources">
                <FeeRow 
                  label="Additional USD Accounts"
                  desc={<>Charged per additional account. First 5 accounts are <span className='text-[#00e68a] font-bold'>FREE</span>.</>}
                  price="$10.00" 
                  period="Every 6 months"
                />
                <FeeRow 
                  label="Additional Virtual Cards" 
                  desc={<>Charged per additional cards. First 50 cards are <span className='text-[#00e68a] font-bold'>FREE</span>.</>}
                  price="$3.00" 
                  period="One-time"
                />
              </FeeSubsection>

              <FeeSubsection title="Account & Usage Limits" id="business-limits">
                <div className="border-b border-slate-200 dark:border-white/10 pb-2 mb-4">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-[#8899aa] uppercase tracking-wider">Resource Account & Usage Limits</h5>
                </div>
                
                <FeeRow 
                  label="USD Account" 
                  desc="No maximum limit on active USD accounts per business." 
                  price="No limit" 
                  period="Accounts"
                />
                <FeeRow 
                  label="Virtual Card" 
                  desc="Maximum number of virtual cards per USD account." 
                  price="50" 
                  period="Cards"
                />
                <FeeRow 
                  label="Physical Card" 
                  desc="Maximum number of physical cards per USD account." 
                  price="1" 
                  period="Card"
                />
                
                <div className="border-b border-slate-200 dark:border-white/10 pb-2 mb-4 mt-6">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-[#8899aa] uppercase tracking-wider">Transaction Limits</h5>
                </div>
                
                <FeeRow 
                  label="General Transaction - Withdraw/Transfer (< 30 days)" 
                  desc="Maximum transaction amount for withdrawals/transfers in past 24 hours, when account is less than 30 days old." 
                  price="$5,000" 
                  period="Per 24 hours"
                />
                <FeeRow 
                  label="General Transaction - Withdraw/Transfer (30+ days)" 
                  desc="Maximum transaction amount for withdrawals/transfers in past 24 hours, when account is 30 days or older." 
                  price="$10,000" 
                  period="Per 24 hours"
                />
                <FeeRow 
                  label="Card Transaction (< 30 days)" 
                  desc="Maximum transaction amount and count for card transactions in past 24 hours, when account is less than 30 days old." 
                  price="$5,000" 
                  period="Max 20 transactions"
                />
                <FeeRow 
                  label="Card Transaction (30+ days)" 
                  desc="Maximum transaction amount and count for card transactions in past 24 hours, when account is 30 days or older." 
                  price="$10,000" 
                  period="Max 30 transactions"
                />
                <FeeRow 
                  label="Withdraw to MFS (Bkash)" 
                  desc="Maximum transaction amount for withdrawals to Mobile Financial Services." 
                  price="$500" 
                  period="Per 24 hours"
                />
              </FeeSubsection>
            </AccountTypeSection>
          )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
<section className="py-16 sm:py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 relative overflow-hidden">
  {/* Background decorative elements */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.14)_1px,transparent_0)] [background-size:20px_20px] opacity-35"></div>
  <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_78%)] bg-[linear-gradient(to_right,rgba(16,185,129,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.12)_1px,transparent_1px)] [background-size:64px_64px] opacity-45"></div>
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[34rem] h-[18rem] rounded-full bg-emerald-400/14 dark:bg-[#00e68a]/8 blur-[96px]"></div>
  
  <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00e68a] to-[#00cc7a] text-[#0a0e17] px-6 py-3 rounded-full text-base font-bold mb-4 shadow-lg shadow-[#00e68a]/18"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        FREQUENTLY ASKED QUESTIONS
      </motion.div>
      <p className="text-slate-500 dark:text-[#8899aa] text-lg max-w-2xl mx-auto">Clarifications on our fee structure and account maintenance. Find answers to everything you need to know.</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      
      {/* 1. Maintenance Fee Billing */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">How is the maintenance fee billed?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          <strong>Personal Accounts:</strong> $10 maintenance fee covers your USD account for 6 months. <strong>Business Accounts:</strong> <span className="text-[#00e68a] font-bold">FREE</span> for up to 5 USD accounts.
        </div>
        </div>
      </motion.details>

      {/* 2. Fee Waiver */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">How can I waive the maintenance fee?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          <strong>Personal Accounts:</strong> The maintenance fee is waived (<span className="text-[#00e68a] font-bold">FREE</span>) if you bring in $5,000 or more in deposits per year, <a href="https://pay.priyo.com/fee-waiver" target="_blank" rel="noopener noreferrer" className="text-[#00e68a] hover:text-emerald-600 underline font-bold">Learn more</a>. <strong>Business Accounts:</strong> Maintenance is <span className="text-[#00e68a] font-bold">FREE</span> for up to 5 USD accounts.
        </div>
        </div>
      </motion.details>

      {/* 3. Virtual Cards */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">Is the Virtual Card really free?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          <strong>Personal Accounts:</strong> First virtual card is <span className="text-[#00e68a] font-bold">FREE</span>. <strong>Business Accounts:</strong> First 50 virtual cards are <span className="text-[#00e68a] font-bold">FREE</span>. Additional cards beyond the free limit incur a one-time fee of $3.00 per card.
        </div>
        </div>
      </motion.details>

      {/* 4. Incoming ACH */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">Are there fees for incoming ACH transfers?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          <strong>Business Accounts:</strong> Incoming ACH transfers are completely <span className="text-[#00e68a] font-bold">FREE</span> with no transaction limits. <strong>Personal Accounts:</strong> First 10 transactions are <span className="text-[#00e68a] font-bold">FREE</span> every month, then $0.25 per transaction.
        </div>
        </div>
      </motion.details>

      {/* 5. Wires */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">What are the fees for Wire transfers?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          <strong>Personal &amp; Business Accounts:</strong> Incoming domestic wires are $10.00 per transaction, and incoming international SWIFT wires are $25.00 per transaction. <strong>Personal Accounts:</strong> Outgoing domestic wires are $10.00 plus 1% per transaction. <strong>Business Accounts:</strong> Outgoing domestic wires are $10.00 plus 1% per transaction (maximum $20.00 per transaction).
        </div>
        </div>
      </motion.details>

      {/* 6. ATM Withdrawal */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">Are there fees for ATM withdrawals?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          <strong>Personal &amp; Business Accounts:</strong> ATM withdrawals globally incur a 1% fee, with a minimum charge of $3.00 per transaction. Maximum withdrawal limit is $500 per 24 hours.
        </div>
        </div>
      </motion.details>

      {/* 7. Additional USD Accounts */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">What are the fees for additional USD accounts?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          <strong>Personal Accounts:</strong> Additional USD accounts cost $10 every 6 months per additional account (no free accounts), with a maximum of 2 USD accounts per profile. <strong>Business Accounts:</strong> First 5 USD accounts are <span className="text-[#00e68a] font-bold">FREE</span>, then $10 every 6 months per additional account, with no maximum account limit.
        </div>
        </div>
      </motion.details>

      {/* 8. Business - Virtual Cards */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">How many Virtual Cards can a business have?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          <strong>Business Accounts:</strong> You can issue up to 50 virtual cards for <span className="text-[#00e68a] font-bold">FREE</span>. Any cards issued beyond this limit incur a one-time fee of $3.00 per card. Maximum 1 physical card per USD account.
        </div>
        </div>
      </motion.details>

      {/* 9. Business - P2P Transfers */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">Can I use P2P transfers for my business?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          <strong>Business Accounts:</strong> Business-to-business P2P transfers are available for 1% per transaction (minimum $1.00; maximum $10,000.00). These are strictly for Business-to-Business usage only.
        </div>
        </div>
      </motion.details>

      {/* 10. Account Limits - Personal */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.0 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">How many USD accounts can I have with a Personal account?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          With a Personal account, you can have up to 2 active USD accounts per profile. Each USD account can hold up to 2 virtual cards and 1 physical card. P2P transfers are limited to $1,000 per transaction.
        </div>
        </div>
      </motion.details>

      {/* 11. Account Limits - Business */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.1 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">How many USD accounts can I have with a Business account?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          With a Business account, there is no maximum limit on active USD accounts. Each USD account can hold up to 50 virtual cards and 1 physical card, perfect for team management. P2P transfers are limited to $10,000 per transaction.
        </div>
        </div>
      </motion.details>

      {/* 12. Physical Cards */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">What are the fees for Physical Cards?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          <strong>Personal &amp; Business Accounts:</strong> Physical cards cost $19.95 per year, and shipping is charged separately at $5.00 per shipment. Maximum 1 physical card per USD account.
        </div>
        </div>
      </motion.details>

      {/* 13. Cross-Border Payments */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.3 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">What are the fees for cross-border payments?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          <strong>Personal &amp; Business Accounts:</strong> Cross-border payments incur a 1% fee per transaction. USD to BDT conversions also have a 1% fee with a minimum of $0.99 per transaction.
        </div>
        </div>
      </motion.details>

      {/* 14. Outgoing ACH */}
      <motion.details 
        className="group bg-white/80 dark:bg-[#0f1a2e]/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.4 }}
      >
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-[#f0f4f8]">What are the fees for outgoing ACH transfers?</span>
          </div>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-[#00e68a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out [grid-template-rows:0fr] group-open:[grid-template-rows:1fr]">
          <div className="px-6 pb-6 pt-4 text-sm text-slate-600 dark:text-[#c5d0db] leading-relaxed border-t border-emerald-100/50 dark:border-emerald-900/40 overflow-hidden">
          <strong>Personal Accounts:</strong> Outgoing ACH transfers have a 1% fee per transaction. <strong>Business Accounts:</strong> Outgoing ACH transfers have a 1% fee with a maximum charge of $5.00 per transaction.
        </div>
        </div>
      </motion.details>

    </div>
  </div>
</section>

{/* --- WHY CHOOSE PRIYO PAY --- */}
<section className="relative py-16 bg-gradient-to-b from-white to-emerald-50 dark:from-slate-900 dark:to-emerald-950/20 overflow-hidden">
  
  {/* Decorative background elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.07)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.12)_1px,transparent_0)] [background-size:24px_24px] opacity-30"></div>
    <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_52%,transparent_84%)] bg-[linear-gradient(to_right,rgba(16,185,129,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.1)_1px,transparent_1px)] [background-size:72px_72px] opacity-40"></div>
    <div className="absolute -top-24 left-1/4 w-[24rem] h-[24rem] rounded-full bg-emerald-400/10 dark:bg-[#00e68a]/7 blur-[84px]"></div>
    <div className="absolute -bottom-24 right-10 w-[20rem] h-[20rem] rounded-full bg-teal-400/10 dark:bg-teal-500/7 blur-[78px]"></div>
  </div>

  <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

    {/* Header */}
    <div className="text-center max-w-3xl mx-auto mb-12">
      <motion.div
        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00e68a] to-[#00cc7a] text-[#0a0e17] px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg shadow-[#00e68a]/18 border border-white/20"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        WHY CHOOSE PRIYO PAY
      </motion.div>

      <motion.h2 
        className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-[#f0f4f8] mt-2 leading-tight"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        Global banking
        <span className="block bg-gradient-to-r from-[#00e68a] to-[#00cc7a] bg-clip-text text-transparent">
          built for you
        </span>
      </motion.h2>
    </div>

    {/* Cards - 7 cards in a responsive grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">

      {/* Card 1: FREE Virtual Cards */}
      <motion.div
        className="group bg-white dark:bg-[#0f1a2e] border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-[#00e68a] to-[#00cc7a] rounded-xl shadow-md shadow-[#00e68a]/18 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-[#f0f4f8]">FREE Virtual Cards</h3>
      </motion.div>

      {/* Card 2: Low Transfer Fees */}
      <motion.div
        className="group bg-white dark:bg-[#0f1a2e] border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-[#00cc7a] to-[#00cc7a] rounded-xl shadow-md shadow-teal-500/30 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-[#f0f4f8]">Low Transfer Fees</h3>
      </motion.div>

      {/* Card 3: Global Transfers */}
      <motion.div
        className="group bg-white dark:bg-[#0f1a2e] border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-[#f0f4f8]">Global Transfers</h3>
      </motion.div>

      {/* Card 4: FREE USD Accounts */}
      <motion.div
        className="group bg-white dark:bg-[#0f1a2e] border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md shadow-purple-500/30 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-[#f0f4f8]">FREE USD Accounts</h3>
      </motion.div>

      {/* Card 5: FDIC Insured */}
      <motion.div
        className="group bg-white dark:bg-[#0f1a2e] border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-[#f0f4f8]">FDIC Insured</h3>
      </motion.div>

      {/* Card 6: Transparent Pricing */}
      <motion.div
        className="group bg-white dark:bg-[#0f1a2e] border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-md shadow-rose-500/30 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-[#f0f4f8]">Transparent Pricing</h3>
      </motion.div>

      {/* Card 7: Local Support */}
      <motion.div
        className="group bg-white dark:bg-[#0f1a2e] border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-5 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 }}
      >
        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-md shadow-cyan-500/30 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-[#f0f4f8]">Local Support</h3>
      </motion.div>

    </div>

    {/* CTA Button */}
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.7 }}
    >
      <Link
        href="https://pay.priyo.com/get-started"
        target="_blank"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00e68a] to-[#00cc7a] text-[#0a0e17] px-8 py-4 rounded-xl font-bold text-base hover:from-[#00cc7a] hover:to-[#00b86f] transition-all duration-300 shadow-xl shadow-[#00e68a]/18 hover:shadow-[#00e68a]/30 hover:-translate-y-0.5"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5M16 12h5M16 12a2 2 0 100 4h5"/>
        </svg>
        Open Your Free Account
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
      <p className="text-slate-500 dark:text-[#8899aa] mt-4 text-sm">
        • No Credit Check • No Minimum Deposit • 100% Online
      </p>
    </motion.div>

  </div>
</section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-50 dark:bg-[#0a0e17] text-gray-900 dark:text-[#f0f4f8] border-t border-gray-200 dark:border-white/10">
        <div className="mx-auto w-[92vw] sm:w-[90vw] px-0 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-1">
              <div className="mb-6">
                <img alt="Priyo Logo" loading="lazy" width="150" height="150" decoding="async" className="w-auto h-8" style={{color: 'transparent'}} src="/priyo-logo.png" />
              </div>
              <p className="text-gray-600 dark:text-[#8899aa] text-sm leading-relaxed mb-6">
                Empowering global financial solutions with innovative cross-border payments, student services, and business solutions.
              </p>
              <div className="flex space-x-4 mb-6">
                <a href="https://facebook.com/priyolife" className="text-blue-600 transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/priyo" className="text-blue-600 transition-colors" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                  </svg>
                </a>
                <a href="https://youtube.com/priyolife" className="text-red-600 transition-colors" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                  </svg>
                </a>
              </div>
              <div className="space-y-0 flex flex-col sm:flex-row gap-4">
                <a href="https://play.google.com/store/apps/details?id=com.priyo.pay&hl=en" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                  <img src="/playstore.webp" alt="Get it on Google Play" className="h-8 w-auto max-w-[180px] object-contain" />
                </a>
                <a href="https://apps.apple.com/us/app/priyo-pay/id6538727748" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                  <img src="/appstore.png" alt="Download on the App Store" className="h-8 w-auto max-w-[180px] object-contain" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-[#f0f4f8] font-semibold text-lg mb-6">Our Services</h3>
              <ul className="space-y-3">
                <li><a href="/personal" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">Personal</a></li>
                <li><a href="/business" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">Business</a></li>
                <li><a href="/card" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">Card</a></li>
                <li><a href="#education" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">Education</a></li>
                <li><a href="/ads" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">Advertising</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-[#f0f4f8] font-semibold text-lg mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#about" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">About Us</a></li>
                <li><a href="https://jobs.priyo.com" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">Careers</a></li>
                <li><a href="https://news.priyo.com" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">News & Updates</a></li>
                <li><a href="#press" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">Press Kit</a></li>
                <li><a href="/contact" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-[#f0f4f8] font-semibold text-lg mb-6">Legal</h3>
              <ul className="space-y-3">
                <li><a href="/disclosures" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">Disclosures</a></li>
                <li><a href="/terms" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">Terms of Service</a></li>
                <li><a href="/privacy" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="/fees" className="text-gray-600 dark:text-[#8899aa] hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-sm">Fees & Charges</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-white/10 pt-8 mb-8">
            <div className="space-y-4 text-xs text-gray-500 dark:text-[#8899aa] leading-relaxed">
              <p>Priyo Payments LLC, a subsidiary of Priyo Inc., is a service provider of Regent Bank USA for Priyo Card and Checking Accounts. Neither Priyo Inc. nor Priyo Payments LLC is a bank.</p>
              <p>Banking services are provided by Regent Bank, Member FDIC. FDIC insurance only covers failure of insured depository institutions. Certain conditions must be satisfied for pass-through FDIC deposit insurance to apply.</p>
              <p>The Priyo Mastercard® Debit Card is issued by Regent Bank pursuant to a license from Mastercard U.S.A. Inc. and may be used everywhere Mastercard debit cards are accepted. Mastercard is a registered trademark, and the circles design is a trademark of Mastercard International Incorporated.</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-[#0f1a2e] text-gray-600 dark:text-[#8899aa] text-sm">
          <div className="border-t border-gray-300 dark:border-white/10"></div>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-600 dark:text-[#8899aa]">Copyright © 2026 Priyo Inc. All rights reserved.</div>
              <div className="text-gray-600 dark:text-[#8899aa]">United States</div>
              <div className="flex items-center flex-wrap justify-start sm:gap-x-2 text-gray-600 dark:text-[#8899aa]">
                <a href="/privacy" className="hover:text-gray-800 dark:hover:text-slate-200 transition-colors">Privacy Policy |</a>
                <a href="/terms" className="hover:text-gray-800 dark:hover:text-slate-200 transition-colors">Terms of Use</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}















