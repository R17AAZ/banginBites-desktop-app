import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Privacy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information essential for providing our services. This includes Account Data (name, email, phone number, and address), Transaction Data (order history and delivery instructions), and Usage Data (device information and IP addresses) collected through automated means.",
      icon: Eye
    },
    {
      title: "2. How We Use Your Information",
      content: "Your data is used to fulfill orders, facilitate communication between buyers and sellers, ensure platform safety and fraud prevention, and personalize your experience. We also use contact details to send critical service updates and order status notifications.",
      icon: Shield
    },
    {
      title: "3. Data Sharing & Third Parties",
      content: "We share necessary fulfillment details with sellers (name/address) and partner with secure service providers for payments (Stripe) and infrastructure. We never sell your personal data to third parties for marketing purposes.",
      icon: Lock
    },
    {
      title: "4. Data Security & Retention",
      content: "We implement industry-standard technical measures to protect your data. Information is retained only as long as necessary to provide our services, comply with legal obligations, or resolve disputes.",
      icon: Lock
    },
    {
      title: "5. Your Privacy Rights",
      content: "Under applicable laws (such as GDPR/UK GDPR), you have the right to access, correct, or delete your personal data. You may also request a copy of your data or object to certain processing activities through your account settings.",
      icon: FileText
    },
    {
      title: "6. Cookies & Tracking",
      content: "We use essential cookies to maintain your session and analytical cookies to improve platform performance. You can manage these through your browser settings, though disabling essential cookies may impact service functionality.",
      icon: FileText
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full p-6 text-left"
    >
      <div className="mb-8 font-sans">
        <h1 className="text-2xl font-bold text-neutral-900 text-left font-heading tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-neutral-500 mt-1 text-left leading-relaxed max-w-2xl">
          At Bangin' Bites, we take your privacy seriously. This policy describes how your personal information is collected, used, and shared when you visit or make a purchase from the site.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:border-neutral-200 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand/5 flex items-center justify-center text-brand shrink-0 group-hover:bg-brand/10 transition-colors border border-brand/10">
                <section.icon size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  {section.title}
                  <ChevronRight size={14} className="text-neutral-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                  {section.content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="p-6 rounded-2xl bg-neutral-900 text-white mt-12 overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2">Have questions about your privacy?</h3>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact our data protection officer at privacy@banginbites.com
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-brand text-white rounded-lg font-bold text-sm hover:bg-brand-600 transition-colors">
                Contact Support
              </button>
              <button className="px-6 py-2 bg-white/10 text-white rounded-lg font-bold text-sm hover:bg-white/20 transition-colors border border-white/10">
                Download PDF
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10 scale-150">
            <Shield size={120} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Privacy;
