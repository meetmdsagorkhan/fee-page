'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';

// Reusable Component for Fee Rows
const FeeRow = ({ title, subtitle, price, condition, isFree, secondaryPrice, secondaryCondition }: any) => (
  <div className={`flex flex-col lg:flex-row gap-4 w-full px-4 md:px-6 rounded-xl transition-all duration-300 hover:shadow-md ${isFree ? 'bg-[#efefef]' : 'bg-white border border-gray-100'}`}>
    {/* Left Side: Description */}
    <div className="flex flex-col lg:w-3/5 lg:border-r-2 lg:border-gray-300 lg:pr-10 py-4 md:py-6 lg:border-dashed justify-center">
      <div className="text-lg md:text-xl font-bold leading-tight text-gray-900">{title}</div>
      {subtitle && <div className="text-sm md:text-base text-gray-500 mt-2 leading-relaxed">{subtitle}</div>}
    </div>

    {/* Right Side: Price */}
    <div className="text-sm md:text-base lg:w-2/5 lg:pl-4 py-4 md:py-6 flex flex-col justify-center gap-3">
      <div className="flex flex-row justify-between md:flex-col items-center md:items-baseline gap-2">
        <div className={`px-4 py-1.5 rounded-md w-fit font-bold text-sm md:text-base ${price === 'FREE' ? 'bg-green-600 text-white' : 'bg-gray-900 text-white'}`}>
          {price}
        </div>
        {condition && <div className="text-sm text-gray-700 font-medium">{condition}</div>}
      </div>

      {/* Optional Secondary Price (e.g., for BDT account alternative) */}
      {secondaryPrice && (
        <div className="flex flex-row justify-between md:flex-col items-center md:items-baseline gap-2 mt-2 pt-2 border-t border-gray-200 w-full">
           <div className="px-4 py-1.5 rounded-md w-fit font-bold text-sm md:text-base bg-gray-900 text-white">
            {secondaryPrice}
          </div>
          <div className="text-sm text-gray-700 font-medium">{secondaryCondition}</div>
        </div>
      )}
    </div>
  </div>
);

export default function FeesPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((reveal) => observer.observe(reveal));

    return () => {
      reveals.forEach((reveal) => observer.unobserve(reveal));
    };
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-primary selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-black">
        {/* Background Gradients/Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-0 w-80 h-80 bg-secondary/15 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 max-w-4xl">
            <span className="text-lg md:text-xl font-medium text-gray-300 tracking-wide uppercase">
              Transparent Pricing
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
              Simple Fees.<br/>
              <span className="gradient-text">No Hidden Charges.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mt-4">
              A clear breakdown of costs for cards, accounts, and transfers. 
              We bill subscription fees every 6 months to keep things simple.
            </p>

            <div className="mt-8">
              <Link href="https://pay.priyo.com" target="_blank" 
                className="inline-block rounded-full px-8 py-4 text-lg font-bold bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Open Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEES CONTENT */}
      <div className="w-full py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* SECTION 1: MAINTENANCE */}
          <section className="reveal">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-gray-900">
              Maintenance & Subscription
            </h2>
            <div className="flex flex-col gap-4">
              <FeeRow 
                isFree={true}
                title="Monthly Maintenance (USD & BDT)" 
                subtitle="Includes one active USD account and one BDT account."
                price="FREE" 
                condition="Waived if you transfer $2,000+ to Bangladesh annually."
              />
              <FeeRow 
                isFree={false}
                title="USD Account Subscription" 
                subtitle="Applies to both Personal and Business accounts. Billed every 6 months."
                price="$10.00" 
                condition="Per 6-month cycle"
              />
              <FeeRow 
                isFree={true}
                title="BDT Account Only" 
                subtitle="For users who only need a Bangladeshi Taka account."
                price="FREE" 
                condition="If you already hold a USD Account."
                secondaryPrice="৳199.00"
                secondaryCondition="Yearly fee if you do NOT have a USD Account."
              />
              <FeeRow 
                isFree={false}
                title="Virtual Debit Card" 
                subtitle="Instant virtual card for online purchases."
                price="$3.00" 
                condition="One-time issuance fee. First card is free for Personal accounts."
              />
              <FeeRow 
                isFree={true}
                title="Physical Mastercard" 
                subtitle="A plastic card delivered to your door. Shipping is charged separately."
                price="$19.95" 
                condition="Yearly fee."
              />
              <FeeRow 
                isFree={false}
                title="Card Shipping" 
                subtitle="Standard global shipping (3-6 weeks). Expedited FedEx shipping available for $40."
                price="$5.00" 
                condition="One-time per delivery"
              />
            </div>
          </section>

          {/* SECTION 2: RECEIVE MONEY */}
          <section className="reveal">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-gray-900">
              Receive Money
            </h2>
            <div className="flex flex-col gap-4">
              <FeeRow 
                isFree={true}
                title="Priyo to Priyo (P2P)" 
                subtitle="Receive money instantly from another Priyo user."
                price="FREE" 
              />
              <FeeRow 
                isFree={false}
                title="Receive from US Bank (ACH)" 
                subtitle="Direct deposit from any bank in the USA."
                price="$0.10" 
                condition="Free for the first 10 transactions every month."
              />
              <FeeRow 
                isFree={true}
                title="Receive Domestic Wire" 
                subtitle="High-value transfers from US banks via Wire network."
                price="$10.00" 
                condition="Per transaction"
              />
              <FeeRow 
                isFree={false}
                title="Receive International Wire (SWIFT)" 
                subtitle="Receive funds from banks outside the USA."
                price="$25.00" 
                condition="Per transaction"
              />
               <FeeRow 
                isFree={true}
                title="Load via Card" 
                subtitle="Add money using an external debit or credit card."
                price="2.00%" 
                condition="Minimum fee $1.00"
              />
            </div>
          </section>

          {/* SECTION 3: SEND MONEY */}
          <section className="reveal">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-gray-900">
              Send & Spend
            </h2>
            <div className="flex flex-col gap-4">
               <FeeRow 
                isFree={true}
                title="Send to Money Transfer Apps" 
                subtitle="Card payments to Western Union, Remitly, Wise, Taptap Send, PayPal, etc."
                price="2.00%" 
                condition="Minimum fee $1.00"
              />
              <FeeRow 
                isFree={false}
                title="International Purchases" 
                subtitle="Spending with your card outside the USA."
                price="1.00%" 
                condition="No minimum fee"
              />
              <FeeRow 
                isFree={true}
                title="Send to US Bank (ACH)" 
                subtitle="Transfer funds to any US bank account."
                price="1.00%" 
                condition="Standard speed"
              />
              <FeeRow 
                isFree={false}
                title="Send Wire Transfer (USA)" 
                subtitle="Same-day high-value transfer to US banks."
                price="$10 + 1%" 
                condition="Per transaction"
              />
              <FeeRow 
                isFree={true}
                title="Send to Priyo User (P2P)" 
                subtitle="Instant transfer to another Priyo wallet."
                price="1.00%" 
                condition="Min $1.00. Max transfer $1,000."
              />
              <FeeRow 
                isFree={false}
                title="Convert USD to BDT" 
                subtitle="Transfer from your USD balance to your BDT Bank Account."
                price="1.00%" 
                condition="Min fee $0.99"
              />
               <FeeRow 
                isFree={true}
                title="Global ATM Withdrawal" 
                subtitle="Withdraw cash from any Mastercard-accepted ATM worldwide."
                price="1.00%" 
                condition="Plus $3.00 minimum fixed fee"
              />
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
