import { getJenisWorkorders } from "@/services/jenisWorkorderService";
import { JenisWorkorder } from "@/types/jenisWorkorderTypes";
import { useEffect, useState } from "react";

interface JenisWorkorderOption {
    id: number;
    nama: string;
}

export function useJenisWorkorderOptions() {
    const [data, setData] = useState<JenisWorkorderOption[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch all jenis workorder without pagination
            const response = await getJenisWorkorders(undefined, undefined, undefined, undefined, true);
            const options = response.data.map((item: JenisWorkorder) => ({
                id: item.id,
                nama: item.nama,
            }));
            setData(options);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal mengambil data jenis workorder");
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refreshData: fetchData };
}
