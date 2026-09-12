"use client";

import React from "react";
import {
  Users,
  Calendar,
  Activity,
  Sparkles,
  Receipt,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { Patient, TherapySession } from "../../types/physio";

interface MetricCardsProps {
  patients: Patient[];
  sessions: TherapySession[];
  onSelectTab: (tab: "overview" | "patients" | "soap" | "schedule" | "progress" | "reference") => void;
}

export function MetricCards({ patients, sessions, onSelectTab }: MetricCardsProps) {
  const getPatientStatus = (patientId: string): "ACTIVE" | "COMPLETED" => {
    const patientSessions = sessions.filter((s) => s.patientId === patientId);
    const maxSession = patientSessions.reduce((max, s) => Math.max(max, s.sessionNumber), 0);
    return maxSession >= 8 ? "COMPLETED" : "ACTIVE";
  };

  const activePatients = patients.filter((p) => getPatientStatus(p.id) === "ACTIVE").length;
  const completedPatients = patients.filter((p) => getPatientStatus(p.id) === "COMPLETED").length;
  const bpjsPatients = patients.filter((p) => p.insuranceType === "BPJS").length;

  const totalBilling = sessions.reduce((acc, s) => acc + (s.totalCost || 175000), 0);
  const syncedFhirCount = sessions.filter((s) => s.satuSehatSynced).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Pasien */}
      <div
        onClick={() => onSelectTab("patients")}
        className="cursor-pointer bg-[#0d1117] border border-slate-800 hover:border-teal-500/50 p-4 rounded-xl shadow-sm transition group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Total Pasien</span>
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-105 transition">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{patients.length}</span>
            <span className="text-[10px] font-mono text-emerald-400 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +12%
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Aktif: <strong className="text-slate-200">{activePatients}</strong></span>
            <span>Selesai: <strong className="text-slate-200">{completedPatients}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Sesi Terapi Berjalan */}
      <div
        onClick={() => onSelectTab("soap")}
        className="cursor-pointer bg-[#0d1117] border border-slate-800 hover:border-teal-500/50 p-4 rounded-xl shadow-sm transition group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Sesi Terapi</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{sessions.length}</span>
            <span className="text-[10px] font-mono text-slate-400">Total Sesi</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>SOAP Evaluasi: <strong className="text-slate-200">100%</strong></span>
          </div>
        </div>
      </div>

      {/* 3. BPJS Quota & Protection */}
      <div
        onClick={() => onSelectTab("schedule")}
        className="cursor-pointer bg-[#0d1117] border border-slate-800 hover:border-teal-500/50 p-4 rounded-xl shadow-sm transition group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Kuota BPJS (8 Sesi)</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">
              {bpjsPatients} <span className="text-xs text-slate-400 font-normal">Pasien</span>
            </span>
            <span className="text-[10px] font-mono text-amber-300 font-semibold">Guard Aktif</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: "87.5%" }} />
          </div>
        </div>
      </div>

      {/* 4. SatuSehat FHIR Sync */}
      <div
        className="bg-[#0d1117] border border-slate-800 p-4 rounded-xl shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">SatuSehat FHIR</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{syncedFhirCount}</span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> 100% Synced
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 font-mono truncate">
            Encounter &bull; Condition &bull; CarePlan
          </p>
        </div>
      </div>

      {/* 5. Billing & Kasir */}
      <div
        className="bg-[#0d1117] border border-slate-800 p-4 rounded-xl shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Estimasi Billing</span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-slate-400 font-mono">Rp</span>
            <span className="text-xl font-bold text-white font-mono">
              {(totalBilling / 1000).toLocaleString("id-ID")}k
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 font-mono">
            Tarif PMK &bull; BPJS &amp; Mandiri
          </p>
        </div>
      </div>
    </div>
  );
}
