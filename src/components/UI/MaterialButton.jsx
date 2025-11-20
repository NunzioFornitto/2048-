import React from 'react';
import { haptic } from '../../utils/haptic';

const MaterialButton = ({ onClick, icon: Icon, label, colorClass, subLabel, disabled }) => (
  <button onClick={() => { if (!disabled) { haptic.medium(); onClick(); } }} disabled={disabled} className={`relative w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-between transition-all duration-200 ease-out transform active:scale-[0.98] shadow-md hover:shadow-lg ${colorClass} ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''} mb-3 border border-white/5`}>
    <div className="flex items-center gap-4">
      <div className="bg-black/10 p-2.5 rounded-xl"><Icon size={22} strokeWidth={2.5} /></div>
      <div className="flex flex-col items-start text-left"><span className="leading-none tracking-tight">{label}</span>{subLabel && <span className="text-[11px] opacity-80 font-medium mt-1 tracking-wide uppercase">{subLabel}</span>}</div>
    </div>
  </button>
);

export default MaterialButton;
