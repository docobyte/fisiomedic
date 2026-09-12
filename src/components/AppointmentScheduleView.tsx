"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Search,
  Printer,
  FileText,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { AppointmentItem } from "../types/physio";
import { calculateBpjsQuota, formatIndonesianDate } from "../utils/scheduleHelper";

interface AppointmentScheduleViewProps {
  appointments: AppointmentItem[];
  onSelectPatient: (patientId: string) => void;
  onOpenResume?: (patientId: string) => void;
}

export const AppointmentScheduleView: React.FC<AppointmentScheduleViewProps> = ({
  appointments,
  onSelectPatient,
  onOpenResume,
}) => {
  const [filterInsurance, setFilterInsurance] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = appointments.filter((apt) => {
    const matchesInsurance = filterInsurance === "ALL" || apt.insuranceType === filterInsurance;
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.recordNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.therapistName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesInsurance && matchesSearch;
  });

  const totalBpjs = appointments.filter((a) => a.insuranceType === "BPJS").length;
  const totalUmum = appointments.filter((a) => a.insuranceType !== "BPJS").length;
  const warningQuotaCount = appointments.filter(
    (a) => a.insuranceType === "BPJS" && (a.sessionNumber >= a.totalQuota || a.totalQuota - a.sessionNumber <= 2)
  ).length;

  return (
    <div className="space-y-5">
      {/* 1. TOP SUMMARY METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Sesi Terjadwal Minggu Ini</span>
            <span className="text-2xl font-bold font-mono text-white mt-0.5 block">{appointments.length}</span>
            <span className="text-[10px] text-teal-400 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" /> Periode 14 - 19 Sep 2026
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-teal-950/60 border border-teal-800/60 flex items-center justify-center text-teal-400">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Pasien BPJS Kesehatan</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-0.5 block">{totalBpjs}</span>
            <span className="text-[10px] text-emerald-400/90 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" /> Rujukan FKRTL Bridging
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Pasien Umum / Mandiri</span>
            <span className="text-2xl font-bold font-mono text-cyan-400 mt-0.5 block">{totalUmum}</span>
            <span className="text-[10px] text-cyan-400/90 flex items-center gap-1 mt-0.5">
              <User className="w-3 h-3" /> Tarif Klinik Reguler
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <User className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Monitoring Kuota BPJS</span>
            <span className="text-2xl font-bold font-mono text-amber-400 mt-0.5 block">{warningQuotaCount}</span>
            <span className="text-[10px] text-amber-400/90 flex items-center gap-1 mt-0.5">
              <AlertTriangle className="w-3 h-3" /> Mendekati / Habis Kuota (8 Sesi)
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari pasien, No RM, atau fisioterapis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Penjamin:</span>
          <select
            value={filterInsurance}
            onChange={(e) => setFilterInsurance(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">Semua Penjamin</option>
            <option value="BPJS">BPJS Kesehatan Saja</option>
            <option value="UMUM">Pasien Umum</option>
          </select>
        </div>
      </div>

      {/* 3. APPOINTMENT CARDS LIST */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
          Tidak ada jadwal kontrol terapi yang cocok dengan filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt) => {
            const quota = calculateBpjsQuota(apt.sessionNumber, apt.totalQuota);

            return (
              <div
                key={apt.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                {/* Left: Date, Time & Patient Identity */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-teal-950/70 border border-teal-800/80 flex flex-col items-center justify-center text-teal-300 shrink-0">
                    <Calendar className="w-4 h-4 mb-0.5 text-teal-400" />
                    <span className="text-[10px] font-mono font-bold leading-none">
                      {apt.scheduledDate.split("-")[2]}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{apt.patientName}</h4>
                      <span className="text-xs font-mono text-teal-400 font-medium">{apt.recordNumber}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                          apt.insuranceType === "BPJS"
                            ? "bg-teal-950/80 border-teal-800 text-teal-300"
                            : "bg-cyan-950/80 border-cyan-800 text-cyan-300"
                        }`}
                      >
                        {apt.insuranceType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{formatIndonesianDate(apt.scheduledDate)}</span>
                      <span>&bull;</span>
                      <span className="text-teal-300 font-mono font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-teal-400" /> {apt.scheduledTime}
                      </span>
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Kasus: <strong className="text-slate-200">{apt.diagnosisSnippet}</strong> &bull; Ruang:{" "}
                      <span className="text-slate-300">{apt.room}</span> &bull; Fisioterapis:{" "}
                      <span className="text-teal-400 font-medium">{apt.therapistName}</span>
                    </p>
                  </div>
                </div>

                {/* Right: BPJS Quota Status & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                  {/* Quota Bar */}
                  <div className="w-full sm:w-52 bg-slate-950/80 border border-slate-800 rounded-lg p-2.5">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Kuota Terapi:</span>
                      <span className="font-mono font-bold text-slate-200">
                        Sesi {apt.sessionNumber}/{apt.totalQuota}
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all ${
                          quota.isExhausted ? "bg-rose-500" : quota.isWarning ? "bg-amber-400" : "bg-teal-500"
                        }`}
                        style={{ width: `${quota.percent}%` }}
                      />
                    </div>

                    <span className={`text-[10px] px-1.5 py-0.5 rounded border block text-center font-medium ${quota.colorClass}`}>
                      {quota.statusLabel}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {onOpenResume && (
                      <button
                        type="button"
                        onClick={() => onOpenResume(apt.patientId)}
                        className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg transition-colors border border-slate-700"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Resume</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectPatient(apt.patientId)}
                      className="inline-flex items-center gap-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Buka SOAP</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
