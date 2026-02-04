"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Zap, Lock, Eye, Wallet, Globe, ArrowRight, CheckCircle, Fingerprint, Terminal, FileText, HelpCircle, ChevronDown, Server } from "lucide-react";
import { useRef, useState } from "react";

export default function LandingPage() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-pink-500/30 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl ring-1 ring-white/5">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"/>
            ZK-GovWatch
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">
            <Link href="#manifesto" className="hover:text-white transition-colors">Manifesto</Link>
            <Link href="#technology" className="hover:text-white transition-colors">Technology</Link>
            <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
          <Link href="/submit">
            <button className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Launch App
            </button>
          </Link>
        </div>
      </nav>

          {/* --- HERO SECTION --- */}
      {/* FIX: Changed h-[90vh] to min-h-screen to prevent squishing on small laptops.
         FIX: Added flex-col and huge pt-40 to force content BELOW the navbar.
      */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-40 pb-20">
        
        {/* Deep Space Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] -z-10 mix-blend-screen animate-pulse-slow" />

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-6xl mx-auto relative z-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-mono mb-8 text-blue-200 backdrop-blur-md">
            <Shield className="w-3 h-3" /> ZK-SNARK PRIVACY PROTOCOL V2.0 LIVE
          </div>
          
          {/* FIX: Responsive Text Sizing 
             Changed 'text-9xl' to 'text-6xl md:text-9xl' so it fits on laptops.
          */}
          <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter leading-[0.9] mb-8">
            Truth Needs <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              No Name.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/50 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            The first decentralized whistleblower platform that proves 
            <span className="text-white font-medium"> institutional corruption </span> 
            without revealing 
            <span className="text-white font-medium"> individual identity. </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/submit" className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] group">
                Start Anonymously <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
              </button>
            </Link>
            <Link href="/verify" className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-3 backdrop-blur-sm">
                <Eye className="w-5 h-5 text-purple-400" /> Live Dashboard
              </button>
            </Link>
          </div>

          {/* Mini Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8">
             <StatBox label="Reports Filed" value="142" />
             <StatBox label="ETH Rewarded" value="8.4 Ξ" />
             <StatBox label="Identities Hidden" value="100%" />
             <StatBox label="Encryption Level" value="AES-256" />
          </div>
        </motion.div>
      </section>

      {/* --- TECH STACK MARQUEE --- */}
      <div className="py-8 border-y border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
        <motion.div 
            animate={{ x: ["0%", "-50%"] }} 
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            className="flex whitespace-nowrap gap-16 text-white/30 font-bold text-xl uppercase tracking-widest px-8"
        >
          <span>Powered By</span>
          <span className="text-white">Semaphore</span>
          <span>•</span>
          <span className="text-white">Ethereum Sepolia</span>
          <span>•</span>
          <span className="text-white">IPFS / Pinata</span>
          <span>•</span>
          <span className="text-white">Next.js 15</span>
          <span>•</span>
          <span className="text-white">SnarkJS</span>
          <span>•</span>
          <span className="text-white">Solidity</span>
          <span>•</span>
          <span className="text-white">Tailwind</span>
          {/* Duplicate for loop */}
          <span className="ml-16">Powered By</span>
          <span className="text-white">Semaphore</span>
          <span>•</span>
          <span className="text-white">Ethereum Sepolia</span>
          <span>•</span>
          <span className="text-white">IPFS / Pinata</span>
          <span>•</span>
          <span className="text-white">Next.js 15</span>
          <span>•</span>
          <span className="text-white">SnarkJS</span>
          <span>•</span>
          <span className="text-white">Solidity</span>
          <span>•</span>
          <span className="text-white">Tailwind</span>
        </motion.div>
      </div>

      {/* --- MANIFESTO SECTION (Gap Reduced: py-32 -> py-20) --- */}
      <section id="manifesto" className="py-20 px-6 max-w-4xl mx-auto text-center md:text-left">
          <h2 className="text-xs font-bold tracking-[0.3em] text-purple-400 mb-6 uppercase">The Manifesto</h2>
          <h3 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
              "Privacy is necessary for an open society in the electronic age."
          </h3>
          <div className="space-y-6 text-xl text-white/60 leading-relaxed">
              <p>
                  We are building this platform because the current mechanisms for truth-telling are broken. 
                  Whistleblowers face retaliation, legal threats, and personal danger.
              </p>
              <p>
                  ZK-GovWatch removes the "trust" variable. You don't need to trust the government to protect you. 
                  You don't need to trust us to keep your secrets.
              </p>
              <p className="text-white font-medium">
                  You only need to trust the mathematics.
              </p>
          </div>
      </section>

      {/* --- BENTO GRID (Gap Reduced: py-32 -> py-20) --- */}
      <section id="technology" className="py-20 px-6 max-w-7xl mx-auto" ref={targetRef}>
        <div className="mb-12 md:flex justify-between items-end">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold mb-4">The Architecture</h2>
            <p className="text-white/50 text-xl max-w-xl">Four layers of defense to guarantee your safety.</p>
          </div>
          <Link href="https://github.com/anandstomar/ZK-GovWatch-WhistleBlower-Platform" target="_blank" className="text-white border-b border-white pb-1 hover:text-blue-400 hover:border-blue-400 transition-colors mt-8 md:mt-0 inline-block">
              View Source Code ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          <BentoCard className="md:col-span-2 bg-gradient-to-br from-blue-900/20 to-black border-blue-500/30">
            <div className="absolute top-8 right-8 p-4 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-500/20">
               <Fingerprint className="w-8 h-8" />
            </div>
            <div className="mt-auto relative z-10">
              <h3 className="text-3xl font-bold mb-3">Zero-Knowledge Proofs</h3>
              <p className="text-white/60 text-lg">
                  We use <span className="text-white">Semaphore circuits</span>. This cryptographic magic allows you to prove: 
                  "I am in the Employee Database" without revealing "I am Employee #42."
              </p>
            </div>
          </BentoCard>

          <BentoCard className="md:row-span-2 bg-zinc-900/40 border-purple-500/20 group relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="h-full flex flex-col justify-between relative z-10">
                <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4">
                    <Server className="w-10 h-10 text-purple-400" />
                </div>
                <div>
                   <h3 className="text-3xl font-bold mb-3">Gasless Relayer</h3>
                   <p className="text-white/60 mb-6 text-lg leading-relaxed">
                       If you pay for gas, the blockchain records your wallet address. 
                       <br/><br/>
                       That's why <strong>we pay for you.</strong> Our Relayer server bundles your proof and submits it. The blockchain only sees our server, never you.
                   </p>
                   <div className="flex gap-2 text-xs font-mono text-purple-300">
                      <span className="bg-purple-900/30 px-3 py-1 rounded border border-purple-500/30">POST /api/relay</span>
                   </div>
                </div>
             </div>
          </BentoCard>

          <BentoCard className="bg-zinc-900/40 border-green-500/20">
            <Wallet className="w-10 h-10 text-green-400 mb-6" />
            <h3 className="text-2xl font-bold mb-2">Hash-Lock Vault</h3>
            <p className="text-white/60">Generate a secret key locally. Withdraw rewards to a completely fresh wallet with zero history.</p>
          </BentoCard>

          <BentoCard className="bg-zinc-900/40 border-pink-500/20">
            <Lock className="w-10 h-10 text-pink-400 mb-6" />
            <h3 className="text-2xl font-bold mb-2">Client-Side E2EE</h3>
            <p className="text-white/60">Evidence is encrypted in your browser using the Admin's Public Key before it ever touches IPFS.</p>
          </BentoCard>

        </div>
      </section>

      {/* --- DEEP DIVE (Gap Reduced: py-32 -> py-20) --- */}
      <section className="py-20 bg-white/5 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-bold mb-12 text-center">Protocol Flow</h2>
              <div className="grid md:grid-cols-4 gap-8">
                  <StepDetail number="01" title="Register Identity" desc="Connect once to generate your ZK-Identity. This adds you to the Merkle Tree anonymity set." />
                  <StepDetail number="02" title="Generate Proof" desc="Your browser generates a mathematical proof that you exist in the tree, without revealing your leaf index." />
                  <StepDetail number="03" title="Relay & Verify" desc="The proof is sent to our Relayer. The Smart Contract verifies the math on-chain." />
                  <StepDetail number="04" title="Anonymous Claim" desc="If verified, use your local Secret Key to withdraw funds to a burner wallet." />
              </div>
          </div>
      </section>

      {/* --- FAQ SECTION (Gap Reduced: py-32 -> py-20) --- */}
      <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
              <Accordion title="Can the admin see who I am?" answer="No. The admin only sees that 'someone from the valid employee list' submitted the report. They cannot trace it back to your specific ID." />
              <Accordion title="What if the government subpoenas the server?" answer="The server only knows your IP address at the moment of submission. We recommend using a VPN or Tor for maximum safety. The blockchain data itself contains zero identifying information." />
              <Accordion title="How do I get paid anonymously?" answer="We use a Commit-Reveal scheme. When you submit, you generate a random secret password. The money is locked behind the HASH of that password. You can unlock it from ANY wallet, even a brand new empty one." />
              <Accordion title="Is the evidence public?" answer="No. The evidence file (PDF/Image) is encrypted with the Admin's Public Key. Only the Admin can decrypt and view it. The public only sees the encrypted nonsense text." />
          </div>
      </section>

      {/* --- FINAL CTA (Gap Reduced: py-32 -> py-20) --- */}
      <section className="py-20 px-6 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 p-16 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
             <h2 className="text-5xl font-bold mb-6 text-white">Ready to speak up?</h2>
             <p className="text-xl text-white/50 mb-10">Your identity is safe. Your reward is waiting.</p>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Link href="/submit">
                    <button className="px-12 py-4 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-transform">
                        Submit a Report
                    </button>
                 </Link>
                 <Link href="/claim">
                    <button className="px-12 py-4 bg-transparent border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-colors">
                        Claim Rewards
                    </button>
                 </Link>
             </div>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/10 text-center text-white/30 text-sm">
        <div className="flex justify-center gap-8 mb-8 font-medium text-white/70">
          <Link href="/admin-key" className="hover:text-white">Admin Setup</Link>
          <Link href="/vault" className="hover:text-white">My Vault</Link>
          <Link href="/verify" className="hover:text-white">Dashboard</Link>
        </div>
        <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>All Systems Operational</span>
        </div>
        <p className="font-mono">OPEN SOURCE • DECENTRALIZED • UNSTOPPABLE</p>
      </footer>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatBox({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">{value}</div>
            <div className="text-xs text-white/40 uppercase tracking-widest">{label}</div>
        </div>
    )
}

function BentoCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 0.98 }}
      className={`relative p-8 rounded-3xl border border-white/10 overflow-hidden flex flex-col hover:border-white/20 transition-colors ${className}`}
    >
      {children}
    </motion.div>
  );
}

