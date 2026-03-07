'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const SUB_NAV_ITEMS = [
  { id: 'maintenance-service-fees', label: 'Maintenance & Service Fees' },
  { id: 'receive-money', label: 'Receive Money' },
  { id: 'send-money-payments', label: 'Send Money/ Make Payments' },
  { id: 'additional-resources', label: 'Additional Resources' },
  { id: 'limits', label: 'Limits' },
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
      <div className={`text-base font-bold ${price === 'FREE' || price === '$0.00' ? 'text-emerald-500' : 'text-slate-900'}`}>
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
                  label="Maintenance Fee (Personal 1 USD & 1 BDT Account) - Every 6 months" 
                  desc="$10 / FREE If you bring $5,000 / year" 
                  price="$10" 
                  period="Every 6 months"
                />
                <FeeRow 
                  label="Business USD Accounts (up to 2 USD Accounts)" 
                  price="FREE" 
                />
                <FeeRow 
                  label="Maintenance Fee (BDT Account Only) - Yearly" 
                  desc="Payable in every 12 months. FREE For USD Account Holder." 
                  price="৳199.00" 
                  period="Yearly"
                />
                <FeeRow 
                  label="Priyo Virtual Card (Debit) - One-time" 
                  desc="The first virtual debit card for your personal account is free. Any additional cards incur a fee" 
                  price="$3.00" 
                  period="One-time"
                />
                <FeeRow 
                  label="Priyo Physical Card (Plastic) - Yearly" 
                  desc="You can order Physical Mastercard from your account. This is yearly fee for a single card. Shipping Charge is separate." 
                  price="$19.95" 
                  period="Yearly"
                />
                <FeeRow 
                  label="Physical Card Shipping (Standard)" 
                  desc="Regular Shipping takes 3-5 business days in the USA, and 3-6 weeks globally. If you want FedEx, then the Fee is $40" 
                  price="$5.00" 
                  period="Per shipment"
                />
              </FeeSubsection>

              <FeeSubsection title="Receive Money" id="personal-receive-money">
                <FeeRow 
                  label="From another Priyo Pay Customer (P2P)" 
                  desc="You can receive money from another Priyo Pay user" 
                  price="$0.00" 
                />
                <FeeRow 
                  label="Incoming ACH - from Any Bank in the USA" 
                  desc="First 10 transactions are free every month" 
                  price="$0.25" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Incoming Wire (Domestic)" 
                  desc="Receiving Wire from any Bank in the USA" 
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

              <FeeSubsection title="Send Money/ Make Payments" id="personal-send-money-payments">
                <FeeRow 
                  label="Payment (via Card) - to Third-Party Money Transmitters" 
                  desc="2% of total transaction amount on payment via Card to third-party money transmitters such as Western Union, Remitly, MoneyGram, Taptap Send, PayPal, and similar platforms. Minimum Fee $1.00." 
                  price="2.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Cross Border Payment (via Card) - outside of USA" 
                  desc="1% of total transaction amount on payment via Card outside of the USA. No Minimum Fee." 
                  price="1.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Outgoing ACH (USA Only)" 
                  desc="Any Bank in the USA" 
                  price="1.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Outgoing Domestic Wire" 
                  desc="Sending Wire to any Bank in the USA" 
                  price="$10.00 + 1% of transfer amount" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Payment to another Priyo User (P2P)" 
                  desc="1% of the transaction amount. Minimum Fee: $1.00. Maximum $1,000.00." 
                  price="1.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="Transfer from USD to BDT" 
                  desc="Minimum Fee $0.99. The transaction fee is also displayed during the transaction." 
                  price="1.00%" 
                  period="Per transaction"
                />
                <FeeRow 
                  label="ATM Withdraw (Globally)" 
                  desc="Minimum fee $3.00." 
                  price="1.00%" 
                  period="Per transaction"
                />
              </FeeSubsection>

              <FeeSubsection title="Additional Resources" id="personal-additional-resources">
                <FeeRow 
                  label="Personal USD Accounts" 
                  price="$10.00" 
                  period="Every 6 months"
                />
                <FeeRow 
                  label="Business USD Accounts (up to 2 USD Accounts)" 
                  price="FREE" 
                />
                <FeeRow 
                  label="Virtual Card for Personal Accounts" 
                  price="$3.00" 
                  period="One-time per card"
                />
                <FeeRow 
                  label="Virtual Card for Business Accounts (up to 20 Virtual Cards)" 
                  price="FREE" 
                />
                <FeeRow 
                  label="Personal and Business Physical Card" 
                  desc="For the first year including shipping charge" 
                  price="$25.00" 
                  period="First year"
                />
                <FeeRow 
                  label="Personal and Business Physical Card" 
                  desc="From 2nd year and onwards" 
                  price="$19.95" 
                  period="Per year"
                />
              </FeeSubsection>
            </AccountTypeSection>
          )}

          {/* Business Account Section */}
          {activeAccountType === 'business' && (
            <AccountTypeSection>
              <FeeSubsection title="Maintenance & Service Fees" id="business-maintenance-service-fees">
                <FeeRow 
                  label="USD Account Subscription" 
                  desc="Access to US Bank Account features. Billed every 6 months." 
                  price="$25.00" 
                  period="Per 6 Months"
                />
                <FeeRow 
                  label="Monthly Maintenance" 
                  desc="Waived if you transfer $10,000+ to Bangladesh annually." 
                  price="FREE" 
                  period="Condition Apply" 
                />
                <FeeRow 
                  label="API Access" 
                  desc="Programmatic access to payment features." 
                  price="$50.00" 
                  period="Per Month" 
                />
              </FeeSubsection>

              <FeeSubsection title="Receive Money" id="business-receive-money">
                <FeeRow 
                  label="Receive Money (P2P)" 
                  desc="From another Priyo Pay user." 
                  price="FREE" 
                />
                <FeeRow 
                  label="Receive from US Bank (ACH)" 
                  desc="Direct deposit. First 20 transactions/month are free." 
                  price="$0.10" 
                  period="Per Transaction" 
                />
                <FeeRow 
                  label="Receive Wire (Domestic)" 
                  desc="Same-day wire from US banks." 
                  price="$10.00" 
                  period="Per Transaction" 
                />
                <FeeRow 
                  label="Batch Payments Processing" 
                  desc="Process multiple payments at once." 
                  price="0.50%" 
                  period="Per Transaction" 
                />
              </FeeSubsection>

              <FeeSubsection title="Send Money/ Make Payments" id="business-send-money-payments">
                <FeeRow 
                  label="Send to US Bank (ACH)" 
                  desc="Standard transfer to any US bank." 
                  price="0.80%" 
                  period="No Min Fee" 
                />
                <FeeRow 
                  label="Send Wire (Domestic)" 
                  desc="Urgent transfer to US bank." 
                  price="$8 + 0.8%" 
                  period="Per Transaction" 
                />
                <FeeRow 
                  label="International Card Spend" 
                  desc="Spending outside the USA." 
                  price="0.80%" 
                  period="No Min Fee" 
                />
                <FeeRow 
                  label="Payroll Processing" 
                  desc="Bulk employee payments." 
                  price="1.00%" 
                  period="Per Transaction" 
                />
              </FeeSubsection>

              <FeeSubsection title="Additional Resources" id="business-additional-resources">
                <FeeRow 
                  label="Virtual Debit Card" 
                  desc="Instant issuance for online shopping. First 2 cards free." 
                  price="FREE" 
                  period="First 2 Cards" 
                  isHighlight={true}
                />
                <FeeRow 
                  label="Additional Virtual Card" 
                  desc="Extra virtual cards for team members." 
                  price="$2.50" 
                  period="One-time" 
                />
                <FeeRow 
                  label="Physical Mastercard" 
                  desc="Plastic card mailed to your address. Shipping charged separately." 
                  price="$15.00" 
                  period="Per Year" 
                />
                <FeeRow 
                  label="Corporate Cards" 
                  desc="Managed cards for employees with spending limits." 
                  price="$25.00" 
                  period="Per Card/Year" 
                />
              </FeeSubsection>

              <FeeSubsection title="Limits" id="business-limits">
                <FeeRow 
                  label="Standard Shipping" 
                  desc="Global delivery (3-6 weeks)." 
                  price="FREE" 
                  period="First Order" 
                />
                <FeeRow 
                  label="Express Shipping (FedEx)" 
                  desc="Fast tracked delivery." 
                  price="$35.00" 
                  period="Per Delivery" 
                />
              </FeeSubsection>
            </AccountTypeSection>
          )}

        </div>
      </section>

      {/* --- FAQ SECTION (Reused Style from your Repo) --- */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Common Questions</h2>
            <p className="text-slate-500">Clarifications on our fee structure.</p>
          </div>

          <div className="space-y-4">
            <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="font-bold text-slate-900">How is the subscription fee billed?</span>
                <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
                The $10 subscription fee covers your USD account maintenance for 6 months. It is automatically deducted from your balance at the start of each cycle.
              </div>
            </details>

            <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="font-bold text-slate-900">Is the Virtual Card really free?</span>
                <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
                For Personal accounts, your <strong>first</strong> virtual debit card is issued absolutely free. If you need additional cards later, a one-time fee of $3.00 applies per card.
              </div>
            </details>

            <details className="group bg-slate-50 rounded-2xl border border-slate-100 open:bg-white open:shadow-lg open:border-[#E61C5D]/20 transition-all duration-300">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="font-bold text-slate-900">How do I waive the monthly maintenance fee?</span>
                <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 pt-4">
                The monthly maintenance fee is automatically waived if you transfer a total of $2,000 or more to Bangladesh within a year.
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
                    Get Started Free
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
