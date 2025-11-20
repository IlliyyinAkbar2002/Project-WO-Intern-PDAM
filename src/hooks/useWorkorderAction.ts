'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { delayWorkorder, extendWorkorder, resumeWorkorder, updateWorkorderStatus } from '@/services';
import { acceptWo, rejectWo } from "@/services/work-order"

export function useWorkorderAction(workorderId: string, workorder: string) {
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
// approve: () => wrapAction(() => approveWo(workorderId, verifikator), 'SPL disetujui'),
resume: () => wrapAction(() => resumeWorkorder(Number(workorderId), 3), 'Workorder dilanjutkan'),
accept: () => wrapAction(() => updateWorkorderStatus(workorderId, 6), 'Workorder diterima'),
reject: (reason: string) => wrapAction(() => rejectWo(workorderId, verifikator, reason), 'Workorder ditolak'),
extend: (date: string) => wrapAction(() => extendWorkorder(Number(workorderId), 4, date), 'Workorder diperpanjang'),
delay: (reason: string) => wrapAction(() => delayWorkorder(Number(workorderId), 2, reason), 'Workorder ditunda'),
revise: (reason: string) => wrapAction(() => updateWorkorderStatus(workorderId, 3), 'Workorder direvisi'),
finish: () => wrapAction(() => updateWorkorderStatus(workorderId, 7), 'Workorder selesai')
};
}