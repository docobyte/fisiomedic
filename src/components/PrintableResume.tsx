"use client";

import React from "react";
import { Printer, X } from "lucide-react";
import { Patient, TherapySession } from "../types/physio";

interface PrintableResumeProps {
  patient: Patient;
  session: TherapySession;
  onClose: () => void;
}

export const PrintableResume: React.FC<PrintableResumeProps> = ({
  patient,
  session,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl w-full max-w-4xl shadow-2xl p-8 my-8 relative">
        {/* Floating action bar (Hidden during print) */}
        <div className="no-print absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" /> Cetak Dokumen / PDF
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CLINICAL HEADER (KOP KLINIK) */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
            KLINIK & PRAKTIK MANDIRI FISIOTERAPI FISIOMEDIC
          </h2>
          <p className="text-xs text-slate-600">
            Pelayanan Fisioterapi Komprehensif: Muskuloskeletal, Neurologi, Pediatri & Sport Injury
          </p>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Izin Operasional Dinkes: 440/082/SIPF/2024 &bull; Terhubung Platform SatuSehat Kemenkes RI
          </p>
          <div className="mt-3 inline-block bg-slate-100 border border-slate-300 px-4 py-1 rounded text-xs font-bold uppercase tracking-widest text-slate-800">
            RESUME PELAYANAN & EVALUASI FISIOTERAPI
          </div>
        </div>

        {/* IDENTITAS PASIEN */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs border border-slate-200 rounded-lg p-3.5 mb-5 bg-slate-50/50">
          <div>
            <span className="text-slate-500 inline-block w-28">No. Rekam Medis:</span>
            <span className="font-mono font-bold text-slate-900">{patient.recordNumber}</span>
          </div>
          <div>
            <span className="text-slate-500 inline-block w-28">NIK (KTP):</span>
            <span className="font-mono text-slate-800">{patient.nik}</span>
          </div>
          <div>
            <span className="text-slate-500 inline-block w-28">Nama Pasien:</span>
            <span className="font-bold text-slate-900">{patient.fullName}</span>
          </div>
          <div>
            <span className="text-slate-500 inline-block w-28">Jenis Kelamin / Usia:</span>
            <span>
              {patient.gender === "M" ? "Laki-laki" : "Perempuan"} (Lahir: {patient.birthDate})
            </span>
          </div>
          <div>
            <span className="text-slate-500 inline-block w-28">Penjamin:</span>
            <span className="font-semibold text-slate-800">
              {patient.insuranceType} {patient.bpjsCardNumber ? `(${patient.bpjsCardNumber})` : ""}
            </span>
          </div>
          <div>
            <span className="text-slate-500 inline-block w-28">Faskes Perujuk:</span>
            <span className="text-slate-700">{patient.referralSource || "Rujukan Mandiri"}</span>
          </div>
        </div>

        {/* 1. PEMERIKSAAN SUBJEKTIF (S) */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2.5 py-1 rounded border-l-4 border-teal-600 mb-2">
            1. Anamnesis & Keluhan (Subjective)
          </h4>
          <div className="text-xs text-slate-700 space-y-1 pl-2">
            <p>
              <strong className="text-slate-900">Keluhan Utama & Area:</strong> {session.pain.primaryPainRegion}
            </p>
            <p>
              <strong className="text-slate-900">Sifat / Karakter Nyeri:</strong>{" "}
              {session.pain.painCharacteristics.join(", ") || "Nyeri tumpul & kaku"}
            </p>
            <p>
              <strong className="text-slate-900">Faktor Memperberat / Memperingan:</strong>{" "}
              {session.pain.aggravatingFactors || "-"} / {session.pain.relievingFactors || "-"}
            </p>
            <div className="flex gap-6 mt-1 pt-1 font-mono text-[11px]">
              <span>VAS Nyeri Diam: <strong>{session.pain.vasRest}/10</strong></span>
              <span>VAS Nyeri Gerak: <strong>{session.pain.vasMotion}/10</strong></span>
              <span>VAS Nyeri Tekan: <strong>{session.pain.vasPressure}/10</strong></span>
            </div>
          </div>
        </div>

        {/* 2. PEMERIKSAAN OBJEKTIF (O) */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2.5 py-1 rounded border-l-4 border-teal-600 mb-2">
            2. Pemeriksaan Fisik & Pengukuran Fungsi (Objective)
          </h4>
          <div className="text-xs text-slate-700 space-y-2 pl-2">
            <div className="flex gap-6 text-[11px] font-mono text-slate-600">
              <span>TD: {session.vitalSigns.bloodPressure}</span>
              <span>HR: {session.vitalSigns.heartRate} x/mnt</span>
              <span>RR: {session.vitalSigns.respiratoryRate} x/mnt</span>
              <span>Suhu: {session.vitalSigns.temperature} &deg;C</span>
            </div>

            {/* ROM Table */}
            {session.goniometry.length > 0 && (
              <div>
                <span className="font-semibold text-slate-900 block mb-1 text-[11px]">
                  Hasil Pengukuran Lingkup Gerak Sendi (Goniometri):
                </span>
                <table className="w-full text-[11px] border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="p-1 border border-slate-300 text-left">Sendi & Gerakan</th>
                      <th className="p-1 border border-slate-300 text-center">ROM Aktif</th>
                      <th className="p-1 border border-slate-300 text-center">ROM Pasif</th>
                      <th className="p-1 border border-slate-300 text-center">Normal</th>
                      <th className="p-1 border border-slate-300 text-left">End-Feel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {session.goniometry.map((r) => (
                      <tr key={r.id}>
                        <td className="p-1 border border-slate-300">{r.joint} ({r.movement})</td>
                        <td className="p-1 border border-slate-300 text-center font-mono font-semibold">{r.activeDegrees}&deg;</td>
                        <td className="p-1 border border-slate-300 text-center font-mono">{r.passiveDegrees}&deg;</td>
                        <td className="p-1 border border-slate-300 text-center font-mono text-slate-500">{r.normalDegrees}&deg;</td>
                        <td className="p-1 border border-slate-300">{r.endFeel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* 3. DIAGNOSIS FISIOTERAPI (A) */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2.5 py-1 rounded border-l-4 border-teal-600 mb-2">
            3. Diagnosis Fisioterapi (Assessment)
          </h4>
          <div className="text-xs text-slate-700 space-y-1 pl-2">
            <p>
              <strong className="text-slate-900">Diagnosis Fisioterapi (IFI):</strong>{" "}
              {session.diagnosis.physioDiagnosis}
            </p>
            <p>
              <strong className="text-slate-900">Kode ICD-10:</strong>{" "}
              <span className="font-mono font-bold text-slate-900">{session.diagnosis.icd10Code}</span> - {session.diagnosis.icd10Description}
            </p>
            <p>
              <strong className="text-slate-900">ICF Classification:</strong>{" "}
              {session.diagnosis.icfImpairment}; {session.diagnosis.icfActivity}
            </p>
            <p>
              <strong className="text-slate-900">Target Evaluasi:</strong> {session.diagnosis.shortTermGoal}
            </p>
          </div>
        </div>

        {/* 4. INTERVENSI & HOME PROGRAM (P) */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2.5 py-1 rounded border-l-4 border-teal-600 mb-2">
            4. Intervensi & Rencana Tindakan (Plan)
          </h4>
          <div className="text-xs text-slate-700 space-y-1.5 pl-2">
            <div>
              <strong className="text-slate-900">Modalitas Terapi Diberikan (ICD-9-CM):</strong>
              <ul className="list-disc list-inside mt-0.5 text-slate-800">
                {session.intervention.modalities.map((m) => (
                  <li key={m.id}>
                    {m.type}: {m.dose} ({m.durationMinutes} menit) pada {m.targetArea}
                  </li>
                ))}
              </ul>
            </div>
            {session.intervention.exerciseTherapy.length > 0 && (
              <div>
                <strong className="text-slate-900">Terapi Latihan & Manual Therapy:</strong>{" "}
                {session.intervention.exerciseTherapy.join("; ")}
              </div>
            )}
            <div>
              <strong className="text-slate-900">Program Latihan Mandiri di Rumah (Home Exercise):</strong>{" "}
              {session.intervention.homeProgram}
            </div>
          </div>
        </div>

        {/* SIGNATURE AREA */}
        <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end text-xs">
          <div>
            <p className="text-slate-500 text-[11px]">Dicetak tanggal: {new Date().toLocaleDateString("id-ID")}</p>
            <p className="text-[10px] text-slate-400 font-mono">ID SatuSehat: {session.satuSehatBundleId || "PENDING"}</p>
          </div>
          <div className="text-center w-56">
            <p className="text-slate-700 mb-12">Fisioterapis Penanggung Jawab,</p>
            <p className="font-bold text-slate-900 underline">{session.therapistName}</p>
            <p className="text-[11px] font-mono text-slate-600">{session.therapistSipf}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
