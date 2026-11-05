"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Headphones,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Globe2,
  Building2,
  Clock,
  Layers,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
} from "lucide-react";

const STATS = [
  { value: "14+", label: "Years of Experience", description: "Trusted procurement partner across Pakistan since 2011" },
  { value: "10", label: "Core Supply Domains", description: "Office essentials to heavy industrial tools" },
  { value: "100%", label: "Nationwide Delivery", description: "Comprehensive logistics network reaching all regions" },
  { value: "10,000+", label: "Supplies & SKUs", description: "One-stop sourcing under one roof" },
];

const HOW_WE_WORK_PILLARS = [
  {
    step: "01",
    title: "Understanding Your Needs",
    description:
      "We start by understanding your specific business requirements, operational objectives, and procurement challenges.",
    icon: Headphones,
  },
  {
    step: "02",
    title: "Customized Solutions",
    description:
      "Based on your needs, we develop tailored procurement strategies and supply chain setups to ensure efficiency and cost savings.",
    icon: Layers,
  },
  {
    step: "03",
    title: "Supply Chain Resilience",
    description:
      "Our agile procurement process adapts to market fluctuations, minimizing disruption and keeping your operations running smoothly.",
    icon: TrendingUp,
  },
  {
    step: "04",
    title: "Quality Assurance",
    description:
      "We partner strictly with suppliers who meet rigorous quality standards, maintaining excellence in everything we deliver.",
    icon: ShieldCheck,
  },
  {
    step: "05",
    title: "Continuous Improvement",
    description:
      "We continuously monitor the supply process, collect feedback, and optimize to ensure your requirements are consistently exceeded.",
    icon: Clock,
  },
  {
    step: "06",
    title: "Ethical Practices",
    description:
      "Integrity is at the heart of our operations. We ensure ethical sourcing and responsible business practices across our entire supply chain.",
    icon: Award,
  },
];

const VALUE_PROPOSITIONS = [
  {
    title: "One-stop Solution",
    description: "Complete solution for all procurement needs, providing everything your business requires under one roof.",
    icon: Building2,
  },
  {
    title: "Nationwide Delivery",
    description: "Comprehensive logistics network covering Karachi, Lahore, Islamabad, Peshawar, Quetta, and all regions across Pakistan.",
    icon: Truck,
  },
  {
    title: "Ease of Ordering",
    description: "Streamlined corporate ordering process with transparent quotations, dedicated account reps, and centralized invoicing.",
    icon: CheckCircle2,
  },
  {
    title: "Competitive Pricing",
    description: "Direct vendor relations and wholesale volume sourcing ensure maximum cost efficiency for your procurement budget.",
    icon: Zap,
  },
];

const CORE_DOMAINS = [
  "Electronic Appliances",
  "Hardware and Tools",
  "Office Supplies & Stationery",
  "IT Accessories & Gadgets",
  "Mobile Phones & Laptops",
  "Office & Industrial Uniforms",
  "Beverages & Grocery",
  "Hygiene & Cleaning Products",
  "Souvenirs & Corporate Gifting",
  "ID Cards & Lamination Products",
];

