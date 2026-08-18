"use client";

import { useEffect, useState } from "react";
import { EyeSlashIcon, XIcon } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { PegawaiMetaResponse } from "@/types/pegawaiTypes";
import { createPegawai, getPegawaiById, updatePegawai } from "@/services/pegawaiService";
import { EyeIcon } from "lucide-react";
import Swal from "sweetalert2";

interface EmployeeFormModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  employeeId?: number;
  isEdit?: boolean;
}

type FormState = {
  nama: string;
  email: string;
  password: string;
  nip: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  alamat: string;
  telepon: string;
  role_id?: number;
  departemen_id?: number;
  jabatan_id?: number;
};

export default function EmployeeFormModal({
  onClose,
  onSuccess,
  employeeId,
  isEdit = false,
}: EmployeeFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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
    tanggal_lahir: "",
    jenis_kelamin: "",
    alamat: "",
    telepon: "",
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
  // FETCH DETAIL PEGAWAI (EDIT MODE)
  // =========================
  useEffect(() => {
    if (!isEdit || !employeeId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getPegawaiById(employeeId);
        setForm({
          nama: data.nama ?? "",
          email: data.user?.email ?? "",
          password: "",
          nip: data.nip ?? "",
          tanggal_lahir: data.tanggal_lahir ?? "",
          jenis_kelamin: data.jenis_kelamin ?? "",
          alamat: data.alamat ?? "",
          telepon: data.telepon ?? "",
          role_id: data.user?.role_id,
          departemen_id: data.departemen_id,
          jabatan_id: data.jabatan_id,
        });
      } catch (error) {
        console.error("Failed load employee", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [employeeId, isEdit]);

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
  // HANDLE NUMBER ONLY INPUTS
  // =========================
  const handleNumberOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let numericValue = value.replace(/\D/g, "");

    if (name === "nip") {
      numericValue = numericValue.slice(0, 18);
    }
    if (name === "telepon") {
      numericValue = numericValue.slice(0, 15);
    }
    setForm((prev) => ({
      ...prev,
      [name]: numericValue,
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
        !form.nama ||
        !form.nip
      ) {
        throw new Error("Semua field wajib diisi");
      }
      if (isEdit && employeeId) {
        const payload = {
          nama: form.nama,
          email: form.email,
          nip: form.nip.trim(),
          tanggal_lahir: form.tanggal_lahir || null,
          jenis_kelamin: form.jenis_kelamin || null,
          alamat: form.alamat || null,
          telepon: form.telepon || null,
          role_id: Number(form.role_id),
          departemen_id: Number(form.departemen_id),
          jabatan_id: Number(form.jabatan_id),
        };
        await updatePegawai(employeeId, payload);
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data pegawai berhasil diperbarui",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        const payload = {
          nama: form.nama,
          email: form.email,
          password: form.password,
          nip: form.nip.trim(),
          role_id: Number(form.role_id),
          departemen_id: Number(form.departemen_id),
          jabatan_id: Number(form.jabatan_id),
        };
        await createPegawai(payload);
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data pegawai berhasil ditambahkan",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menyimpan data",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl bg-white overflow-hidden max-h-[85vh] flex flex-col mt-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between bg-primary-500 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? "Edit Pegawai" : "Tambah Pegawai"}
          </h2>
          <button onClick={onClose}>
            <XIcon size={20} className="text-white" />
          </button>
        </div>

        {/* CONTENT */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Nama */}
          <div>
            <label className="text-sm font-medium">Nama</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          {/* NIP */}
          <div>
            <label className="text-sm font-medium">NIP</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="nip"
              value={form.nip}
              onChange={handleNumberOnly}
              placeholder="Masukkan NIP"
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
              placeholder="Masukkan email"
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          {/* Password */}
          {!isEdit && (
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <input
                  name="password"
                  type={isVisible ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Masukkan password minimal 8 karakter"
                  className="w-full border rounded px-3 py-2 mt-1"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsVisible((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-gray-700"
                >
                  {isVisible ? (
                    <EyeIcon size={24} />
                  ) : (
                    <EyeSlashIcon size={24} />
                  )}
                </button>
              </div>
            </div>
          )}
          {/* Role */}
          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              name="role_id"
              value={form.role_id ?? ""}
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
              value={form.departemen_id ?? ""}
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
              value={form.jabatan_id ?? ""}
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

          {isEdit && (
            <>
              {/* Tanggal Lahir */}
              <div>
                <label className="text-sm font-medium">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={form.tanggal_lahir}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="text-sm font-medium">Jenis Kelamin</label>
                <select
                  name="jenis_kelamin"
                  value={form.jenis_kelamin}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              {/* Nomor Telepon */}
              <div>
                <label className="text-sm font-medium">Nomor Telepon</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  name="telepon"
                  value={form.telepon}
                  onChange={handleNumberOnly}
                  placeholder="08xxxxxxxxxx"
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="text-sm font-medium">Alamat</label>
                <textarea
                  name="alamat"
                  value={form.alamat}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      alamat: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
            </>
          )}

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
              {loading
                ? isEdit
                  ? "Memperbarui..."
                  : "Menyimpan..."
                : isEdit
                  ? "Perbarui"
                  : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
