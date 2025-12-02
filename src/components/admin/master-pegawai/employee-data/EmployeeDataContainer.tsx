"use client";

import { useEffect, useState } from "react";
import { getPegawai } from "@/services/pegawaiService";
import { Pegawai } from "@/types/pegawaiTypes";

export default function EmployeeDataContainer() {
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ State filter departemen & jabatan
  const [departemenId, setDepartemenId] = useState<number | undefined>();
  const [jabatanId, setJabatanId] = useState<number | undefined>();

  // ✅ Ambil data pegawai saat komponen mount atau filter berubah
  useEffect(() => {
    setLoading(true);
    getPegawai(departemenId, jabatanId)
      .then(setPegawaiList)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [departemenId, jabatanId]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Master Pegawai</h1>

      {/* ✅ Filter UI sederhana */}
      <div className="flex gap-4 mb-4">
        <select
          onChange={(e) =>
            setDepartemenId(e.target.value ? Number(e.target.value) : undefined)
          }
        >
          <option value="">Filter Departemen</option>
          <option value="1">Departemen 1</option>
          <option value="2">Departemen 2</option>
          {/* Tambahkan opsi sesuai data departemen */}
        </select>

        <select
          onChange={(e) =>
            setJabatanId(e.target.value ? Number(e.target.value) : undefined)
          }
        >
          <option value="">Filter Jabatan</option>
          <option value="1">Jabatan 1</option>
          <option value="2">Jabatan 2</option>
          {/* Tambahkan opsi sesuai data jabatan */}
        </select>

        <button
          onClick={() => {
            setDepartemenId(undefined);
            setJabatanId(undefined);
          }}
        >
          Reset Filter
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border px-2">Nama</th>
              <th className="border px-2">NIP</th>
              <th className="border px-2">Departemen</th>
              <th className="border px-2">Jabatan</th>
              <th className="border px-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {pegawaiList.map((p) => (
              <tr key={p.id}>
                <td className="border px-2">{p.pegawai.nama}</td>
                <td className="border px-2">{p.pegawai.nip}</td>
                <td className="border px-2">{p.pegawai.departemen}</td>
                <td className="border px-2">{p.pegawai.jabatan}</td>
                <td className="border px-2">{p.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
