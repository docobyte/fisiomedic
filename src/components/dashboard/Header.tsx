"use client";

import React from "react";
import {
  Menu,
  Search,
  ShieldCheck,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Bell,
  Stethoscope,
  Sparkles
} from "lucide-react";

interface HeaderProps {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onToggleMobileMenu: () => void;
  onNewPatient: () => void;
  onExportDatabase: () => void;
  onImportClick: () => void;
  onResetData: () => void;
}

export function Header({
  activeTab,
  searchQuery,
  setSearchQuery,
  onToggleMobileMenu,
  onNewPatient,
  onExportDatabase,
  onImportClick,
  onResetData
}: HeaderProps) {
  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "overview":
        return "Executive Overview";
      case "patients":
        return "Daftar Pasien & Rekam Medis";
      case "soap":
        return "Pencatatan SOAP & Asesmen Fisio";
      case "schedule":
        return "Jadwal Terapi & Kuota BPJS";
      case "progress":
        return "Evaluasi ROM & VAS Pain Scale";
      case "reference":
        return "Standar ICD-10 & Kamus Klinis IFI";
      default:
        return "Dashboard Pelayanan";
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0d1117]/90 backdrop-blur border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">FISIOMEDIC</span>
          <span className="text-slate-600">/</span>
          <span className="text-teal-300 font-medium">{getTabLabel(activeTab)}</span>
        </div>
      </div>

      {/* Center: Quick Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pasien / NIK / No. RM (⌘K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
          />
        </div>
      </div>

      {/* Right: Status Badges & Quick Action Triggers */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Compliance Badges */}
        <div className="hidden xl:flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SatuSehat FHIR</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-teal-300">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>BPJS VClaim</span>
          </div>
        </div>

        {/* Database Export/Import Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onExportDatabase}
            title="Ekspor database JSON"
            className="p-1.5 text-slate-400 hover:text-teal-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onImportClick}
            title="Impor database JSON"
            className="p-1.5 text-slate-400 hover:text-teal-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onResetData}
            title="Reset data ke simulasi awal"
            className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* New Patient Button */}
        <button
          type="button"
          onClick={onNewPatient}
          className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Pasien Baru</span>
        </button>
      </div>
    </header>
  );
}
