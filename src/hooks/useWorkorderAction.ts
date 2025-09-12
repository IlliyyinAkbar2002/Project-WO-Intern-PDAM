'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { delayWorkorder, extendWorkorder, resumeWorkorder, updateWorkorderStatus } from '@/services';
import { approveLemburSpl, rejectLemburSpl } from '@/services/lemburSplService';

export function useWorkorderAction(workorderId: string, lemburSplId: string) {
  const router = useRouter();

   const wrapAction = async (actionFn: () => Promise<any>, successMsg: string) => {
    try {
      await actionFn();
      toast.success(successMsg);
      router.refresh();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Terjadi kesalahan koneksi';
      toast.error(message);
    }
  };
  const verifikator = 2; 
  return {
    approve: () => wrapAction(() => approveLemburSpl(lemburSplId, verifikator), 'SPL disetujui'),
    resume: () => wrapAction(() => resumeWorkorder(Number(workorderId), 3,), 'Workorder dilanjutkan'),
    accept: () => wrapAction(() => updateWorkorderStatus(workorderId, 6), 'Workorder diterima'),
    reject: (reason: string) => wrapAction(() => rejectLemburSpl(lemburSplId, verifikator, reason), 'SPL ditolak'),
    extend: (date: string) => wrapAction(() => extendWorkorder(Number(workorderId), 4, date), 'Workorder diperpanjang'),
    delay: (reason: string) => wrapAction(() => delayWorkorder(Number(workorderId), 2, reason), 'Workorder ditunda'),
    revise: (reason: string) => wrapAction(() => updateWorkorderStatus(workorderId, 3), 'Workorder direvisi'),
  };
}
