"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Headphones,
  Award,
  CheckCircle2,
  Users,
  Cpu,
  ArrowRight,
  Star,
  Sparkles,
  Zap,
  Globe2,
} from "lucide-react";

const STATS = [
  { value: "150K+", label: "Active Customers", description: "Trusted worldwide across 45+ countries" },
  { value: "12,000+", label: "Curated Products", description: "Top-tier industrial & consumer tech" },
  { value: "99.8%", label: "On-Time Delivery", description: "Express global fulfillment logistics" },
  { value: "24/7", label: "Expert Support", description: "Dedicated certified technical team" },
];

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "100% Genuine & Certified",
    description:
      "Every product in our catalog is sourced directly from certified manufacturers with official warranty and authenticated specifications.",
  },
  {
    icon: Truck,
    title: "Fast & Tracked Shipping",
    description:
      "Same-day dispatch for eligible orders, real-time dispatch tracking, and free shipping on qualifying orders over $100.",
  },
  {
    icon: Headphones,
    title: "Dedicated Technical Support",
    description:
      "Our team of knowledgeable hardware specialists is ready 24/7 to help you choose the exact hardware for your workflow.",
  },
  {
    icon: Award,
    title: "Satisfaction Guaranteed",
    description:
      "Experience hassle-free 30-day returns, secure encrypted checkout, and transparent customer-first policies.",
  },
];

const MILESTONES = [
  {
    year: "2018",
    title: "Inception & Launch",
    description: "Started with a vision to make industrial computing and pro audio equipment accessible worldwide.",
  },
  {
    year: "2020",
    title: "Catalog Expansion",
    description: "Partnered directly with premier tech brands including Apple, Bose, Acer, and Lenovo.",
  },
  {
    year: "2023",
    title: "Global Warehousing",
    description: "Opened automated fulfillment centers across North America, Europe, and Asia for faster shipping.",
  },
  {
    year: "2026",
    title: "IndustrialEdge Next",
    description: "Serving over 150,000 tech enthusiasts and commercial enterprises with cutting-edge electronics.",
  },
];

