"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Handshake,
  ShieldCheck,
  Globe2,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Check,
  Send,
  Building2,
  Cpu,
  Server,
  Headphones,
  Laptop,
  Network,
} from "lucide-react";

interface PartnerItem {
  id: string;
  name: string;
  logo: string;
  category: "all" | "computing" | "audio" | "semiconductors" | "networking";
  categoryLabel: string;
  tier: "Global Strategic Partner" | "Authorized Premier Partner" | "Certified Alliance";
  description: string;
  productsCount: string;
  highlight: string;
}

const PARTNER_DATA: PartnerItem[] = [
  {
    id: "partner-1",
    name: "Apple Premier Enterprise",
    logo: "/images/partner1.png",
    category: "computing",
    categoryLabel: "Computers & Smart Devices",
    tier: "Global Strategic Partner",
    description: "Official authorized enterprise partner for M-Series silicon, MacBook Pro, iMac workstations, and AirPods ecosystem.",
    productsCount: "140+ Products",
    highlight: "Direct Manufacturer Warranty",
  },
  {
    id: "partner-2",
    name: "Bose Professional Audio",
    logo: "/images/partner2.png",
    category: "audio",
    categoryLabel: "Pro Audio & Acoustics",
    tier: "Authorized Premier Partner",
    description: "Collaborating on calibrated acoustic hardware, active noise cancellation headphones, and smart wireless speakers.",
    productsCount: "85+ Products",
    highlight: "Acoustic Lab Certified",
  },
  {
    id: "partner-3",
    name: "Acer Industrial Solutions",
    logo: "/images/partner3.png",
    category: "computing",
    categoryLabel: "Laptops & Workstations",
    tier: "Global Strategic Partner",
    description: "Supplying high-efficiency Intel and AMD based Aspire and Predator series laptops for commercial workflows.",
    productsCount: "110+ Products",
    highlight: "Next-Day Hardware Swap",
  },
  {
    id: "partner-4",
    name: "Intel Advanced Compute",
    logo: "/images/partner4.png",
    category: "semiconductors",
    categoryLabel: "Silicon & Microchips",
    tier: "Global Strategic Partner",
    description: "Direct OEM supply of 11th–14th Gen Intel Core and Xeon processors for heavy computational workflows.",
    productsCount: "250+ SKUs",
    highlight: "Verified Factory Steppings",
  },
  {
    id: "partner-5",
    name: "SkyTech Gaming & AI Rigs",
    logo: "/images/partner5.png",
    category: "computing",
    categoryLabel: "Workstations & AI Clusters",
    tier: "Authorized Premier Partner",
    description: "Custom pre-assembled desktop workstations featuring liquid cooling, high-airflow chassis, and NVIDIA RTX cards.",
    productsCount: "60+ Systems",
    highlight: "72-Hour Burn-in Tested",
  },
  {
    id: "partner-6",
    name: "Western Digital Enterprise",
    logo: "/images/partner6.png",
    category: "networking",
    categoryLabel: "Storage & Backbones",
    tier: "Certified Alliance",
    description: "High-capacity NVMe SSDs and enterprise datacenter hard drives engineered for zero-data-loss redundancy.",
    productsCount: "95+ Products",
    highlight: "2.5M Hours MTBF Rated",
  },
  {
    id: "partner-7",
    name: "Sony Electronics Pro",
    logo: "/images/partner7.png",
    category: "audio",
    categoryLabel: "Imaging & Audio Gear",
    tier: "Authorized Premier Partner",
    description: "Industry-standard mirrorless sensors, studio broadcast cameras, and LDAC-certified high-resolution audio equipment.",
    productsCount: "120+ Products",
    highlight: "Hi-Res Audio Certified",
  },
  {
    id: "partner-8",
    name: "Cisco & Ubiquiti Networks",
    logo: "/images/partner8.png",
    category: "networking",
    categoryLabel: "Enterprise Networking",
    tier: "Global Strategic Partner",
    description: "Managed 10GbE network switches, Wi-Fi 6 enterprise access points, and rackmount infrastructure hardware.",
    productsCount: "75+ Systems",
    highlight: "Enterprise QoS Certified",
  },
];

const CATEGORY_TABS = [
  { id: "all", label: "All Partners" },
  { id: "computing", label: "Computers & Systems" },
  { id: "audio", label: "Pro Audio & Acoustics" },
  { id: "semiconductors", label: "Silicon & Processors" },
  { id: "networking", label: "Enterprise Storage & Networks" },
];

const PARTNERSHIP_BENEFITS = [
  {
    icon: Globe2,
    title: "Global Distribution Network",
    description: "Fast multi-region fulfillment across North America, Europe, and Asia with zero-tariff enterprise handling.",
  },
  {
    icon: ShieldCheck,
    title: "Anti-Counterfeiting Guarantee",
    description: "Strict serialization tracking and verified chain of custody protecting your brand's integrity.",
  },
  {
    icon: Building2,
    title: "Dedicated B2B Sales Channels",
    description: "High-volume procurement with personalized enterprise account managers and negotiated payment terms.",
  },
  {
    icon: Award,
    title: "Co-Marketing & Prime Placement",
    description: "Featured storefront banners, deep technical reviews, and high-visibility digital showcase opportunities.",
  },
];

