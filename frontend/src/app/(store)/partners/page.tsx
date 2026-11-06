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
  Laptop,
  Truck,
  FileText,
  Coffee,
  Sparkle,
  Zap,
} from "lucide-react";

interface PartnerItem {
  id: string;
  name: string;
  logo: string;
  category: "all" | "appliances" | "mobiles-computing" | "stationery" | "beverages" | "hygiene";
  categoryLabel: string;
  tier: "Official Tier-1 Partner" | "Authorized Premier Distributor" | "Certified Commercial Supplier";
  description: string;
  productsCount: string;
  highlight: string;
}

const PARTNER_DATA: PartnerItem[] = [
  // 1. Appliances
  {
    id: "app-1",
    name: "Dawlance Commercial",
    logo: "/images/partner1.png",
    category: "appliances",
    categoryLabel: "Appliances",
    tier: "Official Tier-1 Partner",
    description: "Reliable commercial cooling units, energy-efficient workplace water dispensers, and office pantry appliances across Pakistan.",
    productsCount: "80+ Products",
    highlight: "Direct Manufacturer Warranty",
  },
  {
    id: "app-2",
    name: "Haier Enterprise",
    logo: "/images/partner2.png",
    category: "appliances",
    categoryLabel: "Appliances",
    tier: "Authorized Premier Distributor",
    description: "Industrial climate control, smart inverter air conditioners, and breakroom refrigeration units.",
    productsCount: "95+ Products",
    highlight: "Energy Efficient Inverter",
  },
  {
    id: "app-3",
    name: "Gree Commercial HVAC",
    logo: "/images/partner3.png",
    category: "appliances",
    categoryLabel: "Appliances",
    tier: "Official Tier-1 Partner",
    description: "Heavy-duty commercial floor standing and split units designed for continuous office cooling.",
    productsCount: "50+ Systems",
    highlight: "Factory Certified",
  },
  {
    id: "app-4",
    name: "Philips Workplace",
    logo: "/images/partner4.png",
    category: "appliances",
    categoryLabel: "Appliances",
    tier: "Authorized Premier Distributor",
    description: "Workplace kettles, coffee makers, garment steamers, and premium breakroom culinary electronics.",
    productsCount: "65+ Products",
    highlight: "Global Quality Assured",
  },

  // 2. Mobiles and Computing
  {
    id: "comp-1",
    name: "HP Enterprise Pakistan",
    logo: "/images/partner5.png",
    category: "mobiles-computing",
    categoryLabel: "Mobiles and computing",
    tier: "Official Tier-1 Partner",
    description: "Business laptops, ProBook & EliteBook series, desktop towers, and enterprise LaserJet network printers.",
    productsCount: "120+ Products",
    highlight: "3-Year Official Warranty",
  },
  {
    id: "comp-2",
    name: "Dell Technologies",
    logo: "/images/partner6.png",
    category: "mobiles-computing",
    categoryLabel: "Mobiles and computing",
    tier: "Official Tier-1 Partner",
    description: "Latitude business notebooks, OptiPlex workstations, and high-resolution commercial monitors.",
    productsCount: "140+ Products",
    highlight: "Direct OEM Sourcing",
  },
  {
    id: "comp-3",
    name: "Lenovo ThinkPad",
    logo: "/images/partner7.png",
    category: "mobiles-computing",
    categoryLabel: "Mobiles and computing",
    tier: "Authorized Premier Distributor",
    description: "Rugged military-spec ThinkPad laptops and desktop compute units tailored for corporate mobility.",
    productsCount: "85+ Products",
    highlight: "Enterprise Support Included",
  },
  {
    id: "comp-4",
    name: "Samsung Business",
    logo: "/images/partner8.png",
    category: "mobiles-computing",
    categoryLabel: "Mobiles and computing",
    tier: "Official Tier-1 Partner",
    description: "PTA-approved corporate Galaxy smartphones, enterprise tablets, and digital interactive display panels.",
    productsCount: "110+ Products",
    highlight: "PTA Official Approved",
  },

  // 3. Stationery
  {
    id: "stat-1",
    name: "Dollar Industries Pakistan",
    logo: "/images/partner1.png",
    category: "stationery",
    categoryLabel: "Stationery",
    tier: "Official Tier-1 Partner",
    description: "Pakistan's leading writing instruments, ballpoints, gel pens, highlighters, and whiteboard marker supplies.",
    productsCount: "150+ SKUs",
    highlight: "Consistently In Stock",
  },
  {
    id: "stat-2",
    name: "Double A Paper",
    logo: "/images/partner2.png",
    category: "stationery",
    categoryLabel: "Stationery",
    tier: "Official Tier-1 Partner",
    description: "Premium high-opacity 80gsm copier paper engineered for jam-free high-speed corporate printing.",
    productsCount: "Bulk Pallets",
    highlight: "Jam-Free High Opacity",
  },
  {
    id: "stat-3",
    name: "Piano Stationery",
    logo: "/images/partner3.png",
    category: "stationery",
    categoryLabel: "Stationery",
    tier: "Authorized Premier Distributor",
    description: "High-demand office writing instruments, correction pens, permanent markers, and desk accessories.",
    productsCount: "90+ SKUs",
    highlight: "Wholesale Institutional Rates",
  },
  {
    id: "stat-4",
    name: "Deli Office Tools",
    logo: "/images/partner4.png",
    category: "stationery",
    categoryLabel: "Stationery",
    tier: "Certified Commercial Supplier",
    description: "Heavy-duty paper shredders, punch machines, staplers, tape dispensers, and document binders.",
    productsCount: "75+ Products",
    highlight: "1-Year Replacement Warranty",
  },

  // 4. Beverages
  {
    id: "bev-1",
    name: "Lipton & Unilever Food Solutions",
    logo: "/images/partner5.png",
    category: "beverages",
    categoryLabel: "Beverages",
    tier: "Official Tier-1 Partner",
    description: "Yellow Label black tea bags, green tea assortments, and commercial pantry foodservice packages.",
    productsCount: "35+ Products",
    highlight: "Fresh Factory Batch",
  },
  {
    id: "bev-2",
    name: "Tapal Tea Enterprise",
    logo: "/images/partner6.png",
    category: "beverages",
    categoryLabel: "Beverages",
    tier: "Official Tier-1 Partner",
    description: "Pakistan's favorite Danedar and round teabag packs supplied in bulk commercial cartons for corporate pantries.",
    productsCount: "25+ Cartons",
    highlight: "Scheduled Monthly Supply",
  },
  {
    id: "bev-3",
    name: "Nestlé Professional",
    logo: "/images/partner7.png",
    category: "beverages",
    categoryLabel: "Beverages",
    tier: "Official Tier-1 Partner",
    description: "Nescafé instant coffee, everyday milk powder, creamer, and bottled Pure Life water supply.",
    productsCount: "40+ Products",
    highlight: "Wholesale Bulk Pack",
  },
  {
    id: "bev-4",
    name: "Mitchell's & National Foods",
    logo: "/images/partner8.png",
    category: "beverages",
    categoryLabel: "Beverages",
    tier: "Certified Commercial Supplier",
    description: "Pantry juices, fruit concentrates, syrups, snacks, and corporate pantry breakroom provisions.",
    productsCount: "30+ Products",
    highlight: "Quality Assured",
  },

  // 5. Hygiene
  {
    id: "hyg-1",
    name: "Dettol & Reckitt Benckiser",
    logo: "/images/partner1.png",
    category: "hygiene",
    categoryLabel: "Hygiene",
    tier: "Official Tier-1 Partner",
    description: "Hospital-grade antiseptic liquid, antibacterial hand washes, surface sprays, and multi-surface wipes.",
    productsCount: "45+ Products",
    highlight: "99.9% Germ Protection",
  },
  {
    id: "hyg-2",
    name: "Lifebuoy & Surf Excel Professional",
    logo: "/images/partner2.png",
    category: "hygiene",
    categoryLabel: "Hygiene",
    tier: "Official Tier-1 Partner",
    description: "Bulk industrial hand washes, surface detergents, and facility cleaning formulations in 5L & 10L drums.",
    productsCount: "30+ Formulations",
    highlight: "Commercial Drums Available",
  },
  {
    id: "hyg-3",
    name: "Harpic Commercial",
    logo: "/images/partner3.png",
    category: "hygiene",
    categoryLabel: "Hygiene",
    tier: "Authorized Premier Distributor",
    description: "Specialized power cleaner and disinfectant liquids for enterprise washrooms and facility sanitation.",
    productsCount: "20+ SKUs",
    highlight: "Deep Disinfection Grade",
  },
  {
    id: "hyg-4",
    name: "Rose Petal Paper Products",
    logo: "/images/partner4.png",
    category: "hygiene",
    categoryLabel: "Hygiene",
    tier: "Official Tier-1 Partner",
    description: "Commercial multi-fold hand towels, toilet tissue rolls, facial tissues, and dispenser napkins.",
    productsCount: "50+ Varieties",
    highlight: "100% Virgin Pulp",
  },
];

