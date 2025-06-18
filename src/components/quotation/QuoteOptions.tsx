
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuoteOptionsProps {
  submitting: boolean;
  countdown: number;
  handleSubmit: (paidOption: boolean) => void;
  instantProposal: boolean;
}

const QuoteOptions: React.FC<QuoteOptionsProps> = ({ submitting, countdown, handleSubmit, instantProposal }) => {
  // Get user's locale for currency formatting
  const getUserCurrency = () => {
    const locale = navigator.language || 'en-US';
    const currency = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale.includes('IN') ? 'INR' : 
                locale.includes('GB') ? 'GBP' :
                locale.includes('EU') ? 'EUR' : 'USD'
    });
    
    // Convert $10 to local currency (approximate rates)
    const baseAmount = 10;
    let localAmount = baseAmount;
    let currencyCode = 'USD';
    
    if (locale.includes('IN')) {
      localAmount = baseAmount * 83; // Approximate INR rate
      currencyCode = 'INR';
    } else if (locale.includes('GB')) {
      localAmount = baseAmount * 0.79; // Approximate GBP rate
      currencyCode = 'GBP';
    } else if (locale.includes('EU')) {
      localAmount = baseAmount * 0.92; // Approximate EUR rate
      currencyCode = 'EUR';
    }
    
    return { amount: localAmount, code: currencyCode, formatted: currency.format(localAmount) };
  };

  const currencyInfo = getUserCurrency();

  if (submitting) {
    return (
      <div className="text-center p-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand-orange to-brand-dark-orange rounded-full mb-4">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Processing Your Request
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          {instantProposal ? "Processing payment and preparing your instant proposal..." : "Preparing your proposal..."}
        </p>
        
        {countdown > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-2xl border border-brand-orange/20 dark:border-brand-orange/40">
            <p className="text-slate-700 dark:text-slate-300 mb-2">Estimated processing time:</p>
            <p className="text-4xl font-bold text-brand-orange">
              {countdown} seconds
            </p>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Complete Your Instant Proposal
        </h3>
        <p className="text-slate-600 dark:text-slate-300">
          Pay securely to receive your proposal immediately
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        <Card className="relative border-2 border-brand-orange/30 dark:border-brand-orange/50 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 hover:shadow-xl transition-all duration-200">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-brand-orange to-brand-dark-orange text-white px-4 py-1 rounded-full text-xs font-semibold">
              INSTANT DELIVERY
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-brand-orange to-brand-dark-orange rounded-full mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-white">Instant Proposal</h4>
              <p className="text-3xl font-bold text-brand-orange mt-2">
                {currencyInfo.formatted}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                (Equivalent to $10 USD)
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Comprehensive project analysis
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Detailed cost breakdown
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Zap className="w-4 h-4 text-brand-orange" />
                Instant email delivery
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Priority support included
              </div>
            </div>
            
            <Button 
              onClick={() => handleSubmit(true)}
              className="w-full bg-gradient-to-r from-brand-orange to-brand-dark-orange hover:from-brand-dark-orange hover:to-brand-dark-orange text-white rounded-xl h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Pay {currencyInfo.formatted} & Get Proposal
            </Button>
            
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
              Secure payment processed by Stripe
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuoteOptions;
