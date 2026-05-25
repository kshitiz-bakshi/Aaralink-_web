'use client'

import {
  Apple,
  Play,
  Check,
  Star,
  Menu,
  X,
  Globe,
  FileText,
  Building2,
  Users,
  BarChart3,
  Mail,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  MapPin,
  Clock,
  Zap,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'


const steps = [
  {
    number: '01',
    icon: Building2,
    title: 'Add Your Properties',
    description: 'Enter your property and unit details once. Everything is saved and reusable.',
  },
  {
    number: '02',
    icon: Users,
    title: 'Create Tenant Profiles',
    description: 'Add tenant info, upload IDs, and configure lease terms in under two minutes.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Generate & Send Leases',
    description: 'Produce compliant leases instantly and deliver them for digital signature.',
  },
]

const testimonials = [
  {
    name: 'Sarah Ahmed',
    role: 'Property Manager',
    location: 'Toronto, ON',
    review: 'Aaralink cut my lease prep from 2 hours to 5 minutes. The compliance peace of mind alone is worth every penny.',
    rating: 5,
    properties: '14 units',
  },
  {
    name: 'Marcus Johnson',
    role: 'Landlord',
    location: 'Ottawa, ON',
    review: 'Incredibly intuitive from day one. My tenants appreciate the professional digital experience — it builds trust.',
    rating: 5,
    properties: '6 units',
  },
  {
    name: 'Emily Chen',
    role: 'Real Estate Agent',
    location: 'Vancouver, BC',
    review: 'Best investment for my property business. The automation handles the paperwork so I can focus on growth.',
    rating: 5,
    properties: '23 units',
  },
]

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'For landlords just getting started',
    features: ['Up to 5 properties', 'Basic lease generation', '2 tenants per property', 'Community support'],
  },
  {
    name: 'Professional',
    price: '$29',
    period: '/month',
    description: 'For growing property managers',
    features: ['Unlimited properties', 'Advanced lease generation', 'Unlimited tenants', 'Priority support', 'Analytics dashboard', 'Digital e-signatures'],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale portfolios',
    features: ['Everything in Professional', 'Dedicated account manager', 'Custom integrations', '24/7 phone support', 'Advanced reporting', 'API access'],
  },
]

