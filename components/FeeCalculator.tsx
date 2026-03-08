'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalculatorData {
  programType: 'bachelor' | 'master' | 'language';
  country: string;
  universityType: 'public' | 'private';
  duration: number;
}

interface CalculatedCosts {
  tuitionFee: number;
  livingCost: number;
  visaCost: number;
  totalCost: number;
}

const FeeCalculator: React.FC = () => {
  const [data, setData] = useState<CalculatorData>({
    programType: 'bachelor',
    country: 'usa',
    universityType: 'public',
    duration: 4
  });

  const [costs, setCosts] = useState<CalculatedCosts>({
    tuitionFee: 0,
    livingCost: 0,
    visaCost: 0,
    totalCost: 0
  });

  const [isCalculating, setIsCalculating] = useState(false);

  // Base costs for different scenarios
  const baseCosts = {
    usa: {
      bachelor: { public: 25000, private: 40000 },
      master: { public: 20000, private: 35000 },
      language: { public: 15000, private: 25000 }
    },
    uk: {
      bachelor: { public: 18000, private: 30000 },
      master: { public: 15000, private: 28000 },
      language: { public: 12000, private: 20000 }
    },
    canada: {
      bachelor: { public: 20000, private: 35000 },
      master: { public: 18000, private: 32000 },
      language: { public: 14000, private: 22000 }
    }
  };

  const livingCosts = {
    usa: 15000,
    uk: 12000,
    canada: 13000
  };

  const visaCosts = {
    usa: 185,
    uk: 348,
    canada: 150
  };

  useEffect(() => {
    setIsCalculating(true);
    
    const timer = setTimeout(() => {
      const countryData = baseCosts[data.country as keyof typeof baseCosts];
      const programData = countryData[data.programType];
      const tuition = programData[data.universityType] * data.duration;
      const living = livingCosts[data.country as keyof typeof livingCosts] * data.duration;
      const visa = visaCosts[data.country as keyof typeof visaCosts];
      const total = tuition + living + visa;

      setCosts({
        tuitionFee: tuition,
        livingCost: living,
        visaCost: visa,
        totalCost: total
      });
      setIsCalculating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [data]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const AnimatedCounter: React.FC<{ value: number; prefix?: string }> = ({ value, prefix = '' }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      const duration = 1000;
      const steps = 60;
      const stepValue = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [value]);

    return (
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {prefix}{formatCurrency(displayValue)}
      </motion.span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 shadow-xl border border-slate-100"
    >
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-slate-900 mb-2">Interactive Fee Calculator</h3>
        <p className="text-slate-600">Estimate your total education costs instantly</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side - Inputs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Program Type</label>
            <select
              value={data.programType}
              onChange={(e) => setData({ ...data, programType: e.target.value as CalculatorData['programType'] })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#E61C5D] focus:ring-2 focus:ring-[#E61C5D]/20 transition-all duration-200 bg-white"
            >
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="language">Language Program</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
            <select
              value={data.country}
              onChange={(e) => setData({ ...data, country: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#E61C5D] focus:ring-2 focus:ring-[#E61C5D]/20 transition-all duration-200 bg-white"
            >
              <option value="usa">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="canada">Canada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">University Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setData({ ...data, universityType: 'public' })}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  data.universityType === 'public'
                    ? 'bg-[#E61C5D] text-white shadow-lg shadow-[#E61C5D]/25'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setData({ ...data, universityType: 'private' })}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  data.universityType === 'private'
                    ? 'bg-[#E61C5D] text-white shadow-lg shadow-[#E61C5D]/25'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                Private
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Duration: {data.duration} {data.duration === 1 ? 'Year' : 'Years'}
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={data.duration}
              onChange={(e) => setData({ ...data, duration: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E61C5D]"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1 year</span>
              <span>6 years</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-[#E61C5D] to-[#c9154e] rounded-2xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold">Cost Breakdown</h4>
              <AnimatePresence>
                {isCalculating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-between items-center py-3 border-b border-white/20"
              >
                <span className="text-white/80">Tuition Fee</span>
                <span className="font-bold text-lg">
                  <AnimatedCounter value={costs.tuitionFee} />
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-between items-center py-3 border-b border-white/20"
              >
                <span className="text-white/80">Living Cost</span>
                <span className="font-bold text-lg">
                  <AnimatedCounter value={costs.livingCost} />
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-between items-center py-3 border-b border-white/20"
              >
                <span className="text-white/80">Visa Cost</span>
                <span className="font-bold text-lg">
                  <AnimatedCounter value={costs.visaCost} />
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between items-center py-4 bg-white/10 rounded-xl px-4 -mx-4"
              >
                <span className="font-semibold text-lg">Total Cost</span>
                <span className="font-bold text-2xl">
                  <AnimatedCounter value={costs.totalCost} />
                </span>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 bg-white text-[#E61C5D] px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-all duration-200 shadow-lg"
            >
              Get Detailed Breakdown
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeeCalculator;
