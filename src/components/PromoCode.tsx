import React, { useState } from 'react';
import { PromoCodeState, PromoCode } from '../types/game';
import { Gift, Check, X, Coins, Gem } from 'lucide-react';

interface PromoCodeProps {
  promoCodes: PromoCodeState;
  onRedeemCode: (code: string) => boolean;
}

export const PromoCode: React.FC<PromoCodeProps> = ({ promoCodes, onRedeemCode }) => {
  const [inputCode, setInputCode] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleRedeem = () => {
    if (!inputCode.trim()) {
      setMessage({ text: 'Please enter a promo code', type: 'error' });
      return;
    }

    const success = onRedeemCode(inputCode.toUpperCase());
    
    if (success) {
      setMessage({ text: 'Promo code redeemed successfully!', type: 'success' });
      setInputCode('');
    } else {
      setMessage({ text: 'Invalid or already used promo code', type: 'error' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-4 sm:p-6 rounded-lg shadow-2xl">
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Promo Codes</h2>
        </div>
        <p className="text-green-300 text-sm sm:text-base">Enter special codes to claim rewards!</p>
      </div>

      {/* Code Input */}
      <div className="bg-black/30 p-4 rounded-lg mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="Enter promo code..."
            className="flex-1 px-3 py-2 bg-black/40 border border-green-500/50 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
            maxLength={20}
          />
          <button
            onClick={handleRedeem}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-200"
          >
            Redeem
          </button>
        </div>
        
        {message && (
          <div className={`mt-3 p-2 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-900/50 border border-green-500/50 text-green-300' 
              : 'bg-red-900/50 border border-red-500/50 text-red-300'
          }`}>
            {message.type === 'success' ? (
              <Check className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}
      </div>

      {/* Available Codes */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">Available Codes</h3>
        <div className="space-y-3">
          {promoCodes.availableCodes.map((code) => (
            <div
              key={code.code}
              className={`p-3 rounded-lg border ${
                code.isUsed 
                  ? 'border-gray-600 bg-gray-800/50' 
                  : 'border-green-500/50 bg-black/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm sm:text-base ${
                    code.isUsed ? 'text-gray-400' : 'text-green-400'
                  }`}>
                    {code.code}
                  </span>
                  {code.isUsed && <Check className="w-4 h-4 text-green-400" />}
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  code.isUsed 
                    ? 'bg-gray-600 text-gray-300' 
                    : 'bg-green-600 text-white'
                }`}>
                  {code.isUsed ? 'Used' : 'Available'}
                </span>
              </div>
              
              <p className={`text-xs sm:text-sm mb-2 ${
                code.isUsed ? 'text-gray-400' : 'text-white'
              }`}>
                {code.description}
              </p>
              
              <div className="flex items-center gap-3 text-xs">
                {code.rewards.coins && (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Coins className="w-3 h-3" />
                    <span>+{code.rewards.coins}</span>
                  </div>
                )}
                {code.rewards.gems && (
                  <div className="flex items-center gap-1 text-purple-400">
                    <Gem className="w-3 h-3" />
                    <span>+{code.rewards.gems}</span>
                  </div>
                )}
                {code.rewards.items && (
                  <span className="text-blue-400">
                    +{code.rewards.items.length} item(s)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Used Codes */}
      {promoCodes.usedCodes.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">Redeemed Codes</h3>
          <div className="flex flex-wrap gap-2">
            {promoCodes.usedCodes.map((code, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};