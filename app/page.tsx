'use client';

import React, { useState, useEffect } from 'react';
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
        <span className="text-sm font-bold text-slate-900 group-hover:text-[#E61C5D] transition-colors">
          {label}
        </span>
      </div>
      {desc && <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-sm">{desc}</p>}
    </div>
    
    <div className="text-left sm:text-right shrink-0">
      <div className={`text-base font-bold ${price === 'FREE' || price === '$0.00' ? 'text-[#E61C5D]' : 'text-slate-900'}`}>
        {price}
      </div>
      {period && <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">{period}</div>}
    </div>
  </div>
);

const FeeSubsection = ({ title, children, id }: any) => (
  <div className="mb-8" id={id}>
    <h4 className="text-lg font-bold text-center text-[#E61C5D] mb-4 pb-2 border-b border-slate-200">{title}</h4>
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
                  ? 'bg-[#E61C5D] text-white shadow-lg shadow-[#E61C5D]/25'
                  : 'text-slate-600 hover:text-[#E61C5D] hover:bg-slate-50'
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
  return (
    <div className="sticky top-[145px] z-30 bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-lg border-b border-white/20 shadow-lg rounded-2xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center gap-6 py-3 overflow-x-auto">
          {SUB_NAV_ITEMS.map((item) => {
            const sectionId = `${accountType}-${item.id}`;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(sectionId)}
                className={`px-4 py-2 text-xs font-medium whitespace-nowrap rounded-lg transition-all duration-200 ${
                  activeSection === sectionId
                    ? 'bg-[#E61C5D] text-white shadow-md'
                    : 'text-slate-600 hover:text-[#E61C5D] hover:bg-white'
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

export default function FeesPage() {
  const [activeAccountType, setActiveAccountType] = useState('personal');
  const [activeSection, setActiveSection] = useState('personal-maintenance-service-fees');

  useEffect(() => {
    setActiveSection(`${activeAccountType}-maintenance-service-fees`);
  }, [activeAccountType]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#E61C5D] selection:text-white">
      
      {/* --- HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
             <span className="text-xl font-extrabold text-slate-900 tracking-tight">Priyo Pay</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="https://pay.priyo.com" className="bg-slate-900 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                Open Account
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO: Quick Summary --- */}
      <section className="relative pt-20 pb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E61C5D]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
        </div>

        <div className="container mx-auto px-6 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-6">
             <span className="w-1.5 h-1.5 rounded-full bg-[#E61C5D]"></span>
             Transparent Pricing
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Simple Fees. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E61C5D] to-[#FF6A00]">
              No Hidden Charges.
            </span>
          </h1>
          
          <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            We believe in complete transparency. Here is exactly what you pay, and what you don't.
          </p>
        </div>
      </section>

      {/* --- DETAILED FEE LISTS --- */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-5xl space-y-10">
          
          {/* Account Type Navigation */}
          <AccountTypeNavigation 
            activeAccountType={activeAccountType} 
            setActiveAccountType={setActiveAccountType} 
          />
          
          {/* Sub Navigation */}
          <SubNavigation 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
            accountType={activeAccountType}
          />
          
          {/* Personal Account Section */}
          {activeAccountType === 'personal' && (
            <AccountTypeSection>
              <FeeSubsection title="Maintenance & Service Fees" id="personal-maintenance-service-fees">
                <FeeRow 
                  label="Maintenance Fee (1 USD, 1 Virtual Card & 1 BDT Account)" 
                  desc={<> <span className="text-[#E61C5D] font-bold">FREE</span> If you bring $5,000 / year <a href="https://pay.priyo.com/fee-waiver" target="_blank" rel="noopener noreferrer" className="text-[#E61C5D] hover:text-[#c9154e] underline font-bold">Learn more</a>. </>} 
                  price="$10" 
                  period="Every 6 months"
                />
                <FeeRow 
                  label="Maintenance Fee (BDT Account Only)" 
                  desc={<>Payable in every 12 months. <span className='text-[#E61C5D] font-bold'>FREE</span> for USD Account Holder.</>} 
                  price="৳199.00" 
                  period="Yearly"
                />
                <FeeRow 
                  label="Virtual Card (Debit)" 
                  desc={<>The first virtual debit card for your personal account is <span className='text-[#E61C5D] font-bold'>FREE</span>. Any additional cards incur a fee.</>} 
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
                  desc={<>First 10 transactions are <span className='text-[#E61C5D] font-bold'>FREE</span> every month.</>} 
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
                  desc={<>Zero monthly fee. <span className='text-[#E61C5D] font-bold'>FREE</span> forever.</>}
                  price="FREE" 
                  period="Upto 2 USD Accounts"
                  
                />
                
                <FeeRow 
                  label="Virtual Card (Debit)" 
                  desc={<>Zero monthly fee. <span className='text-[#E61C5D] font-bold'>FREE</span> forever.</>}
                  price="FREE" 
                  period="Upto 20 Cards"
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
                  desc={<>First 10 transactions are <span className='text-[#E61C5D] font-bold'>FREE</span> every month.</>} 
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
                  desc={<>Charged per additional account. First 2 accounts are <span className='text-[#E61C5D] font-bold'>FREE</span>.</>}
                  price="$10.00" 
                  period="Every 6 months"
                />
                <FeeRow 
                  label="Additional Virtual Cards" 
                  desc={<>Charged per additional cards. First 20 cards are <span className='text-[#E61C5D] font-bold'>FREE</span>.</>}
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
                  price="2" 
                  period="Accounts"
                />
                <FeeRow 
                  label="Virtual Card" 
                  desc="Maximum number of virtual cards per USD account." 
                  price="20" 
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
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
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
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
          <span className="font-bold text-[#E61C5D]">How can I waive the maintenance fee?</span>
          <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
          The maintenance fee is waived (FREE) if you bring in $5,000 or more in deposits per year. <a href="https://pay.priyo.com/fee-waiver" target="_blank" rel="noopener noreferrer" className="text-[#E61C5D] hover:text-[#c9154e] underline font-bold">Learn more</a>
        </div>
      </details>

      {/* 3. Virtual Cards */}
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
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
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
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
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
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
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
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
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
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
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
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
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
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
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
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
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
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
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
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
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
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
      <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
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

      {/* --- FOOTER CTA --- */}
      <section className="py-24 bg-[#0F172A] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E61C5D]/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/2 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
         
         <div className="container mx-auto px-6 relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                Ready to save on fees?
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Join thousands of users who trust Priyo Pay for their international banking needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="https://pay.priyo.com" className="inline-flex items-center justify-center gap-2 bg-[#E61C5D] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#c9154e] hover:shadow-lg hover:shadow-[#E61C5D]/25 transition-all duration-300">
                    Get Started FREE
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300">
                    Contact Sales
                </Link>
            </div>
         </div>
      </section>

    </div>
  );
}
