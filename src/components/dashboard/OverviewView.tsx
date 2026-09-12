"use client";

import React from "react";
import {
  Users,
  Activity,
  Calendar,
  Sparkles,
  ShieldCheck,
  FileText,
  Printer,
  Receipt,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  ChevronRight
} from "lucide-react";
import { Patient, TherapySession } from "../../types/physio";
import { SOAP_FAST_TEMPLATES } from "../../data/soapTemplates";

interface OverviewViewProps {
  patients: Patient[];
  sessions: TherapySession[];
  onSelectPatient: (id: string) => void;
  onGoToSoap: (patientId?: string) => void;
  onGoToSchedule: () => void;
  onApplyTemplate: (templateId: string) => void;
  onOpenFhir: () => void;
  onOpenBilling: () => void;
  onOpenPrint: () => void;
}

export function OverviewView({
  patients,
  sessions,
  onSelectPatient,
  onGoToSoap,
  onGoToSchedule,
  onApplyTemplate,
  onOpenFhir,
  onOpenBilling,
  onOpenPrint,
}: OverviewViewProps) {
  const getPatientSessions = (patId: string) => sessions.filter((s) => s.patientId === patId);
  const getLatestSession = (patId: string) => {
    const pSessions = getPatientSessions(patId);
    return pSessions.sort((a, b) => b.sessionNumber - a.sessionNumber)[0];
  };

  // Identify patients approaching or reaching 8 sessions
  const bpjsQuotaAlerts = patients
    .map((pat) => {
      const pSessions = getPatientSessions(pat.id);
      const current = pSessions.reduce((max, s) => Math.max(max, s.sessionNumber), 0);
      return { patient: pat, currentSession: current, maxSessions: 8 };
    })
    .filter((item) => item.patient.insuranceType === "BPJS" && item.currentSession >= 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-[#0d1117] border border-teal-800/40 p-5 sm:p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>PMK 65/2015 &bull; PMK 24/2022 &bull; SatuSehat FHIR R4 Ready</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Portal SIMRS &bull; RME Fisioterapi Indonesia
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Manajemen rekam medis elektronik fisioterapi terintegrasi SOAP, body chart interaktif, tracking goniometri ROM, dan pengawasan kuota 8 sesi klaim BPJS Kesehatan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onGoToSoap()}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow transition"
            >
              <FileText className="w-4 h-4" />
              <span>Buka Form SOAP</span>
            </button>
            <button
              type="button"
              onClick={onOpenFhir}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-800 text-xs font-medium px-3.5 py-2.5 rounded-lg transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>SatuSehat Bundle</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Recent Patients & Diagnosis Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recent Patients Table Card */}
          <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-400" />
                  <span>Pasien Terdaftar Terbaru</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Daftar pasien aktif dalam siklus rehabilitasi medik</p>
              </div>
              <button
                type="button"
                onClick={() => onGoToSoap()}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 font-mono transition"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2.5 font-medium">Pasien</th>
                    <th className="pb-2.5 font-medium">No. RM / NIK</th>
                    <th className="pb-2.5 font-medium">Penjamin</th>
                    <th className="pb-2.5 font-medium">Sesi</th>
                    <th className="pb-2.5 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {patients.slice(0, 5).map((pat) => {
                    const latest = getLatestSession(pat.id);
                    const currentSes = latest?.sessionNumber || 1;
                    return (
                      <tr key={pat.id} className="hover:bg-slate-900/50 transition">
                        <td className="py-3 font-sans">
                          <p className="font-semibold text-white truncate max-w-[140px]">{pat.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{pat.gender === "M" ? "Laki-laki" : "Perempuan"}</p>
                        </td>
                        <td className="py-3 text-slate-300 text-[11px]">
                          <p className="text-teal-300 font-medium">{pat.recordNumber}</p>
                          <p className="text-[10px] text-slate-400">{pat.nik.slice(0, 8)}****</p>
                        </td>
                        <td className="py-3">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded border ${
                              pat.insuranceType === "BPJS"
                                ? "bg-teal-500/10 text-teal-300 border-teal-500/30 font-semibold"
                                : pat.insuranceType === "UMUM"
                                ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                                : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                            }`}
                          >
                            {pat.insuranceType}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{currentSes}</span>
                            <span className="text-slate-400 text-[10px]">/ 8</span>
                            {currentSes >= 8 && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Selesai siklus" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                onSelectPatient(pat.id);
                                onGoToSoap(pat.id);
                              }}
                              className="px-2 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded text-[10px] font-medium transition"
                            >
                              SOAP
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onSelectPatient(pat.id);
                                onOpenPrint();
                              }}
                              className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded transition"
                              title="Cetak Resume"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Clinical SOAP Templates Picker */}
          <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Fast-Templates SOAP Standar IFI</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">1-Klik Terapkan</span>
            </div>
            <p className="text-xs text-slate-400">
              Pilih template klinis yang sering digunakan untuk mengisi otomatis asesmen, goniometri, dan intervensi modalitas:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {SOAP_FAST_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => onApplyTemplate(tmpl.id)}
                  className="p-3 bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 rounded-lg cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-teal-300 font-mono group-hover:text-teal-200">
                      {tmpl.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {tmpl.icd10Code}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{tmpl.icd10Description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): BPJS 8-Session Quota Guard & SatuSehat Sync */}
        <div className="lg:col-span-5 space-y-6">
          {/* BPJS 8-Session Quota Radar */}
          <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Radar Kuota 8 Sesi BPJS</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                Anti-Dispute
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pasien BPJS dengan siklus terapi mendekati batas maksimal (8 sesi per rujukan FKRTL) memerlukan evaluasi ulang dokter Sp.KFR:
            </p>

            <div className="space-y-3">
              {bpjsQuotaAlerts.length > 0 ? (
                bpjsQuotaAlerts.map(({ patient, currentSession, maxSessions }) => {
                  const percent = Math.min(100, Math.round((currentSession / maxSessions) * 100));
                  const isLimit = currentSession >= 8;
                  return (
                    <div
                      key={patient.id}
                      className={`p-3 rounded-lg border text-xs space-y-2 ${
                        isLimit
                          ? "bg-rose-950/30 border-rose-800/80 text-rose-200"
                          : "bg-slate-900/80 border-slate-800 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white font-sans truncate">{patient.fullName}</span>
                        <span className="font-mono text-[11px] font-semibold">
                          Sesi {currentSession} / {maxSessions} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isLimit ? "bg-rose-500" : "bg-amber-400"}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      {isLimit && (
                        <div className="flex items-center gap-1.5 text-[10px] text-rose-300 font-mono">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>Batas kuota tercapai. Wajib rujukan baru untuk klaim lanjut!</span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
                  Semua pasien BPJS berada dalam batas kuota aman (&lt; 5 sesi).
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onGoToSchedule}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-medium font-mono flex items-center justify-center gap-1.5 transition"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Kelola Jadwal & Kuota Lengkap</span>
            </button>
          </div>

          {/* SatuSehat FHIR Bridging Card */}
          <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Integrasi SatuSehat Kemenkes</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Transaksi rekam medis elektronik fisioterapi dikonversi ke FHIR R4 Bundle standar Kemenkes RI (Encounter, Condition, ClinicalImpression, CarePlan):
            </p>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11px] space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Kemenkes IHS Faskes:</span>
                <span className="text-teal-300 font-semibold">100028491</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Protokol:</span>
                <span className="text-slate-200">HL7 FHIR R4 JSON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Validasi:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Valid Transaction
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenFhir}
              className="w-full py-2 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/80 rounded-lg text-xs font-semibold font-mono flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspeksi Bundle FHIR Pasien Aktif</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
