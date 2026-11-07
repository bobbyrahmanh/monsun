// Tata letak tugas berjam dalam satu hari di tampilan minggu (logika murni, tanpa React).
//
// Tugas hanya punya satu waktu (tenggat), bukan rentang. Supaya terlihat sebagai blok, tiap
// tugas digambar selama BLOCK_MINUTES. Tugas yang rentang gambarnya bertumpuk dibagi ke
// beberapa "lajur" berdampingan, seperti Google Calendar, supaya tidak saling menutupi.

export const MINUTES_PER_DAY = 24 * 60;
export const BLOCK_MINUTES = 30;

// "14:30" -> 870
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export interface LayoutInput {
  id: string;
  startMin: number; // menit sejak 00:00
}

export interface Placed extends LayoutInput {
  lane: number; // lajur ke berapa (mulai 0)
  lanes: number; // jumlah lajur di kelompok tumpukan ini (menentukan lebar blok)
}

export function layoutDay(items: LayoutInput[], blockMin: number = BLOCK_MINUTES): Placed[] {
  // sort stabil: tugas dengan jam sama tetap berurutan seperti input
  const sorted = [...items].sort((a, b) => a.startMin - b.startMin);
  const result: Placed[] = [];

  let cluster: Placed[] = []; // kelompok tugas yang saling bertumpuk (langsung atau berantai)
  let laneEnds: number[] = []; // kapan tiap lajur di kelompok ini kosong lagi
  let clusterEnd = -Infinity;

  const closeCluster = () => {
    for (const p of cluster) p.lanes = laneEnds.length; // semua anggota berbagi lebar yang sama
    result.push(...cluster);
    cluster = [];
    laneEnds = [];
  };

  for (const item of sorted) {
    if (cluster.length > 0 && item.startMin >= clusterEnd) closeCluster();

    // pakai lajur pertama yang sudah kosong pada jam ini; kalau tidak ada, buka lajur baru
    let lane = laneEnds.findIndex((end) => end <= item.startMin);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(0);
    }
    laneEnds[lane] = item.startMin + blockMin;
    clusterEnd = cluster.length === 0 ? laneEnds[lane] : Math.max(clusterEnd, laneEnds[lane]);
    cluster.push({ id: item.id, startMin: item.startMin, lane, lanes: 1 });
  }
  if (cluster.length > 0) closeCluster();
  return result;
}
