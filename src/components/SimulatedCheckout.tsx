import React, { useState } from "react";
import { CreditCard, Lock, ArrowLeft, Shield, Sparkles, CheckCircle2 } from "lucide-react";

interface SimulatedCheckoutProps {
  onSuccess: () => void;
  onCancel: () => void;
  itemName: string;
  priceAmount: number;
  itemType: string;
}

export default function SimulatedCheckout({
  onSuccess,
  onCancel,
  itemName,
  priceAmount,
  itemType
}: SimulatedCheckoutProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
      setError("Please enter a valid 16-digit card number.");
      return;
    }
    if (!expiry || expiry.length < 5) {
      setError("Please enter a valid expiry date (MM/YY).");
      return;
    }
    if (!cvc || cvc.length < 3) {
      setError("Please enter a valid 3 or 4 digit CVC.");
      return;
    }
    if (!nameOnCard) {
      setError("Please enter the name on the card.");
      return;
    }

    setIsProcessing(true);

    // Simulate payment loading
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Post-success delay before redirect
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2500);
  };

  const handleFillTestCard = () => {
    setCardNumber("4242 4242 4242 4242");
    setExpiry("12/28");
    setCvc("242");
    setNameOnCard("Jane Doe");
    setZipCode("90210");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800" id="stripe-simulated-root">
      {/* Left panel: Product summaries */}
      <div className="w-full md:w-[45%] bg-slate-50 md:bg-slate-50/50 p-8 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 shrink-0">
        <div>
          <button 
            onClick={onCancel}
            className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 mb-12 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Page Builder
          </button>

          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider mb-8 shadow-xs">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Stripe Sandbox Checkout</span>
          </div>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Paying for Upgrade
          </p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
            {itemName}
          </h1>
          <p className="text-slate-600 mb-8 text-sm leading-relaxed font-medium">
            {itemType === "upgrade" 
              ? "Gain permanent access to download fully-compiled static HTML and React modules of your generated landing pages." 
              : "Complete the sandbox payment authorization to activate Developer privileges."}
          </p>

          <div className="border-t border-b border-slate-200 py-4 mb-6">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-800">
              <span>{itemName}</span>
              <span>${priceAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium mt-1">
              <span>Standard Merchant VAT</span>
              <span>Included</span>
            </div>
          </div>

          <div className="flex justify-between items-center font-bold text-lg text-slate-900">
            <span>Total due</span>
            <span className="font-mono">${priceAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-12 md:mt-0 text-[11px] text-slate-400 font-medium flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Simulated secure SSL sandbox powered by Stripe Node.js API.</span>
        </div>
      </div>

      {/* Right panel: Credit Card input fields */}
      <div className="w-full md:w-[55%] p-8 md:p-16 flex items-center justify-center bg-slate-100/50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-200/50">
          {isSuccess ? (
            <div className="text-center py-12 animate-fade-in" id="payment-success-msg">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 animate-bounce" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Payment Authorized</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-8 max-w-xs mx-auto font-medium">
                Your Stripe transaction has been securely authorized and logged. Redirecting you back now...
              </p>
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Payment Details</h2>
                <button
                  type="button"
                  onClick={handleFillTestCard}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Autofill Card</span>
                </button>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3.5 rounded-lg text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    defaultValue="guest_checkout@stripe.test"
                    disabled
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400 focus:outline-none cursor-not-allowed font-medium"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Card Information
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-3 py-2 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Expiry & CVC Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      CVC Number
                    </label>
                    <input
                      type="password"
                      placeholder="CVC"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                      maxLength={4}
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Name on card */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>

                {/* ZIP Code */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Country or Region
                  </label>
                  <select className="w-full bg-white border border-slate-200 rounded-t-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium">
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Germany</option>
                    <option>Australia</option>
                  </select>
                  <input
                    type="text"
                    placeholder="ZIP / Postal Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.toUpperCase())}
                    required
                    className="w-full bg-white border-t-0 border border-slate-200 rounded-b-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer mt-4 h-11"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authorizing Sandbox...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay ${priceAmount.toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-medium leading-relaxed block">
                  Secure sandbox payment. No actual transaction will occur. Use test card credentials.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
