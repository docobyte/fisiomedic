"use client";

import React from "react";
import { Crosshair, Check } from "lucide-react";

interface BodyChartProps {
  selectedRegions: string[];
  onToggleRegion: (regionName: string) => void;
  painLevel?: number; // 0-10 to colorize
}

interface AnatomicalSpot {
  id: string;
  name: string;
  view: "Anterior (Depan)" | "Posterior (Belakang)";
  cx: number;
  cy: number;
}

const BODY_SPOTS: AnatomicalSpot[] = [
  // Anterior spots
  { id: "cervical_ant", name: "Cervical / Leher Depan", view: "Anterior (Depan)", cx: 100, cy: 75 },
  { id: "shoulder_r_ant", name: "Bahu Kanan", view: "Anterior (Depan)", cx: 62, cy: 105 },
  { id: "shoulder_l_ant", name: "Bahu Kiri", view: "Anterior (Depan)", cx: 138, cy: 105 },
  { id: "chest", name: "Dada / Thoraks", view: "Anterior (Depan)", cx: 100, cy: 125 },
  { id: "elbow_r_ant", name: "Siku Kanan", view: "Anterior (Depan)", cx: 45, cy: 155 },
  { id: "elbow_l_ant", name: "Siku Kiri", view: "Anterior (Depan)", cx: 155, cy: 155 },
  { id: "wrist_r_ant", name: "Pergelangan Tangan Kanan", view: "Anterior (Depan)", cx: 30, cy: 210 },
  { id: "wrist_l_ant", name: "Pergelangan Tangan Kiri", view: "Anterior (Depan)", cx: 170, cy: 210 },
  { id: "hip_r_ant", name: "Pinggul Kanan", view: "Anterior (Depan)", cx: 80, cy: 200 },
  { id: "hip_l_ant", name: "Pinggul Kiri", view: "Anterior (Depan)", cx: 120, cy: 200 },
  { id: "knee_r_ant", name: "Lutut Kanan (Genu Dextra)", view: "Anterior (Depan)", cx: 80, cy: 285 },
  { id: "knee_l_ant", name: "Lutut Kiri (Genu Sinistra)", view: "Anterior (Depan)", cx: 120, cy: 285 },
  { id: "ankle_r_ant", name: "Pergelangan Kaki Kanan", view: "Anterior (Depan)", cx: 80, cy: 370 },
  { id: "ankle_l_ant", name: "Pergelangan Kaki Kiri", view: "Anterior (Depan)", cx: 120, cy: 370 },

  // Posterior spots
  { id: "cervical_post", name: "Tengkuk / Cervical Belakang", view: "Posterior (Belakang)", cx: 300, cy: 75 },
  { id: "upper_back", name: "Punggung Atas (Thoracal)", view: "Posterior (Belakang)", cx: 300, cy: 120 },
  { id: "shoulder_r_post", name: "Scapula Kanan", view: "Posterior (Belakang)", cx: 265, cy: 110 },
  { id: "shoulder_l_post", name: "Scapula Kiri", view: "Posterior (Belakang)", cx: 335, cy: 110 },
  { id: "lumbar_post", name: "Lumbal / Pinggang", view: "Posterior (Belakang)", cx: 300, cy: 170 },
  { id: "gluteus_r", name: "Bokong Kanan (Gluteal)", view: "Posterior (Belakang)", cx: 280, cy: 215 },
  { id: "gluteus_l", name: "Bokong Kiri (Gluteal)", view: "Posterior (Belakang)", cx: 320, cy: 215 },
  { id: "hamstring_r", name: "Paha Belakang Kanan", view: "Posterior (Belakang)", cx: 280, cy: 260 },
  { id: "hamstring_l", name: "Paha Belakang Kiri", view: "Posterior (Belakang)", cx: 320, cy: 260 },
  { id: "achilles_r", name: "Tendo Achilles Kanan", view: "Posterior (Belakang)", cx: 280, cy: 365 },
  { id: "achilles_l", name: "Tendo Achilles Kiri", view: "Posterior (Belakang)", cx: 320, cy: 365 },
];

