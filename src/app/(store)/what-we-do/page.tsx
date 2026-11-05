"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Cpu,
  Wrench,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  Laptop,
  Truck,
  Package,
  FileText,
  Coffee,
  Sparkle,
  Gift,
  CreditCard,
  Building2,
  BarChart3,
  Clock,
} from "lucide-react";

interface DomainService {
  id: string;
  icon: any;
  title: string;
  tagline: string;
  description: string;
  benefits: string[];
  metric: string;
  category: "Industrial & Tools" | "Technology & IT" | "Office & Commercial" | "Pantry & Hygiene";
}

const CORE_SUPPLY_DOMAINS: DomainService[] = [
  {
    id: "electronic-appliances",
    icon: Zap,
    title: "Electronic Appliances",
    tagline: "Commercial Cooling, Pantry & Workplace Electronics",
    description:
      "High-efficiency commercial appliances, office water dispensers, heating & cooling systems, kitchen electronics, and facility units sourced directly from verified manufacturers.",
    benefits: [
      "Official manufacturer warranty on all commercial appliances",
      "Bulk enterprise discounts and custom electrical specifications",
      "Nationwide installation support and rapid replacement guarantee",
    ],
    metric: "100% Warrantied",
    category: "Office & Commercial",
  },
  {
    id: "hardware-tools",
    icon: Wrench,
    title: "Hardware and Tools",
    tagline: "Industrial Power Tools, Hand Tools & Maintenance Gear",
    description:
      "Heavy-duty power drills, impact wrenches, precision hand tools, tool storage chests, safety hardware, and workshop machinery supplies engineered for industrial environments.",
    benefits: [
      "Rigorous quality standards for high-stress industrial operations",
      "Wide assortment of global tool brands and replacement parts",
      "Direct bulk contractor supply with guaranteed authenticity",
    ],
    metric: "Industrial Grade",
    category: "Industrial & Tools",
  },
  {
    id: "office-supplies-stationery",
    icon: FileText,
    title: "Office Supplies and Stationery",
    tagline: "Printing Paper, Filing Folders & Desk Essentials",
    description:
      "Comprehensive range of general order paper goods, executive notebooks, document filing systems, writing instruments, desk organizers, and daily administrative supplies.",
    benefits: [
      "Consistent bulk inventory and rapid monthly replenishment",
      "Premium 75gsm–80gsm copier paper, imported & local brands",
      "Corporate account consolidation with monthly billing cycles",
    ],
    metric: "10,000+ SKUs",
    category: "Office & Commercial",
  },
  {
    id: "it-accessories",
    icon: Cpu,
    title: "IT Accessories and Gadgets",
    tagline: "Connectivity, Charging, Peripherals & Ergonomic Gear",
    description:
      "Enterprise USB-C docking stations, display adapters, high-speed data cables, ergonomic mice, mechanical keyboards, surge protection units, and workspace tech accessories.",
    benefits: [
      "100% tested compatibility with major enterprise IT ecosystems",
      "Volume institutional pricing for company-wide hardware rollouts",
      "Immediate stock availability for fast turnarounds",
    ],
    metric: "Zero Bottlenecks",
    category: "Technology & IT",
  },
  {
    id: "mobiles-laptops",
    icon: Laptop,
    title: "Mobile Phones and Laptops",
    tagline: "Official Business Laptops, Smart Devices & Workstations",
    description:
      "Enterprise notebooks, executive laptops, official corporate smartphones, and tablets configured for business productivity and remote work setups.",
    benefits: [
      "Genuine PTA-approved devices with official brand warranties",
      "Custom imaging, RAM/SSD upgrades, and bulk asset tagging",
      "Competitive corporate pricing against retail markups",
    ],
    metric: "Official Brand Warranty",
    category: "Technology & IT",
  },
  {
    id: "uniforms-safety",
    icon: ShieldCheck,
    title: "Office and Industrial Uniforms",
    tagline: "Certified Safety Gear, PPE & Corporate Attire",
    description:
      "Custom embroidered corporate shirts, industrial boiler suits, reflective safety vests, steel-toe boots, hard hats, safety goggles, and protective gloves.",
    benefits: [
      "High-durability fabrics meeting industrial safety compliance",
      "Bespoke logo embroidery and corporate color customization",
      "Complete size ranges for small teams to 5,000+ workforce",
    ],
    metric: "Safety Certified",
    category: "Industrial & Tools",
  },
  {
    id: "beverages-grocery",
    icon: Coffee,
    title: "Beverages and Grocery",
    tagline: "Office Pantry Provisions, Tea, Coffee & Refreshments",
    description:
      "Scheduled pantry supplies including premium tea bags, roast coffee beans, sugar, dairy creamers, bottled mineral water, juices, and essential office refreshments.",
    benefits: [
      "Guaranteed fresh batch delivery straight to your breakroom",
      "Automated monthly delivery schedules tailored to headcounts",
      "Wholesale enterprise bulk rates with unified invoicing",
    ],
    metric: "Fresh Stock Guarantee",
    category: "Pantry & Hygiene",
  },
  {
    id: "hygiene-cleaning",
    icon: Sparkle,
    title: "Hygiene and Cleaning Products",
    tagline: "Janitorial Chemicals, Sanitizers, Tissues & Facility Supplies",
    description:
      "Commercial-grade disinfectants, antibacterial hand washes, surface cleaners, multi-fold paper towels, heavy-duty trash bags, floor mops, and sanitization dispensers.",
    benefits: [
      "Hospital-grade sanitation standards for office health & safety",
      "Bulk chemical containers and automatic wall dispenser systems",
      "Reliable nationwide distribution preventing supply stock-outs",
    ],
    metric: "Commercial Grade",
    category: "Pantry & Hygiene",
  },
  {
    id: "corporate-gifting",
    icon: Gift,
    title: "Souvenirs and Corporate Gifting",
    tagline: "Custom Executive Sets, Branded Merchandise & Event Giveaways",
    description:
      "Custom engraved executive gift boxes, branded leather diaries, metal pens, personalized thermal bottles, commemorative trophies, and seasonal corporate hampers.",
    benefits: [
      "High-precision laser engraving, UV printing, and embossing",
      "Luxurious bespoke packaging reflecting your corporate brand",
      "Fast production turnaround with strict delivery deadlines",
    ],
    metric: "Custom Branded",
    category: "Office & Commercial",
  },
  {
    id: "id-cards-lamination",
    icon: CreditCard,
    title: "ID Cards and Lamination Products",
    tagline: "PVC Cards, Security Lanyards & Lamination Supplies",
    description:
      "Thermal PVC printable cards, RFID smart chips, heavy-duty pouch lamination machines, thermal pouches, customized company lanyards, and security badge clips.",
    benefits: [
      "Crisp, tamper-resistant card printing and durable lamination",
      "Custom woven corporate lanyards with metal swivel hooks",
      "Full spectrum of badge holders, reels, and access card sleeves",
    ],
    metric: "High Durability",
    category: "Office & Commercial",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Strategic Sourcing",
    tagline: "Supplier Identification & Verification",
    description:
      "Expert identification and selection of quality suppliers, ensuring competitive pricing and reliable product sourcing for all your business needs.",
  },
  {
    step: "02",
    title: "Inventory Management",
    tagline: "Order Tracking & Allocation",
    description:
      "Efficient tracking and management of your orders with real-time updates and detailed reporting for better procurement decisions.",
  },
  {
    step: "03",
    title: "Delivery Optimization",
    tagline: "Nationwide Logistics",
    description:
      "Nationwide delivery network with flexible solutions, ensuring your supplies reach you when and where you need them across Pakistan.",
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
    description: "Comprehensive logistics network covering all industrial zones, business districts, and cities in Pakistan.",
    icon: Truck,
  },
  {
    title: "Ease of Ordering",
    description: "Streamlined corporate requisition workflow with consolidated quotes, PO handling, and transparent tracking.",
    icon: CheckCircle2,
  },
  {
    title: "Competitive Pricing",
    description: "Direct manufacturer relationships and wholesale bulk purchasing pass massive savings to your budget.",
    icon: Zap,
  },
];

