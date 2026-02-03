"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, Zap, Eye, Database, Globe, ChevronRight, Wallet, Server, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" /> ZK-GovWatch
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="/verify" className="hover:text-white transition-colors">Live Dashboard</Link>
            {/* NEW: Direct Link to Claim Tool */}
            <Link href="/claim" className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-1">
               <Wallet className="w-4 h-4" /> Claim Rewards
            </Link>
          </div>
          <Link href="/submit">
            <button className="bg-white text-slate-950 px-5 py-2 rounded-full font-bold text-sm hover:bg-blue-50 transition-transform hover:scale-105">
              Launch App
            </button>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-xs font-bold mb-6 tracking-wider">
              V2.0 NOW LIVE: GASLESS RELAY ENABLED
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8">
              Whistleblow <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Without A Trace.
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The first decentralized platform that uses <strong>Zero-Knowledge Proofs</strong> to verify your employment while hiding your identity. Earn crypto rewards anonymously.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/submit">
                <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40">
                  <Zap className="w-5 h-5 fill-current" /> Start Reporting
                </button>
              </Link>
              <Link href="/verify">
                <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all">
                  <Eye className="w-5 h-5" /> View Public Leaks
                </button>
              </Link>
            </div>

            {/* NEW: Tertiary Link for Returning Users */}
            <div className="mt-8">
                <Link href="/claim" className="text-slate-500 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors">
                    <CheckCircle className="w-4 h-4" /> Already have a key? <span className="underline decoration-slate-700 underline-offset-4">Redeem your reward here</span>
                </Link>
            </div>

          </motion.div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Lock className="w-8 h-8 text-purple-400"/>}
              title="Mathematical Privacy"
              desc="We don't just 'hide' your IP. We use ZK-SNARKs to prove you are an employee without revealing which one."
            />
            <FeatureCard 
              icon={<Server className="w-8 h-8 text-green-400"/>}
              title="Gasless Relayer"
              desc="Our servers pay the gas fees. Your personal wallet never interacts with the blockchain, making you untraceable."
            />
            <FeatureCard 
              icon={<Wallet className="w-8 h-8 text-orange-400"/>}
              title="Anonymous Rewards"
              desc="Claim ETH bounties using a Hash-Lock Vault. Withdraw to a brand new wallet with zero history."
            />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Horizontal Flow) --- */}
      <section id="how-it-works" className="py-24 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">The Privacy Protocol </h2>
            <p className="text-slate-400 mt-4">How we protect you from start to finish.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-900/0 via-blue-900 to-blue-900/0 -z-10" />

            <StepCard number="01" title="Register" desc="Generate a ZK Identity. Join your organization's anonymity set." link="/submit" />
            <StepCard number="02" title="Prove" desc="Generate a proof locally in your browser. Encrypt evidence for the admin." link="/submit" />
            <StepCard number="03" title="Verify" desc="The Relayer submits your proof. The contract verifies it on-chain." link="/verify" />
            {/* UPDATED LINK: Pointing directly to Claim page now */}
            <StepCard number="04" title="Withdraw" desc="Use your secret key to withdraw rewards to a fresh wallet." link="/claim" />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-900 text-center text-slate-500 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/admin-key" className="hover:text-blue-400">Admin Setup</Link>
          <Link href="/vault" className="hover:text-blue-400">My Vault</Link>
          <Link href="/claim" className="hover:text-blue-400">Claim Tool</Link>
        </div>
        <p>&copy; 2026 ZK-GovWatch Protocol. Built for Truth.</p>
      </footer>

    </div>
  );
}

// --- SUB-COMPONENTS for Clean Code ---

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 hover:bg-slate-900 transition-all group"
    >
      <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function StepCard({ number, title, desc, link }: { number: string, title: string, desc: string, link: string }) {
  return (
    <Link href={link}>
      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer h-full relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl group-hover:opacity-20 transition-opacity select-none">
          {number}
        </div>
        <div className="w-10 h-10 bg-blue-900/20 rounded-full flex items-center justify-center text-blue-400 font-bold mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          {number}
        </div>
        <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
        <p className="text-sm text-slate-400">{desc}</p>
      </div>
    </Link>
  );
}