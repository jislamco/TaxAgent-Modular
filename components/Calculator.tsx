import React, { useState } from 'react';
import { TAX_DATA } from '../constants';
import { DollarSign, PieChart, TrendingDown, RefreshCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { convertCurrency, formatCurrency, INVESTMENT_CURRENCIES } from '../services/currencyService';
import { CurrencyCode } from '../types';

export const Calculator: React.FC = () => {
  const [revenue, setRevenue] = useState<number>(1000000);
  const [expenses, setExpenses] = useState<number>(600000);
  const [selectedCountry, setSelectedCountry] = useState<string>(TAX_DATA[0].id);
  const [investmentCurrency, setInvestmentCurrency] = useState<CurrencyCode>('USD');

  const getResults = () => {
    const country = TAX_DATA.find(c => c.id === selectedCountry);
    if (!country) return { tax: 0, net: 0, profit: 0, rate: 0, currency: 'USD' };

    // 1. Convert Input (Inv Currency) -> Local Currency
    const localRevenue = convertCurrency(revenue, investmentCurrency, country.currencyCode as CurrencyCode);
    const localExpenses = convertCurrency(expenses, investmentCurrency, country.currencyCode as CurrencyCode);
    const localProfit = Math.max(0, localRevenue - localExpenses);

    // 2. Calculate Tax (simplified standard rate)
    const localTax = localProfit * (country.cit.standardRate / 100);
    const localNet = localProfit - localTax;

    // 3. Convert Local Result -> Investment Currency
    return {
      tax: convertCurrency(localTax, country.currencyCode as CurrencyCode, investmentCurrency),
      net: convertCurrency(localNet, country.currencyCode as CurrencyCode, investmentCurrency),
      profit: convertCurrency(localProfit, country.currencyCode as CurrencyCode, investmentCurrency),
      rate: country.cit.standardRate,
      localCurrency: country.currencyCode
    };
  };

  const results = getResults();
  const country = TAX_DATA.find(c => c.id === selectedCountry);

  const comparisonData = TAX_DATA.map(c => {
    // Convert inputs to local for that country to simulate local ops, or assume inputs are global?
    // Assuming inputs are global investment value, so we convert global -> local -> tax -> global
    const localRev = convertCurrency(revenue, investmentCurrency, c.currencyCode as CurrencyCode);
    const localExp = convertCurrency(expenses, investmentCurrency, c.currencyCode as CurrencyCode);
    const localProfit = Math.max(0, localRev - localExp);
    const localTax = localProfit * (c.cit.standardRate / 100);
    const localNet = localProfit - localTax;

    return {
      name: c.country,
      NetProfit: convertCurrency(localNet, c.currencyCode as CurrencyCode, investmentCurrency),
      Tax: convertCurrency(localTax, c.currencyCode as CurrencyCode, investmentCurrency)
    };
  }).sort((a, b) => b.NetProfit - a.NetProfit);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" /> 
            Investment Parameters
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Investment Currency</label>
              <div className="relative">
                <select 
                  value={investmentCurrency}
                  onChange={(e) => setInvestmentCurrency(e.target.value as CurrencyCode)}
                  className="w-full p-2 pl-9 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                >
                  {INVESTMENT_CURRENCIES.map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
                <RefreshCcw className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Country</label>
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {TAX_DATA.map(c => (
                  <option key={c.id} value={c.id}>{c.flag} {c.country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Annual Revenue ({investmentCurrency})</label>
              <input 
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Annual Expenses ({investmentCurrency})</label>
              <input 
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            
            <div className="pt-4 border-t border-slate-100 mt-4">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-slate-600">Gross Profit:</span>
                 <span className="font-bold text-slate-900">{formatCurrency(results.profit, investmentCurrency)}</span>
               </div>
               <div className="flex justify-between items-center mb-2">
                 <span className="text-red-600">Est. Tax ({results.rate}%):</span>
                 <span className="font-bold text-red-600">-{formatCurrency(results.tax, investmentCurrency)}</span>
               </div>
               <div className="flex justify-between items-center text-lg mt-2 pt-2 border-t border-slate-100">
                 <span className="text-emerald-700 font-bold">Net Profit:</span>
                 <span className="font-bold text-emerald-700">{formatCurrency(results.net, investmentCurrency)}</span>
               </div>
               <p className="text-xs text-slate-400 mt-2 text-center">
                 *Calculated in local {results.localCurrency} and converted back.
               </p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
           <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-indigo-600" />
            Regional Profitability Comparison ({investmentCurrency})
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Comparing projected net profit across all 7 jurisdictions. Values converted to {investmentCurrency} using current exchange rates.
          </p>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, investmentCurrency)}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="NetProfit" fill="#10b981" name="Net Profit" stackId="a" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Tax" fill="#ef4444" name="Tax Liability" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3">
        <PieChart className="w-6 h-6 text-blue-600 flex-shrink-0" />
        <div>
           <h4 className="font-semibold text-blue-900">Incentive Alert for {country?.country}</h4>
           <p className="text-sm text-blue-800 mt-1">
             Remember to check available incentives. {country?.country} offers: {country?.cit.incentives.join(', ')}. 
             These could significantly lower your effective tax rate below the calculated {results.rate}%.
           </p>
        </div>
      </div>
    </div>
  );
};