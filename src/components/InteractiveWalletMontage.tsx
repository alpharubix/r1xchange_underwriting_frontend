import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, X, CheckCircle2, History, Activity, ArrowRight, ShieldCheck, PieChart, FileText, Database } from 'lucide-react';

export default function InteractiveWalletMontage() {
  const [balance, setBalance] = useState(5000);
  const [transactions, setTransactions] = useState([
    { id: 1, date: '30 Sep', service: 'BSA', type: 'Service Deduction', amount: -100 },
    { id: 2, date: '29 Sep', service: 'GST', type: 'Service Deduction', amount: -75 },
    { id: 3, date: '28 Sep', service: 'CIBIL', type: 'Service Deduction', amount: -50 }
  ]);
  
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(5000);
  const [rechargeState, setRechargeState] = useState<'idle' | 'processing' | 'success'>('idle');

  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  // Services State: 'locked', 'unlocking', 'unlocked'
  // Actually the prompt says: "Initially, show them in a state such as Available or Unlock Service. After the dummy wallet interaction, transition them into UNLOCKED"
  const [servicesState, setServicesState] = useState<'available' | 'unlocking' | 'unlocked'>('available');

  const [activeServiceModal, setActiveServiceModal] = useState<string | null>(null);
  const [serviceProcessState, setServiceProcessState] = useState<'idle' | 'processing' | 'ready'>('idle');
  const [processMessage, setProcessMessage] = useState('');

  const services = [
    { id: 'BSA', name: 'BSA', desc: 'Bank Statement Analysis', fee: 565, icon: <Database size={16} /> },
    { id: 'GST', name: 'GST', desc: 'GST Analysis', fee: 561, icon: <FileText size={16} /> },
    { id: 'ITR', name: 'ITR', desc: 'Income Tax Return Analysis', fee: 0, icon: <PieChart size={16} /> },
    { id: 'CIBIL', name: 'CIBIL', desc: 'Credit Information', fee: 643, icon: <ShieldCheck size={16} /> }
  ];

  const handleRecharge = () => {
    setRechargeState('processing');
    setTimeout(() => {
      setBalance(b => b + rechargeAmount);
      setTransactions(prev => [
        { id: Date.now(), date: 'Today', service: 'Wallet Recharge', type: 'Credit', amount: rechargeAmount },
        ...prev
      ]);
      setRechargeState('success');
      setTimeout(() => {
        setRechargeModalOpen(false);
        setRechargeState('idle');
        
        // Trigger service unlocking animation
        if (servicesState === 'available') {
          setServicesState('unlocking');
          setTimeout(() => setServicesState('unlocked'), 1500);
        }
      }, 2000);
    }, 1500);
  };

  const handleServiceClick = (serviceId: string) => {
    if (servicesState !== 'unlocked') return; // Only allow click if unlocked
    setActiveServiceModal(serviceId);
    setServiceProcessState('idle');
  };

  const runServiceAnalysis = (serviceId: string) => {
    setServiceProcessState('processing');
    
    const messages = {
      'BSA': ['Connecting to source...', 'Retrieving data...', 'Analysing transactions...', 'Generating insights...'],
      'GST': ['Connecting to GST source...', 'Retrieving GST information...', 'Analysing business activity...', 'Generating GST insights...'],
      'ITR': ['Retrieving ITR information...', 'Processing financial information...', 'Analysing income details...', 'Generating ITR insights...'],
      'CIBIL': ['Retrieving credit information...', 'Processing credit profile...', 'Analysing credit information...', 'Credit intelligence ready']
    }[serviceId] || ['Processing...'];

    let i = 0;
    setProcessMessage(messages[0]);
    
    const interval = setInterval(() => {
      i++;
      if (i < messages.length) {
        setProcessMessage(messages[i]);
      } else {
        clearInterval(interval);
        setServiceProcessState('ready');
        
        // Add a mock transaction for running a service
        const srv = services.find(s => s.id === serviceId);
        if (srv && srv.fee > 0) {
           setBalance(b => b - srv.fee);
           setTransactions(prev => [
             { id: Date.now(), date: 'Just now', service: serviceId, type: 'Service Deduction', amount: -srv.fee },
             ...prev
           ]);
        }
      }
    }, 800);
  };

  return (
    <div className="flex w-full items-center justify-center p-4 relative">
      {/* DATA IS FLOWING EASTER EGG (Particles) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#002366] rounded-full"
            initial={{ x: -20, y: 50 + i * 40, opacity: 0 }}
            animate={{ 
              x: ["0%", "100%"],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-20 w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 hover:shadow-[#002366]/10 hover:-translate-y-1">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#001845] to-[#002366] p-5 text-white overflow-hidden group">
          <motion.div 
            className="absolute right-0 top-0 opacity-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <Activity size={120} className="translate-x-1/3 -translate-y-1/3" />
          </motion.div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold opacity-90 flex items-center gap-2">
                <Wallet size={16} /> Individual Wallet
              </div>
              <div className="text-xs opacity-70 mt-1">Available Balance</div>
            </div>
            <div className="text-right">
              <motion.div 
                key={balance}
                initial={{ scale: 1.2, color: '#4ade80' }}
                animate={{ scale: 1, color: '#ffffff' }}
                className="text-3xl font-bold tracking-tight"
              >
                ?{balance.toLocaleString()}
              </motion.div>
            </div>
          </div>

          <div className="relative z-10 mt-5 flex gap-2">
            <button 
              onClick={() => setRechargeModalOpen(true)}
              className="flex-1 rounded-lg bg-white/10 hover:bg-white/20 py-2 text-xs font-bold transition-colors border border-white/10"
            >
              Recharge Wallet
            </button>
            <button 
              onClick={() => setTransactionModalOpen(true)}
              className="flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 px-3 transition-colors border border-white/10"
              title="View Transactions"
            >
              <History size={16} />
            </button>
          </div>
        </div>

        {/* Services */}
        <div className="p-5 bg-slate-50">
          <div className="text-xs font-bold text-slate-500 mb-3 flex items-center justify-between">
            <span>AVAILABLE SERVICES</span>
            <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full text-slate-600">
              Demo Mode
            </span>
          </div>

          <div className="space-y-3">
            {services.map((srv) => (
              <motion.div
                key={srv.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleServiceClick(srv.id)}
                className={`group relative overflow-hidden rounded-xl border p-3 cursor-pointer transition-all ${servicesState === 'unlocked' ? 'border-[#002366]/20 bg-white hover:border-[#002366]/40 shadow-sm' : 'border-slate-200 bg-slate-100 opacity-80'}`}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${servicesState === 'unlocked' ? 'bg-[#002366]/10 text-[#002366]' : 'bg-slate-200 text-slate-500'}`}>
                      {srv.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{srv.name}</div>
                      <div className="text-[10px] text-slate-500">{srv.desc}</div>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end">
                    {servicesState === 'available' && (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded-md">
                        Available
                      </span>
                    )}
                    {servicesState === 'unlocking' && (
                      <span className="text-[10px] font-bold text-blue-500 animate-pulse bg-blue-50 px-2 py-1 rounded-md">
                        Unlocking...
                      </span>
                    )}
                    {servicesState === 'unlocked' && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md flex items-center gap-1">
                        <CheckCircle2 size={10} /> Unlocked
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover animation easter egg */}
                {servicesState === 'unlocked' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#002366]/5 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* RECHARGE MODAL */}
      <AnimatePresence>
        {rechargeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-[#001845]">Recharge Wallet</h3>
                <button onClick={() => setRechargeModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              
              <div className="p-6">
                {rechargeState === 'idle' && (
                  <>
                    <div className="mb-6 text-center">
                      <div className="text-sm text-slate-500 mb-1">Current Balance</div>
                      <div className="text-3xl font-bold text-slate-800">?{balance.toLocaleString()}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[1000, 2500, 5000, 10000].map(amt => (
                        <button 
                          key={amt}
                          onClick={() => setRechargeAmount(amt)}
                          className={`py-2 rounded-xl border text-sm font-bold transition-all ${rechargeAmount === amt ? 'border-[#002366] bg-[#002366]/5 text-[#002366]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                        >
                          ?{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={handleRecharge}
                      className="w-full py-3 rounded-xl bg-[#002366] text-white font-bold shadow-lg shadow-[#002366]/20 hover:bg-[#001845] transition-all active:scale-[0.98]"
                    >
                      Recharge ?{rechargeAmount.toLocaleString()}
                    </button>
                  </>
                )}

                {rechargeState === 'processing' && (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-[#002366] rounded-full animate-spin mb-4"></div>
                    <h4 className="font-bold text-slate-800">Processing payment...</h4>
                    <p className="text-xs text-slate-500 mt-2">Securely processing your transaction</p>
                  </div>
                )}

                {rechargeState === 'success' && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-8 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="font-bold text-xl text-slate-800 mb-1">Wallet Recharged</h4>
                    <p className="text-sm text-slate-600"><strong>?{rechargeAmount.toLocaleString()}</strong> added to your wallet</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SERVICE UNLOCK MODAL */}
      <AnimatePresence>
        {activeServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-[#001845]">{services.find(s => s.id === activeServiceModal)?.desc}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={12}/> Unlocked</span>
                    <span className="text-xs text-slate-500 font-medium">Service Fee: ?{services.find(s => s.id === activeServiceModal)?.fee}</span>
                  </div>
                </div>
                <button onClick={() => setActiveServiceModal(null)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 border shadow-sm"><X size={16}/></button>
              </div>
              
              <div className="p-6">
                {serviceProcessState === 'idle' && (
                  <div className="text-center py-4">
                    <div className="mb-6">
                      <p className="text-sm text-slate-600">You are about to initiate a dummy analysis.</p>
                      <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-[#002366] px-4 py-2 rounded-lg text-sm font-semibold border border-blue-100">
                        <Wallet size={16}/> Wallet Balance: ?{balance.toLocaleString()}
                      </div>
                    </div>
                    <button 
                      onClick={() => runServiceAnalysis(activeServiceModal)}
                      className="w-full py-3 rounded-xl bg-[#002366] text-white font-bold shadow-lg shadow-[#002366]/20 hover:bg-[#001845] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      Start {activeServiceModal} Analysis <ArrowRight size={18}/>
                    </button>
                  </div>
                )}

                {serviceProcessState === 'processing' && (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
                      <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                        {services.find(s=>s.id===activeServiceModal)?.icon}
                      </div>
                    </div>
                    <h4 className="font-bold text-lg text-slate-800">{processMessage}</h4>
                    
                    {/* Easter egg animation text */}
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="mt-4 text-xs font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded border border-slate-100"
                    >
                      Data ? Analysis ? Intelligence
                    </motion.div>
                  </div>
                )}

                {serviceProcessState === 'ready' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="py-2"
                  >
                    <div className="flex items-center gap-2 mb-4 text-emerald-600">
                      <CheckCircle2 size={24} /> <span className="font-bold text-lg text-slate-800">Analysis Ready</span>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
                      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Customer</div>
                          <div className="text-sm font-bold text-[#002366]">Sample Enterprises</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Period</div>
                          <div className="text-sm font-bold text-[#002366]">Apr 2026 - Mar 2027</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase">Total Credits</div>
                          <div className="text-base font-bold text-emerald-600">?45.2L</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase">Total Debits</div>
                          <div className="text-base font-bold text-rose-500">?38.7L</div>
                        </div>
                        <div className="col-span-2 group relative">
                          <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 cursor-help">
                            Avg. Monthly Balance <div className="w-3 h-3 rounded-full bg-slate-200 text-[8px] flex items-center justify-center text-slate-600">?</div>
                          </div>
                          <div className="text-base font-bold text-slate-800">?6.5L</div>
                          
                          {/* Hover Tooltip Easter Egg */}
                          <div className="absolute left-0 bottom-full mb-1 w-48 p-2 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Average balance maintained across the selected analysis period.
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setActiveServiceModal(null)}
                      className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                    >
                      Close Report
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TRANSACTIONS MODAL */}
      <AnimatePresence>
        {transactionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-lg text-[#001845] flex items-center gap-2"><History size={18}/> Wallet Transactions</h3>
                <button onClick={() => setTransactionModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              
              <div className="p-0 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-xs font-bold text-slate-500 sticky top-0">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-slate-500 text-xs whitespace-nowrap">{t.date}</td>
                        <td className="py-3 px-4 font-semibold text-[#001845]">{t.service}</td>
                        <td className="py-3 px-4 text-xs text-slate-500">{t.type}</td>
                        <td className={`py-3 px-4 text-right font-bold ${t.amount > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {t.amount > 0 ? '+' : ''}?{Math.abs(t.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
