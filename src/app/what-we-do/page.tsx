"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Cpu,
  Server,
  Headphones,
  Network,
  Wrench,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Clock,
  Sparkles,
  Layers,
  Laptop,
} from "lucide-react";

const SERVICES = [
  {
    id: "hardware-procurement",
    icon: Cpu,
    title: "Industrial Hardware & Component Procurement",
    tagline: "Direct OEM Sourcing & Supply Chain Reliability",
    description:
      "We source genuine microprocessors, high-frequency memory modules, enterprise storage, and industrial-grade silicon directly from certified global manufacturers.",
    benefits: [
      "100% Genuine, serialized, and warrantied components",
      "Bulk enterprise discounts and custom billing",
      "Guaranteed supply continuity for commercial deployments",
    ],
    metric: "12,000+ Verified SKUs",
  },
  {
    id: "workstation-assembly",
    icon: Server,
    title: "Custom Workstations & High-Compute Servers",
    tagline: "Engineered for AI, 3D Rendering & Heavy Computation",
    description:
      "Our hardware engineers design and assemble purpose-built workstations optimized for machine learning training, architectural CAD rendering, and simulation workloads.",
    benefits: [
      "Rigorous 72-hour thermal stress-testing and burn-in",
      "Custom liquid cooling loops and vibration dampening",
      "Pre-configured Linux & Windows workstation environments",
    ],
    metric: "99.98% Hardware Reliability",
  },
  {
    id: "audio-integration",
    icon: Headphones,
    title: "Pro Audio & Acoustic Studio Integration",
    tagline: "Precision Sound Calibration for Creators & Studios",
    description:
      "From active noise-cancelling equipment and pro broadcast mics to wireless multi-room smart speakers, we calibrate sound systems for pure acoustic fidelity.",
    benefits: [
      "Ultra-low latency audio interfaces and digital DSPs",
      "Acoustic frequency response testing and matching",
      "Turnkey broadcast and podcasting studio bundles",
    ],
    metric: "Zero-Latency Sound",
  },
  {
    id: "enterprise-networking",
    icon: Network,
    title: "Enterprise Networking & Storage Arrays",
    tagline: "High-Throughput Connectivity & Redundant Backups",
    description:
      "We architect high-speed 10GbE network backbones, multi-bay enterprise NAS solutions, and robust wireless mesh infrastructures for uninterrupted enterprise operation.",
    benefits: [
      "Automated RAID redundancy and cloud synchronization",
      "Managed Layer-3 switching with QoS prioritization",
      "Zero-downtime failover configuration",
    ],
    metric: "10GbE Fast Backbone",
  },
  {
    id: "smart-iot",
    icon: Layers,
    title: "Smart Devices & Automation Systems",
    tagline: "Intelligent Telematics & Connected Hardware",
    description:
      "Integration of industrial sensors, environmental telemetry modules, and cutting-edge consumer smart gadgets communicating over secure protocols.",
    benefits: [
      "Matter, Zigbee, and Wi-Fi 6 interoperability",
      "Real-time sensor telemetry and cloud dashboards",
      "Automated power management and energy monitoring",
    ],
    metric: "Multi-Protocol Support",
  },
  {
    id: "diagnostics-repair",
    icon: Wrench,
    title: "Component Diagnostics & Technical Lifecycle Support",
    tagline: "Certified ESD-Safe Maintenance & Repairs",
    description:
      "Comprehensive component-level diagnostics, thermal maintenance, bios firmware flashing, and rapid warranty RMA handling by certified technicians.",
    benefits: [
      "48-hour diagnostic turnaround on priority service",
      "ESD-safe certified laboratory environment",
      "Transparent reporting and genuine spare parts guarantee",
    ],
    metric: "48h Rapid Turnaround",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery & Requirements",
    description:
      "We analyze your compute requirements, software dependencies, and operational constraints to determine ideal hardware specs.",
  },
  {
    step: "02",
    title: "Component Matching & Curation",
    description:
      "Selecting verified, tier-one parts with guaranteed thermal headroom, zero bottlenecks, and full warranty coverage.",
  },
  {
    step: "03",
    title: "Benchmarking & Burn-in Testing",
    description:
      "Every machine and hardware cluster undergoes 72 hours of continuous stress testing to guarantee rock-solid stability.",
  },
  {
    step: "04",
    title: "Express Delivery & Support",
    description:
      "Insured, tracked global dispatch with dedicated technical engineers ready to assist with deployment and ongoing operation.",
  },
];

const INDUSTRIES = [
  { label: "Artificial Intelligence & ML", icon: Zap },
  { label: "Industrial Automation", icon: Cpu },
  { label: "Audio Production & Media", icon: Headphones },
  { label: "Enterprise Data Centers", icon: Server },
  { label: "Gaming & Esports Rigs", icon: Laptop },
  { label: "Smart Office & IoT", icon: Layers },
];

