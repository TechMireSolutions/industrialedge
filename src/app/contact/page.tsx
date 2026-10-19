"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Share2, Camera, X, Send, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-[calc(100vh-276px)]">
      <section className="py-12 lg:py-16">
        <div className="container">
          <h1 className="text-[32px] font-normal text-[#212529] mb-2 tracking-tight">Contact Us</h1>
          <p className="text-sm text-black/60 mb-10 max-w-lg">
            Have a question or feedback? We&apos;d love to hear from you. Our support team is here 24/7.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              {submitted ? (
                <div className="bg-[#eff6fa] border border-[#0e8ce4]/30 rounded-[5px] p-8 text-center animate-fade-in">
                  <CheckCircle2 size={48} className="text-[#0e8ce4] mx-auto mb-4" />
                  <h2 className="text-xl font-medium text-black mb-2">Message Sent Successfully!</h2>
                  <p className="text-sm text-black/60 mb-6">
                    Thank you for contacting Industrial Edge. We will respond to your inquiry within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="bg-[#0e8ce4] text-white px-6 py-2.5 rounded-[5px] text-sm font-medium hover:bg-[#0e8ce4]/80 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-black mb-1.5">
                        Full Name <span className="text-[#df3b3b]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full h-[46px] border border-[#e5e5e5] rounded-[5px] px-4 text-sm focus:outline-none focus:border-[#0e8ce4] focus:ring-1 focus:ring-[#0e8ce4] transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-black mb-1.5">
                        Email Address <span className="text-[#df3b3b]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full h-[46px] border border-[#e5e5e5] rounded-[5px] px-4 text-sm focus:outline-none focus:border-[#0e8ce4] focus:ring-1 focus:ring-[#0e8ce4] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-black mb-1.5">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Order inquiry or product feedback"
                      className="w-full h-[46px] border border-[#e5e5e5] rounded-[5px] px-4 text-sm focus:outline-none focus:border-[#0e8ce4] focus:ring-1 focus:ring-[#0e8ce4] transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-black mb-1.5">
                      Message <span className="text-[#df3b3b]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can our technical team help you today?"
                      className="w-full h-[130px] border border-[#e5e5e5] rounded-[5px] px-4 py-3 text-sm focus:outline-none focus:border-[#0e8ce4] focus:ring-1 focus:ring-[#0e8ce4] transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-[50px] bg-[#0e8ce4] text-white text-base font-medium rounded-[5px] hover:bg-[#0e8ce4]/80 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send size={18} strokeWidth={2} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-5 bg-[#f2f4f8] border border-[#e5e5e5] rounded-[5px] p-8 shadow-[0_1px_5px_rgba(0,0,0,0.03)]">
              <h2 className="text-lg font-medium text-black mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border border-[#e5e5e5] text-[#0e8ce4] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-medium text-black text-sm">Office Address</h3>
                    <p className="text-sm text-black/60 leading-relaxed mt-0.5">
                      123 Tech Avenue, Silicon Valley<br />CA 94025, USA
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border border-[#e5e5e5] text-[#0e8ce4] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <Phone size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-medium text-black text-sm">Phone</h3>
                    <p className="text-sm text-black/60 mt-0.5">+1 (555) 014-2360</p>
                    <span className="inline-block text-[11px] font-medium text-[#0e8ce4] bg-[#0e8ce4]/10 px-2 py-0.5 rounded mt-1">
                      Available 24/7
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border border-[#e5e5e5] text-[#0e8ce4] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <Mail size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-medium text-black text-sm">Email Support</h3>
                    <p className="text-sm text-black/60 mt-0.5">support@industrialedge.example</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#e5e5e5]">
                <h3 className="text-xs uppercase font-medium text-black/60 tracking-wider mb-3">
                  Follow Our Channels
                </h3>
                <div className="flex gap-3">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#828282] hover:text-[#0e8ce4] hover:border-[#0e8ce4] transition-colors shadow-sm cursor-pointer"
                  >
                    <Share2 size={16} strokeWidth={2} />
                  </a>
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#828282] hover:text-[#0e8ce4] hover:border-[#0e8ce4] transition-colors shadow-sm cursor-pointer"
                  >
                    <Camera size={16} strokeWidth={2} />
                  </a>
                  <a
                    href="#"
                    aria-label="Twitter / X"
                    className="w-10 h-10 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#828282] hover:text-[#0e8ce4] hover:border-[#0e8ce4] transition-colors shadow-sm cursor-pointer"
                  >
                    <X size={16} strokeWidth={2} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
