import React from 'react';
import { TaxProfile } from '../types';
import { Building, ShoppingBag, User, AlertCircle, Info } from 'lucide-react';

interface Props {
  data: TaxProfile;
  onBack: () => void;
}

export const CountryDetail: React.FC<Props> = ({ data, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-sm text-slate-500 hover:text-indigo-600">
          ← Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-4xl">{data.flag}</span> 
          {data.country} Tax Profile
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Corporate Tax Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex items-center gap-2">
            <Building className="text-indigo-600 w-5 h-5" />
            <h3 className="font-semibold text-indigo-900">Corporate Income Tax (CIT)</h3>
          </div>
          <div className="p-6">
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-bold text-slate-800">{data.cit.standardRate}%</span>
              <span className="text-slate-500 mb-1">Standard Rate</span>
            </div>
            <p className="text-sm text-slate-600 mb-4">{data.cit.description}</p>
            
            <h4 className="text-sm font-semibold text-slate-800 mb-2">Key Incentives</h4>
            <ul className="space-y-2">
              {data.cit.incentives.map((inc, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-green-500 mt-1">✓</span>
                  {inc}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sales Tax Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center gap-2">
            <ShoppingBag className="text-emerald-600 w-5 h-5" />
            <h3 className="font-semibold text-emerald-900">{data.salesTax.name}</h3>
          </div>
          <div className="p-6">
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-bold text-slate-800">{data.salesTax.standardRate}%</span>
              <span className="text-slate-500 mb-1">Standard Rate</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">Reduced Rates</span>
                <p className="text-sm text-slate-700">{data.salesTax.reducedRates}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">Exemptions</span>
                <p className="text-sm text-slate-700">{data.salesTax.exemptions}</p>
              </div>
               <div>
                <span className="text-xs font-semibold uppercase text-slate-400">Registration Threshold</span>
                <p className="text-sm text-slate-700">{data.salesTax.registrationThreshold}</p>
              </div>
            </div>
          </div>
        </div>

        {/* PIT Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center gap-2">
            <User className="text-orange-600 w-5 h-5" />
            <h3 className="font-semibold text-orange-900">Personal Income Tax (PIT)</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-600 mb-4">{data.pit.description}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="p-2 border-b">Rate</th>
                    <th className="p-2 border-b">Income Range ({data.currencyCode})</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pit.brackets.map((b, i) => (
                    <tr key={i} className="border-b last:border-0 border-slate-100">
                      <td className="p-2 font-semibold text-slate-700">{b.rate}%</td>
                      <td className="p-2 text-slate-600">
                        {b.max 
                          ? `${(b.min || 0).toLocaleString()} - ${b.max.toLocaleString()}` 
                          : `Above ${(b.min || 0).toLocaleString()}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-orange-50/50 rounded-lg text-xs text-orange-800">
              <strong>Residency Rule: </strong> {data.residencyRules}
            </div>
          </div>
        </div>

        {/* Additional Levies & Compliance */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center gap-2">
            <AlertCircle className="text-blue-600 w-5 h-5" />
            <h3 className="font-semibold text-blue-900">Other Levies & Compliance</h3>
          </div>
          <div className="p-6 space-y-4">
             <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Additional Levies</h4>
                <div className="flex flex-wrap gap-2">
                  {data.additionalLevies.map((levy, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs border border-slate-200">
                      {levy}
                    </span>
                  ))}
                </div>
             </div>

             <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Withholding Taxes</h4>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                     <span className="text-xs text-slate-500 block">Dividends</span>
                     <span className="text-sm font-medium">{data.withholding.dividends}</span>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                     <span className="text-xs text-slate-500 block">Interest</span>
                     <span className="text-sm font-medium">{data.withholding.interest}</span>
                   </div>
                 </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};