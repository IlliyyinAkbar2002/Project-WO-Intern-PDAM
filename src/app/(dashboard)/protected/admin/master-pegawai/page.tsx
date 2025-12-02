"use client";

import EmployeeDataContainer from "@/components/admin/master-pegawai/employee-data/EmployeeDataContainer";

export default function MasterPegawaiPage() {
  // ✅ Halaman utama Master Pegawai
  // Bisa tambahkan state filter di sini lalu lempar ke container
  return (
    <div className="p-4">
      <EmployeeDataContainer />
    </div>
  );
}
