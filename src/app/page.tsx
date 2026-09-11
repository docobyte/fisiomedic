"use client";

import React, { useState } from "react";
import {
  Activity,
  Users,
  Calendar,
  ShieldCheck,
  Search,
  Plus,
  FileText,
  Printer,
  ChevronRight,
  Stethoscope,
  TrendingDown,
  Building2,
  CheckCircle,
  Clock,
  BookOpen,
  Sliders,
  Sparkles,
  ArrowRight,
  HeartPulse,
} from "lucide-react";
import { INITIAL_PATIENTS, INITIAL_SESSIONS, CLINICAL_REFERENCES } from "../data/mockPhysioData";
import { Patient, TherapySession } from "../types/physio";
import { BodyChart } from "../components/BodyChart";
import { VasPainScale } from "../components/VasPainScale";
import { GoniometryTracker } from "../components/GoniometryTracker";
import { SatuSehatFhirModal } from "../components/SatuSehatFhirModal";
import { PrintableResume } from "../components/PrintableResume";

export default function FisiomedicDashboard() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [sessions, setSessions] = useState<TherapySession[]>(INITIAL_SESSIONS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("pat-01");
  const [activeTab, setActiveTab] = useState<"patients" | "soap" | "progress" | "reference">("patients");
  const [searchQuery, setSearchQuery] = useState("");
  const [insuranceFilter, setInsuranceFilter] = useState<string>("ALL");

  // Modals state
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);

  // New patient form state
  const [newPatientForm, setNewPatientForm] = useState({
    fullName: "",
    nik: "",
    birthDate: "",
    gender: "M" as "M" | "F",
    phoneNumber: "",
    address: "",
    insuranceType: "BPJS" as "BPJS" | "UMUM" | "ASURANSI_SWASTA",
    bpjsCardNumber: "",
    referralSource: "",
  });

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const activeSession =
    sessions.find((s) => s.patientId === selectedPatientId) || sessions[0];

  // Handler for updating active session fields
  const handleUpdateSession = (updates: Partial<TherapySession>) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSession.id ? { ...s, ...updates } : s))
    );
  };

  // Filtered patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.recordNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nik.includes(searchQuery);
    const matchesInsurance = insuranceFilter === "ALL" || p.insuranceType === insuranceFilter;
    return matchesSearch && matchesInsurance;
  });

  // Handle register new patient
  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientForm.fullName || !newPatientForm.nik) return;

    const newId = `pat-${Date.now()}`;
    const newRecordNum = `RM-FT-2026-${String(patients.length + 1).padStart(4, "0")}`;

    const created: Patient = {
      id: newId,
      recordNumber: newRecordNum,
      nik: newPatientForm.nik,
      fullName: newPatientForm.fullName,
      birthDate: newPatientForm.birthDate || "1990-01-01",
      gender: newPatientForm.gender,
      phoneNumber: newPatientForm.phoneNumber || "08123456789",
      address: newPatientForm.address || "Kabupaten Trenggalek",
      insuranceType: newPatientForm.insuranceType,
      bpjsCardNumber: newPatientForm.bpjsCardNumber,
      referralSource: newPatientForm.referralSource || "Rujukan Mandiri",
      satuSehatId: `P-3503-${Math.floor(100000 + Math.random() * 900000)}`,
      registeredAt: new Date().toISOString().split("T")[0],
    };

    setPatients([created, ...patients]);
    setSelectedPatientId(newId);
    setShowNewPatientModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090d]">
      {/* 1. TOP HEADER / APP BAR */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shadow-inner">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  FISIOMEDIC
                  <span className="text-[10px] font-mono bg-teal-950/90 text-teal-300 border border-teal-800/80 px-2 py-0.5 rounded-full font-medium">
                    SIMRS &bull; RME Fisioterapi
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Sistem Informasi Manajemen Pelayanan Fisioterapi &bull; RSUD / Praktik Mandiri
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bridging Status Badges */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-[11px]">SatuSehat FHIR Aktif</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1 text-teal-300 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>BPJS VClaim Bridging</span>
              </div>
            </div>

            <button
              onClick={() => setShowNewPatientModal(true)}
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Pasien Baru
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-5">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Pasien Fisioterapi Aktif</span>
              <span className="text-2xl font-bold font-mono text-white mt-0.5 block">{patients.length}</span>
              <span className="text-[10px] text-teal-400 flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3 h-3" /> 100% Terdaftar RME
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-teal-950/60 border border-teal-800/60 flex items-center justify-center text-teal-400">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Sesi Terapi Berjalan</span>
              <span className="text-2xl font-bold font-mono text-white mt-0.5 block">18</span>
              <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" /> Kuota BPJS 8 Sesi / Siklus
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Rerata Reduksi Nyeri VAS</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-0.5 block">-54.2%</span>
              <span className="text-[10px] text-emerald-400/90 flex items-center gap-1 mt-0.5">
                <TrendingDown className="w-3 h-3" /> Evaluasi Sesi 1 ke Sesi 4
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Kepatuhan SatuSehat</span>
              <span className="text-2xl font-bold font-mono text-teal-300 mt-0.5 block">100%</span>
              <span className="text-[10px] text-teal-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" /> PMK 24/2022 Terverifikasi
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-teal-950/60 border border-teal-800/60 flex items-center justify-center text-teal-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-1 border-b border-slate-800/90 pb-1">
          <button
            onClick={() => setActiveTab("patients")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "patients"
                ? "bg-teal-950 text-teal-300 border border-teal-800"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Users className="w-4 h-4" /> Daftar Pasien & RME
          </button>
          <button
            onClick={() => setActiveTab("soap")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "soap"
                ? "bg-teal-950 text-teal-300 border border-teal-800"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Stethoscope className="w-4 h-4" /> Pemeriksaan Klinis & SOAP
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "progress"
                ? "bg-teal-950 text-teal-300 border border-teal-800"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Activity className="w-4 h-4" /> Evaluasi Sesi & Grafik Nyeri
          </button>
          <button
            onClick={() => setActiveTab("reference")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "reference"
                ? "bg-teal-950 text-teal-300 border border-teal-800"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Standar Klinis IFI & ICD-10
          </button>
        </div>

        {/* TAB 1: DAFTAR PASIEN & REKAM MEDIS */}
        {activeTab === "patients" && (
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama pasien, No RM, atau NIK..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-medium">Penjamin:</span>
                <select
                  value={insuranceFilter}
                  onChange={(e) => setInsuranceFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5"
                >
                  <option value="ALL">Semua Penjamin</option>
                  <option value="BPJS">BPJS Kesehatan</option>
                  <option value="UMUM">Pasien Umum</option>
                  <option value="ASURANSI_SWASTA">Asuransi Swasta</option>
                </select>
              </div>
            </div>

            {/* Patients List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPatients.map((pat) => {
                const isSelected = pat.id === selectedPatientId;
                const patSession = sessions.find((s) => s.patientId === pat.id) || sessions[0];

                return (
                  <div
                    key={pat.id}
                    onClick={() => setSelectedPatientId(pat.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 border-teal-500/80 shadow-lg ring-1 ring-teal-500/30"
                        : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-100">{pat.fullName}</h3>
                          <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {pat.gender === "M" ? "Laki-laki" : "Perempuan"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                          <span className="text-teal-400 font-semibold">{pat.recordNumber}</span>
                          <span>&bull;</span>
                          <span>NIK: {pat.nik}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          pat.insuranceType === "BPJS"
                            ? "bg-teal-950/80 border-teal-800 text-teal-300"
                            : "bg-cyan-950/80 border-cyan-800 text-cyan-300"
                        }`}
                      >
                        {pat.insuranceType}
                      </span>
                    </div>

                    {/* Clinical summary preview */}
                    <div className="mt-3 pt-3 border-t border-slate-800/70 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 text-[11px] block">Diagnosis Terakhir:</span>
                        <span className="font-medium text-slate-300 truncate block">
                          {patSession.diagnosis.physioDiagnosis}
                        </span>
                        <span className="text-[10px] font-mono text-teal-400">
                          ICD-10: {patSession.diagnosis.icd10Code}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 text-[11px] block">Kemajuan Terapi:</span>
                        <span className="text-xs font-mono font-bold text-white">
                          Sesi {patSession.sessionNumber} dari {patSession.totalSessionsTarget}
                        </span>
                        <div className="text-[11px] text-amber-400">
                          VAS Gerak: <strong>{patSession.pain.vasMotion}/10</strong>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons inside card */}
                    <div className="mt-3 pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientId(pat.id);
                          setShowFhirModal(true);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-teal-400 bg-teal-950/60 border border-teal-800/80 hover:bg-teal-900 px-2 py-1 rounded transition-colors"
                      >
                        <ShieldCheck className="w-3 h-3" /> SatuSehat FHIR
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientId(pat.id);
                          setShowPrintModal(true);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded transition-colors"
                      >
                        <Printer className="w-3 h-3" /> Resume Medis
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientId(pat.id);
                          setActiveTab("soap");
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-white bg-teal-600 hover:bg-teal-500 px-2.5 py-1 rounded font-medium transition-colors"
                      >
                        Periksa SOAP <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PEMERIKSAAN KLINIS & SOAP FORM */}
        {activeTab === "soap" && (
          <div className="space-y-5">
            {/* Active Patient Bar */}
            <div className="bg-slate-900 border border-teal-500/40 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-950 border border-teal-700 flex items-center justify-center text-teal-300 font-bold font-mono">
                  {selectedPatient.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white">{selectedPatient.fullName}</h2>
                    <span className="text-xs font-mono text-teal-400">({selectedPatient.recordNumber})</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      {selectedPatient.gender === "M" ? "Laki-laki" : "Perempuan"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Faskes Perujuk: {selectedPatient.referralSource || "Mandiri"} &bull; Penjamin:{" "}
                    <strong className="text-slate-200">{selectedPatient.insuranceType}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFhirModal(true)}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-800/80 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-400" /> SatuSehat FHIR
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                >
                  <Printer className="w-4 h-4" /> Cetak Lembar SOAP
                </button>
              </div>
            </div>

            {/* SOAP Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* LEFT COLUMN: S (Subjective) & Body Chart */}
              <div className="space-y-5">
                {/* Visual Analog Scale */}
                <VasPainScale
                  pain={activeSession.pain}
                  onChange={(updated) =>
                    handleUpdateSession({
                      pain: { ...activeSession.pain, ...updated },
                    })
                  }
                />

                {/* Interactive Body Chart */}
                <BodyChart
                  selectedRegions={activeSession.bodyRegions}
                  onToggleRegion={(reg) => {
                    const current = activeSession.bodyRegions;
                    const next = current.includes(reg)
                      ? current.filter((r) => r !== reg)
                      : [...current, reg];
                    handleUpdateSession({ bodyRegions: next });
                  }}
                  painLevel={activeSession.pain.vasMotion}
                />
              </div>

              {/* RIGHT COLUMN: O (Objective), A (Assessment) & P (Plan) */}
              <div className="space-y-5">
                {/* Goniometri & MMT */}
                <GoniometryTracker
                  goniometry={activeSession.goniometry}
                  muscleTests={activeSession.muscleTests}
                  onChangeGoniometry={(goniometry) => handleUpdateSession({ goniometry })}
                  onChangeMmt={(muscleTests) => handleUpdateSession({ muscleTests })}
                />

                {/* Clinical Diagnosis (A) & ICD-10 */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Diagnosis Fisioterapi (A) & Koding ICD-10
                    </span>
                    <span className="text-[11px] font-mono text-teal-400">
                      ICD-10: {activeSession.diagnosis.icd10Code}
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Diagnosis Fisioterapi (Permenkes 65/2015 & IFI):
                    </label>
                    <input
                      type="text"
                      value={activeSession.diagnosis.physioDiagnosis}
                      onChange={(e) =>
                        handleUpdateSession({
                          diagnosis: { ...activeSession.diagnosis, physioDiagnosis: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 block mb-1">Kode ICD-10:</label>
                      <input
                        type="text"
                        value={activeSession.diagnosis.icd10Code}
                        onChange={(e) =>
                          handleUpdateSession({
                            diagnosis: { ...activeSession.diagnosis, icd10Code: e.target.value },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-teal-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 block mb-1">Deskripsi ICD-10:</label>
                      <input
                        type="text"
                        value={activeSession.diagnosis.icd10Description}
                        onChange={(e) =>
                          handleUpdateSession({
                            diagnosis: { ...activeSession.diagnosis, icd10Description: e.target.value },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Plan / Intervensi (P) */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-medium text-slate-300 block mb-1.5">
                      Modalitas Terapi Diberikan (ICD-9-CM):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeSession.intervention.modalities.map((mod) => (
                        <span
                          key={mod.id}
                          className="bg-slate-950 border border-teal-800/70 text-teal-300 px-2 py-1 rounded text-[11px] font-mono"
                        >
                          {mod.type} &bull; {mod.durationMinutes} mnt ({mod.targetArea})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Program Latihan Mandiri di Rumah (Home Program):
                    </label>
                    <textarea
                      rows={2}
                      value={activeSession.intervention.homeProgram}
                      onChange={(e) =>
                        handleUpdateSession({
                          intervention: { ...activeSession.intervention, homeProgram: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EVALUASI PROGRES & GRAFIK NYERI */}
        {activeTab === "progress" && (
          <div className="space-y-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Serial Evaluasi Nyeri VAS & Target Fisioterapi (Sesi 1 s/d Sesi 8)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Memantau respons terapi klinis untuk validasi medis dan klaim BPJS Kesehatan
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-semibold text-teal-400">
                    {selectedPatient.fullName}
                  </span>
                  <span className="text-[10px] text-slate-500 block">{selectedPatient.recordNumber}</span>
                </div>
              </div>

              {/* Progress Visual Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { sessionNum: 1, date: "15 Agu 2026", vasMotion: 8, status: "Akut / Nyeri Berat" },
                  { sessionNum: 2, date: "22 Agu 2026", vasMotion: 6, status: "Nyeri Sedang" },
                  { sessionNum: 3, date: "01 Sep 2026", vasMotion: 5, status: "Subakut" },
                  { sessionNum: 4, date: "10 Sep 2026", vasMotion: 4, status: "Fase Thawing (Aktif)" },
                ].map((item) => (
                  <div
                    key={item.sessionNum}
                    className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-bold text-slate-200">Sesi {item.sessionNum}</span>
                      <span className="text-[10px] font-mono">{item.date}</span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold font-mono text-teal-400">{item.vasMotion}</span>
                      <span className="text-xs text-slate-500">/ 10 VAS</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">{item.status}</span>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-teal-500 h-full rounded-full"
                        style={{ width: `${(item.vasMotion / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Functional Goals checklist */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Target Fungsional Jangka Pendek & Panjang (ICF Framework)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />
                    <div>
                      <strong>Target Sesi 1-4:</strong> Mengurangi spasme otot m. trapezius dan m. deltoideus; VAS gerak turun ke &le; 4.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />
                    <div>
                      <strong>Target Sesi 4-6:</strong> Peningkatan ROM aktif fleksi bahu mencapai 160 derajat dan rotasi eksternal mencapai 70 derajat.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400 mt-0.5" />
                    <div>
                      <strong>Target Sesi 7-8 (Terminasi):</strong> Pasien mandiri dalam ADL (Activities of Daily Living) tanpa rasa sakit mengganjal.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STANDAR KLINIS IFI & ICD-10 */}
        {activeTab === "reference" && (
          <div className="space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-white">
                  Katalog Diagnosis Fisioterapi Indonesia & Panduan Koding ICD-10 / ICD-9-CM
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Standar Ikatan Fisioterapi Indonesia (IFI) dan bridging rujukan BPJS FKRTL
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CLINICAL_REFERENCES.map((ref) => (
                  <div
                    key={ref.icd10Code}
                    className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold font-mono text-teal-400">{ref.icd10Code}</span>
                        <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {ref.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-100">{ref.name}</h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/70 text-[11px] text-slate-400 space-y-1">
                      <div>
                        <span className="text-slate-500 font-mono">ICD-9-CM: </span>
                        <span className="font-mono text-teal-300">{ref.typicalIcd9.join(", ")}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Modalitas Unggulan: </span>
                        <span className="text-slate-300">{ref.recommendedModalities.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. MODALS */}
      {/* SatuSehat FHIR Modal */}
      <SatuSehatFhirModal
        isOpen={showFhirModal}
        onClose={() => setShowFhirModal(false)}
        patient={selectedPatient}
        session={activeSession}
      />

      {/* Printable Medical Summary */}
      {showPrintModal && (
        <PrintableResume
          patient={selectedPatient}
          session={activeSession}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* Register New Patient Modal */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-3">Registrasi Pasien Fisioterapi Baru</h3>
            <form onSubmit={handleCreatePatient} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Lengkap Pasien *</label>
                <input
                  type="text"
                  required
                  value={newPatientForm.fullName}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, fullName: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">NIK (16 Digit) *</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={newPatientForm.nik}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, nik: e.target.value })}
                    placeholder="3503..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={newPatientForm.birthDate}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, birthDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Penjamin</label>
                  <select
                    value={newPatientForm.insuranceType}
                    onChange={(e) =>
                      setNewPatientForm({
                        ...newPatientForm,
                        insuranceType: e.target.value as "BPJS" | "UMUM" | "ASURANSI_SWASTA",
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="BPJS">BPJS Kesehatan</option>
                    <option value="UMUM">Pasien Umum</option>
                    <option value="ASURANSI_SWASTA">Asuransi Swasta</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">No. Kartu BPJS (Jika Ada)</label>
                  <input
                    type="text"
                    value={newPatientForm.bpjsCardNumber}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, bpjsCardNumber: e.target.value })}
                    placeholder="000..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Faskes / Dokter Perujuk</label>
                <input
                  type="text"
                  value={newPatientForm.referralSource}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, referralSource: e.target.value })}
                  placeholder="Contoh: Poli Saraf / Puskesmas Rejowinangun"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg shadow"
                >
                  Simpan Pasien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-900 py-3 text-center text-[11px] text-slate-500">
        FISIOMEDIC &bull; Sistem Informasi Manajemen Praktik &amp; Klinik Fisioterapi Indonesia &bull; DocoByte Ecosystem
      </footer>
    </div>
  );
}
