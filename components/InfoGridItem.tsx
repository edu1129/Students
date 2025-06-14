
import React from 'react';

interface InfoGridItemProps {
  label: string;
  value: React.ReactNode;
}

const InfoGridItem: React.FC<InfoGridItemProps> = ({ label, value }) => {
  return (
    <div className="text-sm">
      <strong className="font-medium text-slate-500 block min-w-[120px] mb-1">{label}:</strong>
      <span className="text-slate-700">{value}</span>
    </div>
  );
};

export default InfoGridItem;
    