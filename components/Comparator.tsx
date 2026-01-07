import React, { useState } from 'react';
import { TAX_DATA } from '../constants';
import { Check, Plus } from 'lucide-react';

export const Comparator: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['ae', 'in', 'vn']);

  const toggleCountry = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const selectedCountries = TAX_DATA.filter(c => selectedIds.includes(c.id));

  return (
    <div className="space-y-6">
      {/* Selector */}
      <div className="flex flex-wrap gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <span className="text-sm font-medium text-slate-500 flex items-center mr-2">Compare (max 4):</span>
        {TAX_DATA.map(c => {
          const isSelected = selectedIds.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggleCountry(c.id)}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-all ${
                isSelected 
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200 font-medium' 
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.country}</span>
              {isSelected ? <Check size={12} /> : <Plus size={12} />}
            </button>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-sm font-semibold text-slate-500 w-48 sticky left-0 bg-slate-50">Metric</th>
              {selectedCountries.map(c => (
                <th key={c.id} className="p-4 min-w-[250px] border-l border-slate-100">
                  <div className="flex items-center gap-2 text-slate-800 text-lg">
                    <span className="text-2xl">{c.flag}</span>
                    {c.country}
                  </div>
                  <div className="text-xs text-slate-500 font-normal mt-1">{c.currency} ({c.currencyCode})</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {/* CIT Section */}
            <tr className="bg-slate-50/50"><td colSpan={selectedCountries.length + 1} className="p-2 px-4 text-xs font-bold text-indigo-600 uppercase tracking-wider">Corporate Income Tax</td></tr>
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700 sticky left-0 bg-white">Standard Rate</td>
              {selectedCountries.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-100 text-slate-800 font-semibold">{c.cit.standardRate}%</td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700 sticky left-0 bg-white">Key Incentives</td>
              {selectedCountries.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-100 text-slate-600">
                  <ul className="list-disc pl-4 space-y-1">
                    {c.cit.incentives.map((inc, i) => <li key={i}>{inc}</li>)}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Business Income Section */}
            <tr className="bg-slate-50/50"><td colSpan={selectedCountries.length + 1} className="p-2 px-4 text-xs font-bold text-indigo-600 uppercase tracking-wider">Business Income (Indiv. & Partners)</td></tr>
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700 sticky left-0 bg-white">Sole Proprietorship</td>
              {selectedCountries.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-100 text-slate-800">{c.businessTax.soleProprietor}</td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700 sticky left-0 bg-white">Partnership Firm</td>
              {selectedCountries.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-100 text-slate-800">{c.businessTax.partnership}</td>
              ))}
            </tr>

            {/* Sales Tax Section */}
            <tr className="bg-slate-50/50"><td colSpan={selectedCountries.length + 1} className="p-2 px-4 text-xs font-bold text-indigo-600 uppercase tracking-wider">Indirect Tax (VAT/GST)</td></tr>
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700 sticky left-0 bg-white">System Name</td>
              {selectedCountries.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-100 text-slate-800">{c.salesTax.name}</td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700 sticky left-0 bg-white">Standard Rate</td>
              {selectedCountries.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-100 text-slate-800 font-semibold">{c.salesTax.standardRate}%</td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700 sticky left-0 bg-white">Registration Threshold</td>
              {selectedCountries.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-100 text-slate-600 italic">{c.salesTax.registrationThreshold}</td>
              ))}
            </tr>

             {/* PIT Section */}
             <tr className="bg-slate-50/50"><td colSpan={selectedCountries.length + 1} className="p-2 px-4 text-xs font-bold text-indigo-600 uppercase tracking-wider">Personal Income Tax (Employment)</td></tr>
             <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700 sticky left-0 bg-white">Top Marginal Rate</td>
              {selectedCountries.map(c => {
                const topRate = c.pit.brackets[c.pit.brackets.length - 1].rate;
                return (
                  <td key={c.id} className="p-4 border-l border-slate-100 text-slate-800 font-semibold">
                    {topRate}%
                  </td>
                );
              })}
            </tr>
             <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700 sticky left-0 bg-white">Tax Residency</td>
              {selectedCountries.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-100 text-slate-600 text-xs">{c.residencyRules}</td>
              ))}
            </tr>

            {/* Withholding */}
            <tr className="bg-slate-50/50"><td colSpan={selectedCountries.length + 1} className="p-2 px-4 text-xs font-bold text-indigo-600 uppercase tracking-wider">Withholding Tax (Non-Residents)</td></tr>
             <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700 sticky left-0 bg-white">Dividends</td>
              {selectedCountries.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-100 text-slate-800">{c.withholding.dividends}</td>
              ))}
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700 sticky left-0 bg-white">Interest</td>
              {selectedCountries.map(c => (
                <td key={c.id} className="p-4 border-l border-slate-100 text-slate-800">{c.withholding.interest}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};