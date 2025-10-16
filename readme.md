
## CLONE REPO IN YOUR LOCAL ENVIRONTMENT
```bash
git clone https://github.com/Ronaldotriandes/tapdev-test
```

# 1. Buat Grafik Penduduk Indonesia

- masuk ke dalam folder chart-app
```bash
cd chart-app
```
- Lakukan instalasi Dependencies menggunakan NPM atau Yarn
```bash
npm install
```
- Jalankan aplikasi
```bash
npm run dev
```
- Silahkan akses Chart dengan   http://localhost:3000


# 2. Buat producer dan consumer sederhana pada message queing berikut:

saya coba buat producer dan consumer sederhana menggunakan Go dengan Framework Fiber
- masuk ke dalam folder new-test-go
```bash
cd new-test-go
```
- Copy dan Edit file `.env` sesuai dengan konfigurasi Kafka Anda
```bash
cp .env.example .env
```
- Jalankan aplikasi
```bash
go run .
```

## ABAIKAN JIKA SUDAH INSTALL KAFKA,
Jika belum install kafka, silahkan jalankan docker-compose.yml
```bash
docker-compose up -d
```

## Produce Message
```
POST /produce
Content-Type: application/json

{
  "topic": "test-topic",
  "message": "Hello Kafka!"
}
```

## Start Consumer
```
POST /consume
Content-Type: application/json

{
  "topic": "test-topic",
  "consumer_group": "my-consumer-group"
}
```
Check di logs go application akan ada logs dari consumer dan producer


# 3. Temukan dan perbaiki issue yang terdapat pada program terlampir. Untuk menjalankan program ini pastikan sudah install node js dan npm atau pnpm. Langkah awal ke folder src/client lalu ketik pnpm i dan pnpm build. Langkah kedua masuk ke folder src lalu ketik pnpm i dan pnpm start.

saya sudah install dan jalankan applikasi express js nya, dan setelah saya coba reproduces code dan error dari api nya, saya temukan ada yang salah dari post/create user nya, di parameter ada yang salah di user service. saya cek di model nya itu ada paramter name, dan age. tapi di service itu variable parameternya nama dan ages, maka dari itu tidak bisa tercreate usernya.

saya sudah perbaiki itu dan bisa create user, edit, getall dan getdetail user.

# 4. Jika dalam 1 projek terdapat 3 branch pada repository

Development : terdapat penambahan fitur A
QA : sedang testing fitur B
Production : ditemukan issue yang harus diperbaiki saat itu juga
Jelaskan apa yang harus dilakukan supaya issue dapat diperbaiki serta branch QA & Development tidak terjadi conflict dan tetap up-to-date terhadap perbaikan issue?

-->
Biasanya ketika ada issue di production, kita akan membuat branch baru untuk memperbaiki issue tersebut. Kemudian, kita akan melakukan merge ke branch QA dan Development setelah issue tersebut selesai diperbaiki. Dengan begitu, branch QA dan Development akan tetap up-to-date terhadap perbaikan issue tersebut.

Jika ada conflict, kita akan melakukan resolve conflict tersebut terlebih dahulu sebelum melakukan merge ke branch QA dan Development.

By experience saya biasanya mengerjakan fitur baru itu dengan bikin branch baru dari branch Production, karena production lah branch yang paling stabil dan aman untuk diubah-ubah. Jika sudah selesai mendevelop di local saya push branch fitur tadi ke development -> QA dan baru terakhir ke production. itupun juga berlaku pada issue issue yang ditemukan di production. 

dan juga untuk commitnya saya juga ada message yang menjelaskan perubahan apa yang dilakukan pada code tersebut agar nanti secara history dan ketika ada conflict saya bisa mengkondisikannya. 