const TESTIMONIALS = [
  {
    name: "Alex Thompson",
    role: "Senior Systems Engineer",
    company: "Apex Tech Labs",
    quote:
      "IndustrialEdge has been our go-to supplier for pro-grade laptops and workstation components. Fast delivery and genuine products every single time.",
    rating: 5,
  },
  {
    name: "Elena Rostova",
    role: "Studio Audio Producer",
    company: "SoundWave Media",
    quote:
      "Ordered the Bose Smart Speaker and high-end headphones. The checkout was seamless, and the sound quality blew our studio team away.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "IT Procurement Director",
    company: "Nexus Enterprises",
    quote:
      "Exceptional customer support when configuring bulk hardware. The team provided transparent specs and delivered ahead of schedule.",
    rating: 5,
  },
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
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 sm:py-7">
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
            {/* Left Column: Heading, Description, Bullets */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecfdf5] text-[#0ea57a] border border-[#a7f3d0] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles size={14} />
                <span>About IndustrialEdge</span>
              </div>

              <h1 className="text-[32px] sm:text-[42px] font-bold text-[#18181b] tracking-tight leading-[1.2] mb-5">
                Empowering Innovation in Industrial Electronics &amp; Consumer Tech.
              </h1>

              <p className="text-[15px] sm:text-[16px] text-[#52525b] leading-relaxed mb-6">
                Founded with a mission to bridge the gap between industrial-grade reliability and consumer sleekness,
                <strong> IndustrialEdge.pk</strong> curates state-of-the-art computers, pro audio, gaming gear,
                and smart digital hardware for professionals, creators, and enthusiasts worldwide.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Direct partnerships with premier global hardware manufacturers",
                  "Every unit inspected, verified, and backed by manufacturer warranty",
                  "Automated global fulfillment with real-time tracking",
                  "Dedicated 24/7 human technical assistance and order consultation",
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
                  <span>Explore Catalog</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="px-7 py-3.5 bg-[#333e48] hover:bg-[#222a32] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99] inline-flex items-center gap-2"
                >
                  <span>Contact Team</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Visual with Badges */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[16px] overflow-hidden border border-[#e5e7eb] bg-[#fbfcfd] p-6 shadow-xl">
                <div className="relative aspect-4/3 w-full rounded-[10px] overflow-hidden bg-white">
                  <Image
                    src="/images/apple-imac.jpg"
                    alt="IndustrialEdge Hardware Showcase"
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
                    <div className="text-[16px] sm:text-[18px] font-bold text-[#18181b]">8+ Years</div>
                    <div className="text-[11px] sm:text-[12px] text-[#71717a]">Of Tech Excellence</div>
                  </div>
                </div>

                {/* Floating Global Reach Badge */}
                <div className="absolute -top-2 right-2 sm:-right-3 sm:-top-3 bg-white border border-[#e5e7eb] rounded-[10px] py-1.5 px-3 sm:py-2 sm:px-3.5 shadow-lg flex items-center gap-2">
                  <Globe2 size={15} className="text-[#0ea57a]" />
                  <span className="text-[11px] sm:text-xs font-semibold text-[#18181b]">45+ Countries Served</span>
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
                <div className="text-[15px] font-bold text-[#18181b] mt-1">
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
        {/* 4. CORE VALUES / WHY CHOOSE US                             */}
        {/* ========================================================= */}
        <section className="py-12">
          <div className="text-center max-w-[650px] mx-auto mb-12">
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#18181b] tracking-tight mb-3">
              Why Choose IndustrialEdge
            </h2>
            <p className="text-[14.5px] text-[#71717a] leading-relaxed">
              We stand apart through our uncompromising dedication to product authenticity, rapid global logistics, and lifetime customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((val) => {
              const IconComp = val.icon;
              return (
                <div
                  key={val.title}
                  className="bg-white border border-[#e5e7eb] hover:border-[#0ea57a] rounded-[10px] p-6 transition-all duration-200 hover:shadow-md group"
                >
                  <div className="w-12 h-12 rounded-[8px] bg-[#ecfdf5] group-hover:bg-[#0ea57a] text-[#0ea57a] group-hover:text-white flex items-center justify-center transition-colors mb-4">
                    <IconComp size={22} strokeWidth={2} />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#18181b] mb-2">
                    {val.title}
                  </h3>
                  <p className="text-[13.5px] text-[#52525b] leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. BRAND PARTNERS LOGO CAROUSEL / ROW                     */}
        {/* ========================================================= */}
        <section className="py-12 border-t border-b border-[#f0f0f0] my-8">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-[#a1a1aa] mb-8">
            Trusted Partners &amp; Premier Manufacturers
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
        {/* 6. OUR JOURNEY & MILESTONES                               */}
        {/* ========================================================= */}
        <section className="py-12">
          <div className="text-center max-w-[650px] mx-auto mb-12">
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#18181b] tracking-tight mb-3">
              Our Journey So Far
            </h2>
            <p className="text-[14.5px] text-[#71717a] leading-relaxed">
              From our humble beginnings to a globally recognized electronics brand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MILESTONES.map((m) => (
              <div
                key={m.year}
                className="p-6 bg-[#fafafa] border border-[#e5e7eb] rounded-[10px] relative overflow-hidden"
              >
                <div className="text-[28px] font-extrabold text-[#0ea57a] mb-1">
                  {m.year}
                </div>
                <h3 className="text-[16px] font-bold text-[#18181b] mb-2">
                  {m.title}
                </h3>
                <p className="text-[13px] text-[#52525b] leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. VERIFIED CUSTOMER TESTIMONIALS                         */}
        {/* ========================================================= */}
        <section className="py-12 mb-10">
          <div className="text-center max-w-[650px] mx-auto mb-12">
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#18181b] tracking-tight mb-3">
              What Our Customers Say
            </h2>
            <p className="text-[14.5px] text-[#71717a] leading-relaxed">
              Read authentic feedback from hardware engineers, IT leaders, and creative professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-[#e5e7eb] rounded-[10px] p-6 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  {/* 5-star rating */}
                  <div className="flex items-center gap-1 text-[#f59e0b] mb-4">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-[14px] text-[#3f3f46] italic leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="border-t border-[#f4f4f5] pt-4">
                  <div className="font-bold text-[14.5px] text-[#18181b]">{t.name}</div>
                  <div className="text-xs text-[#71717a]">
                    {t.role} &bull; <span className="text-[#0ea57a]">{t.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 8. CALL TO ACTION BANNER                                  */}
        {/* ========================================================= */}
        <section className="mb-16 bg-[#18181b] rounded-[14px] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-[700px]">
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight mb-3 text-white">
              Ready to Upgrade Your Tech Setup?
            </h2>
            <p className="text-[15px] text-[#a1a1aa] leading-relaxed mb-8">
              Explore our wide range of pro laptops, audio hardware, and gaming peripherals.
              Enjoy certified warranty and express delivery worldwide.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99] inline-flex items-center gap-2"
              >
                <span>Browse All Products</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-[14px] rounded-[6px] transition-colors backdrop-blur-xs"
              >
                Contact Sales &amp; Support
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