export const BodyChart: React.FC<BodyChartProps> = ({
  selectedRegions,
  onToggleRegion,
  painLevel = 5,
}) => {
  const getSpotColor = (isSelected: boolean) => {
    if (!isSelected) return "fill-slate-700 stroke-slate-500 hover:fill-teal-400";
    if (painLevel >= 7) return "fill-rose-500 stroke-rose-300 animate-pulse";
    if (painLevel >= 4) return "fill-amber-500 stroke-amber-300";
    return "fill-teal-400 stroke-teal-200";
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Body Chart Interaktif (Titik Keluhan & Nyeri)
          </span>
        </div>
        <span className="text-[11px] text-slate-400">Klik titik anatomis untuk menandai</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SVG Diagram Canvas */}
        <div className="relative bg-slate-950/80 rounded-lg p-2 flex flex-col items-center border border-slate-800/60">
          <div className="flex justify-between w-full px-6 text-[10px] font-mono text-slate-400 mb-1">
            <span>ANTERIOR (Depan)</span>
            <span>POSTERIOR (Belakang)</span>
          </div>
          <svg
            viewBox="0 0 400 410"
            className="w-full h-72 max-w-sm select-none"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}
          >
            {/* ANTERIOR SILHOUETTE */}
            <g className="fill-slate-800/70 stroke-slate-700/80" strokeWidth="1.5">
              {/* Head */}
              <circle cx="100" cy="45" r="20" />
              {/* Neck */}
              <path d="M 94 65 L 94 78 L 106 78 L 106 65 Z" />
              {/* Torso */}
              <path d="M 70 85 L 130 85 L 122 195 L 78 195 Z" />
              {/* Arms */}
              <path d="M 70 85 L 42 155 L 26 215 L 34 220 L 52 160 L 76 100 Z" />
              <path d="M 130 85 L 158 155 L 174 215 L 166 220 L 148 160 L 124 100 Z" />
              {/* Legs */}
              <path d="M 80 195 L 75 285 L 74 380 L 88 380 L 92 285 L 97 195 Z" />
              <path d="M 120 195 L 125 285 L 126 380 L 112 380 L 108 285 L 103 195 Z" />
            </g>

            {/* POSTERIOR SILHOUETTE */}
            <g className="fill-slate-800/70 stroke-slate-700/80" strokeWidth="1.5">
              {/* Head */}
              <circle cx="300" cy="45" r="20" />
              {/* Neck */}
              <path d="M 294 65 L 294 78 L 306 78 L 306 65 Z" />
              {/* Torso */}
              <path d="M 270 85 L 330 85 L 322 195 L 278 195 Z" />
              {/* Spine Line */}
              <line x1="300" y1="78" x2="300" y2="195" stroke="rgba(255,255,255,0.15)" strokeDasharray="3,3" />
              {/* Arms */}
              <path d="M 270 85 L 242 155 L 226 215 L 234 220 L 252 160 L 276 100 Z" />
              <path d="M 330 85 L 358 155 L 374 215 L 366 220 L 348 160 L 324 100 Z" />
              {/* Legs */}
              <path d="M 280 195 L 275 285 L 274 380 L 288 380 L 292 285 L 297 195 Z" />
              <path d="M 320 195 L 325 285 L 326 380 L 312 380 L 308 285 L 303 195 Z" />
            </g>

            {/* INTERACTIVE CLICKABLE SPOTS */}
            {BODY_SPOTS.map((spot) => {
              const isSelected = selectedRegions.includes(spot.name);
              return (
                <g key={spot.id} className="cursor-pointer" onClick={() => onToggleRegion(spot.name)}>
                  <circle
                    cx={spot.cx}
                    cy={spot.cy}
                    r={isSelected ? 8 : 6}
                    className={`transition-all duration-200 stroke-2 ${getSpotColor(isSelected)}`}
                  />
                  {isSelected && (
                    <circle
                      cx={spot.cx}
                      cy={spot.cy}
                      r="12"
                      className="fill-none stroke-teal-400/50 animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Regions List & Indicators */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-2">
              Titik Terpilih ({selectedRegions.length}):
            </span>
            {selectedRegions.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-3 border border-dashed border-slate-800 rounded-lg">
                Belum ada titik anatomi yang ditandai. Klik titik pada ilustrasi tubuh di samping atau pilih cepat dari daftar.
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {selectedRegions.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => onToggleRegion(reg)}
                    className="inline-flex items-center gap-1 text-[11px] bg-teal-950/80 text-teal-300 border border-teal-800/80 px-2 py-1 rounded hover:bg-rose-950/70 hover:border-rose-800 hover:text-rose-300 transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    <span>{reg}</span>
                    <span className="text-slate-500 hover:text-rose-400 ml-0.5">x</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Pilihan Cepat Fisioterapi:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {[
                "Bahu Kanan",
                "Bahu Kiri",
                "Lumbal / Pinggang",
                "Lutut Kanan (Genu Dextra)",
                "Lutut Kiri (Genu Sinistra)",
                "Cervical / Leher Depan",
              ].map((name) => {
                const active = selectedRegions.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onToggleRegion(name)}
                    className={`px-2 py-1 text-left rounded border transition-colors ${
                      active
                        ? "bg-teal-900/60 border-teal-600 text-teal-200"
                        : "bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
