"use client";

import Image from "next/image";

const PARTNER_LOGOS = [
  { id: 1, name: "Lead E-Commerce", src: "/images/partner1.png" },
  { id: 2, name: "Global Brand", src: "/images/partner2.png" },
  { id: 3, name: "Great Deals E-Commerce Corp.", src: "/images/partner3.png" },
  { id: 4, name: "Walmart eCommerce", src: "/images/partner4.png" },
  { id: 5, name: "Rodem", src: "/images/partner5.png" },
  { id: 6, name: "Fabric", src: "/images/partner6.png" },
  { id: 7, name: "Sudo E-Commerce", src: "/images/partner7.png" },
  { id: 8, name: "Ctaecom", src: "/images/partner8.png" },
];

export default function PartnerLogos() {
  return (
    <section className="w-full bg-white border-t border-b border-[#e5e8ec] py-7 sm:py-8 lg:py-9 select-none">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Single Horizontal Row Matching Screenshot */}
        <div className="flex items-center justify-between gap-6 sm:gap-8 overflow-x-auto scrollbar-none md:grid md:grid-cols-8 md:gap-4 lg:gap-8 justify-items-center">
          {PARTNER_LOGOS.map((partner) => (
            <div
              key={partner.id}
              className="h-10 sm:h-11 w-full flex items-center justify-center min-w-[100px] shrink-0 transition-transform duration-200 hover:scale-105 cursor-pointer"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                width={130}
                height={40}
                className="max-h-[32px] sm:max-h-[36px] w-auto max-w-[120px] object-contain opacity-85 hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
