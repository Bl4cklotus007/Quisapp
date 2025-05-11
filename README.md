# Quiz App Data

Repository ini berisi data soal untuk aplikasi quiz.

## Struktur Data

Setiap file JSON memiliki format berikut:

```json
{
  "kategori": [
    {
      "nama": "Nama Kategori",
      "soal": [
        {
          "pertanyaan": "Pertanyaan",
          "pilihan": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
          "jawaban": 0
        }
      ]
    }
  ]
}
```

## Cara Menambah/Mengubah Soal

1. Buka file JSON yang sesuai dengan mata pelajaran
2. Tambahkan atau ubah soal sesuai format di atas
3. Commit dan push perubahan ke repository
4. Perubahan akan otomatis tersedia di aplikasi quiz

## Daftar File

- `soal-agama.json` - Soal mata pelajaran Agama
- `soal-matematika.json` - Soal mata pelajaran Matematika
- `soal-ipa.json` - Soal mata pelajaran IPA
- `soal-indo.json` - Soal mata pelajaran Bahasa Indonesia
- `soal-inggris.json` - Soal mata pelajaran Bahasa Inggris
- `soal-ips.json` - Soal mata pelajaran IPS

## Catatan

- Pastikan format JSON valid
- Jawaban harus berupa angka (0-3) yang sesuai dengan indeks pilihan
- Setiap soal harus memiliki 4 pilihan jawaban
