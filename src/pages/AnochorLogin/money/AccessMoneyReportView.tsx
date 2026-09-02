import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { requestLoan } from '@/api/money';

export default function AccessMoneyReportView({ selectedCustomer }: { selectedCustomer: any }) {
  const [loanType, setLoanType] = useState('Personal Loan');
  const [customLoanType, setCustomLoanType] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }

    const finalLoanType = loanType === 'Others' ? customLoanType : loanType;
    if (!finalLoanType.trim()) {
      toast.error('Please specify a loan type');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await requestLoan({
        cust_id: selectedCustomer.id,
        loan_type: finalLoanType,
        amount: Number(amount)
      });
      toast.success(res.message || 'Loan request submitted successfully!');
      setAmount('');
      setCustomLoanType('');
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || 'Failed to submit loan request';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Access Money</h3>
        <p className="text-sm text-slate-500 mt-1">Request a loan or credit facility for this customer.</p>
      </div>

      <Card className="max-w-md border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="loanType" className="text-sm font-medium text-slate-700">Loan Type</Label>
              <select
                id="loanType"
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Personal Loan">Personal Loan</option>
                <option value="Business Loan">Business Loan</option>
                <option value="Working Capital">Working Capital</option>
                <option value="Term Loan">Term Loan</option>
                <option value="Equipment Finance">Equipment Finance</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {loanType === 'Others' && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <Label htmlFor="customLoanType" className="text-sm font-medium text-slate-700">Specify Loan Type</Label>
                <Input
                  id="customLoanType"
                  type="text"
                  placeholder="Enter loan type"
                  value={customLoanType}
                  onChange={(e) => setCustomLoanType(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-slate-700">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#1106de] hover:bg-[#0e05b5] text-white font-semibold rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
