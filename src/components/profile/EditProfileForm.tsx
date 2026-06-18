"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  UserCircleIcon,
  IdentificationCardIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  BuildingsIcon,
  BriefcaseIcon,
} from "@phosphor-icons/react";
import { getPegawaiById, updatePegawai } from "@/services/pegawaiService";
import { PegawaiDetail } from "@/types/pegawaiTypes";

export default function EditProfileForm() {
  const router = useRouter();
  const [profile, setProfile] = useState<PegawaiDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    telepon: "",
    alamat: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const pegawaiId = Cookies.get("pegawai_id");

        if (!pegawaiId) {
          throw new Error("Pegawai ID tidak ditemukan");
        }

        const data = await getPegawaiById(Number(pegawaiId));

        setProfile(data);
        setForm({
          nama: data.nama ?? "",
          tanggal_lahir: data.tanggal_lahir ?? "",
          jenis_kelamin: data.jenis_kelamin ?? "",
          telepon: data.telepon ?? "",
          alamat: data.alamat ?? "",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Tidak dapat mengambil data profile",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;

    const result = await Swal.fire({
      title: "Simpan Perubahan?",
      text: "Data profile akan diperbarui",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;
    try {
      setSaving(true);
      await updatePegawai(profile.id, {
        nama: form.nama,
        email: profile.user.email,
        role_id: profile.user.role_id,
        departemen_id: profile.departemen_id,
        jabatan_id: profile.jabatan_id,
        nip: profile.nip ?? "",
        tanggal_lahir: form.tanggal_lahir || null,
        jenis_kelamin: form.jenis_kelamin || null,
        telepon: form.telepon || null,
        alamat: form.alamat || null,
      });

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Profile berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });

      const roleName = Cookies.get("role_name");

      let rolePath = "admin";

      if (roleName === "superadmin") {
        rolePath = "super-admin";
      } else if (roleName === "manager") {
        rolePath = "manager";
      }
      router.push(`/protected/${rolePath}/profile`);
      router.refresh();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan data",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        Memuat data profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        Data profile tidak ditemukan
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg">
        <div className="p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-bold text-primary-500">
              {profile.nama?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white">Edit Profile</h1>

              <p className="text-white/90">
                Kelola informasi pribadi akun Anda
              </p>

              <div className="mt-3 inline-flex rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white">
                <ShieldCheckIcon size={16} className="mr-2" />
                {profile.user.role}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            icon={<UserCircleIcon size={20} />}
            label="Nama"
            value={form.nama}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm({
                ...form,
                nama: e.target.value,
              })
            }
          />

          <InputField
            icon={<IdentificationCardIcon size={20} />}
            label="NIP"
            value={profile.nip ?? ""}
            disabled
          />

          <InputField label="Email" value={profile.user.email} disabled />

          <InputField
            icon={<ShieldCheckIcon size={20} />}
            label="Role"
            value={profile.user.role}
            disabled
          />

          <InputField
            icon={<BuildingsIcon size={20} />}
            label="Departemen"
            value={profile.departemen}
            disabled
          />

          <InputField
            icon={<BriefcaseIcon size={20} />}
            label="Jabatan"
            value={profile.jabatan}
            disabled
          />

          <InputField
            icon={<CalendarIcon size={20} />}
            type="date"
            label="Tanggal Lahir"
            value={form.tanggal_lahir}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm({
                ...form,
                tanggal_lahir: e.target.value,
              })
            }
          />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Jenis Kelamin
            </label>

            <select
              value={form.jenis_kelamin}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setForm({
                  ...form,
                  jenis_kelamin: e.target.value,
                })
              }
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="">Pilih</option>
              <option value="Laki-laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <InputField
            icon={<PhoneIcon size={20} />}
            label="Telepon"
            value={form.telepon}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm({
                ...form,
                telepon: e.target.value,
              })
            }
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium">Alamat</label>

          <textarea
            rows={4}
            value={form.alamat}
            onChange={(e) =>
              setForm({
                ...form,
                alamat: e.target.value,
              })
            }
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border px-5 py-2"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-primary-500 px-5 py-2 text-white hover:bg-primary-600"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  disabled,
  type = "text",
  icon,
  onChange,
}: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-gray-500">{icon}</div>
        )}

        <input
          type={type}
          value={value}
          disabled={disabled}
          onChange={onChange}
          className={`w-full rounded-lg border py-2 ${
            icon ? "pl-10" : "px-3"
          } ${disabled ? "bg-gray-100 text-gray-500" : "bg-white"}`}
        />
      </div>
    </div>
  );
}