export default function WhatWeDoPage() {
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const categories = ["All", "Industrial & Tools", "Technology & IT", "Office & Commercial", "Pantry & Hygiene"];

  const filteredDomains =
    filterCategory === "All"
      ? CORE_SUPPLY_DOMAINS
      : CORE_SUPPLY_DOMAINS.filter((d) => d.category === filterCategory);

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
          <span className="text-[#18181b] font-medium">What We Do</span>
        </nav>

        {/* ========================================================= */}
        {/* 2. HERO SECTION                                           */}
        {/* ========================================================= */}
        <section className="py-6 sm:py-12">
          <div className="max-w-[950px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecfdf5] text-[#0ea57a] border border-[#a7f3d0] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={14} />
              <span>Core Supply Domains &amp; Services</span>
            </div>

            <h1 className="text-[32px] sm:text-[44px] lg:text-[48px] font-bold text-[#171145] tracking-tight leading-[1.18] mb-5">
              Simplifying Business Procurement Across Pakistan.
            </h1>

            <p className="text-[15px] sm:text-[16px] text-[#52525b] leading-relaxed mb-6 font-medium">
              <strong>Industrial Edge simplifies procurement for businesses across Pakistan.</strong> With 14 years of experience, we provide a comprehensive range of general order supplies, from office essentials to heavy industrial tools. We understand the diverse needs of offices and industries.
            </p>

            <p className="text-[14.5px] text-[#71717a] leading-relaxed mb-8 max-w-[850px]">
              Our domain caters high-quality products sourced to meet stringent standards and ensure optimal performance. Whether you need stationery, office supplies, electronic appliances, hygiene &amp; cleaning, IT &amp; accessories, uniforms and safety gears, or customized corporate gifting, we offer a complete one-stop solution.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99] inline-flex items-center gap-2"
              >
                <span>Browse Product Catalog</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-[#171145] hover:bg-[#201859] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99]"
              >
                Request Enterprise Quote
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. VALUE PROPOSITION SUMMARY STRIP                        */}
        {/* ========================================================= */}
        <section className="py-6 border-t border-b border-[#f0f0f0] my-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {VALUE_PROPOSITIONS.map((prop) => {
              const IconComp = prop.icon;
              return (
                <div key={prop.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#ecfdf5] text-[#0ea57a] flex items-center justify-center shrink-0">
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#171145]">{prop.title}</h3>
                    <p className="text-[12px] text-[#71717a] mt-0.5 leading-snug">{prop.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. THE 10 CORE SUPPLY DOMAINS                             */}
        {/* ========================================================= */}
        <section className="py-12">
          <div className="text-center max-w-[700px] mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0ea57a] mb-2 block">
              10 Core Supply Domains
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#171145] tracking-tight mb-3">
              Comprehensive Sourcing Portfolio
            </h2>
            <p className="text-[15px] text-[#71717a] leading-relaxed">
              Explore our core supply domains engineered to meet the operational needs of enterprises, corporate offices, and industrial plants across Pakistan.
            </p>
          </div>

          {/* Filter Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  filterCategory === cat
                    ? "bg-[#0ea57a] text-white shadow-xs"
                    : "bg-[#f4f4f5] text-[#52525b] hover:bg-[#e4e4e7] hover:text-[#18181b]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Domain Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredDomains.map((service, idx) => {
              const IconComp = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white border border-[#e5e7eb] hover:border-[#0ea57a] rounded-[12px] p-7 transition-all duration-200 hover:shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Icon & Metric Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-13 h-13 rounded-[10px] bg-[#ecfdf5] group-hover:bg-[#0ea57a] text-[#0ea57a] group-hover:text-white flex items-center justify-center transition-colors">
                        <IconComp size={24} strokeWidth={2} />
                      </div>
                      <span className="text-[11.5px] font-semibold text-[#059669] bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-1 rounded-full">
                        {service.metric}
                      </span>
                    </div>

                    <h3 className="text-[18px] font-bold text-[#171145] group-hover:text-[#0ea57a] transition-colors mb-1.5 leading-snug">
                      {service.title}
                    </h3>

                    <p className="text-xs font-semibold text-[#0ea57a] mb-3">
                      {service.tagline}
                    </p>

                    <p className="text-[13.5px] text-[#52525b] leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Bullet Benefits */}
                    <div className="space-y-2.5 mb-6 pt-4 border-t border-[#f4f4f5]">
                      {service.benefits.map((b) => (
                        <div key={b} className="flex items-start gap-2.5 text-[12.5px] text-[#3f3f46]">
                          <CheckCircle2 size={15} className="text-[#0ea57a] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0ea57a] hover:text-[#047857] transition-colors pt-2 group/link"
                  >
                    <span>View Domain Products</span>
                    <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. PROCUREMENT PROCESS EXCELLENCE (3-STEP)                */}
        {/* ========================================================= */}
        <section className="my-14 py-12 px-6 sm:px-10 bg-[#fafafa] border border-[#e5e7eb] rounded-[14px]">
          <div className="text-center max-w-[650px] mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0ea57a] mb-2 block">
              Proven 3-Step Methodology
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#171145] tracking-tight mb-3">
              Procurement Process Excellence
            </h2>
            <p className="text-[14.5px] text-[#71717a] leading-relaxed">
              We streamline your procurement journey with our proven three-step process, ensuring efficient, cost-effective, and reliable supply chain management for businesses across Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-[#e5e7eb] rounded-[12px] p-7 shadow-xs relative hover:border-[#0ea57a] transition-colors"
              >
                <div className="text-[34px] font-extrabold text-[#0ea57a] leading-none mb-3">
                  {item.step}
                </div>
                <h3 className="text-[18px] font-bold text-[#171145] mb-1">
                  {item.title}
                </h3>
                <div className="text-xs font-semibold text-[#059669] mb-3">
                  {item.tagline}
                </div>
                <p className="text-[13.5px] text-[#52525b] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. CALL TO ACTION / ENTERPRISE BANNER                     */}
        {/* ========================================================= */}
        <section className="mb-16 bg-[#171145] text-white rounded-[14px] p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="max-w-[750px] relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-[#a7f3d0] mb-4">
              <Zap size={14} />
              <span>Let Industrial Edge Be Your Procurement Partner</span>
            </div>
            <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight mb-4">
              Have a Specific Corporate Requisition or Bulk Requirement?
            </h2>
            <p className="text-[15px] text-[#cbd5e1] leading-relaxed mb-8">
              Whether you need regular monthly pantry &amp; hygiene supplies, industrial tools, corporate gifting for an upcoming event, or office technology setup — our specialists are ready to provide custom institutional quotations.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99] inline-flex items-center gap-2"
              >
                <span>Request Custom Quote</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-[14px] rounded-[6px] transition-colors backdrop-blur-xs"
              >
                Browse Shop Catalog
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
