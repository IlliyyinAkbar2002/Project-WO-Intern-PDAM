"use client";

import { useEffect, useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { PegawaiMetaResponse } from "@/types/pegawaiTypes";
import { createPegawai } from "@/services/pegawaiService";

interface EmployeeFormModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

type FormState = {
  nama: string;
  email: string;
  password: string;
  nip: string;
  role_id?: number;
  departemen_id?: number;
  jabatan_id?: number;
};

export default function EmployeeFormModal({
  onClose,
  onSuccess,
}: EmployeeFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<PegawaiMetaResponse>({
    departemen: [],
    jabatan: [],
    role: [],
  });
  const [form, setForm] = useState<FormState>({
    nama: "",
    email: "",
    password: "",
    nip: "",
    role_id: undefined,
    departemen_id: undefined,
    jabatan_id: undefined,
  });

  // =========================
  // FETCH META DROPDOWN
  // =========================
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await api.get("/v1/pegawai/meta");
        setMeta(res.data);
      } catch (error) {
        console.error("Failed to load meta", error);
      }
    };
    fetchMeta();
  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name.includes("_id") || name === "role_id"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  // =========================
  // SUBMIT CREATE
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (
        !form.role_id ||
        !form.departemen_id ||
        !form.jabatan_id ||
        !form.email ||
        !form.password ||
        !form.nama ||
        !form.nip
      ) {
        throw new Error("Semua field wajib diisi");
      }
      const payload = {
        nama: form.nama,
        email: form.email,
        password: form.password,
        nip: form.nip?.trim(),
        role_id: Number(form.role_id ?? 0),
        departemen_id: Number(form.departemen_id ?? 0),
        jabatan_id: Number(form.jabatan_id ?? 0),
      };
      await createPegawai(payload);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Create employee failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between bg-primary-500 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Tambah Pegawai</h2>
          <button onClick={onClose}>
            <XIcon size={20} className="text-white" />
          </button>
        </div>

        {/* CONTENT */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nama */}
          <div>
            <label className="text-sm font-medium">Nama</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          {/* NIP */}
          <div>
            <label className="text-sm font-medium">NIP</label>
            <input
              name="nip"
              value={form.nip}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password Default</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          {/* Role */}
          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              name="role_id"
              value={form.role_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            >
              <option value="">Pilih Role</option>
              {meta.role.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Departemen */}
          <div>
            <label className="text-sm font-medium">Departemen</label>
            <select
              name="departemen_id"
              value={form.departemen_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            >
              <option value="">Pilih Departemen</option>
              {meta.departemen.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Jabatan */}
          <div>
            <label className="text-sm font-medium">Jabatan</label>
            <select
              name="jabatan_id"
              value={form.jabatan_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            >
              <option value="">Pilih Jabatan</option>
              {meta.jabatan.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nama}
                </option>
              ))}
            </select>
          </div>

          {/* ACTION */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-500 text-white rounded"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
