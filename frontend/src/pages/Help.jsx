import { useState } from 'react';
import { HelpCircle, Mail, Phone, MessageSquare, ChevronDown, CheckCircle2, Send, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How long does shipping take for AuraLuxe orders?',
      a: 'We process all orders within 24 hours. Express shipping takes 2-4 business days across metro cities in India, while standard shipping takes 4-6 business days. Complimentary shipping is provided on all orders above ₹1,999.',
    },
    {
      q: 'Are AuraLuxe products 100% authentic and dermatologist tested?',
      a: 'Yes, every product in our collection is formulated with premium, ethically sourced active ingredients and certified non-comedogenic and dermatologist tested. All products carry our Atelier seal of authenticity.',
    },
    {
      q: 'What is AuraLuxe’s return and exchange policy?',
      a: 'We offer a hassle-free 14-day return policy for unopened and unused items in their original packaging. If you received a damaged or incorrect product, our concierge team will arrange a free replacement instantly.',
    },
    {
      q: 'How can I track my existing order status?',
      a: 'Once your order is dispatched, you will receive an SMS and email notification with your tracking link. You can also view live status updates anytime by navigating to "My Orders" from your profile dropdown menu.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="h-14 w-14 rounded-full bg-nude-100 text-gold-600 grid place-items-center mx-auto mb-4 border border-gold-400/30">
          <HelpCircle className="h-7 w-7" />
        </div>
        <h1 className="font-display text-4xl text-slateink-900">AuraLuxe Concierge & Support</h1>
        <p className="text-sm text-slateink-700/60 mt-2 leading-relaxed">
          Have a question about your order, skin type recommendations, or product formulation? We are here to elevate your experience.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-3xl p-6 border border-nude-200 shadow-sm text-center">
          <div className="h-10 w-10 bg-gold-400/20 text-gold-600 rounded-2xl grid place-items-center mx-auto mb-3">
            <Truck className="h-5 w-5" />
          </div>
          <h3 className="font-display text-lg text-slateink-900 font-semibold mb-1">Fast Delivery</h3>
          <p className="text-xs text-slateink-700/60 leading-relaxed">Free courier delivery across India for orders over ₹1,999.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-nude-200 shadow-sm text-center">
          <div className="h-10 w-10 bg-gold-400/20 text-gold-600 rounded-2xl grid place-items-center mx-auto mb-3">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-display text-lg text-slateink-900 font-semibold mb-1">Authentic Guarantee</h3>
          <p className="text-xs text-slateink-700/60 leading-relaxed">100% genuine formulation sealed direct from our Atelier.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-nude-200 shadow-sm text-center">
          <div className="h-10 w-10 bg-gold-400/20 text-gold-600 rounded-2xl grid place-items-center mx-auto mb-3">
            <RotateCcw className="h-5 w-5" />
          </div>
          <h3 className="font-display text-lg text-slateink-900 font-semibold mb-1">14-Day Returns</h3>
          <p className="text-xs text-slateink-700/60 leading-relaxed">Seamless returns & instant replacements for damaged items.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* FAQs */}
        <div>
          <h2 className="font-display text-2xl text-slateink-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-nude-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-semibold text-slateink-900 hover:text-gold-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-gold-600 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slateink-700/70 leading-relaxed border-t border-nude-100 bg-nude-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Direct Cards */}
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="bg-nude-100/50 rounded-2xl p-4 border border-nude-200 flex items-center gap-3">
              <Mail className="h-6 w-6 text-gold-600 shrink-0" />
              <div>
                <p className="text-[11px] text-slateink-700/60 font-semibold uppercase tracking-wider">Email Concierge</p>
                <p className="text-xs font-semibold text-slateink-900">support@auraluxe.com</p>
              </div>
            </div>
            <div className="bg-nude-100/50 rounded-2xl p-4 border border-nude-200 flex items-center gap-3">
              <Phone className="h-6 w-6 text-gold-600 shrink-0" />
              <div>
                <p className="text-[11px] text-slateink-700/60 font-semibold uppercase tracking-wider">Helpline</p>
                <p className="text-xs font-semibold text-slateink-900">+91 1800-123-LUXE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-nude-200 shadow-sm">
          <h2 className="font-display text-2xl text-slateink-900 mb-2 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gold-600" />
            Send Us a Message
          </h2>
          <p className="text-xs text-slateink-700/60 mb-6">Our beauty advisors typically respond within 2-4 hours.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slateink-700/70 mb-1 font-medium">Your Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Aanya Mehra"
                className="w-full rounded-2xl border border-nude-300 px-4 py-2.5 text-sm bg-nude-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slateink-700/70 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="aanya@example.com"
                className="w-full rounded-2xl border border-nude-300 px-4 py-2.5 text-sm bg-nude-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slateink-700/70 mb-1 font-medium">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Product Inquiry / Order Query"
                className="w-full rounded-2xl border border-nude-300 px-4 py-2.5 text-sm bg-nude-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slateink-700/70 mb-1 font-medium">Message</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can our beauty advisors assist you today?"
                className="w-full rounded-2xl border border-nude-300 px-4 py-2.5 text-sm bg-nude-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>

            {submitted && (
              <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Thank you! Your message has been received by our concierge team.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-slateink-900 hover:bg-slateink-800 text-white text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Send className="h-4 w-4" />
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
