"use client";

import React from "react";
import { Activity, AlertCircle } from "lucide-react";
import { PainAssessment } from "../types/physio";

interface VasPainScaleProps {
  pain: PainAssessment;
  onChange: (updated: Partial<PainAssessment>) => void;
}

export const VasPainScale: React.FC<VasPainScaleProps> = ({ pain, onChange }) => {
  const getVasCategory = (val: number) => {
    if (val === 0) return { label: "Tidak Nyeri", color: "text-emerald-400 bg-emerald-950/60 border-emerald-800" };
    if (val <= 3) return { label: "Nyeri Ringan (Mild)", color: "text-teal-400 bg-teal-950/60 border-teal-800" };
    if (val <= 6) return { label: "Nyeri Sedang (Moderate)", color: "text-amber-400 bg-amber-950/60 border-amber-800" };
    return { label: "Nyeri Berat (Severe)", color: "text-rose-400 bg-rose-950/60 border-rose-800" };
  };

  const renderSlider = (
    label: string,
    subLabel: string,
    value: number,
    fieldKey: "vasRest" | "vasMotion" | "vasPressure"
  ) => {
    const category = getVasCategory(value);

    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <span className="text-xs font-semibold text-slate-200 block">{label}</span>
            <span className="text-[10px] text-slate-400">{subLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-mono text-teal-400">{value}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${category.color}`}>
              {category.label}
            </span>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={value}
          onChange={(e) => onChange({ [fieldKey]: Number(e.target.value) })}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
          <span>0 (Bebas Nyeri)</span>
          <span>5 (Mengganggu)</span>
          <span>10 (Nyeri Tak Tertahankan)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Skala Nyeri VAS / NRS (Visual Analog Scale)
          </span>
        </div>
        <span className="text-[11px] text-slate-400">Standar Evaluasi IFI & Permenkes</span>
      </div>

      <div className="space-y-3">
        {renderSlider("Nyeri Diam (VAS Rest)", "Derajat nyeri saat posisi istirahat tanpa aktivitas", pain.vasRest, "vasRest")}
        {renderSlider("Nyeri Gerak (VAS Motion)", "Derajat nyeri saat anggota tubuh digerakkan aktif/pasif", pain.vasMotion, "vasMotion")}
        {renderSlider("Nyeri Tekan (VAS Pressure)", "Derajat nyeri saat palpasi titik anatomis oleh fisioterapis", pain.vasPressure, "vasPressure")}
      </div>

      {/* Additional Pain Qualifiers */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-medium text-slate-300 block mb-1">
            Faktor Pemberat (Aggravating Factors):
          </label>
          <input
            type="text"
            value={pain.aggravatingFactors}
            onChange={(e) => onChange({ aggravatingFactors: e.target.value })}
            placeholder="Contoh: Duduk > 30 menit, mengangkat lengan ke atas..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="text-[11px] font-medium text-slate-300 block mb-1">
            Faktor Peringan (Relieving Factors):
          </label>
          <input
            type="text"
            value={pain.relievingFactors}
            onChange={(e) => onChange({ relievingFactors: e.target.value })}
            placeholder="Contoh: Kompres hangat, berbaring telentang..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>
    </div>
  );
};
