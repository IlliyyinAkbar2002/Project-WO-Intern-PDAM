import { getUsers } from "@/services/userService";
import { User } from "@/types/userTypes";
import { useEffect, useState } from "react";

export function useUser(){
  const [data, setData] =  useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
      try {
        const response = await getUsers();
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengambil data");
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
      fetchData();
  }, []);

  return { data, loading, error, refreshData: fetchData }
}