const PARTNER_LOGOS = [
  "/images/partner1.png",
  "/images/partner2.png",
  "/images/partner3.png",
  "/images/partner4.png",
  "/images/partner5.png",
  "/images/partner6.png",
  "/images/partner7.png",
  "/images/partner8.png",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#212529]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-5 sm:py-7">
        {/* ========================================================= */}
        {/* 1. BREADCRUMBS                                            */}
        {/* ========================================================= */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#71717a] mb-8">
          <Link href="/" className="hover:text-[#0ea57a] transition-colors">
            Home
          </Link>
          <span className="text-[#a1a1aa] font-normal">&gt;</span>
          <span className="text-[#18181b] font-medium">About Us</span>
        </nav>

        {/* ========================================================= */}
        {/* 2. HERO STORY SECTION                                     */}
        {/* ========================================================= */}
        <section className="py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Heading, Vision & Experience */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecfdf5] text-[#0ea57a] border border-[#a7f3d0] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles size={14} />
                <span>About Industrial Edge</span>
              </div>

              <h1 className="text-[30px] sm:text-[40px] lg:text-[44px] font-bold text-[#171145] tracking-tight leading-[1.2] mb-5">
                Streamline Your Business Procurement Across Pakistan.
              </h1>

              <p className="text-[15px] sm:text-[16px] text-[#52525b] leading-relaxed mb-6 font-medium">
                From office essentials to industrial supplies, <strong>Industrial Edge</strong> is your trusted procurement partner with <strong>14 years of expertise</strong>. We provide tailored, one-stop solutions designed to support your operational efficiency.
              </p>

              {/* Vision Box */}
              <div className="p-5 sm:p-6 bg-[#f8fafc] border-l-4 border-[#0ea57a] rounded-r-[10px] mb-8 shadow-xs">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#0ea57a] mb-2">
                  Our Corporate Vision
                </h2>
                <p className="text-[14px] sm:text-[14.5px] text-[#334155] italic leading-relaxed">
                  &ldquo;At Industrial Edge, our vision is to reshape the procurement landscape by providing forward-thinking solutions that drive value, sustainability, and growth. We aim to deliver not just products and services, but strategic advantages that enhance our clients’ supply chains and contribute to their long-term success. Through innovative solutions, exceptional service, and a commitment to sustainability, we aim to support your operations with seamless procurement experiences every time.&rdquo;
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  "14+ years of established B2B supply experience across Pakistan",
                  "Comprehensive portfolio covering 10 core commercial & industrial domains",
                  "Nationwide logistics network ensuring prompt, secure delivery",
                  "Verified supplier partnerships meeting stringent quality standards",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#0ea57a] shrink-0 mt-0.5" />
                    <span className="text-[14px] text-[#27272a] font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/shop"
                  className="px-7 py-3.5 bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99] inline-flex items-center gap-2"
                >
                  <span>Explore Product Catalog</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/what-we-do"
                  className="px-7 py-3.5 bg-[#171145] hover:bg-[#201859] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99] inline-flex items-center gap-2"
                >
                  <span>What We Do</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[16px] overflow-hidden border border-[#e5e7eb] bg-[#fbfcfd] p-6 shadow-xl">
                <div className="relative aspect-4/3 w-full rounded-[10px] overflow-hidden bg-white">
                  <Image
                    src="/images/apple-imac.jpg"
                    alt="Industrial Edge Corporate Supplies & Tech"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-contain p-4"
                  />
                </div>

                {/* Floating Experience Badge */}
                <div className="absolute -bottom-3 left-2 sm:-left-4 sm:-bottom-4 bg-white border border-[#e5e7eb] rounded-[10px] p-3 sm:p-4 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0ea57a] text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-md">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="text-[16px] sm:text-[18px] font-bold text-[#171145]">14+ Years</div>
                    <div className="text-[11px] sm:text-[12px] text-[#71717a]">Proven Procurement Expertise</div>
                  </div>
                </div>

                {/* Floating Reach Badge */}
                <div className="absolute -top-2 right-2 sm:-right-3 sm:-top-3 bg-white border border-[#e5e7eb] rounded-[10px] py-1.5 px-3 sm:py-2 sm:px-3.5 shadow-lg flex items-center gap-2">
                  <Globe2 size={15} className="text-[#0ea57a]" />
                  <span className="text-[11px] sm:text-xs font-semibold text-[#171145]">Nationwide Delivery Pakistan</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. KEY METRICS STATS BAR                                  */}
        {/* ========================================================= */}
        <section className="my-14 py-10 px-6 sm:px-10 bg-[#fafafa] border border-[#f0f0f0] rounded-[12px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb]">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`text-center ${i !== 0 ? "pt-6 sm:pt-0 sm:pl-6" : ""}`}>
                <div className="text-[32px] sm:text-[40px] font-bold text-[#0ea57a] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[15px] font-bold text-[#171145] mt-1">
                  {stat.label}
                </div>
                <div className="text-[12.5px] text-[#71717a] mt-0.5">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. HOW WE WORK (THE 6 PILLARS)                            */}
        {/* ========================================================= */}
        <section className="py-12">
          <div className="text-center max-w-[700px] mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0ea57a] mb-2 block">
              Tailored Methodology
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#171145] tracking-tight mb-3">
              How We Work
            </h2>
            <p className="text-[14.5px] text-[#71717a] leading-relaxed">
              At Industrial Edge, we combine deep industry expertise with a customer-first approach. We don’t believe in a one-size-fits-all approach. Instead, we craft procurement strategies specifically tailored to your business, ensuring that every step of the process supports your organization’s unique objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOW_WE_WORK_PILLARS.map((pillar) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white border border-[#e5e7eb] hover:border-[#0ea57a] rounded-[10px] p-6 transition-all duration-200 hover:shadow-md group relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-[8px] bg-[#ecfdf5] group-hover:bg-[#0ea57a] text-[#0ea57a] group-hover:text-white flex items-center justify-center transition-colors">
                      <IconComp size={22} strokeWidth={2} />
                    </div>
                    <span className="text-[12px] font-extrabold text-[#94a3b8] group-hover:text-[#0ea57a] transition-colors">
                      {pillar.step}
                    </span>
                  </div>
                  <h3 className="text-[16.5px] font-bold text-[#171145] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-[13.5px] text-[#52525b] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. 10 CORE SUPPLY DOMAINS PREVIEW                         */}
        {/* ========================================================= */}
        <section className="my-14 py-12 px-6 sm:px-10 bg-[#fafafa] border border-[#f0f0f0] rounded-[14px]">
          <div className="text-center max-w-[650px] mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0ea57a] mb-2 block">
              Comprehensive Portfolio
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#171145] tracking-tight mb-3">
              10 Core Supply Domains
            </h2>
            <p className="text-[14.5px] text-[#71717a] leading-relaxed">
              Serving corporate offices, commercial facilities, and manufacturing industries across Pakistan with high-quality general order supplies.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CORE_DOMAINS.map((domain, index) => (
              <div
                key={domain}
                className="bg-white border border-[#e5e7eb] rounded-[8px] p-4 text-center hover:border-[#0ea57a] hover:shadow-xs transition-all flex flex-col justify-center items-center gap-2 group"
              >
                <div className="w-7 h-7 rounded-full bg-[#ecfdf5] text-[#0ea57a] flex items-center justify-center font-bold text-xs group-hover:bg-[#0ea57a] group-hover:text-white transition-colors">
                  {index + 1}
                </div>
                <span className="text-[13px] font-bold text-[#171145] group-hover:text-[#0ea57a] transition-colors">
                  {domain}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/what-we-do"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-[#0ea57a] hover:underline"
            >
              <span>Explore all domain details &amp; procurement services</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. VALUE PROPOSITION: SIMPLIFYING PROCUREMENT             */}
        {/* ========================================================= */}
        <section className="py-12">
          <div className="text-center max-w-[650px] mx-auto mb-12">
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#171145] tracking-tight mb-3">
              Simplifying Business Procurement
            </h2>
            <p className="text-[14.5px] text-[#71717a] leading-relaxed">
              We streamline the complexities of corporate purchasing so your organization can focus on core business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPOSITIONS.map((prop) => {
              const IconComp = prop.icon;
              return (
                <div
                  key={prop.title}
                  className="bg-white border border-[#e5e7eb] rounded-[10px] p-6 shadow-2xs hover:border-[#0ea57a] transition-colors"
                >
                  <div className="w-12 h-12 rounded-[8px] bg-[#ecfdf5] text-[#0ea57a] flex items-center justify-center mb-4">
                    <IconComp size={22} strokeWidth={2} />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#171145] mb-2">
                    {prop.title}
                  </h3>
                  <p className="text-[13px] text-[#52525b] leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. BRAND PARTNERS LOGO CAROUSEL / ROW                     */}
        {/* ========================================================= */}
        <section className="py-12 border-t border-b border-[#f0f0f0] my-8">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-[#a1a1aa] mb-8">
            Trusted Partners &amp; Tier-1 Quality Manufacturers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 hover:opacity-100 transition-opacity">
            {PARTNER_LOGOS.map((logo, idx) => (
              <div key={idx} className="relative w-24 h-10 grayscale hover:grayscale-0 transition-all">
                <Image
                  src={logo}
                  alt={`Brand Partner ${idx + 1}`}
                  fill
                  sizes="100px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 8. CALL TO ACTION BANNER                                  */}
        {/* ========================================================= */}
        <section className="mb-16 bg-[#171145] rounded-[14px] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-[700px]">
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight mb-3 text-white">
              Your Trusted Partner for Corporate Procurement &amp; Gifting
            </h2>
            <p className="text-[15px] text-[#cbd5e1] leading-relaxed mb-8">
              Let Industrial Edge manage your business supplies, office equipment, and enterprise orders with guaranteed authenticity and nationwide logistics.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99] inline-flex items-center gap-2"
              >
                <span>Request Procurement Quotation</span>
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
