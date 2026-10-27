"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-276px)] bg-[#fcfcfc]">
      {/* Breadcrumb Bar */}
      <div className="w-full bg-[#f4f4f4] border-b border-[#e5e5e5] py-3.5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center gap-2 text-[13px] text-[#73787d]">
          <Link href="/" className="hover:text-[#0ea57a] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#222222] font-semibold">Contact Us</span>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="mb-10 max-w-2xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#0ea57a] bg-[#ecfdf5] px-3 py-1 rounded-full border border-[#d1fae5] mb-3">
              We&apos;re Here To Assist You
            </span>
            <h1 className="text-[32px] sm:text-[38px] font-bold text-[#171145] tracking-tight leading-tight mb-3">
              Contact IndustrialEdge.pk
            </h1>
            <p className="text-[15px] text-[#73787d] leading-relaxed">
              Have questions regarding equipment orders, bulk enterprise inquiries, or technical support? Reach out to our Karachi headquarters directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-xl border border-[#ebebeb] shadow-xs">
              <h2 className="text-xl font-bold text-[#171145] mb-1">
                Send Us A Message
              </h2>
              <p className="text-[13px] text-[#73787d] mb-6">
                Fill in your details below and our technical support specialists will get back to you promptly.
              </p>

              {submitted ? (
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-8 text-center animate-fade-in">
                  <CheckCircle2 size={52} className="text-[#16a34a] mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-[#166534] mb-2">
                    Message Dispatched Successfully!
                  </h3>
                  <p className="text-sm text-[#15803d] mb-6 max-w-md mx-auto">
                    Thank you for reaching out to <strong>IndustrialEdge.pk</strong>. Your inquiry has been logged, and an engineer will reply to <em>{formData.email}</em> within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="bg-[#171145] hover:bg-[#0ea57a] text-white px-7 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-semibold text-[#333e48] mb-1.5">
                        Full Name <span className="text-[#0ea57a]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Tariq Khan"
                        className="w-full h-[46px] border border-[#e0e0e0] rounded-lg px-4 text-sm text-[#333e48] focus:outline-none focus:border-[#0ea57a] focus:ring-1 focus:ring-[#0ea57a] transition-all placeholder:text-[#aaa]"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-semibold text-[#333e48] mb-1.5">
                        Email Address <span className="text-[#0ea57a]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. name@company.com"
                        className="w-full h-[46px] border border-[#e0e0e0] rounded-lg px-4 text-sm text-[#333e48] focus:outline-none focus:border-[#0ea57a] focus:ring-1 focus:ring-[#0ea57a] transition-all placeholder:text-[#aaa]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-semibold text-[#333e48] mb-1.5">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Technical Specs / Bulk Quotation"
                      className="w-full h-[46px] border border-[#e0e0e0] rounded-lg px-4 text-sm text-[#333e48] focus:outline-none focus:border-[#0ea57a] focus:ring-1 focus:ring-[#0ea57a] transition-all placeholder:text-[#aaa]"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-[#333e48] mb-1.5">
                      Message <span className="text-[#0ea57a]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can our technical and procurement team assist you today?"
                      className="w-full h-[130px] border border-[#e0e0e0] rounded-lg px-4 py-3 text-sm text-[#333e48] focus:outline-none focus:border-[#0ea57a] focus:ring-1 focus:ring-[#0ea57a] transition-all resize-none placeholder:text-[#aaa]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-[48px] bg-[#0ea57a] hover:bg-[#0b8462] text-white text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send size={16} strokeWidth={2.2} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

            {/* Information Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Primary Contact Card */}
              <div className="bg-white border border-[#ebebeb] rounded-xl p-7 shadow-xs">
                <h2 className="text-lg font-bold text-[#171145] mb-5 pb-3 border-b border-[#f0f0f0]">
                  Head Office &amp; Inquiries
                </h2>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-[#ecfdf5] text-[#0ea57a] rounded-xl flex items-center justify-center shrink-0 border border-[#d1fae5]">
                      <MapPin size={20} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#171145] text-sm">Office Address</h3>
                      <p className="text-sm text-[#666666] leading-relaxed mt-1">
                        Suite M-107 Odeon Center Regal chowk saddar Karachi, Pakistan
                      </p>
                      <a
                        href="https://maps.app.goo.gl/52dT7YxfarFZ4nPQ7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0ea57a] hover:underline mt-2"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Phone & WhatsApp */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-[#ecfdf5] text-[#059669] rounded-xl flex items-center justify-center shrink-0 border border-[#d1fae5]">
                      <Phone size={20} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#171145] text-sm">Direct Phone &amp; WhatsApp</h3>
                      <p className="text-sm font-semibold text-[#171145] mt-1">
                        +92 332 2316225
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-[#73787d] mt-1">
                        <Clock size={12} />
                        <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
                      </div>
                      <a
                        href="https://wa.me/923322316225"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669] hover:underline mt-2"
                      >
                        <MessageSquare size={13} />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-[#eff6ff] text-[#2563eb] rounded-xl flex items-center justify-center shrink-0 border border-[#dbeafe]">
                      <Mail size={20} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#171145] text-sm">Email Inquiries</h3>
                      <a
                        href="mailto:info@industrialedge.pk"
                        className="text-sm text-[#2563eb] hover:underline font-medium block mt-1"
                      >
                        info@industrialedge.pk
                      </a>
                      <span className="text-xs text-[#73787d]">Official inquiries &amp; sales support</span>
                    </div>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="mt-8 pt-6 border-t border-[#f0f0f0]">
                  <h3 className="text-xs uppercase font-bold text-[#73787d] tracking-wider mb-3">
                    Follow Our Channels
                  </h3>
                  <div className="flex items-center gap-2.5">
                    {/* Facebook */}
                    <a
                      href="https://facebook.com/industrialedge.pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-10 h-10 rounded-lg bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center text-[#73787d] hover:text-[#0ea57a] hover:border-[#0ea57a] hover:bg-white transition-all shadow-xs"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://instagram.com/industrialedge.pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-10 h-10 rounded-lg bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center text-[#73787d] hover:text-[#0ea57a] hover:border-[#0ea57a] hover:bg-white transition-all shadow-xs"
                    >
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href="https://linkedin.com/company/industrial-edge-pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="w-10 h-10 rounded-lg bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center text-[#73787d] hover:text-[#0ea57a] hover:border-[#0ea57a] hover:bg-white transition-all shadow-xs"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href="https://wa.me/923322316225"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="w-10 h-10 rounded-lg bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center text-[#73787d] hover:text-[#059669] hover:border-[#059669] hover:bg-white transition-all shadow-xs"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Card */}
              <div className="bg-white border border-[#ebebeb] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#171145]">Location Map</span>
                  <a
                    href="https://maps.app.goo.gl/52dT7YxfarFZ4nPQ7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#0ea57a] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View Map</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <div className="w-full h-[180px] bg-[#f0f3f6] rounded-lg overflow-hidden border border-[#e5e5e5] relative flex items-center justify-center">
                  <iframe
                    title="IndustrialEdge.pk Karachi Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.088667527188!2d67.025686!3d24.860882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e144a0b2d41%3A0x6b77c688d6be6fa0!2sOdeon%20Center%2C%20Regal%20Chowk%2C%20Saddar%20Karachi!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
