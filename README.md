Proyek Game Kuis Milioner (v5 - Progressive Difficulty)Ini adalah game kuis yang terhubung dengan Firebase. Game ini sekarang menggunakan sistem "Hybrid" (campuran) dan mendukung tingkat kesulitan progresif.Soal Default (Fase A-F): Dikelola menggunakan file .csv lokal (misal: FaseA.csv) yang ada di dalam folder proyek.Soal Kustom (Host Mode): Dikelola menggunakan link Google Sheet (CSV) yang disimpan di Firebase.Leaderboard: Dikelola sepenuhnya oleh Firebase.🚀 Fitur UtamaTingkat Kesulitan Progresif: Game akan mengambil 5 soal Mudah (level 1), 5 Sedang (level 2), dan 5 Sulit (level 3) secara berurutan.Database Hybrid: Soal default cepat dimuat dari file CSV lokal; Soal kustom dan leaderboard tetap online.Bantuan Lengkap: Fitur 50/50 dan Bantuan Telepon (dengan 4 kontak) kini berfungsi.Kuis Kustom via CSV: Host dapat membuat kuis baru hanya dengan mempublikasikan Google Sheet sebagai CSV (juga harus 4 kolom).📦 Pengaturan (File Soal) - SANGAT PENTINGAnda WAJIB membuat file .csv (misal FaseA.csv, FaseB.csv, dst.) di folder yang sama dengan index.html.Format File .csv (Format 4 Kolom BARU)Setiap file .csv WAJIB memiliki 4 kolom dengan header q, o, a, difficulty.q,o,a,difficulty

Pertanyaan Anda di sini?,.OpsiA,.OpsiB,.OpsiC,.OpsiBenar,OpsiBenar,1

Pertanyaan kedua?,.Satu,.Dua,.Tiga,Dua,1

Pertanyaan sedang?,.X,.Y,.Z,Y,2

Pertanyaan sulit?,.Alpha,.Beta,.Gamma,Gamma,3

difficulty: Gunakan angka:1 = Mudah (Soal untuk level 1-5)2 = Sedang (Soal untuk level 6-10)3 = Sulit (Soal untuk level 11-15)PENTING: Setiap file (FaseA.csv, dll.) harus memiliki MINIMAL 5 SOAL untuk setiap tingkat kesulitan (5 mudah, 5 sedang, 5 sulit). Jika tidak, game akan gagal dimuat.👩‍🏫 Cara Menggunakan (Alur Host)Alur host (pembuat kuis) juga harus mengikuti format 4 kolom:Buat Google Sheet: Buat sheet baru.Isi Kolom (WAJIB): Di baris pertama, buat 4 header: q, o, a, difficulty.Isi Soal: Isi soal Anda dan pastikan untuk menambahkan angka 1, 2, atau 3 di kolom difficulty.Publikasikan ke Web: Klik File > Bagikan > Publikasikan ke web, pilih Sheet Anda, dan ganti format menjadi "Nilai yang dipisahkan koma (.csv)".Buat Game: Tempelkan link CSV di game dan klik "Buat Link Game". Script akan memvalidasi apakah Anda memiliki setidaknya 5 soal untuk setiap level.Bagikan Link: Bagikan link # yang dihasilkan.

