"use client";

import React, { useState } from "react";
import { Compass, Plus, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { GoniometryRom, MuscleTest, EndFeel } from "../types/physio";

interface GoniometryTrackerProps {
  goniometry: GoniometryRom[];
  muscleTests: MuscleTest[];
  onChangeGoniometry: (records: GoniometryRom[]) => void;
  onChangeMmt: (records: MuscleTest[]) => void;
}

const COMMON_JOINTS = [
  { joint: "Shoulder (Bahu)", movement: "Fleksi", normal: 180 },
  { joint: "Shoulder (Bahu)", movement: "Ekstensi", normal: 60 },
  { joint: "Shoulder (Bahu)", movement: "Abduksi", normal: 180 },
  { joint: "Shoulder (Bahu)", movement: "Eksternal Rotasi", normal: 90 },
  { joint: "Shoulder (Bahu)", movement: "Internal Rotasi", normal: 70 },
  { joint: "Elbow (Siku)", movement: "Fleksi", normal: 145 },
  { joint: "Elbow (Siku)", movement: "Ekstensi", normal: 0 },
  { joint: "Wrist (Pergelangan Tangan)", movement: "Palmar Fleksi", normal: 80 },
  { joint: "Wrist (Pergelangan Tangan)", movement: "Dorsofleksi", normal: 70 },
  { joint: "Knee (Lutut)", movement: "Fleksi", normal: 135 },
  { joint: "Knee (Lutut)", movement: "Ekstensi", normal: 0 },
  { joint: "Hip (Panggul)", movement: "Fleksi", normal: 120 },
  { joint: "Hip (Panggul)", movement: "Ekstensi", normal: 30 },
  { joint: "Ankle (Pergelangan Kaki)", movement: "Dorsofleksi", normal: 20 },
  { joint: "Ankle (Pergelangan Kaki)", movement: "Plantarfleksi", normal: 50 },
  { joint: "Cervical (Leher)", movement: "Fleksi", normal: 45 },
  { joint: "Cervical (Leher)", movement: "Ekstensi", normal: 45 },
];

export const GoniometryTracker: React.FC<GoniometryTrackerProps> = ({
  goniometry,
  muscleTests,
  onChangeGoniometry,
  onChangeMmt,
}) => {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [selectedSide, setSelectedSide] = useState<"Dextra" | "Sinistra">("Dextra");

  const handleAddPreset = () => {
    const preset = COMMON_JOINTS[selectedPreset];
    const newRom: GoniometryRom = {
      id: `rom-${Date.now()}`,
      joint: `${preset.joint} ${selectedSide}`,
      movement: preset.movement,
      side: selectedSide,
      activeDegrees: Math.round(preset.normal * 0.75),
      passiveDegrees: Math.round(preset.normal * 0.85),
      normalDegrees: preset.normal,
      endFeel: "Firm (Normal)",
    };
    onChangeGoniometry([...goniometry, newRom]);
  };

  const handleRemoveRom = (id: string) => {
    onChangeGoniometry(goniometry.filter((r) => r.id !== id));
  };

  const handleUpdateRom = (id: string, updates: Partial<GoniometryRom>) => {
    onChangeGoniometry(
      goniometry.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const handleAddMmt = () => {
    const newMmt: MuscleTest = {
      id: `mmt-${Date.now()}`,
      muscleGroup: "Quadriceps / Ekstensor Genu",
      side: "Dextra",
      grade: 4,
    };
    onChangeMmt([...muscleTests, newMmt]);
  };

  const handleUpdateMmt = (id: string, grade: number) => {
    onChangeMmt(muscleTests.map((m) => (m.id === id ? { ...m, grade } : m)));
  };

  const handleRemoveMmt = (id: string) => {
    onChangeMmt(muscleTests.filter((m) => m.id !== id));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-6">
      {/* SECTION 1: GONIOMETRI (ROM) */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Pemeriksaan Goniometri (Range of Motion / ROM)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedSide}
              onChange={(e) => setSelectedSide(e.target.value as "Dextra" | "Sinistra")}
              className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded px-2 py-1"
            >
              <option value="Dextra">Dextra (Kanan)</option>
              <option value="Sinistra">Sinistra (Kiri)</option>
            </select>
            <select
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded px-2 py-1"
            >
              {COMMON_JOINTS.map((j, i) => (
                <option key={i} value={i}>
                  {j.joint} - {j.movement} ({j.normal}&deg;)
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddPreset}
              className="inline-flex items-center gap-1 bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-medium px-2.5 py-1 rounded transition-colors"
            >
              <Plus className="w-3 h-3" /> Tambah Sendi
            </button>
          </div>
        </div>

        {goniometry.length === 0 ? (
          <div className="text-xs text-slate-500 italic p-3 border border-dashed border-slate-800 rounded-lg text-center">
            Belum ada data pengukuran goniometri. Gunakan menu dropdown di atas untuk menambahkan sendi evaluasi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2 px-2">Sendi & Gerakan</th>
                  <th className="py-2 px-2">Sisi</th>
                  <th className="py-2 px-2 text-center">ROM Aktif</th>
                  <th className="py-2 px-2 text-center">ROM Pasif</th>
                  <th className="py-2 px-2 text-center">Normal</th>
                  <th className="py-2 px-2">Defisit</th>
                  <th className="py-2 px-2">End-Feel</th>
                  <th className="py-2 px-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {goniometry.map((r) => {
                  const deficit = Math.max(0, r.normalDegrees - r.activeDegrees);
                  const deficitPct = Math.round((deficit / r.normalDegrees) * 100);

                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="py-2 px-2 font-medium text-slate-200">
                        {r.joint} ({r.movement})
                      </td>
                      <td className="py-2 px-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                          {r.side}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          value={r.activeDegrees}
                          onChange={(e) => handleUpdateRom(r.id, { activeDegrees: Number(e.target.value) })}
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center font-mono text-teal-400 focus:outline-none focus:border-teal-500"
                        />
                        <span className="text-[10px] text-slate-500 ml-1">&deg;</span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          value={r.passiveDegrees}
                          onChange={(e) => handleUpdateRom(r.id, { passiveDegrees: Number(e.target.value) })}
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
                        />
                        <span className="text-[10px] text-slate-500 ml-1">&deg;</span>
                      </td>
                      <td className="py-2 px-2 text-center font-mono text-slate-400">
                        {r.normalDegrees}&deg;
                      </td>
                      <td className="py-2 px-2">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                            deficitPct > 30
                              ? "bg-rose-950/60 border-rose-800 text-rose-300"
                              : deficitPct > 10
                              ? "bg-amber-950/60 border-amber-800 text-amber-300"
                              : "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                          }`}
                        >
                          {deficit > 0 ? `-${deficit}° (${deficitPct}%)` : "Full"}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <select
                          value={r.endFeel}
                          onChange={(e) => handleUpdateRom(r.id, { endFeel: e.target.value as EndFeel })}
                          className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-slate-300"
                        >
                          <option value="Soft (Normal)">Soft (Normal)</option>
                          <option value="Firm (Normal)">Firm (Normal)</option>
                          <option value="Hard (Normal)">Hard (Normal)</option>
                          <option value="Empty (Nyeri/Spasme)">Empty (Nyeri/Spasme)</option>
                          <option value="Springy (Meniskus)">Springy (Meniskus)</option>
                        </select>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveRom(r.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 2: MANUAL MUSCLE TESTING (MMT) */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Manual Muscle Testing (MMT / Skala Kekuatan Otot 0-5)
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddMmt}
            className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium px-2 py-0.5 rounded transition-colors"
          >
            <Plus className="w-3 h-3" /> Tambah Otot
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {muscleTests.map((m) => (
            <div
              key={m.id}
              className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between"
            >
              <div>
                <input
                  type="text"
                  value={m.muscleGroup}
                  onChange={(e) =>
                    onChangeMmt(
                      muscleTests.map((item) =>
                        item.id === m.id ? { ...item, muscleGroup: e.target.value } : item
                      )
                    )
                  }
                  className="bg-transparent border-b border-dashed border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-teal-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Sisi: {m.side}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Nilai:</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleUpdateMmt(m.id, val)}
                      className={`w-6 h-6 rounded text-[11px] font-mono font-bold transition-colors ${
                        m.grade === val
                          ? "bg-teal-500 text-slate-950 shadow-sm"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMmt(m.id)}
                  className="text-slate-500 hover:text-rose-400 ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
