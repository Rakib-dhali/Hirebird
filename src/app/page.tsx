"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "motion/react";
import {
  CheckSquare,
  ArrowRight,
  BarChart3,
  Users,
  Kanban,
  Sparkles,
  Globe,
  Mail,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import scr from "@/assets/scr.png"

/* ─────────────────────────────── Animations ─────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const staggerContainer: Variants = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ─────────────────────────────── Navbar ──────────────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/40 backdrop-blur-md border-b border-slate-200/80 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md group-hover:shadow-indigo-500/20 transition-shadow">
            <CheckSquare className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">Hirebird</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            How it works
          </a>
          <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Pricing
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/sign-in" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-3 py-2">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-500/15 transition-all hover:shadow-indigo-500/25"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-b border-slate-200 px-6 pb-6 space-y-3 shadow-lg"
        >
          <a
            href="#features"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-slate-600 hover:text-indigo-600 py-2 border-b border-slate-100"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-slate-600 hover:text-indigo-600 py-2 border-b border-slate-100"
          >
            How it works
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-slate-600 hover:text-indigo-600 py-2 border-b border-slate-100"
          >
            Pricing
          </a>
          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/sign-in"
              className="text-center text-sm font-semibold text-slate-700 hover:text-indigo-600 py-2 rounded-lg border border-slate-200"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

/* ─────────────────────────────── Hero ────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative bg-slate-50 pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Subtle Grid background */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
          backgroundSize: `24px 24px`,
        }}
      />

      {/* Decorative gradient blur */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-200/50 via-violet-200/30 to-purple-200/40 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          {/* Tagline Badge */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold mb-6 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Track every application. Land your next job.</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6"
          >
            Stop losing track of your{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              job applications
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-9"
          >
            Hirebird gives you a visual pipeline, smart analytics, and contact tracking — all in one place.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link
              href="/sign-up"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer"
            >
              <span>Start for free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl shadow-xs transition-all"
            >
              <span>See how it works</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </motion.div>
        </div>

        {/* Hero Mockup */}
        <motion.div
          variants={scaleUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 blur-xl" />

          {/* Screenshot Card Container */}
          <div className="relative rounded-2xl bg-white p-2 border border-slate-200/90 shadow-2xl shadow-slate-900/10">
            <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-900">
              <Image
                src={scr}
                alt="Hirebird kanban board UI mockup"
                width={1200}
                height={700}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Features ────────────────────────────────── */

const FEATURES = [
  {
    icon: Kanban,
    title: "Kanban Pipeline",
    description: "Drag and drop applications through every stage of your hiring process.",
    iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "See your response rate, weekly trends, and best performing job sources.",
    iconBg: "bg-violet-50 text-violet-600 border border-violet-100",
  },
  {
    icon: Users,
    title: "Contact Tracking",
    description: "Save recruiter details against every application so nothing slips through.",
    iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="relative bg-white py-20 sm:py-28 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4">
            Everything you need to stay organized
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Take total control of your job search with intuitive tools designed for modern applicants.
          </p>
        </motion.div>

        {/* Feature Cards Row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col group"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${f.iconBg} mb-5 group-hover:scale-105 transition-transform`}
              >
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────── How It Works ────────────────────────────────── */

const STEPS = [
  {
    step: "1",
    title: "Create an account",
    description: "Sign up for free in seconds. No credit card required.",
  },
  {
    step: "2",
    title: "Add your applications",
    description: "Log every job you apply to with one click. Store salary, contacts, and custom notes.",
  },
  {
    step: "3",
    title: "Track your progress",
    description: "Watch your pipeline and analytics update in real time as you advance through rounds.",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative bg-slate-50 py-20 sm:py-28 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4">
            Get started in 3 steps
          </h2>
        </motion.div>

        {/* 3 Numbered Steps Side by Side */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {STEPS.map((s, idx) => (
            <motion.div
              key={s.step}
              variants={fadeUp}
              className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xs relative flex flex-col items-start"
            >
              {/* Number Badge */}
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center mb-5 shadow-sm">
                {s.step}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────── Stats (Dark Contrast) ────────────────────── */

const STATS = [
  { value: "2,400+", label: "Applications tracked" },
  { value: "89%", label: "Users got more organized" },
  { value: "3x", label: "Faster follow-up rate" },
];

function StatsSection() {
  return (
    <section id="stats" className="relative bg-slate-900 text-white py-20 sm:py-28 overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center"
        >
          {STATS.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="p-4">
              <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-2">
                {s.value}
              </p>
              <p className="text-sm sm:text-base text-slate-400 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── CTA ────────────────────────────────────── */

function CTASection() {
  return (
    <section className="relative bg-slate-50 py-20 sm:py-28 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-10 sm:p-16 text-center shadow-xl shadow-indigo-500/10"
        >
          {/* Subtle background circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Ready to take control of your job search?
            </h2>
            <p className="text-base sm:text-lg text-indigo-100/90 mb-8">
              Join hundreds of job seekers already using Hirebird to organize their applications and land interviews faster.
            </p>
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-indigo-700 bg-white hover:bg-indigo-50 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Footer ──────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
                <CheckSquare className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-slate-900">Hirebird</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <p className="text-xs text-slate-500">Track every application. Land your next job.</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
            >
              <FaGithub className="w-4 h-4 text-slate-500" />
              <span>GitHub</span>
            </a>
            <a
              href="https://rakibul.is-a.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>Portfolio</span>
            </a>
            <a
              href="mailto:contact@hirebird.app"
              className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
            >
              <Mail className="w-4 h-4 text-slate-500" />
              <span>Contact</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">&copy; 2026 Hirebird. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────── Landing Page ────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