export default function WhatWeDoPage() {
  const [activeTab, setActiveTab] = useState<string>("hardware-procurement");

  const currentService = SERVICES.find((s) => s.id === activeTab) || SERVICES[0];

  return (
    <div className="min-h-screen bg-white text-[#212529]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 sm:py-7">
        {/* ========================================================= */}
        {/* 1. BREADCRUMBS                                            */}
        {/* ========================================================= */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#71717a] mb-8">
          <Link href="/" className="hover:text-[#ff3d3d] transition-colors">
            Home
          </Link>
          <span className="text-[#a1a1aa] font-normal">&gt;</span>
          <span className="text-[#18181b] font-medium">What We Do</span>
        </nav>

        {/* ========================================================= */}
        {/* 2. HERO SECTION                                           */}
        {/* ========================================================= */}
        <section className="py-6 sm:py-12">
          <div className="max-w-[900px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fef2f2] text-[#ff3d3d] border border-[#fecaca] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={14} />
              <span>Our Capabilities &amp; Services</span>
            </div>

            <h1 className="text-[34px] sm:text-[46px] font-bold text-[#18181b] tracking-tight leading-[1.15] mb-5">
              End-to-End Technology Solutions for Enterprises, Creators &amp; Enthusiasts.
            </h1>

            <p className="text-[16px] text-[#52525b] leading-relaxed mb-8 max-w-[780px]">
              From pro-grade hardware procurement and custom workstation engineering to certified studio acoustics
              and lifecycle diagnostics — IndustrialEdge provides the reliable foundation required to drive your digital ambitions.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-[#ff3d3d] hover:bg-[#e03131] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99] inline-flex items-center gap-2"
              >
                <span>Browse Products &amp; Kits</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-[#333e48] hover:bg-[#222a32] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99]"
              >
                Request Enterprise Quote
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. INDUSTRIES WE SERVE BADGES                             */}
        {/* ========================================================= */}
        <section className="py-6 border-t border-b border-[#f0f0f0] my-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] shrink-0">
              Core Industries:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {INDUSTRIES.map((ind) => {
                const IconComp = ind.icon;
                return (
                  <div
                    key={ind.label}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#fafafa] border border-[#e5e7eb] rounded-full text-xs font-medium text-[#3f3f46]"
                  >
                    <IconComp size={14} className="text-[#ff3d3d]" />
                    <span>{ind.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. THE 6 PILLARS / SERVICES CARDS                         */}
        {/* ========================================================= */}
        <section className="py-12">
          <div className="text-center max-w-[700px] mx-auto mb-14">
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#18181b] tracking-tight mb-3">
              Our Core Services &amp; Specialties
            </h2>
            <p className="text-[15px] text-[#71717a] leading-relaxed">
              Discover how our specialized hardware departments help individuals and companies achieve peak operational performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {SERVICES.map((service) => {
              const IconComp = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white border border-[#e5e7eb] hover:border-[#ff3d3d] rounded-[12px] p-7 transition-all duration-200 hover:shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Icon & Metric Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-13 h-13 rounded-[10px] bg-[#fef2f2] group-hover:bg-[#ff3d3d] text-[#ff3d3d] group-hover:text-white flex items-center justify-center transition-colors">
                        <IconComp size={24} strokeWidth={2} />
                      </div>
                      <span className="text-[11.5px] font-semibold text-[#059669] bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-1 rounded-full">
                        {service.metric}
                      </span>
                    </div>

                    <h3 className="text-[18px] font-bold text-[#18181b] group-hover:text-[#ff3d3d] transition-colors mb-2 leading-snug">
                      {service.title}
                    </h3>

                    <p className="text-xs font-medium text-[#71717a] mb-4">
                      {service.tagline}
                    </p>

                    <p className="text-[13.5px] text-[#52525b] leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Bullet Benefits */}
                    <div className="space-y-2.5 mb-6 pt-4 border-t border-[#f4f4f5]">
                      {service.benefits.map((b) => (
                        <div key={b} className="flex items-start gap-2.5 text-[12.5px] text-[#3f3f46]">
                          <CheckCircle2 size={15} className="text-[#ff3d3d] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#ff3d3d] hover:text-[#b91c1c] transition-colors pt-2 group/link"
                  >
                    <span>Explore Hardware</span>
                    <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. HOW WE WORK (THE 4-STEP PROCESS)                       */}
        {/* ========================================================= */}
        <section className="my-14 py-12 px-6 sm:px-10 bg-[#fafafa] border border-[#e5e7eb] rounded-[14px]">
          <div className="text-center max-w-[650px] mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff3d3d] mb-2 block">
              Transparent Methodology
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#18181b] tracking-tight mb-3">
              How We Deliver Precision
            </h2>
            <p className="text-[14.5px] text-[#71717a] leading-relaxed">
              From the initial consultation to final burn-in validation and global deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((item, idx) => (
              <div
                key={item.step}
                className="bg-white border border-[#e5e7eb] rounded-[10px] p-6 shadow-2xs relative"
              >
                <div className="text-[32px] font-extrabold text-[#fee2e2] group-hover:text-[#ff3d3d] leading-none mb-4">
                  {item.step}
                </div>
                <h3 className="text-[16px] font-bold text-[#18181b] mb-2">
                  {item.title}
                </h3>
                <p className="text-[13px] text-[#52525b] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. CALL TO ACTION / ENTERPRISE BANNER                     */}
        {/* ========================================================= */}
        <section className="mb-16 bg-[#18181b] text-white rounded-[14px] p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="max-w-[700px] relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-[#fca5a5] mb-4">
              <Zap size={14} />
              <span>Fast Turnaround &amp; Custom Quotes</span>
            </div>
            <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight mb-4">
              Have a Custom Tech Requirement?
            </h2>
            <p className="text-[15px] text-[#a1a1aa] leading-relaxed mb-8">
              Whether you need specialized workstation configurations, pro studio audio gear, or bulk hardware procurement,
              our specialists are available 24/7 to architect the right solution.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-[#ff3d3d] hover:bg-[#e03131] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99] inline-flex items-center gap-2"
              >
                <span>Talk to an Engineer</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-[14px] rounded-[6px] transition-colors backdrop-blur-xs"
              >
                Browse Shop
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
