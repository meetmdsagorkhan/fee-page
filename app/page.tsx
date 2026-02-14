import React from 'react';
import Link from 'next/link';

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
        {isHighlight && <Badge color="pink">Popular</Badge>}
      </div>
      {desc && <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-sm">{desc}</p>}
    </div>
    
    <div className="text-left sm:text-right shrink-0">
      <div className={`text-base font-bold ${price === 'FREE' ? 'text-emerald-500' : 'text-slate-900'}`}>
        {price}
      </div>
      {period && <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">{period}</div>}
    </div>
  </div>
);

const FeeSection = ({ title, icon, children }: any) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500">
    <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
      <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-[#E61C5D] shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    </div>
    <div className="p-8 pt-2 divide-y divide-slate-100">
      {children}
    </div>
  </div>
);

// ----------------------------------------------------------------------
// 2. Main Page Content
// ----------------------------------------------------------------------

export default function FeesPage() {
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

          {/* Quick Highlight Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
             {[
               { label: "P2P Transfers", val: "FREE", sub: "Instant" },
               { label: "Monthly Maintenance", val: "FREE", sub: "With conditions*" },
               { label: "Virtual Card", val: "$3.00", sub: "One-time fee" },
               { label: "Bank Transfer", val: "1.00%", sub: "Standard rate" },
             ].map((item, i) => (
               <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-[#E61C5D]/20 transition-colors">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{item.label}</div>
                 <div className="text-2xl font-bold text-slate-900 mb-1">{item.val}</div>
                 <div className="text-[10px] font-medium text-slate-400">{item.sub}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- DETAILED FEE LISTS --- */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-5xl space-y-10">
          
          {/* 1. Account & Subscription */}
          <FeeSection 
            title="Account & Subscription" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          >
            <FeeRow 
              label="USD Account Subscription" 
              desc="Access to US Bank Account features. Billed every 6 months." 
              price="$10.00" 
              period="Per 6 Months"
              isHighlight={true}
            />
            <FeeRow 
              label="Monthly Maintenance" 
              desc="Waived if you transfer $2,000+ to Bangladesh annually." 
              price="FREE" 
              period="Condition Apply" 
            />
            <FeeRow 
              label="BDT Account Only" 
              desc="Maintenance fee if you strictly use BDT account only." 
              price="৳199.00" 
              period="Per Year" 
            />
          </FeeSection>

          {/* 2. Cards */}
          <FeeSection 
            title="Cards" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
          >
            <FeeRow 
              label="Virtual Debit Card" 
              desc="Instant issuance for online shopping. First card is free for Personal accounts." 
              price="$3.00" 
              period="One-time" 
            />
            <FeeRow 
              label="Physical Mastercard" 
              desc="Plastic card mailed to your address. Shipping charged separately." 
              price="$19.95" 
              period="Per Year" 
            />
            <FeeRow 
              label="Standard Shipping" 
              desc="Global delivery (3-6 weeks)." 
              price="$5.00" 
              period="Per Delivery" 
            />
             <FeeRow 
              label="Express Shipping (FedEx)" 
              desc="Fast tracked delivery." 
              price="$40.00" 
              period="Per Delivery" 
            />
          </FeeSection>

          {/* 3. Money Movement */}
          <FeeSection 
            title="Transfers & Payments" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
          >
            <FeeRow 
              label="Receive Money (P2P)" 
              desc="From another Priyo Pay user." 
              price="FREE" 
            />
            <FeeRow 
              label="Receive from US Bank (ACH)" 
              desc="Direct deposit. First 10 transactions/month are free." 
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
              label="Send to US Bank (ACH)" 
              desc="Standard transfer to any US bank." 
              price="1.00%" 
              period="No Min Fee" 
            />
            <FeeRow 
              label="Send Wire (Domestic)" 
              desc="Urgent transfer to US bank." 
              price="$10 + 1%" 
              period="Per Transaction" 
            />
            <FeeRow 
              label="International Card Spend" 
              desc="Spending outside the USA." 
              price="1.00%" 
              period="No Min Fee" 
            />
          </FeeSection>

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