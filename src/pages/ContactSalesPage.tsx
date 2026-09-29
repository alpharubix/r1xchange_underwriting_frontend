import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, ArrowLeft, Building, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactSalesPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => setSubmitted(true), 1000);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f4f5f9] text-[#1a1a1a]">
      {/* Left Branding Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#003da6] via-[#002366] to-[#000a1f] p-12 text-white md:flex overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-50">
          <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="inline-block text-2xl font-bold tracking-tight text-white mb-12 hover:opacity-80 transition-opacity">
            CRISP<span className="text-blue-400">.</span>
          </Link>
          <div className="max-w-md">
            <h1 className="text-4xl font-extrabold leading-tight mb-6">Let's scale your underwriting.</h1>
            <p className="text-lg text-blue-100/80 leading-relaxed mb-8">
              Whether you are an Anchor managing millions in flow or an User organizing regional networks, our platform provides the intelligence you need.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-blue-300" />
                </div>
                <span className="font-medium text-blue-50">Custom enterprise pricing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-blue-300" />
                </div>
                <span className="font-medium text-blue-50">Dedicated account manager</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-blue-300" />
                </div>
                <span className="font-medium text-blue-50">Tailored API integrations</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-xs text-white/40 font-medium tracking-wide">
           2025 CRISP. All rights reserved.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="relative flex w-full flex-col items-center justify-center p-6 md:w-1/2">
        <Link 
          to="/anchors" 
          className="absolute top-8 right-8 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#002366] transition-colors bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg mt-12 md:mt-0"
        >
          <Card className="border-0 bg-white shadow-xl shadow-black/5 rounded-2xl overflow-hidden">
            <CardContent className="p-8 md:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Received</h2>
                  <p className="text-slate-500 mb-8">
                    Thank you for your interest in CRISP. Our sales team will get back to you within 24 hours to discuss your requirements.
                  </p>
                  <Button 
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="rounded-full px-8"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                      Contact Sales
                    </h2>
                    <p className="text-sm text-gray-500">
                      Fill out the form below and we'll be in touch shortly.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-xs font-semibold text-slate-600 uppercase">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input id="firstName" required className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#002366]" placeholder="John" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-xs font-semibold text-slate-600 uppercase">Last Name</Label>
                      <Input id="lastName" required className="bg-slate-50 border-slate-200 focus-visible:ring-[#002366]" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-600 uppercase">Work Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input id="email" type="email" required className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#002366]" placeholder="john@company.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-xs font-semibold text-slate-600 uppercase">Company</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input id="company" required className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#002366]" placeholder="Acme Corp" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-semibold text-slate-600 uppercase">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input id="phone" type="tel" className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#002366]" placeholder="+91 98765 43210" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-semibold text-slate-600 uppercase">How can we help?</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <textarea 
                        id="message" 
                        required
                        rows={4} 
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 pl-10 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002366] focus:border-transparent resize-none"
                        placeholder="Tell us about your underwriting volume and specific needs..."
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-[#002366] hover:bg-[#001845]/90 text-white rounded-xl shadow-lg shadow-[#002366]/20 transition-all flex items-center justify-center gap-2"
                  >
                    Send Request <Send className="w-4 h-4 ml-1" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
