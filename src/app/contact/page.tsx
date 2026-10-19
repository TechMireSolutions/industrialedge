import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-276px)]">
      <section className="py-12">
        <div className="container">
          <h1 className="text-[28px] font-normal text-[#212529] mb-2">Contact Us</h1>
          <p className="text-sm text-black/50 mb-10">
            Have a question? We'd love to hear from you.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full h-[44px] border border-[#e5e5e5] rounded-[5px] px-4 text-sm focus:outline-none focus:border-[#0e8ce4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full h-[44px] border border-[#e5e5e5] rounded-[5px] px-4 text-sm focus:outline-none focus:border-[#0e8ce4]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Order inquiry"
                  className="w-full h-[44px] border border-[#e5e5e5] rounded-[5px] px-4 text-sm focus:outline-none focus:border-[#0e8ce4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Message</label>
                <textarea
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full h-[120px] border border-[#e5e5e5] rounded-[5px] px-4 py-3 text-sm focus:outline-none focus:border-[#0e8ce4]"
                />
              </div>
              <button
                type="submit"
                className="w-full h-[50px] bg-[#0e8ce4] text-white text-base font-medium rounded-[5px] hover:bg-[#0e8ce4]/80 transition-colors"
              >
                Send Message
              </button>
            </form>

            <div className="bg-[#f2f4f8] border border-[#e5e5e5] rounded-[5px] p-8">
              <h2 className="text-lg font-medium text-black mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#0e8ce4]/10 text-[#0e8ce4] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs">📍</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-black">Office Address</h3>
                    <p className="text-sm text-black/50">123 Tech Avenue, Silicon Valley<br />CA 94025, USA</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#0e8ce4]/10 text-[#0e8ce4] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs">📞</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-black">Phone</h3>
                    <p className="text-sm text-black/50">+1 (555) 014-2360</p>
                    <p className="text-xs text-black/50 mt-1">Open 24/7</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#0e8ce4]/10 text-[#0e8ce4] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs">✉️</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-black">Email</h3>
                    <p className="text-sm text-black/50">support@onetech.example</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <a href="#" className="w-9 h-9 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#828282] hover:text-[#0e8ce4] transition-colors">
                  <span className="text-xs">f</span>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#828282] hover:text-[#0e8ce4] transition-colors">
                  <span className="text-xs">📷</span>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#828282] hover:text-[#0e8ce4] transition-colors">
                  <span className="text-xs">🐦</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
