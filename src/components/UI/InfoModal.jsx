import React from 'react';
import { Info, X } from 'lucide-react';

const InfoModal = ({ onClose, theme, title, items }) => (
    <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-fade-in p-6">
        <div className={`${theme.panel} w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/10`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black flex items-center gap-2"><Info className="text-blue-400" /> {title}</h2>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={20} /></button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {items.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                        <div className={`p-3 rounded-xl bg-${item.color}-500/20 text-${item.color}-400`}>{item.icon}</div>
                        <div>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-sm opacity-70 leading-tight">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default InfoModal;