function StepDetail({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="relative pl-8 border-l border-white/10">
            <div className="absolute top-0 left-0 -translate-x-1/2 w-4 h-4 bg-black border border-blue-500 rounded-full" />
            <div className="text-xs font-mono text-blue-400 mb-2">{number}</div>
            <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
            <p className="text-white/50 leading-relaxed">{desc}</p>
        </div>
    )
}

function Accordion({ title, answer }: { title: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/10 rounded-xl bg-zinc-900/30 overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-bold text-lg">{title}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="p-6 pt-0 text-white/60 leading-relaxed border-t border-white/5">
                    {answer}
                </div>
            )}
        </div>
    )
}


// "use client";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { Shield, Lock, Zap, Eye, Database, Globe, ChevronRight, Wallet, Server, CheckCircle } from "lucide-react";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
      
//       {/* --- NAVBAR --- */}
//       <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//           <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
//             <Shield className="w-6 h-6 text-blue-400" /> ZK-GovWatch
//           </div>
//           <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
//             <Link href="#features" className="hover:text-white transition-colors">Features</Link>
//             <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
//             <Link href="/verify" className="hover:text-white transition-colors">Live Dashboard</Link>
//             {/* NEW: Direct Link to Claim Tool */}
//             <Link href="/claim" className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-1">
//                <Wallet className="w-4 h-4" /> Claim Rewards
//             </Link>
//           </div>
//           <Link href="/submit">
//             <button className="bg-white text-slate-950 px-5 py-2 rounded-full font-bold text-sm hover:bg-blue-50 transition-transform hover:scale-105">
//               Launch App
//             </button>
//           </Link>
//         </div>
//       </nav>

