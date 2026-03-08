'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  ctaLink: string;
}

interface PricingCardsProps {
  plans: PricingPlan[];
}

const PricingCards: React.FC<PricingCardsProps> = ({ plans }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
    >
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          variants={cardVariants}
          whileHover={{
            y: -8,
            scale: plan.highlighted ? 1.02 : 1.05,
            transition: { duration: 0.3, ease: 'easeOut' }
          }}
          className={`relative group ${
            plan.highlighted
              ? 'md:scale-105 md:z-10'
              : ''
          }`}
        >
          {/* Highlighted Badge */}
          {plan.highlighted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
            >
              <div className="bg-gradient-to-r from-[#E61C5D] to-[#c9154e] text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                <Star className="w-4 h-4 fill-current" />
                Most Popular
              </div>
            </motion.div>
          )}

          {/* Card */}
          <motion.div
            className={`relative h-full rounded-2xl p-8 transition-all duration-300 ${
              plan.highlighted
                ? 'bg-gradient-to-br from-[#E61C5D] to-[#c9154e] text-white shadow-2xl shadow-[#E61C5D]/25 border-2 border-[#E61C5D]'
                : 'bg-white border border-slate-200 hover:border-[#E61C5D]/50 hover:shadow-xl'
            }`}
            whileHover={{
              boxShadow: plan.highlighted
                ? '0 25px 50px -12px rgba(230, 28, 93, 0.4)'
                : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            {/* Glow Effect on Hover */}
            <motion.div
              className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-[#E61C5D]/20 to-[#c9154e]/20'
                  : 'bg-gradient-to-br from-[#E61C5D]/10 to-transparent'
              }`}
              style={{ filter: 'blur(20px)' }}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Plan Name */}
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className={`text-2xl font-bold mb-2 ${
                  plan.highlighted ? 'text-white' : 'text-slate-900'
                }`}
              >
                {plan.name}
              </motion.h3>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="mb-4"
              >
                <div className={`text-4xl font-bold ${
                  plan.highlighted ? 'text-white' : 'text-slate-900'
                }`}>
                  {plan.price}
                </div>
                <div className={`text-sm ${
                  plan.highlighted ? 'text-white/80' : 'text-slate-600'
                }`}>
                  {plan.period}
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`mb-6 text-sm ${
                  plan.highlighted ? 'text-white/90' : 'text-slate-600'
                }`}
              >
                {plan.description}
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="space-y-3 mb-8"
              >
                {plan.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + featureIndex * 0.1 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.highlighted
                        ? 'bg-white/20'
                        : 'bg-[#E61C5D]/10'
                    }`}>
                      <Check className={`w-3 h-3 ${
                        plan.highlighted ? 'text-white' : 'text-[#E61C5D]'
                      }`} />
                    </div>
                    <span className={`text-sm ${
                      plan.highlighted ? 'text-white/90' : 'text-slate-700'
                    }`}>
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <motion.a
                  href={plan.ctaLink}
                  className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? 'bg-white text-[#E61C5D] hover:bg-white/90 shadow-lg'
                      : 'bg-[#E61C5D] text-white hover:bg-[#c9154e] shadow-lg shadow-[#E61C5D]/25'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PricingCards;
