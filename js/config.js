/* ============================================================
   CONFIG.JS — Edit semua data personal di sini.
   Jangan ubah engine.js kecuali emang ngerti logicnya.
   ============================================================ */

const CONFIG = {

  // ---- IDENTITAS ----
  her: {
    fullName: "Indah Kusuma Atmaja",
    nickname: "Sayang"
  },
  signedBy: "Victor♥️",

  // ---- GATE (kode kunci) ----
  // Format DDMMYYYY, 8 digit. Tanggal jadian: 15 April 2026
  gate: {
    code: "15042026",
    clueWrong: "Hmm, coba lagi deh Sayang... petunjuknya: tanggal ini yang bikin kita resmi jadi 'kita' 💕",
    placeholderHint: "DD MM YYYY"
  },

  // ---- TOGETHER COUNTER ----
  // Tanggal jadian, dipakai buat hitung durasi pacaran real-time
  relationship: {
    startDate: "2026-04-15T00:00:00"
  },

  // ---- GREETING (typewriter) ----
  greeting: {
    text: "Hai Sayang... 🥰"
  },

  // ---- SURAT CINTA ----
  letter: {
    paragraphs: [
      "Hai Sayang 🥰",
      "Di hari ulang tahunmu ini, aku cuma mau bilang maaf kalau belakangan kita jarang ketemu ya. Kerjaan emang lagi padet banget, paling kita ketemu 1-2 minggu sekali 😭 tapi percaya deh, walau jarang ketemu, kamu tetep yang paling sering ada di pikiran aku tiap hari 🤭",
      "Tiap chat singkat di sela kerjaan, tiap vc malem walau cuma 30 menit sebelum aku tepar 🤭😂 itu semua yang bikin aku kuat jalanin hari-hari yang capek. Aku tau gak ketemu sering itu berat, makasih banget ya udah ngerti dan sabar nungguin waktu aku 🥹",
      "Selamat ulang tahun, Sayang 🎉 Aku promise bakal usahain lebih banyak waktu buat kita, dan bikin tiap ketemu worth it banget. Aku sayang kamu, sebesar rasa kangen yang gak pernah sempat ke-ucap di antara jadwal kerja yang numpuk ini 😭❤️"
    ],
    signOff: "Victor♥️"
  },

  // ---- GALERI FOTO ----
  // Ganti file di assets/img/ dengan nama yang sama buat update foto
  gallery: [
    { src: "assets/img/photo1.jpg", caption: "Momen kita #1" },
    { src: "assets/img/photo2.jpg", caption: "Momen kita #2" },
    { src: "assets/img/photo3.jpg", caption: "Momen kita #3" },
    { src: "assets/img/photo4.jpg", caption: "Momen kita #4" },
    { src: "assets/img/photo5.jpg", caption: "Momen kita #5" },
    { src: "assets/img/photo6.jpg", caption: "Momen kita #6" }
  ],

  // ---- MUSIK ----
  // Drop file MP3 di assets/music/song.mp3 — gak perlu ubah kode apapun
  music: {
    src: "assets/music/song.mp3",
    title: "Lagu Kita"
  },

  // ---- REASONS I LOVE YOU ----
  reasons: [
    "Karena kamu selalu dengerin cerita random aku tiap malam",
    "Karena ketawamu bisa nyembuhin mood buruk aku",
    "Karena kamu sabar banget hadapin aku yang kadang ribet",
    "Karena kamu tetep usaha komunikasi walau capek kerja",
    "Karena video call sama kamu rasanya kayak pulang",
    "Karena kamu support semua hal kecil yang aku kerjain",
    "Karena cara kamu peduli tanpa diminta",
    "Karena kamu bikin hari-hari sibuk ini berasa gak terlalu berat",
    "Karena senyummu di foto bikin hari aku lebih baik",
    "Karena kamu selalu jadi tempat ternyaman buat cerita apa aja"
  ],

  // ---- FINAL REVEAL ----
  finalReveal: {
    title: "Happy Birthday,",
    nameDisplay: "Indah Kusuma Atmaja! 🎉",
    closing: "Makasih udah jadi Sayang yang paling sabar nungguin waktu aku. I love you 💕"
  },

  // ---- EASTER EGG ----
  // Tap logo hati 5x buat munculin ini
  easterEgg: {
    message: "Eh ketemu 🤭 ini rahasia kecil: dari semua orang yang pernah aku kenal, kamu satu-satunya yang bikin aku percaya jarak itu cuma angka. I love you, Sayang."
  }

};
