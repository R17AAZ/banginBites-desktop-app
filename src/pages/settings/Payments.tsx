
import { motion } from 'framer-motion';
import { CreditCard, Plus, ArrowRight, PoundSterling } from 'lucide-react';

const Payments = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full p-6 text-left"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Billing</h1>
          <p className="text-sm text-gray-500 mt-1 text-left">Manage your payout methods and billing history</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium">
          <Plus size={18} />
          Add Method
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-black">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 ml-1">Payment Methods</h2>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500 text-left">Expires 12/26</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">Primary</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center py-8 group cursor-pointer hover:border-primary/50 transition-all">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors mb-2 border border-gray-100">
              <Plus size={24} />
            </div>
            <p className="text-gray-500 font-medium">Add a new payment method</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 ml-1">Payout Settings</h2>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <PoundSterling className="text-primary" />
                <span className="font-semibold">Available for Payout</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">£1,240.50</span>
            </div>
            <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              Withdraw Funds
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Payments;
