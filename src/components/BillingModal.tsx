"use client";

import React, { useState } from "react";
import { CreditCard, Printer, X, Check, ShieldCheck, Receipt } from "lucide-react";
import { Patient, TherapySession } from "../types/physio";

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  session: TherapySession;
  onUpdateBillingStatus: (status: "LUNAS" | "PENDING" | "KLAIM_BPJS") => void;
}

export const BillingModal: React.FC<BillingModalProps> = ({
  isOpen,
  onClose,
  patient,
  session,
  onUpdateBillingStatus,
}) => {
  const [sepNumber, setSepNumber] = useState(
    patient.insuranceType === "BPJS" ? `SEP-3503R001-${session.sessionDate.replace(/-/g, "")}-0042` : ""
  );

  if (!isOpen) return null;

  // Modality pricing reference (Standard Indonesian Physiotherapy Clinic / RSUD tariff)
  const MODALITY_TARIFFS: Record<string, number> = {
    TENS: 35000,
    ULTRASOUND: 45000,
    INFRARED: 30000,
    SWD: 50000,
    LASER: 60000,
    CRYOTHERAPY: 25000,
    ES_FARADIK: 40000,
  };

  const adminFee = 25000;
  const manualTherapyFee = session.intervention.manualTherapy.length > 0 ? 55000 : 0;
  const exerciseTherapyFee = session.intervention.exerciseTherapy.length > 0 ? 45000 : 0;

  const modalityFee = session.intervention.modalities.reduce((acc, m) => {
    return acc + (MODALITY_TARIFFS[m.type] || 35000);
  }, 0);

  const subTotal = adminFee + manualTherapyFee + exerciseTherapyFee + modalityFee;
  const totalDue = patient.insuranceType === "BPJS" ? 0 : subTotal;

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Rincian Billing Tindakan & Kasir</h3>
              <p className="text-xs text-slate-400">
                {patient.fullName} &bull; Sesi {session.sessionNumber} ({session.sessionDate})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Insurance Status Banner */}
        <div className="my-4 p-3 rounded-lg border flex items-center justify-between text-xs bg-slate-950/60 border-slate-800">
          <div>
            <span className="text-slate-400 block text-[11px]">Penjamin Pasien:</span>
            <span className="font-bold text-white font-mono">{patient.insuranceType}</span>
            {patient.bpjsCardNumber && (
              <span className="text-[10px] text-slate-400 block font-mono">No: {patient.bpjsCardNumber}</span>
            )}
          </div>
          {patient.insuranceType === "BPJS" ? (
            <div className="text-right">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                Ditanggung BPJS Kesehatan
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Sesuai kuota rehabilitasi medik</span>
            </div>
          ) : (
            <div className="text-right">
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
                Tarif Reguler Pasien Umum
              </span>
            </div>
          )}
        </div>

        {/* BPJS SEP field */}
        {patient.insuranceType === "BPJS" && (
          <div className="mb-4">
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Nomor Surat Eligibilitas Peserta (SEP BPJS VClaim):
            </label>
            <input
              type="text"
              value={sepNumber}
              onChange={(e) => setSepNumber(e.target.value)}
              placeholder="SEP-..."
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-teal-300 font-mono focus:outline-none focus:border-teal-500"
            />
          </div>
        )}

        {/* Itemized breakdown table */}
        <div className="space-y-2 text-xs border border-slate-800/80 rounded-lg p-3 bg-slate-950/40">
          <div className="flex justify-between text-slate-400 pb-1 border-b border-slate-800 text-[11px] font-mono">
            <span>Uraian Jasa & Tindakan</span>
            <span>Tarif (IDR)</span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Biaya Registrasi & Asesmen Fisioterapis</span>
            <span className="font-mono">Rp {adminFee.toLocaleString("id-ID")}</span>
          </div>

          {session.intervention.modalities.map((mod) => (
            <div key={mod.id} className="flex justify-between text-slate-300">
              <span className="truncate pr-2">
                Modalitas {mod.type} ({mod.durationMinutes} mnt)
              </span>
              <span className="font-mono">
                Rp {(MODALITY_TARIFFS[mod.type] || 35000).toLocaleString("id-ID")}
              </span>
            </div>
          ))}

          {manualTherapyFee > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Manual Therapy & Mobilisasi Sendi</span>
              <span className="font-mono">Rp {manualTherapyFee.toLocaleString("id-ID")}</span>
            </div>
          )}

          {exerciseTherapyFee > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Terapi Latihan Fungsional & Edukasi</span>
              <span className="font-mono">Rp {exerciseTherapyFee.toLocaleString("id-ID")}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-slate-100">
            <span>Subtotal Tagihan:</span>
            <span className="font-mono">Rp {subTotal.toLocaleString("id-ID")}</span>
          </div>

          {patient.insuranceType === "BPJS" && (
            <div className="flex justify-between text-emerald-400 font-semibold text-xs">
              <span>Klaim BPJS (Subsidi Penuh):</span>
              <span className="font-mono">- Rp {subTotal.toLocaleString("id-ID")}</span>
            </div>
          )}

          <div className="pt-2 border-t-2 border-slate-700 flex justify-between text-sm font-bold text-white">
            <span>Total yang Harus Dibayar Pasien:</span>
            <span className="font-mono text-teal-400">Rp {totalDue.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Status Payment Selection */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">Status Pembayaran:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onUpdateBillingStatus("LUNAS")}
              className={`text-xs px-2.5 py-1 rounded font-medium border transition-colors ${
                session.billingStatus === "LUNAS"
                  ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              LUNAS
            </button>
            <button
              type="button"
              onClick={() => onUpdateBillingStatus("PENDING")}
              className={`text-xs px-2.5 py-1 rounded font-medium border transition-colors ${
                session.billingStatus === "PENDING"
                  ? "bg-amber-950 text-amber-300 border-amber-700"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              PENDING
            </button>
            <button
              type="button"
              onClick={() => onUpdateBillingStatus("KLAIM_BPJS")}
              className={`text-xs px-2.5 py-1 rounded font-medium border transition-colors ${
                session.billingStatus === "KLAIM_BPJS"
                  ? "bg-teal-950 text-teal-300 border-teal-700"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              KLAIM BPJS
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrintReceipt}
            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak Kuitansi Kasir
          </button>
        </div>
      </div>
    </div>
  );
};