const CATEGORY_TABS = [
  { id: "all", label: "All Partners" },
  { id: "appliances", label: "Appliances" },
  { id: "mobiles-computing", label: "Mobiles and computing" },
  { id: "stationery", label: "Stationery" },
  { id: "beverages", label: "Beverages" },
  { id: "hygiene", label: "Hygiene" },
];

const PARTNERSHIP_BENEFITS = [
  {
    icon: Globe2,
    title: "Nationwide Logistics Network",
    description: "Seamless distribution reaching offices, commercial centers, and industrial facilities across all provinces of Pakistan.",
  },
  {
    icon: ShieldCheck,
    title: "100% Authenticity Guarantee",
    description: "Zero counterfeit tolerance. All items are verified, warrantied, and serialized directly from manufacturers.",
  },
  {
    icon: Building2,
    title: "Corporate B2B Channels",
    description: "High-volume institutional purchasing with dedicated account reps, centralized billing, and customized payment terms.",
  },
  {
    icon: Award,
    title: "14 Years of Procurement Trust",
    description: "Established procurement reputation connecting premier brands with Pakistan's leading enterprises.",
  },
];

export default function PartnersPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [submittedForm, setSubmittedForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    category: "Appliances",
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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-5 sm:py-7">
        {/* ========================================================= */}
        {/* 1. BREADCRUMBS                                            */}
        {/* ========================================================= */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#71717a] mb-8">
          <Link href="/" className="hover:text-[#0ea57a] transition-colors">
            Home
          </Link>
          <span className="text-[#a1a1aa] font-normal">&gt;</span>
          <span className="text-[#18181b] font-medium">Our Partners</span>
        </nav>

        {/* ========================================================= */}
        {/* 2. HERO SECTION                                           */}
        {/* ========================================================= */}
        <section className="py-6 sm:py-10">
          <div className="max-w-[900px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecfdf5] text-[#0ea57a] border border-[#a7f3d0] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <Handshake size={14} />
              <span>Verified Brand Ecosystem</span>
            </div>

            <h1 className="text-[32px] sm:text-[44px] lg:text-[46px] font-bold text-[#171145] tracking-tight leading-[1.18] mb-5">
              Partnering With Leading Manufacturers &amp; Trusted Brands.
            </h1>

            <p className="text-[15px] sm:text-[16px] text-[#52525b] leading-relaxed mb-6 font-medium">
              Backed by <strong>14 years of procurement expertise</strong>, Industrial Edge maintains strong alliances with top tier manufacturers in Appliances, Computing, Commercial Stationery, Pantry Beverages, and Facility Hygiene.
            </p>

            <p className="text-[14px] sm:text-[14.5px] text-[#71717a] leading-relaxed mb-8">
              We eliminate intermediaries to bring authentic, certified supplies directly to your organization with official warranties, bulk enterprise discounts, and nationwide delivery across Pakistan.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#partner-form"
                className="px-8 py-3.5 bg-[#0ea57a] hover:bg-[#0b8462] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99] inline-flex items-center gap-2"
              >
                <span>Become a Supply Partner</span>
                <ArrowRight size={16} />
              </a>
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-[#171145] hover:bg-[#201859] text-white font-bold text-[14px] rounded-[6px] transition-colors shadow-xs active:scale-[0.99]"
              >
                Browse Partner Supplies
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
              <div className="text-[32px] sm:text-[38px] font-bold text-[#0ea57a] tracking-tight">14+</div>
              <div className="text-[14.5px] font-bold text-[#171145] mt-0.5">Years of Trust</div>
              <div className="text-xs text-[#71717a]">Longstanding vendor ties in Pakistan</div>
            </div>
            <div className="text-center pt-6 sm:pt-0 sm:pl-6">
              <div className="text-[32px] sm:text-[38px] font-bold text-[#0ea57a] tracking-tight">100%</div>
              <div className="text-[14.5px] font-bold text-[#171145] mt-0.5">Authentic &amp; Certified</div>
              <div className="text-xs text-[#71717a]">Direct manufacturer warranty</div>
            </div>
            <div className="text-center pt-6 sm:pt-0 sm:pl-6">
              <div className="text-[32px] sm:text-[38px] font-bold text-[#0ea57a] tracking-tight">5</div>
              <div className="text-[14.5px] font-bold text-[#171145] mt-0.5">Partner Categories</div>
              <div className="text-xs text-[#71717a]">Appliances, Tech, Stationery, &amp; more</div>
            </div>
            <div className="text-center pt-6 sm:pt-0 sm:pl-6">
              <div className="text-[32px] sm:text-[38px] font-bold text-[#0ea57a] tracking-tight">Nationwide</div>
              <div className="text-[14.5px] font-bold text-[#171145] mt-0.5">Distribution Network</div>
              <div className="text-xs text-[#71717a]">All regions across Pakistan</div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. PARTNERS DIRECTORY WITH THE 5 CATEGORY TABS            */}
        {/* ========================================================= */}
        <section className="py-12">
          <div className="text-center max-w-[700px] mx-auto mb-10">
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#171145] tracking-tight mb-3">
              Featured Brand Partners
            </h2>
            <p className="text-[15px] text-[#71717a] leading-relaxed">
              Explore the verified manufacturers and brands that power our general order supply and procurement network.
            </p>
          </div>

          {/* Filter Tabs matching industrialedge.pk */}
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

                  <h3 className="text-[16px] font-bold text-[#171145] group-hover:text-[#0ea57a] transition-colors mb-2">
                    {p.name}
                  </h3>

                  <p className="text-[13px] text-[#52525b] leading-relaxed mb-4">
                    {p.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-[#71717a] pt-3 border-t border-[#f4f4f5]">
                    <div className="flex items-center justify-between">
                      <span>Available Items:</span>
                      <strong className="text-[#171145]">{p.productsCount}</strong>
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
                  <span>Inquire Domain Products</span>
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
            <h2 className="text-[28px] sm:text-[34px] font-bold text-[#171145] tracking-tight mb-3">
              Why Partner With Industrial Edge?
            </h2>
            <p className="text-[15px] text-[#71717a] leading-relaxed">
              We provide brand manufacturers with a proven, reliable corporate distribution network across Pakistan.
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
                  <h3 className="text-[16px] font-bold text-[#171145] mb-2">
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
                Expand Your Reach
              </span>
              <h2 className="text-[26px] sm:text-[30px] font-bold text-[#171145] tracking-tight mb-2">
                Apply to Become an Official Supply Partner
              </h2>
              <p className="text-[14px] text-[#71717a] leading-relaxed">
                Connect with our procurement alliances department to list your products or establish direct institutional distribution agreements.
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
                  Thank you for your interest in partnering with Industrial Edge. Our vendor procurement team will review your proposal and get in touch within 2 business days.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedForm(false);
                    setFormData({ companyName: "", contactName: "", email: "", phone: "", category: "Appliances", message: "" });
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
                      Company / Manufacturer Name <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Apex Industrial Supplies Ltd"
                      className="w-full h-[46px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#0ea57a] transition-colors"
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
                      placeholder="e.g. Muhammad Farooq"
                      className="w-full h-[46px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#0ea57a] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                      Business Email <span className="text-[#0ea57a]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="partners@yourcompany.com"
                      className="w-full h-[46px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#0ea57a] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                      Contact Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full h-[46px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#0ea57a] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13.5px] font-semibold text-[#18181b] mb-1.5">
                      Partner Category <span className="text-[#0ea57a]">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-[46px] px-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] bg-white focus:outline-none focus:border-[#0ea57a] transition-colors cursor-pointer"
                    >
                      <option value="Appliances">Appliances</option>
                      <option value="Mobiles and computing">Mobiles and computing</option>
                      <option value="Stationery">Stationery</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Hygiene">Hygiene</option>
                      <option value="Hardware and tools">Hardware and tools</option>
                      <option value="Uniforms and PPE">Uniforms &amp; Safety PPE</option>
                      <option value="Corporate Gifting">Corporate Gifting</option>
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
                    placeholder="Describe your supply capabilities, brand authorizations, factory capacity, warranty terms, and partnership objectives..."
                    className="w-full p-3.5 border border-[#e4e4e7] rounded-[5px] text-[13.5px] text-[#18181b] placeholder:text-[#a1a1aa] bg-white focus:outline-none focus:border-[#0ea57a] transition-colors resize-y"
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