//       {/* --- HERO SECTION --- */}
//       <section className="relative pt-32 pb-20 overflow-hidden">
//         {/* Background Elements */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
        
//         <div className="max-w-5xl mx-auto px-6 text-center">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <span className="inline-block py-1 px-3 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-xs font-bold mb-6 tracking-wider">
//               V2.0 NOW LIVE: GASLESS RELAY ENABLED
//             </span>
//             <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8">
//               Whistleblow <br />
//               <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//                 Without A Trace.
//               </span>
//             </h1>
//             <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
//               The first decentralized platform that uses <strong>Zero-Knowledge Proofs</strong> to verify your employment while hiding your identity. Earn crypto rewards anonymously.
//             </p>
            
//             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//               <Link href="/submit">
//                 <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40">
//                   <Zap className="w-5 h-5 fill-current" /> Start Reporting
//                 </button>
//               </Link>
//               <Link href="/verify">
//                 <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all">
//                   <Eye className="w-5 h-5" /> View Public Leaks
//                 </button>
//               </Link>
//             </div>

//             {/* NEW: Tertiary Link for Returning Users */}
//             <div className="mt-8">
//                 <Link href="/claim" className="text-slate-500 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors">
//                     <CheckCircle className="w-4 h-4" /> Already have a key? <span className="underline decoration-slate-700 underline-offset-4">Redeem your reward here</span>
//                 </Link>
//             </div>

