import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Eye, CheckCircle2 } from 'lucide-react';

export default function InteractiveAnchorDashboardMontage() {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Cust 1' },
    { id: 2, name: 'Cust 2' },
    { id: 3, name: 'Cust 3' },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    company: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Add new customer to table
      setCustomers(prev => [...prev, { id: prev.length + 1, name: formData.name || `Cust ${prev.length + 1}` }]);
      
      // Reset after showing success
      setTimeout(() => {
        setShowSuccess(false);
        setIsModalOpen(false);
        setFormData({ name: '', mobile: '', company: '', email: '', password: '' });
      }, 1500);
    }, 1500);
  };

  return (
    <>
      <div className="group flex h-full min-h-[300px] w-full bg-slate-50 overflow-hidden rounded-xl border shadow-sm text-left hover:shadow-md transition-shadow">
        {/* Sidebar */}
        <div className="w-16 bg-[#001845] shrink-0 flex flex-col items-center py-4 gap-4 transition-transform duration-300">
          <div className="w-8 h-8 bg-white/20 rounded-md" />
          <div className="w-6 h-6 bg-white/10 rounded-full mt-4" />
          <div className="w-6 h-6 bg-white/10 rounded-full" />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-5 flex flex-col gap-4 bg-white">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="font-bold text-slate-800 text-sm">Customer Dashboard</div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#002366] hover:bg-[#001845] text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
            >
              Add Customer
            </button>
          </div>
          
          <div className="space-y-2 flex-1 overflow-y-auto pr-2">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold px-2 uppercase tracking-wider mb-2">
              <span className="w-16">NAME</span>
              <span className="w-8 text-center">BSA</span>
              <span className="w-8 text-center">GST</span>
              <span className="w-8 text-center">ITR</span>
              <span className="w-8 text-center">CIBIL</span>
              <span className="w-10 text-center leading-tight">Save<br/>money</span>
              <span className="w-10 text-center leading-tight">Acess<br/>Money</span>
              <span className="w-10 text-center leading-tight">Rectify<br/>Money</span>
              <span className="w-10 text-center leading-tight">Wallet</span>
            </div>
            
            <AnimatePresence>
              {customers.map(cust => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={cust.id} 
                  className="flex justify-between items-center bg-white p-2.5 border border-slate-100 rounded-lg shadow-sm text-xs"
                >
                  <span className="font-medium text-slate-700 w-16 truncate">{cust.name}</span>
                  <span className="text-emerald-500 font-bold w-8 text-center">?</span>
                  <span className="text-emerald-500 font-bold w-8 text-center">?</span>
                  <span className="text-emerald-500 font-bold w-8 text-center">?</span>
                  <span className="text-slate-300 font-bold w-8 text-center">-</span>
                  <span className="text-emerald-500 font-bold w-10 text-center">?</span>
                  <span className="text-emerald-500 font-bold w-10 text-center">?</span>
                  <span className="text-emerald-500 font-bold w-10 text-center">?</span>
                  <span className="text-emerald-500 font-bold w-10 text-center">?</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
            >
              {showSuccess ? (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Customer Added Successfully</h3>
                  <p className="text-slate-500">The customer profile has been created.</p>
                </div>
              ) : (
                <div className="p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#001845] mb-1">Add New Customer</h2>
                    <p className="text-sm text-slate-500">Create a new customer profile and allocate audit credits</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#001845]">Customer Name *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="Enter Customer Name"
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#002366] focus:ring-1 focus:ring-[#002366]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#001845]">Mobile Number *</label>
                        <div className="relative">
                          <Smartphone size={16} className="absolute left-3 top-2.5 text-slate-400" />
                          <input 
                            type="tel" 
                            required
                            value={formData.mobile}
                            onChange={e => setFormData({...formData, mobile: e.target.value})}
                            placeholder="E.g., 9876543210"
                            className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#002366] focus:ring-1 focus:ring-[#002366]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#001845]">Company Name</label>
                      <input 
                        type="text" 
                        value={formData.company}
                        onChange={e => setFormData({...formData, company: e.target.value})}
                        placeholder="E.g., ABC Pvt Ltd"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#002366] focus:ring-1 focus:ring-[#002366]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#001845]">Email ID *</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="E.g., name@domain.com"
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#002366] focus:ring-1 focus:ring-[#002366]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#001845]">Password *</label>
                        <div className="relative">
                          <input 
                            type="password" 
                            required
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            placeholder="Enter account password"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:border-[#002366] focus:ring-1 focus:ring-[#002366]"
                          />
                          <Eye size={16} className="absolute right-3 top-2.5 text-slate-400 cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-4">
                      <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-lg bg-[#001845] text-white font-semibold text-sm hover:bg-[#002366] transition-colors flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creating...
                          </>
                        ) : 'Create Customer'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
