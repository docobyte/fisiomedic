export interface BpjsQuotaInfo {
  used: number;
  total: number;
  remaining: number;
  percent: number;
  isWarning: boolean;
  isExhausted: boolean;
  statusLabel: string;
  colorClass: string;
}

export function calculateBpjsQuota(sessionNumber: number, totalQuota: number = 8): BpjsQuotaInfo {
  const used = sessionNumber;
  const total = totalQuota;
  const remaining = Math.max(0, total - used);
  const percent = Math.min(100, Math.round((used / total) * 100));
  const isExhausted = used >= total;
  const isWarning = remaining <= 2 && remaining > 0;

  let statusLabel = `Sesi ${used} dari ${total} (Sisa ${remaining} Sesi)`;
  let colorClass = "text-teal-300 bg-teal-950/80 border-teal-800";

  if (isExhausted) {
    statusLabel = `Siklus Penuh (${total} Sesi) - Evaluasi Rujukan FKRTL`;
    colorClass = "text-rose-300 bg-rose-950/80 border-rose-800";
  } else if (isWarning) {
    statusLabel = `Kuota Hampir Habis (${remaining} Sesi Tersisa)`;
    colorClass = "text-amber-300 bg-amber-950/80 border-amber-800";
  }

  return {
    used,
    total,
    remaining,
    percent,
    isWarning,
    isExhausted,
    statusLabel,
    colorClass,
  };
}

export function formatIndonesianDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${days[date.getDay()]}, ${day} ${months[date.getMonth()]} ${year}`;
  } catch {
    return dateStr;
  }
}
