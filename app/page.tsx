'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const SUB_NAV_ITEMS = [
  { id: 'maintenance-service-fees', label: 'Maintenance & Service Fees' },
  { id: 'receive-money', label: 'Receive Money' },
  { id: 'send-money-payments', label: 'Payments & Transfers' },
  { id: 'additional-resources', label: 'Additional Resources' },
  { id: 'limits', label: 'Account & Usage Limits' },
];

// ----------------------------------------------------------------------
// 1. Reusable Components (Theme-matched)
// ----------------------------------------------------------------------

const Badge = ({ children, color = 'slate' }: { children: React.ReactNode, color?: 'slate' | 'emerald' | 'pink' }) => {
  const styles = {
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    pink: 'bg-[#E61C5D]/5 text-[#E61C5D] border-[#E61C5D]/10',
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${styles[color]}`}>
      {children}
    </span>
  );
};

const FeeRow = ({ label, desc, price, period, isHighlight = false }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-4 group">
    <div className="flex-1">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-500 transition-colors">
          {label}
        </span>
      </div>
      {desc && <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-sm">{desc}</p>}
    </div>
    
    <div className="text-left sm:text-right shrink-0">
      <div className={`text-base font-bold ${price === 'FREE' || price === '$0.00' ? 'text-emerald-500' : 'text-slate-900'}`}>
        {price}
      </div>
      {period && <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">{period}</div>}
    </div>
  </div>
);

const FeeSubsection = ({ title, children, id }: any) => (
  <div className="mb-8" id={id}>
    <h4 className="text-lg font-bold text-center text-emerald-500 mb-4 pb-2 border-b border-slate-200">{title}</h4>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);


const AccountTypeNavigation = ({ activeAccountType, setActiveAccountType }: any) => {
  const accountTypes = [
    { id: 'personal', label: 'Personal' },
    { id: 'business', label: 'Business' }
  ];

  return (
    <div className="sticky top-[68px] z-40 bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-lg border-b border-white/20 shadow-lg rounded-2xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center gap-8 py-4">
          {accountTypes.map((account) => (
            <button
              key={account.id}
              onClick={() => setActiveAccountType(account.id)}
              className={`px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                activeAccountType === account.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-slate-600 hover:text-emerald-500 hover:bg-slate-50'
              }`}
            >
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
      const headerHeight = 145; // Sub Navigation sticky position (top-[145px])
      
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
  }, [activeSection, accountType]);

  return (
    <div className="sticky top-[145px] z-30 bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-lg border-r border-white/20 shadow-lg rounded-r-2xl">
      <div className="px-4 py-4">
        <div className="flex flex-col items-start gap-2 overflow-y-auto">
          {SUB_NAV_ITEMS.map((item) => {
            const sectionId = `${accountType}-${item.id}`;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(sectionId)}
                className={`px-4 py-3 text-xs font-medium whitespace-nowrap rounded-lg transition-all duration-200 text-left w-full ${
                  activeSection === sectionId
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-emerald-500 hover:bg-white'
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
  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500">
    <div className="p-8">
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

  const getServiceName = () => {
    const names: Record<string, string> = {
      'virtual-card': 'Virtual Card',
      'physical-card': 'Physical Card',
      'card-shipping': 'Card Shipping',
      'maintenance': 'Maintenance Fee',
      'additional-account': 'Additional USD Account',
      'incoming-ach': 'Incoming ACH',
      'outgoing-ach': 'Outgoing ACH',
      'incoming-wire': 'Incoming Wire (Domestic)',
      'outgoing-wire': 'Outgoing Wire (Domestic)',
      'incoming-wire-intl': 'Incoming Wire (International)',
      'p2p': 'P2P Transfer',
      'third-party': 'Third-Party Payment',
      'cross-border': 'Cross-Border Payment',
      'usd-to-bdt': 'USD to BDT Conversion',
      'atm': 'ATM Withdrawal'
    };
    return names[calculatorService] || '';
  };

  const getFeeRate = () => {
    const rates: Record<string, string> = {
      'virtual-card': calculatorAccount === 'personal' ? '$3.00 per card' : 'FREE (first 50)',
      'physical-card': '$19.95 per year + $5.00 shipping (included)',
      'card-shipping': '$5.00 per shipment',
      'maintenance': calculatorAccount === 'personal' ? '$10 per 6 months' : 'FREE',
      'additional-account': calculatorAccount === 'personal' ? '$10 per 6 months' : '$10 per 6 months',
      'incoming-ach': '$0.25 per transaction (first 10 free monthly)',
      'outgoing-ach': '1% of transaction amount (max $5.00)',
      'incoming-wire': '$10.00 per transaction',
      'outgoing-wire': '$10.00 + 1% of amount (max $20.00)',
      'incoming-wire-intl': '$25.00 per transaction',
      'p2p': '1% of transaction amount (min $1.00, max $1,000)',
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
        // $0.25 per transaction (first 10 free)
        const achFee = Math.max(0, (transactions - 10) * 0.25);
        return achFee;
      case 'outgoing-ach':
        // 1% with $5 max per transaction
        const achOutFee = Math.min(5, amount * 0.01);
        return achOutFee * transactions;
      case 'incoming-wire':
        // $10 per transaction
        return 10 * transactions;
      case 'outgoing-wire':
        // $10 + 1% with $20 max per transaction
        const wireFee = Math.min(20, 10 + (amount * 0.01));
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
        'additional-account': { max: 10, current: 'USD Account', description: 'Maximum 10 USD accounts per profile' },
        'p2p': { max: 1000, current: 'P2P Transfer', description: 'Maximum $1,000 per P2P transaction' },
        'atm': { max: 500, current: 'ATM Withdrawal', description: 'Maximum $500 per 24 hours for withdrawals to MFS' }
      },
      business: {
        'virtual-card': { max: 50, current: 'Virtual Card', description: 'Maximum 50 virtual cards per USD account' },
        'physical-card': { max: 1, current: 'Physical Card', description: 'Maximum 1 physical card per USD account' },
        'additional-account': { max: 5, current: 'USD Account', description: 'Maximum 5 USD accounts per business' },
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
      return `⚠️ Limit exceeded: ${limitInfo.description}. You requested ${limitInfo.current} but maximum is ${limitInfo.max}.`;
    }

    const notes: Record<string, string> = {
      'virtual-card': calculatorAccount === 'personal' ? 'First virtual card is FREE for personal accounts only. Business accounts get first 50 cards FREE.' : 'First 50 virtual cards are FREE for business accounts.',
      'maintenance': calculatorAccount === 'business' ? 'FREE for up to 5 USD accounts for business accounts.' : 'FREE for personal accounts if you bring $5,000/year in deposits.',
      'additional-account': calculatorAccount === 'personal' ? 'Additional USD accounts cost $10 each for personal accounts.' : 'First 5 USD accounts are FREE for business accounts.',
      'incoming-ach': 'First 10 transactions are FREE every month for all account types.',
      'outgoing-ach': 'Maximum fee is $5.00 regardless of transaction amount.',
      'outgoing-wire': 'Maximum fee is $20.00 regardless of transaction amount.',
      'p2p': 'Business to Business transfers only.'
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
    getServiceName,
    getFeeRate,
    calculateFee,
    getAccountLimits,
    getFeeNote
  };
};

export default function FeesPage() {
  const [activeAccountType, setActiveAccountType] = useState('personal');
  const [activeSection, setActiveSection] = useState('personal-maintenance-service-fees');
  
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
    getServiceName,
    getFeeRate,
    calculateFee,
    getAccountLimits,
    getFeeNote
  } = useFeeCalculator();

  useEffect(() => {
    setActiveSection(`${activeAccountType}-maintenance-service-fees`);
  }, [activeAccountType]);

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter',_'DM_Sans'] text-slate-900 selection:bg-emerald-500 selection:text-white">
      
      {/* --- HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
             <span className="text-xl font-extrabold text-slate-900 tracking-tight">Priyo Pay</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="https://pay.priyo.com" className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10">
                Open Account
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-white min-h-[80vh] flex items-center">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated gradient orbs */}
          <motion.div 
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px]"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[80px]"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[60px]"
            animate={{
              x: [0, 120, -120, 0],
              y: [0, -80, 80, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-emerald-500/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        </div>

        <div className="relative z-10 w-full py-12 md:py-16 lg:py-20 lg:px-0 px-8">
          <div className="mx-auto flex flex-col lg:flex-row gap-12 relative z-10 max-w-5xl 2xl:max-w-[1500px] items-center">
            {/* Left Column - Hero Content */}
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl text-slate-600 tracking-tight mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                No Hidden Charges
              </motion.div>
              <motion.h1 
                className="text-5xl lg:text-6xl 2xl:text-8xl max-w-4xl font-extrabold text-slate-900 tracking-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                Fees
              </motion.h1>
              <motion.div 
                className="text-base md:text-lg lg:text-xl 2xl:text-2xl mb-6 md:mb-8 2xl:max-w-2xl lg:max-w-xl max-w-sm leading-relaxed text-slate-600 mt-2 md:mt-4"
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
                href="https://pay.priyo.com" 
                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold text-base hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 w-fit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Open Account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.a>
            </motion.div>
            
            {/* Right Column - Fee Calculator */}
            <motion.div 
              className="flex-1 lg:max-w-md"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-3xl border border-emerald-200/50 shadow-2xl p-8 backdrop-blur-sm relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-75"></div>
                
                {/* Header */}
                <motion.div 
                  className="relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Fee Calculator</h3>
                      <p className="text-sm text-slate-600">Calculate your costs instantly</p>
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
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Account Type
                    </label>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => setCalculatorAccount('personal')}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform ${
                          calculatorAccount === 'personal'
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-500/50'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
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
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform ${
                          calculatorAccount === 'business'
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-500/50'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
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
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Service Type
                    </label>
                    <motion.select
                      value={calculatorService}
                      onChange={(e) => setCalculatorService(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm hover:bg-white"
                      whileFocus={{ scale: 1.02 }}
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
                        <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {getCalculatorLabel()}
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">$</span>
                          <motion.input
                            type="number"
                            value={calculatorAmount}
                            onChange={(e) => setCalculatorAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm hover:bg-white"
                            whileFocus={{ scale: 1.02 }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Transaction Count Input */}
                  <AnimatePresence>
                    {calculatorService && [
                      'incoming-ach', 'outgoing-ach', 'incoming-wire', 'outgoing-wire', 
                      'incoming-wire-intl', 'p2p', 'third-party', 'cross-border', 
                      'usd-to-bdt', 'atm'
                    ].includes(calculatorService) && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                      >
                        <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm hover:bg-white"
                          whileFocus={{ scale: 1.02 }}
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
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-pulse">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-red-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span className="text-sm font-semibold text-red-700">Account Limit Exceeded</span>
                              </div>
                              <p className="text-xs text-red-600">{getFeeNote()}</p>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Fee Rate:</span>
                              <span className="text-sm font-semibold text-slate-900">{getFeeRate()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-base font-bold text-slate-900">Total Fee:</span>
                              <span className="text-xl font-bold text-emerald-500">
                                ${calculateFee().toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-3 border-b border-slate-200">
                              <span className="text-sm text-slate-600">Fee Rate:</span>
                              <span className="text-sm font-semibold text-slate-900">{getFeeRate()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-base font-bold text-slate-900">Total Fee:</span>
                              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                                ${calculateFee().toLocaleString()}
                              </span>
                            </div>
                            {getFeeNote() && (
                              <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200/50">
                                <p className="text-xs text-emerald-700 flex items-start gap-2">
                                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {getFeeNote()}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- DETAILED FEE LISTS --- */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          
          {/* Account Type Navigation */}
          <AccountTypeNavigation 
            activeAccountType={activeAccountType} 
            setActiveAccountType={setActiveAccountType} 
          />
          
          <div className="flex gap-6 mt-6">
            {/* Sub Navigation - Vertical Left Sidebar */}
            <div className="w-64 flex-shrink-0">
              <SubNavigation 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                accountType={activeAccountType}
              />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              {/* Personal Account Section */}
              {activeAccountType === 'personal' && (
                <AccountTypeSection>
                  <FeeSubsection title="Maintenance & Service Fees" id="personal-maintenance-service-fees">
                <FeeRow 
                  label="Maintenance Fee (1 USD, 1 Virtual Card & 1 BDT Account)" 
                  desc={<> <span className="text-emerald-500 font-bold">FREE</span> If you bring $5,000 / year <a href="https://pay.priyo.com/fee-waiver" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-600 underline font-bold">Learn more</a>. </>} 
                  price="$10" 
                  period="Every 6 months"
                />
                <FeeRow 
                  label="Maintenance Fee (BDT Account Only)" 
                  desc={<>Payable in every 12 months. <span className='text-emerald-500 font-bold'>FREE</span> for USD Account Holder.</>} 
                  price="৳199.00" 
                  period="Yearly"
                />
                <FeeRow 
                  label="Virtual Card (Debit)" 
                  desc={<>The first virtual debit card for your personal account is <span className='text-emerald-500 font-bold'>FREE</span>. Any additional cards incur a fee.</>} 
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
                  desc={<>First 10 transactions are <span className='text-emerald-500 font-bold'>FREE</span> every month.</>} 
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
                  label="Additionl USD Accounts"
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
                <div className="border-b border-slate-200 pb-2 mb-4">
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resource Limits</h5>
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
                
                <div className="border-b border-slate-200 pb-2 mb-4 mt-6">
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction Limits</h5>
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
                  desc={<>Zero monthly fee. <span className='text-emerald-500 font-bold'>FREE</span> forever.</>}
                  price="FREE" 
                  period="Upto 5 USD Accounts"
                  
                />
                
                <FeeRow 
                  label="Virtual Card (Debit)" 
                  desc={<>Zero monthly fee. <span className='text-emerald-500 font-bold'>FREE</span> forever.</>}
                  price="FREE" 
                  period="Upto 50 Cards"
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
                  desc={<>First 10 transactions are <span className='text-emerald-500 font-bold'>FREE</span> every month.</>} 
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
                  desc={<>Any Bank in the USA. <span className='text-emerald-500 font-bold'>Maximum Fee $5.00</span>, You'll never pay more than $5, regardless of the transaction amount.</>} 
                  price="1.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Outgoing Domestic Wire" 
                  desc={<>Sending Wire to any Bank in the USA. <span className='text-emerald-500 font-bold'>Maximum Fee $20.00</span>, You'll never pay more than $20, regardless of the transaction amount.</>} 
                  price="$10.00 + 1%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Payment to another Priyo Pay user (P2P)" 
                  desc="Minimum Fee: $1.00. Maximum $1,000.00. Business to Business only" 
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
                  label="Additionl USD Accounts"
                  desc={<>Charged per additional account. First 5 accounts are <span className='text-emerald-500 font-bold'>FREE</span>.</>}
                  price="$10.00" 
                  period="Every 6 months"
                />
                <FeeRow 
                  label="Additional Virtual Cards" 
                  desc={<>Charged per additional cards. First 50 cards are <span className='text-emerald-500 font-bold'>FREE</span>.</>}
                  price="$3.00" 
                  period="One-time"
                />
              </FeeSubsection>

              <FeeSubsection title="Account & Usage Limits" id="business-limits">
                <div className="border-b border-slate-200 pb-2 mb-4">
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resource Account & Usage Limits</h5>
                </div>
                
                <FeeRow 
                  label="USD Account" 
                  desc="Maximum number of active USD accounts per business." 
                  price="5" 
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
                
                <div className="border-b border-slate-200 pb-2 mb-4 mt-6">
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction Limits</h5>
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
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
<section className="py-24 bg-white border-t border-slate-100">
  <div className="container mx-auto px-6 max-w-3xl">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Common Questions</h2>
      <p className="text-slate-500">Clarifications on our fee structure and account maintenance.</p>
    </div>

    <div className="space-y-4">
      
      {/* 1. Maintenance Fee Billing */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">How is the maintenance fee billed?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          The $10 maintenance fee covers your USD account maintenance for 6 months. It is automatically deducted from your balance at the start of each 6-month cycle.
        </div>
      </details>

      {/* 2. Fee Waiver */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">How can I waive the maintenance fee?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          The maintenance fee is waived (FREE) if you bring in $5,000 or more in deposits per year. <a href="https://pay.priyo.com/fee-waiver" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-600 underline font-bold">Learn more</a>
        </div>
      </details>

      {/* 3. Virtual Cards */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">Is the Virtual Card really free?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          For personal accounts, your first virtual debit card is issued absolutely FREE. Any additional cards incur a one-time fee of $3.00 per card.
        </div>
      </details>

      {/* 4. Incoming ACH */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">Are there fees for incoming ACH transfers?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          We offer the first 10 incoming ACH transactions every month for FREE. After that, a fee of $0.25 applies per transaction.
        </div>
      </details>

      {/* 5. Wires */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">What are the fees for Wire transfers?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          Incoming domestic wires are $10.00, and international SWIFT wires are $25.00 per transaction. Outgoing domestic wires are $10.00 plus a 1% fee.
        </div>
      </details>

      {/* 6. ATM Withdrawal */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">Are there fees for ATM withdrawals?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          Yes, ATM withdrawals globally incur a 1% fee, with a minimum charge of $3.00.
        </div>
      </details>

      {/* 7. Business - Maintenance Fees */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">Are there maintenance fees for Business Accounts?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          No. Business accounts enjoy a zero monthly maintenance fee for up to 2 USD accounts. It is absolutely FREE.
        </div>
      </details>

      {/* 8. Business - Virtual Cards */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">How many Virtual Cards can a business have?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          Business accounts can issue up to 20 virtual cards for FREE. Any cards issued beyond this limit incur a one-time fee of $3.00 per card.
        </div>
      </details>

      {/* 9. Business - P2P Transfers */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">Can I use P2P transfers for my business?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          Yes. Business-to-business P2P transfers are available for 1.00% per transaction (min. $1.00; max $1,000.00). Please note that these are strictly for Business-to-Business usage.
        </div>
      </details>

      {/* 10. Account Limits - Personal */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">How many USD accounts can I have with a Personal account?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          With a Personal account, you can have up to 2 active USD accounts per profile. Each USD account can hold up to 2 virtual cards and 1 physical card.
        </div>
      </details>

      {/* 11. Account Limits - Business */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">How many USD accounts can I have with a Business account?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          With a Business account, you can have up to 2 active USD accounts per business. Each USD account can hold up to 20 virtual cards and 1 physical card, perfect for team management.
        </div>
      </details>

      {/* 12. Transaction Limits - Personal */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">What are the transaction limits for Personal accounts?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          For Personal accounts: General withdrawals/transfers are limited to $1,000/day for accounts under 30 days old, and $4,000/day for accounts 30+ days old. Card transactions are limited to $1,000/day (max 10 transactions) for new accounts, and $3,000/day (max 30 transactions) for established accounts.
        </div>
      </details>

      {/* 13. Transaction Limits - Business */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">What are the transaction limits for Business accounts?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          For Business accounts: General withdrawals/transfers are limited to $5,000/day for accounts under 30 days old, and $10,000/day for accounts 30+ days old. Card transactions are limited to $5,000/day (max 20 transactions) for new accounts, and $10,000/day (max 30 transactions) for established accounts.
        </div>
      </details>

      {/* 14. MFS Withdrawal Limits */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-emerald-500/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-slate-900">Is there a limit for withdrawals to Mobile Financial Services?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          Yes. Withdrawals to Mobile Financial Services like bKash are limited to $500 per 24 hours for both Personal and Business accounts. This limit applies regardless of account age.
        </div>
      </details>

    </div>
  </div>
</section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-50 text-gray-900 border-t border-gray-200">
        <div className="mx-auto w-[90vw] px-0 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-1">
              <div className="mb-6">
                <img alt="Priyo Logo" loading="lazy" width="150" height="150" decoding="async" className="w-auto h-8" style={{color: 'transparent'}} src="/priyo-logo.png" />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
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
              <div className="space-y-4 flex flex-row gap-4">
                <a href="https://play.google.com/store/apps/details?id=com.priyo.pay&hl=en" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                  <img src="/playstore.webp" alt="Get it on Google Play" className="h-8 w-auto max-w-[180px] object-contain" />
                </a>
                <a href="https://apps.apple.com/us/app/priyo-pay/id6538727748" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                  <img src="/appstore.png" alt="Download on the App Store" className="h-8 w-auto max-w-[180px] object-contain" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-lg mb-6">Our Services</h3>
              <ul className="space-y-3">
                <li><a href="/personal" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Personal</a></li>
                <li><a href="/business" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Business</a></li>
                <li><a href="/card" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Card</a></li>
                <li><a href="#education" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Education</a></li>
                <li><a href="/ads" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Advertising</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-lg mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">About Us</a></li>
                <li><a href="https://jobs.priyo.com" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Careers</a></li>
                <li><a href="https://news.priyo.com" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">News & Updates</a></li>
                <li><a href="#press" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Press Kit</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-lg mb-6">Legal</h3>
              <ul className="space-y-3">
                <li><a href="/disclosures" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Disclosures</a></li>
                <li><a href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Terms of Service</a></li>
                <li><a href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="/fees" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Fees & Charges</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 mb-8">
            <div className="space-y-4 text-xs text-gray-500 leading-relaxed">
              <p>Priyo Payments LLC, a subsidiary of Priyo Inc., is a service provider of Regent Bank USA for Priyo Card and Checking Accounts. Neither Priyo Inc. nor Priyo Payments LLC is a bank.</p>
              <p>Banking services are provided by Regent Bank, Member FDIC. FDIC insurance only covers failure of insured depository institutions. Certain conditions must be satisfied for pass-through FDIC deposit insurance to apply.</p>
              <p>The Priyo Mastercard® Debit Card is issued by Regent Bank pursuant to a license from Mastercard U.S.A. Inc. and may be used everywhere Mastercard debit cards are accepted. Mastercard is a registered trademark, and the circles design is a trademark of Mastercard International Incorporated.</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 text-gray-600 text-sm">
          <div className="border-t border-gray-300"></div>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-600">Copyright © 2026 Priyo Inc. All rights reserved.</div>
              <div className="text-gray-600">United States</div>
              <div className="flex items-center flex-wrap justify-start sm:gap-x-2 text-gray-600">
                <a href="/privacy" className="hover:text-gray-800 transition-colors">Privacy Policy |</a>
                <a href="/terms" className="hover:text-gray-800 transition-colors">Terms of Use</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
