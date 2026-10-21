"use client";

import Image from "next/image";

const PARTNERS = [
  { id: 1, name: "Partner 1", img: "/images/partner1.png" },
  { id: 2, name: "Partner 2", img: "/images/partner2.png" },
  { id: 3, name: "Partner 3", img: "/images/partner3.png" },
  { id: 4, name: "Partner 4", img: "/images/partner4.png" },
  { id: 5, name: "Partner 5", img: "/images/partner5.png" },
  { id: 6, name: "Partner 6", img: "/images/partner6.png" },
  { id: 7, name: "Partner 7", img: "/images/partner7.png" },
  { id: 8, name: "Partner 8", img: "/images/partner8.png" },
];

export default function PartnerLogos() {
  return (
    <section className="w-full bg-white py-8 border-b border-gray-100 select-none">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6 items-center justify-items-center">
          {PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="h-12 w-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              <Image
                src={partner.img}
                alt={partner.name}
                width={120}
                height={40}
                className="max-h-8 max-w-[110px] object-contain grayscale hover:grayscale-0 transition-all duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
