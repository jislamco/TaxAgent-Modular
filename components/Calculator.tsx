import React, { useState } from 'react';
import { TAX_DATA } from '../constants';
import { DollarSign, PieChart, TrendingDown, RefreshCcw, Calculator as CalcIcon, Building, User, Users, ArrowRightLeft, Info, Play } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { convertCurrency, formatCurrency, INVESTMENT_CURRENCIES } from '../services/currencyService';
import { CurrencyCode, TaxResult, TaxDetail } from '../types';
import { TAX_CALCULATORS } from '../services/calculators';

type EntityType = 'CORPORATE' | 'PARTNERSHIP' | 'SOLE_PROPRIETOR';

export const Calculator: React.FC = () => {
  // Input State (Form)
  const [revenue, setRevenue] = useState<number>(1000000);
  const [expenses, setExpenses] = useState<number>(600000);
  const [selectedCountry, setSelectedCountry] = useState<string>(TAX_DATA[0].id);
  const [investmentCurrency, setInvestmentCurrency] = useState<CurrencyCode>('USD');
  const [entityType, setEntityType] = useState<EntityType>('CORPORATE');

  // Calculation State (Results) - Initialized with default form values
  const [calcParams, setCalcParams] = useState({
    revenue: 1000000,
    expenses: 600000,
    selectedCountry: TAX_DATA[0].id,
    investmentCurrency: 'USD' as CurrencyCode,
    entityType: 'CORPORATE' as EntityType
  });

  const handleCalculate = () => {
    setCalcParams({
      revenue,
      expenses,
      selectedCountry,
      investmentCurrency,
      entityType
    });
  };

  const performCalculation = (rev: number, exp: number, countryId: string, currency: CurrencyCode, entType: EntityType) => {
    const country = TAX_DATA.find(c => c.id === countryId);
    if (!country) return null;

    // 1. Convert to Local
    const localRevenue = convertCurrency(rev, currency, country.currencyCode as CurrencyCode);
    const localExpenses = convertCurrency(exp, currency, country.currencyCode as CurrencyCode);
    const localProfit = Math.max(0, localRevenue - localExpenses);

    // 2. Get Calculator
    const calculator = TAX_CALCULATORS[countryId];
    if (!calculator) return null;

    let result: TaxResult;
    switch (entType) {
      case 'PARTNERSHIP':
        result = calculator.calculatePartnership(localRevenue, localExpenses);
        break;
      case 'SOLE_PROPRIETOR':
        result = calculator.calculateSoleProp(localRevenue, localExpenses);
        break;
      case 'CORPORATE':
      default:
        result = calculator.calculateCorporate(localRevenue, localExpenses);
        break;
    }

    const localNet = localProfit - result.totalTax;

    return {
      revenue: rev,
      expenses: exp,
      tax: convertCurrency(result.totalTax, country.currencyCode as CurrencyCode, currency),
      net: convertCurrency(localNet, country.currencyCode as CurrencyCode, currency),
      profit: convertCurrency(localProfit, country.currencyCode as CurrencyCode, currency),
      rate: parseFloat(result.effectiveRate.toFixed(2)),
      localCurrency: country.currencyCode,
      local: {
        revenue: localRevenue,
        expenses: localExpenses,
        profit: localProfit,
        tax: result.totalTax,
        net: localNet,
        breakdown: result.breakdown
      }
    };
  };

  const calculateComparison = (rev: number, exp: number, currency: CurrencyCode) => {
    return TAX_DATA.map(c => {
      // Comparison always uses the currently selected entity type for consistency
      const res = performCalculation(rev, exp, c.id, currency, calcParams.entityType);
      if (!res) return { name: c.country, NetProfit: 0, Tax: 0 };
      return {
        name: c.country,
        NetProfit: res.net,
        Tax: res.tax
      };
    }).sort((a, b) => b.NetProfit - a.NetProfit);
  };

  // Perform calculations using the 'calcParams' state, NOT the live inputs
  const results = performCalculation(calcParams.revenue, calcParams.expenses, calcParams.selectedCountry, calcParams.investmentCurrency, calcParams.entityType);
  const comparisonData = calculateComparison(calcParams.revenue, calcParams.expenses, calcParams.investmentCurrency);
  const country = TAX_DATA.find(c => c.id === calcParams.selectedCountry);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-1 h-fit">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" /> 
            Investment Parameters
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Entity Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setEntityType('CORPORATE')}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-medium transition-all ${
                    entityType === 'CORPORATE' 
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Building size={16} className="mb-1" />
                  Corporate
                </button>
                <button 
                  onClick={() => setEntityType('PARTNERSHIP')}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-medium transition-all ${
                    entityType === 'PARTNERSHIP' 
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Users size={16} className="mb-1" />
                  Partnership
                </button>
                <button 
                  onClick={() => setEntityType('SOLE_PROPRIETOR')}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-medium transition-all ${
                    entityType === 'SOLE_PROPRIETOR' 
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <User size={16} className="mb-1" />
                  Sole Prop
                </button>
              </div>
            </div>

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

            <button
              onClick={handleCalculate}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-4 shadow-md active:scale-[0.98]"
            >
              <Play size={18} fill="currentColor" />
              Calculate Profit
            </button>
            
            {results && (
              <div className="pt-4 border-t border-slate-100 mt-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4" /> Currency Breakdown
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-slate-500 border-b border-slate-100">
                        <th className="text-left py-1 font-medium">Metric</th>
                        <th className="text-right py-1 font-medium">{calcParams.investmentCurrency}</th>
                        <th className="text-right py-1 font-medium">{results.localCurrency}</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      <tr className="border-b border-slate-50">
                        <td className="py-2">Revenue</td>
                        <td className="text-right">{formatCurrency(results.revenue, calcParams.investmentCurrency)}</td>
                        <td className="text-right text-slate-500">{formatCurrency(results.local.revenue, results.localCurrency as CurrencyCode)}</td>
                      </tr>
                      <tr className="border-b border-slate-50">
                        <td className="py-2">Expenses</td>
                        <td className="text-right">{formatCurrency(results.expenses, calcParams.investmentCurrency)}</td>
                        <td className="text-right text-slate-500">{formatCurrency(results.local.expenses, results.localCurrency as CurrencyCode)}</td>
                      </tr>
                      <tr className="border-b border-slate-100 font-medium bg-slate-50">
                        <td className="py-2 pl-1">Gross Profit</td>
                        <td className="text-right">{formatCurrency(results.profit, calcParams.investmentCurrency)}</td>
                        <td className="text-right text-slate-600">{formatCurrency(results.local.profit, results.localCurrency as CurrencyCode)}</td>
                      </tr>
                      {results.local.breakdown.map((item, idx) => (
                         <tr key={idx} className="text-xs text-slate-500">
                           <td className="py-1 pl-3 border-l-2 border-slate-200">{item.label}</td>
                           <td className="text-right">-</td>
                           <td className="text-right">{formatCurrency(item.amount, results.localCurrency as CurrencyCode)}</td>
                         </tr>
                      ))}
                      <tr className="text-red-600 border-b border-slate-50 bg-red-50/30">
                        <td className="py-2 flex items-center gap-1 font-medium">
                           Total Tax <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded">~{results.rate}%</span>
                        </td>
                        <td className="text-right font-medium">-{formatCurrency(results.tax, calcParams.investmentCurrency)}</td>
                        <td className="text-right opacity-90 font-medium">-{formatCurrency(results.local.tax, results.localCurrency as CurrencyCode)}</td>
                      </tr>
                      <tr className="font-bold text-emerald-700 text-base">
                        <td className="py-3">Net Profit</td>
                        <td className="text-right">{formatCurrency(results.net, calcParams.investmentCurrency)}</td>
                        <td className="text-right text-emerald-600/70 text-sm">{formatCurrency(results.local.net, results.localCurrency as CurrencyCode)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
           <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-indigo-600" />
            Regional Profitability Comparison ({calcParams.investmentCurrency})
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Comparing projected net profit for a <strong>{calcParams.entityType.toLowerCase().replace('_', ' ')}</strong> across all 7 jurisdictions.
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
                  formatter={(value: number) => formatCurrency(value, calcParams.investmentCurrency)}
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
             These could significantly lower your effective tax rate below the calculated {results?.rate}%.
           </p>
        </div>
      </div>
    </div>
  );
};