const stats = [
  { value: '10K+', label: 'Property Managers', icon: Users },
  { value: '50K+', label: 'Leases Generated', icon: FileText },
  { value: '98%', label: 'Compliance Rate', icon: ShieldCheck },
  { value: '5 min', label: 'Avg. Lease Time', icon: Clock },
]

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white font-josefin overflow-x-hidden">

      {/* ── Navbar ───────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <span className="font-cinzel text-xl font-bold text-blue-700 tracking-wider">AARALINK</span>

            <div className="hidden md:flex items-center gap-8">
              {['Features', 'How it Works', 'Pricing', 'Download'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="text-slate-600 hover:text-blue-700 text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="https://app.aaralink.ca" target="_blank" rel="noopener noreferrer"
                className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer">
                Sign in
              </a>
              <a href="https://app.aaralink.ca" target="_blank" rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md shadow-blue-500/25 cursor-pointer">
                Get Started Free
              </a>
            </div>

            <button className="md:hidden p-2 text-slate-700 cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 pt-2 border-t border-slate-100 space-y-1">
              {['Features', 'How it Works', 'Pricing', 'Download'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="block text-slate-700 hover:text-blue-700 hover:bg-blue-50 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer">
                  {item}
                </a>
              ))}
              <div className="px-4 pt-2">
                <a href="https://app.aaralink.ca" target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer">
                  Get Started Free
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#050D1F]">

        {/* Gradient mesh background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-blue-400/15 rounded-full blur-[100px]" />
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center pt-24 pb-16">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm">
            <MapPin size={13} />
            Built for Ontario Property Managers
          </div>

          {/* Headline */}
          <h1 className="font-cinzel text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            <span className="text-white">Property Management</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate compliant Ontario leases in minutes, manage your entire portfolio, and keep tenants informed — all in one elegant platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="https://app.aaralink.ca" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 shadow-xl shadow-blue-600/30 cursor-pointer">
              Start for Free
              <ArrowRight size={18} />
            </a>
            <a href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 backdrop-blur-sm cursor-pointer">
              See How it Works
              <ChevronRight size={18} />
            </a>
          </div>

          {/* Dashboard mockup */}
          <div className="relative max-w-4xl mx-auto">
            {/* Glow behind card */}
            <div className="absolute -inset-4 bg-blue-600/20 rounded-3xl blur-2xl" />

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Window bar */}
              <div className="flex items-center gap-2 px-5 py-3.5 bg-white/5 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-400/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-green-400/70" />
                <div className="flex-1 mx-4 flex justify-center">
                  <span className="bg-white/10 text-slate-400 text-xs px-4 py-1 rounded-full">app.aaralink.ca — Dashboard</span>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6">
                {/* Stat cards row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Properties', value: '12', icon: Building2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { label: 'Active Tenants', value: '34', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                    { label: 'Leases / Month', value: '8', icon: FileText, color: 'text-blue-300', bg: 'bg-blue-300/10' },
                    { label: 'Time Saved', value: '1.8h', icon: Clock, color: 'text-sky-400', bg: 'bg-sky-400/10' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-2`}>
                        <s.icon size={16} className={s.color} />
                      </div>
                      <div className={`font-cinzel text-xl font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Bottom two panels */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-slate-300 text-sm font-semibold mb-3">Recent Leases</div>
                    <div className="space-y-2.5">
                      {[
                        { addr: '123 Maple St — Unit 2A', status: 'Active', color: 'text-green-400 bg-green-400/10' },
                        { addr: '456 Oak Ave — Unit 1', status: 'Pending', color: 'text-yellow-400 bg-yellow-400/10' },
                        { addr: '789 Pine Rd — Unit 3B', status: 'Active', color: 'text-green-400 bg-green-400/10' },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-slate-400 text-xs">{r.addr}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.color}`}>{r.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-slate-300 text-sm font-semibold mb-3">Quick Actions</div>
                    <div className="space-y-2">
                      {['New Lease', 'Add Tenant', 'Add Property'].map((a, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-slate-600" />
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-blue-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 mb-3">
                  <s.icon size={18} className="text-blue-200" />
                </div>
                <div className="font-cinzel text-3xl md:text-4xl font-bold text-white">{s.value}</div>
                <div className="text-blue-200 text-sm font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">
              <TrendingUp size={14} />
              Simple Process
            </div>
            <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-slate-900 mb-4">Up & Running in Minutes</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">No training. No complex setup. Start managing properties professionally from day one.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-14 left-[calc(100%-1rem)] w-8 h-px bg-blue-200 z-10" />
                )}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 h-full hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <step.icon size={24} className="text-white" />
                    </div>
                    <span className="font-cinzel text-4xl font-bold text-blue-100 select-none">{step.number}</span>
                  </div>
                  <h3 className="font-cinzel text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Bento Grid ───────────────────────────────── */}
      <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
              <Zap size={14} />
              Platform Features
            </div>
            <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">A complete toolkit built specifically for Ontario landlords and property managers.</p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-fr">

            {/* Large card - Lease Generation */}
            <div className="md:col-span-3 md:row-span-2 group bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 border border-blue-500/20 hover:shadow-2xl hover:shadow-blue-600/20 transition-all duration-300 cursor-default flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="inline-flex p-3 rounded-xl bg-white/15 mb-5">
                  <FileText size={26} className="text-white" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-white mb-3">Lease Generation</h3>
                <p className="text-blue-100 leading-relaxed">Generate Ontario-compliant leases in minutes. Smart forms, legal templates, instant PDF delivery. Stop spending hours on paperwork.</p>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-white/70 text-sm font-medium group-hover:text-white transition-colors duration-200">
                Generate your first lease <ArrowRight size={15} />
              </div>
            </div>

            {/* Small card - Property Mgmt */}
            <div className="md:col-span-3 group bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 cursor-default">
              <div className="inline-flex p-2.5 rounded-xl bg-blue-500/15 mb-4">
                <Building2 size={22} className="text-blue-400" />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white mb-2">Property Management</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Every unit, every detail — organized in one clean dashboard.</p>
            </div>

            {/* Small card - Tenant Mgmt */}
            <div className="md:col-span-3 group bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 cursor-default">
              <div className="inline-flex p-2.5 rounded-xl bg-indigo-500/15 mb-4">
                <Users size={22} className="text-indigo-400" />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white mb-2">Tenant Management</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Profiles, lease history, and payment tracking at a glance.</p>
            </div>

            {/* Large card - Analytics */}
            <div className="md:col-span-3 md:row-span-2 group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 hover:border-blue-500/30 hover:shadow-xl transition-all duration-300 cursor-default flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="inline-flex p-3 rounded-xl bg-sky-500/15 mb-5">
                  <BarChart3 size={26} className="text-sky-400" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-white mb-3">Analytics Dashboard</h3>
                <p className="text-slate-400 leading-relaxed">Portfolio insights, occupancy rates, and revenue trends in beautiful, easy-to-read reports.</p>
              </div>
              {/* Mini chart visual */}
              <div className="mt-6 flex items-end gap-1.5 h-16">
                {[40, 65, 45, 80, 60, 90, 75, 95, 70, 88].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-blue-500/30 group-hover:bg-blue-500/50 transition-colors duration-300" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Small card - Digital Comms */}
            <div className="md:col-span-3 group bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 cursor-default">
              <div className="inline-flex p-2.5 rounded-xl bg-blue-400/15 mb-4">
                <Mail size={22} className="text-blue-300" />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white mb-2">Digital Communication</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Send leases, collect e-signatures, manage all correspondence in one flow.</p>
            </div>

            {/* Small card - Secure */}
            <div className="md:col-span-3 group bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 cursor-default">
              <div className="inline-flex p-2.5 rounded-xl bg-green-500/15 mb-4">
                <ShieldCheck size={22} className="text-green-400" />
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white mb-2">Secure & Compliant</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Bank-level encryption, always current with Ontario rental law.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section id="pricing" className="py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">
              <Sparkles size={14} />
              Pricing
            </div>
            <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              No hidden fees. No long-term contracts. Start free, upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 border-2 transition-all duration-300 relative ${
                  plan.featured
                    ? 'bg-blue-600 border-blue-500 text-white shadow-2xl shadow-blue-500/25 md:scale-105'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xl text-slate-900'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-400 text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className={`font-cinzel text-2xl font-bold mb-1 ${plan.featured ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-5 ${plan.featured ? 'text-blue-200' : 'text-slate-400'}`}>{plan.description}</p>

                <div className="mb-7">
                  <span className={`font-cinzel text-5xl font-bold ${plan.featured ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                  {plan.period && <span className={`text-sm ml-1 ${plan.featured ? 'text-blue-200' : 'text-slate-400'}`}>{plan.period}</span>}
                </div>

                <a
                  href="https://app.aaralink.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3.5 rounded-xl font-semibold text-sm text-center mb-7 transition-all duration-200 cursor-pointer ${
                    plan.featured
                      ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-md'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
                  }`}
                >
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </a>

                <ul className="space-y-3">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${plan.featured ? 'bg-white/20' : 'bg-blue-100'}`}>
                        <Check size={11} className={plan.featured ? 'text-white' : 'text-blue-600'} />
                      </div>
                      <span className={`text-sm leading-relaxed ${plan.featured ? 'text-blue-100' : 'text-slate-600'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
              <Star size={14} />
              Testimonials
            </div>
            <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4">Trusted by Property Managers</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Hear from landlords across Canada who switched to Aaralink.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className={`bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 hover:border-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default ${idx === 1 ? 'md:mt-6' : ''}`}
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed text-sm italic mb-7">&ldquo;{t.review}&rdquo;</p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="font-cinzel text-blue-300 font-bold text-sm">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role} &middot; {t.location}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full">{t.properties}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Download ─────────────────────────────────────────── */}
      <section id="download" className="py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl overflow-hidden px-8 md:px-16 py-16 text-center">
            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(96,165,250,0.2),transparent_70%)]" />
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 text-blue-200 text-xs font-bold tracking-widest uppercase mb-6 bg-white/10 px-4 py-2 rounded-full">
                <Globe size={13} />
                Available Everywhere
              </div>
              <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4">
                Download Aaralink Today
              </h2>
              <p className="text-blue-200 text-lg mb-12 max-w-lg mx-auto">
                iOS, Android, and Web. All platforms fully synced. Start managing smarter now.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-3xl mx-auto">
                <a href="https://apps.apple.com/app/aaralink" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-6 py-5 rounded-2xl font-semibold transition-all duration-200 cursor-pointer">
                  <Apple size={28} className="flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-xs text-white/60">Download on the</div>
                    <div className="text-xl font-cinzel font-bold">App Store</div>
                  </div>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.aaralink" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-6 py-5 rounded-2xl font-semibold transition-all duration-200 cursor-pointer">
                  <Play size={28} className="flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-xs text-white/60">Get it on</div>
                    <div className="text-xl font-cinzel font-bold">Google Play</div>
                  </div>
                </a>
                <a href="https://app.aaralink.ca" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-4 bg-white text-blue-700 hover:bg-blue-50 px-6 py-5 rounded-2xl font-semibold transition-all duration-200 shadow-xl cursor-pointer">
                  <Globe size={28} className="flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-xs text-blue-400">Open the</div>
                    <div className="text-xl font-cinzel font-bold">Web App</div>
                  </div>
                </a>
              </div>

              <p className="mt-10 text-blue-300/60 text-sm">
                All platforms fully synced &nbsp;&bull;&nbsp; No subscription required for web &nbsp;&bull;&nbsp; Full feature parity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-slate-900 mb-5">
            Ready to Transform<br />Your Portfolio?
          </h2>
          <p className="text-slate-500 text-lg mb-10 max-w-lg mx-auto">
            Join thousands of property managers saving hours every week. Free to start — no credit card required.
          </p>
          <a href="https://app.aaralink.ca" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-base transition-all duration-200 shadow-xl shadow-blue-500/25 cursor-pointer">
            Start for Free
            <ArrowRight size={18} />
          </a>
          <p className="mt-5 text-slate-400 text-sm">No credit card required &nbsp;&bull;&nbsp; Cancel anytime</p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-500 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <h3 className="font-cinzel text-white text-lg font-bold mb-3 tracking-wider">AARALINK</h3>
              <p className="text-sm leading-relaxed">Simplifying property management for Ontario landlords and managers.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Download'] },
              { title: 'Company', links: ['About', 'Blog', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{col.title}</h4>
                <ul className="space-y-2.5 text-sm">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href={`#${link.toLowerCase()}`} className="hover:text-white transition-colors duration-200 cursor-pointer">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2026 Aaralink Inc. All rights reserved.</p>
            <p className="text-sm">Ontario, Canada</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
