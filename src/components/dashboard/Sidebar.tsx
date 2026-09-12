"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Activity,
  BookOpen,
  Sparkles,
  Receipt,
  Printer,
  Database,
  Stethoscope,
  ShieldCheck,
  ChevronRight,
  X,
  Plus
} from "lucide-react";

interface SidebarProps {
  activeTab: "overview" | "patients" | "soap" | "schedule" | "progress" | "reference";
  setActiveTab: (tab: "overview" | "patients" | "soap" | "schedule" | "progress" | "reference") => void;
  patientCount: number;
  activeSessionsCount: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onNewPatient: () => void;
  onOpenFhir: () => void;
  onOpenBilling: () => void;
  onOpenPrint: () => void;
  onExportDb: () => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  patientCount,
  activeSessionsCount,
  isOpenMobile,
  setIsOpenMobile,
  onNewPatient,
  onOpenFhir,
  onOpenBilling,
  onOpenPrint,
  onExportDb
}: SidebarProps) {
  const navItems = [
    {
      group: "PELAYANAN KLINIS",
      items: [
        {
          id: "overview" as const,
          label: "Dashboard Overview",
          icon: LayoutDashboard,
          badge: "Live",
          badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20"
        },
        {
          id: "patients" as const,
          label: "Daftar Pasien & EMR",
          icon: Users,
          badge: String(patientCount),
          badgeColor: "bg-slate-800 text-slate-300 border-slate-700"
        },
        {
          id: "soap" as const,
          label: "Rekam Medis SOAP",
          icon: FileText,
          badge: "ICD-10",
          badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        },
        {
          id: "schedule" as const,
          label: "Jadwal & Kuota BPJS",
          icon: Calendar,
          badge: "8 Sesi",
          badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
        },
        {
          id: "progress" as const,
          label: "Evaluasi ROM & Nyeri",
          icon: Activity,
          badge: "VAS",
          badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
        },
        {
          id: "reference" as const,
          label: "Standar Referensi IFI",
          icon: BookOpen,
          badge: "PMK 65",
          badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20"
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0d1117] border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shadow-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white font-mono">FISIOMEDIC</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/80 font-semibold">
                  RME
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[150px]">Klinik Fisioterapi Sejahtera</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Patient Button in Sidebar */}
        <div className="p-4 border-b border-slate-800/60">
          <button
            type="button"
            onClick={() => {
              onNewPatient();
              setIsOpenMobile(false);
            }}
            className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrasi Pasien Baru</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navItems.map((sec) => (
            <div key={sec.group} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                {sec.group}
              </p>
              <div className="space-y-0.5 pt-1">
                {sec.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpenMobile(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 font-semibold"
                          : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent className={`w-4 h-4 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Tools & Modals Navigation Group */}
          <div className="space-y-1 pt-2 border-t border-slate-800/60">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              AKSI CEPAT & TOOLS
            </p>
            <div className="space-y-0.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onOpenFhir();
                  setIsOpenMobile(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>SatuSehat FHIR Bundle</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  R4
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenBilling();
                  setIsOpenMobile(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition"
              >
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-4 h-4 text-teal-400" />
                  <span>Billing & Kasir Klinik</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenPrint();
                  setIsOpenMobile(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition"
              >
                <div className="flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-blue-400" />
                  <span>Cetak Resume Medis A4</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onExportDb();
                  setIsOpenMobile(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition"
              >
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>Backup Database JSON</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Profile & Bridging Status */}
        <div className="p-3 border-t border-slate-800 bg-[#0a0d12]">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 font-bold font-mono text-xs flex items-center justify-center border border-teal-500/30">
              AF
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Ahmad Fauzi, S.Tr.Ft</p>
              <p className="text-[10px] text-slate-400 truncate">SIPF.35.03.2024.0042</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="SatuSehat Connected" />
          </div>
        </div>
      </aside>
    </>
  );
}
