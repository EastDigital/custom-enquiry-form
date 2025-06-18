
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuoteOptionsProps {
  submitting: boolean;
  countdown: number;
  handleSubmit: (paidOption: boolean) => void;
}

const QuoteOptions: React.FC<QuoteOptionsProps> = ({ submitting, countdown, handleSubmit }) => {
  if (submitting) {
    return (
      <div className="text-center p-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand-orange to-brand-dark-orange rounded-full mb-4">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Preparing Your Quote
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Our system is analyzing your requirements...
        </p>
        
        {countdown > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-2xl border border-brand-orange/20 dark:border-brand-orange/40">
            <p className="text-slate-700 dark:text-slate-300 mb-2">Estimated delivery time:</p>
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
          Choose Your Quote Option
        </h3>
        <p className="text-slate-600 dark:text-slate-300">
          Select how you'd like to receive your detailed quotation
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Option */}
        <Card 
          className="relative border-2 border-slate-200 dark:border-slate-700 hover:border-brand-orange dark:hover:border-brand-orange transition-all duration-200 cursor-pointer group hover:shadow-lg"
          onClick={() => handleSubmit(false)}
        >
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full mb-3">
                <Clock className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-white">Standard Quote</h4>
              <p className="text-3xl font-bold text-slate-600 dark:text-slate-400 mt-2">Free</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Detailed project quotation
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Delivered via email
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4 text-blue-500" />
                10-15 minutes delivery time
              </div>
            </div>
            
            <Button className="w-full bg-slate-600 hover:bg-slate-700 text-white rounded-xl h-12 font-semibold group-hover:bg-slate-700 transition-colors">
              Get Free Quote
            </Button>
          </CardContent>
        </Card>
        
        {/* Premium Option */}
        <Card 
          className="relative border-2 border-brand-orange/30 dark:border-brand-orange/50 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 hover:shadow-xl transition-all duration-200 cursor-pointer group"
          onClick={() => handleSubmit(true)}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-brand-orange to-brand-dark-orange text-white px-4 py-1 rounded-full text-xs font-semibold">
              POPULAR
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-brand-orange to-brand-dark-orange rounded-full mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-white">Instant Quote</h4>
              <p className="text-3xl font-bold text-brand-orange mt-2">
                $10
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Comprehensive project analysis
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Priority email delivery
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Zap className="w-4 h-4 text-brand-orange" />
                Instant delivery (30 seconds)
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Bonus consultation call
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-brand-orange to-brand-dark-orange hover:from-brand-dark-orange hover:to-brand-dark-orange text-white rounded-xl h-12 font-semibold shadow-lg group-hover:shadow-xl transition-all">
              Get Instant Quote - $10
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuoteOptions;