export default function PartnersPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [submittedForm, setSubmittedForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    category: "Hardware Manufacturer",
    message: "",
  });

  const filteredPartners =
    activeTab === "all"
      ? PARTNER_DATA
      : PARTNER_DATA.filter((p) => p.category === activeTab);

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.companyName.trim() && formData.email.trim()) {
      setSubmittedForm(true);
    }
  };

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
          <span className="text-[#18181b] font-medium">Partners</span>
        </nav>

        {/* ========================================================= */}
        {/* 2. HERO SECTION                                           */}
        {/* ========================================================= */}
        <section className="py-6 sm:py-10">
          <div className="max-w-[900px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecfdf5] text-[#0ea57a] border border-[#a7f3d0] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <Handshake size={14} />
              <span>Ecosystem &amp; Global Alliances</span>
            </div>

            <h1 className="text-[34px] sm:text-[46px] font-bold text-[#18181b] tracking-tight leading-[1.15] mb-5">
              Collaborating With World-Class Hardware &amp; Tech Leaders.
            </h1>

            <p className="text-[16px] text-[#52525b] leading-relaxed mb-8 max-w-[780px]">
              IndustrialEdge partners directly with certified global manufacturers, semiconductor pioneers,
              and enterprise network developers to deliver authentic, high-reliability technology with official warranties.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#partner-form"
                className="px-8 py-3.5 bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99] inline-flex items-center gap-2"
              >
                <span>Become a Partner</span>
                <ArrowRight size={16} />
              </a>
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-[#333e48] hover:bg-[#222a32] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99]"
              >
                Browse Partner Catalog
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. KEY METRICS STATS BAR                                  */}
        {/* ========================================================= */}
        <section className="my-10 py-8 px-6 sm:px-10 bg-[#fafafa] border border-[#f0f0f0] rounded-[12px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb]">
            <div className="text-center">
              <div className="text-[32px] sm:text-[38px] font-bold text-[#0ea57a] tracking-tight">50+</div>
              <div className="text-[14.5px] font-bold text-[#18181b] mt-0.5">Tier-1 OEM Partners</div>
              <div className="text-xs text-[#71717a]">Direct manufacturer agreements</div>
            </div>
            <div className="text-center pt-6 sm:pt-0 sm:pl-6">
              <div className="text-[32px] sm:text-[38px] font-bold text-[#0ea57a] tracking-tight">100%</div>
              <div className="text-[14.5px] font-bold text-[#18181b] mt-0.5">Genuine Serialized Tech</div>
              <div className="text-xs text-[#71717a]">Zero counterfeit tolerance</div>
            </div>
            <div className="text-center pt-6 sm:pt-0 sm:pl-6">
              <div className="text-[32px] sm:text-[38px] font-bold text-[#0ea57a] tracking-tight">45+</div>
              <div className="text-[14.5px] font-bold text-[#18181b] mt-0.5">Countries Fulfilled</div>
              <div className="text-xs text-[#71717a]">Global expedited logistics</div>
            </div>
            <div className="text-center pt-6 sm:pt-0 sm:pl-6">
              <div className="text-[32px] sm:text-[38px] font-bold text-[#0ea57a] tracking-tight">$45M+</div>
              <div className="text-[14.5px] font-bold text-[#18181b] mt-0.5">Annual B2B Volume</div>
              <div className="text-xs text-[#71717a]">Enterprise &amp; retail supply</div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. PARTNERS DIRECTORY WITH CATEGORY TABS                  */}
        {/* ========================================================= */}
        <section className="py-12">
          <div className="text-center max-w-[700px] mx-auto mb-10">
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#18181b] tracking-tight mb-3">
              Featured Strategic Partners
            </h2>
            <p className="text-[15px] text-[#71717a] leading-relaxed">
              Explore the certified brands and manufacturers that form the backbone of our digital inventory.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#0ea57a] text-white shadow-xs"
                    : "bg-[#f4f4f5] text-[#52525b] hover:bg-[#e4e4e7] hover:text-[#18181b]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPartners.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-[#e5e7eb] hover:border-[#0ea57a] rounded-[12px] p-6 transition-all duration-200 hover:shadow-lg flex flex-col justify-between group"
              >
                <div>
                  {/* Top Logo Container */}
                  <div className="h-16 w-full flex items-center justify-start mb-4 border-b border-[#f4f4f5] pb-4">
                    <div className="relative w-32 h-10">
                      <Image
                        src={p.logo}
                        alt={p.name}
                        fill
                        sizes="130px"
                        className="object-contain object-left group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>

                  {/* Tier Badge */}
                  <span className="inline-block text-[11px] font-bold text-[#0ea57a] bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-0.5 rounded-full mb-3">
                    {p.tier}
                  </span>

                  <h3 className="text-[16px] font-bold text-[#18181b] group-hover:text-[#0ea57a] transition-colors mb-2">
                    {p.name}
                  </h3>

                  <p className="text-[13px] text-[#52525b] leading-relaxed mb-4">
                    {p.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-[#71717a] pt-3 border-t border-[#f4f4f5]">
                    <div className="flex items-center justify-between">
                      <span>Available Catalog:</span>
                      <strong className="text-[#18181b]">{p.productsCount}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Assurance:</span>
                      <strong className="text-[#059669]">{p.highlight}</strong>
                    </div>
                  </div>
                </div>

                <Link
                  href="/shop"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#0ea57a] hover:text-[#047857] transition-colors"
                >
                  <span>View Certified Products</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. PARTNERSHIP ADVANTAGES (WHY JOIN)                      */}
        {/* ========================================================= */}
        <section className="my-14 py-12 px-6 sm:px-10 bg-[#fafafa] border border-[#e5e7eb] rounded-[14px]">
          <div className="text-center max-w-[650px] mx-auto mb-12">
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#18181b] tracking-tight mb-3">
              Why Partner With IndustrialEdge?
            </h2>
            <p className="text-[15px] text-[#71717a] leading-relaxed">
              We provide technology innovators with a verified, brand-safe platform to scale hardware distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PARTNERSHIP_BENEFITS.map((b) => {
              const IconComp = b.icon;
              return (
                <div key={b.title} className="bg-white border border-[#e5e7eb] rounded-[10px] p-6 shadow-2xs">
                  <div className="w-12 h-12 rounded-[8px] bg-[#ecfdf5] text-[#0ea57a] flex items-center justify-center mb-4">
                    <IconComp size={22} strokeWidth={2} />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#18181b] mb-2">
                    {b.title}
                  </h3>
                  <p className="text-[13px] text-[#52525b] leading-relaxed">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. BECOME A PARTNER APPLICATION FORM                      */}
        {/* ========================================================= */}
        <section id="partner-form" className="py-12 mb-16 scroll-mt-24">
          <div className="max-w-[850px] mx-auto bg-white border border-[#e5e7eb] rounded-[12px] p-8 sm:p-12 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
            <div className="text-center max-w-[550px] mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0ea57a] mb-1.5 block">
                Join Our Global Network
              </span>
              <h2 className="text-[26px] sm:text-[30px] font-bold text-[#18181b] tracking-tight mb-2">
                Apply to Become an Official Partner
              </h2>
              <p className="text-[14px] text-[#71717a] leading-relaxed">
                Connect with our vendor procurement specialists to list your hardware or establish commercial agreements.
              </p>
            </div>

            {submittedForm ? (
              <div className="p-8 bg-[#ecfdf5] border border-[#a7f3d0] text-center rounded-[8px] animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-full bg-[#d1fae5] text-[#059669] flex items-center justify-center mx-auto mb-4">
                  <Check size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-[20px] font-bold text-[#065f46] mb-2">
                  Application Received!
                </h3>
                <p className="text-[14px] text-[#047857] max-w-[420px] mx-auto mb-6">
                  Thank you for your interest in partnering with IndustrialEdge. Our alliances team will review your proposal and respond within 2 business days.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedForm(false);
                    setFormData({ companyName: "", contactName: "", email: "", category: "Hardware Manufacturer", message: "" });
                  }}
                  className="px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold rounded cursor-pointer transition-colors"
                >
                  Submit Another Proposal
                </button>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                      Company / Organization Name <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Apex Hardware Technologies"
                      className="w-full h-[46px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                      Contact Person Name <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="e.g. Alex Mercer"
                      className="w-full h-[46px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                      Business Email Address <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="partners@yourcompany.com"
                      className="w-full h-[46px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                      Partnership Category <span className="text-[#0ea57a]">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-[46px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#18181b] transition-colors cursor-pointer"
                    >
                      <option value="Hardware Manufacturer">Hardware / OEM Manufacturer</option>
                      <option value="Authorized Distributor">Authorized Regional Distributor</option>
                      <option value="Silicon / Semiconductor Supplier">Silicon / Semiconductor Supplier</option>
                      <option value="Enterprise Systems Integrator">Enterprise Systems Integrator</option>
                      <option value="Software / Driver Partner">Software / Driver Ecosystem</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                    Proposal Summary &amp; Catalog Overview <span className="text-[#0ea57a]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your hardware catalog, production volume, regulatory certifications, and partnership goals..."
                    className="w-full p-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] bg-white focus:outline-none focus:border-[#18181b] transition-colors resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-[48px] bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  <span>Submit Partnership Proposal</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
