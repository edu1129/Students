import React from 'react';
import { CreditCard } from 'lucide-react';
import ProfileSection from './ProfileSection';
import FeeChart from './charts/FeeChart';
import { FeesData, FeeItem } from '../types';
import { formatCurrency, formatDisplayDate, sanitizeText } from '../utils/formatter';
import { BORDER_RADIUS } from '../constants';

interface FeesSectionProps {
  fees?: FeesData;
}

const FeeListItem: React.FC<{ item: FeeItem, isDue: boolean }> = ({ item, isDue }) => (
  <li className={`p-3 border-b border-slate-200 last:border-b-0 flex justify-between items-center text-sm hover:bg-slate-50 transition-colors`}>
    <div>
      <span className="font-medium text-slate-700">{sanitizeText(item.FeeTypeName || item.FeeTypeID)}</span>
      <small className="block text-slate-500">
        {isDue ? `Due: ${formatDisplayDate(item.DueDate)}` : `Paid: ${formatDisplayDate(item.PaidDate)}`}
      </small>
    </div>
    <span className={`font-semibold ${isDue ? 'text-red-600' : 'text-green-600'}`}>
      {formatCurrency(item.Amount)}
      {isDue && item.Status && <span className="text-xs font-normal"> ({sanitizeText(item.Status)})</span>}
    </span>
  </li>
);

const FeesSection: React.FC<FeesSectionProps> = ({ fees }) => {
  if (!fees) {
    return (
      <ProfileSection title="Fee Records" icon={<CreditCard size={24} />}>
        <p className="text-slate-500">Fee information not available.</p>
      </ProfileSection>
    );
  }

  const { totalDue = 0, totalPaid = 0, due = [], paid = [], byMonthPaid = {} } = fees;

  return (
    <ProfileSection title="Fee Records" icon={<CreditCard size={24} />} id="fees-info-section">
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 ${BORDER_RADIUS}`}>
        <div className="text-center">
          <strong className="block text-2xl font-bold text-red-600">{formatCurrency(totalDue)}</strong>
          <span className="text-sm text-slate-500">Total Due</span>
        </div>
        <div className="text-center">
          <strong className="block text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</strong>
          <span className="text-sm text-slate-500">Total Paid</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Due Fees</h3>
          {due.length > 0 ? (
            <ul className={`border border-slate-200 ${BORDER_RADIUS} max-h-60 overflow-y-auto`}>
              {due.map((item, index) => <FeeListItem key={`due-${index}-${item.FeeTypeID}`} item={item} isDue={true} />)}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 p-3 bg-slate-50 rounded-md text-center">No due fees.</p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Paid Fees</h3>
          {paid.length > 0 ? (
            <ul className={`border border-slate-200 ${BORDER_RADIUS} max-h-60 overflow-y-auto`}>
              {paid.map((item, index) => <FeeListItem key={`paid-${index}-${item.FeeTypeID}`} item={item} isDue={false} />)}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 p-3 bg-slate-50 rounded-md text-center">No paid fees recorded.</p>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-700 mt-8 mb-2">Monthly Fee Payments</h3>
      <FeeChart feeData={byMonthPaid} />
    </ProfileSection>
  );
};

export default FeesSection;