//           </motion.div>
//         </div>
//       </section>

//       {/* --- FEATURES GRID --- */}
//       <section id="features" className="py-24 bg-slate-950 relative">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid md:grid-cols-3 gap-8">
//             <FeatureCard 
//               icon={<Lock className="w-8 h-8 text-purple-400"/>}
//               title="Mathematical Privacy"
//               desc="We don't just 'hide' your IP. We use ZK-SNARKs to prove you are an employee without revealing which one."
//             />
//             <FeatureCard 
//               icon={<Server className="w-8 h-8 text-green-400"/>}
//               title="Gasless Relayer"
//               desc="Our servers pay the gas fees. Your personal wallet never interacts with the blockchain, making you untraceable."
//             />
//             <FeatureCard 
//               icon={<Wallet className="w-8 h-8 text-orange-400"/>}
//               title="Anonymous Rewards"
//               desc="Claim ETH bounties using a Hash-Lock Vault. Withdraw to a brand new wallet with zero history."
//             />
//           </div>
//         </div>
//       </section>

//       {/* --- HOW IT WORKS (Horizontal Flow) --- */}
//       <section id="how-it-works" className="py-24 border-t border-slate-900">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl font-bold text-white">The Privacy Protocol </h2>
//             <p className="text-slate-400 mt-4">How we protect you from start to finish.</p>
//           </div>

//           <div className="grid md:grid-cols-4 gap-4 relative">
//             {/* Connecting Line (Desktop) */}
//             <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-900/0 via-blue-900 to-blue-900/0 -z-10" />

//             <StepCard number="01" title="Register" desc="Generate a ZK Identity. Join your organization's anonymity set." link="/submit" />
//             <StepCard number="02" title="Prove" desc="Generate a proof locally in your browser. Encrypt evidence for the admin." link="/submit" />
//             <StepCard number="03" title="Verify" desc="The Relayer submits your proof. The contract verifies it on-chain." link="/verify" />
//             {/* UPDATED LINK: Pointing directly to Claim page now */}
//             <StepCard number="04" title="Withdraw" desc="Use your secret key to withdraw rewards to a fresh wallet." link="/claim" />
//           </div>
//         </div>
//       </section>

//       {/* --- FOOTER --- */}
//       <footer className="py-12 border-t border-slate-900 text-center text-slate-500 text-sm">
//         <div className="flex justify-center gap-6 mb-4">
//           <Link href="/admin-key" className="hover:text-blue-400">Admin Setup</Link>
//           <Link href="/vault" className="hover:text-blue-400">My Vault</Link>
//           <Link href="/claim" className="hover:text-blue-400">Claim Tool</Link>
//         </div>
//         <p>&copy; 2026 ZK-GovWatch Protocol. Built for Truth.</p>
//       </footer>

//     </div>
//   );
// }

// // --- SUB-COMPONENTS for Clean Code ---

// function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
//   return (
//     <motion.div 
//       whileHover={{ y: -5 }}
//       className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 hover:bg-slate-900 transition-all group"
//     >
//       <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 w-fit group-hover:scale-110 transition-transform">
//         {icon}
//       </div>
//       <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
//       <p className="text-slate-400 leading-relaxed">{desc}</p>
//     </motion.div>
//   );
// }

// function StepCard({ number, title, desc, link }: { number: string, title: string, desc: string, link: string }) {
//   return (
//     <Link href={link}>
//       <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer h-full relative overflow-hidden group">
//         <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl group-hover:opacity-20 transition-opacity select-none">
//           {number}
//         </div>
//         <div className="w-10 h-10 bg-blue-900/20 rounded-full flex items-center justify-center text-blue-400 font-bold mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
//           {number}
//         </div>
//         <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
//         <p className="text-sm text-slate-400">{desc}</p>
//       </div>
//     </Link>
//   );
// }