'use client';

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function GrafikPendudukIndonesia() {
  const [chartType, setChartType] = useState('bar');

  const dataPenduduk = [
    { provinsi: 'Jawa Barat', jumlah: 49936900, persentase: 18.1 },
    { provinsi: 'Jawa Timur', jumlah: 40943000, persentase: 14.8 },
    { provinsi: 'Jawa Tengah', jumlah: 36743200, persentase: 13.3 },
    { provinsi: 'Sumatera Utara', jumlah: 15136300, persentase: 5.5 },
    { provinsi: 'Banten', jumlah: 13862700, persentase: 5.0 },
    { provinsi: 'DKI Jakarta', jumlah: 10679200, persentase: 3.9 },
    { provinsi: 'Sulawesi Selatan', jumlah: 9073500, persentase: 3.3 },
    { provinsi: 'Lampung', jumlah: 9007800, persentase: 3.3 },
    { provinsi: 'Sumatera Selatan', jumlah: 8630200, persentase: 3.1 },
    { provinsi: 'Bali', jumlah: 4362000, persentase: 1.6 },
  ];

  const dataStatistik = [
    { kategori: 'Total Penduduk', nilai: '275,773,800 jiwa' },
    { kategori: 'Laki-laki', nilai: '138.6 juta (50.3%)' },
    { kategori: 'Perempuan', nilai: '137.1 juta (49.7%)' },
    { kategori: 'Provinsi Terpadat', nilai: 'Jawa Barat' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  const formatNumber = (num: number) => {
    return (num / 1000000).toFixed(1) + ' juta';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
            Penduduk Indonesia 2024
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Data proyeksi penduduk berdasarkan provinsi terpadat
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {dataStatistik.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                <p className="text-sm opacity-90 mb-2">{stat.kategori}</p>
                <p className="text-2xl font-bold">{stat.nilai}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setChartType('bar')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${chartType === 'bar'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Grafik Batang
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${chartType === 'pie'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Grafik Lingkaran
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            {chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={dataPenduduk}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="provinsi"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={formatNumber}
                    label={{ value: 'Jumlah Penduduk (juta)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    formatter={(value) => formatNumber(value as number)}
                    contentStyle={{ backgroundColor: '#fff', border: '2px solid #0088FE', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="jumlah" fill="#0088FE" name="Jumlah Penduduk" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                  <Pie
                    data={dataPenduduk}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={(entry) => `${entry.provinsi}: ${entry.persentase}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="jumlah"
                  >
                    {dataPenduduk.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Sumber: Proyeksi Badan Pusat Statistik (BPS) Indonesia 2024</p>
            <p className="mt-2">Data menampilkan 10 provinsi dengan jumlah penduduk terbesar</p>
          </div>
        </div>
      </div>
    </div>
  );
}