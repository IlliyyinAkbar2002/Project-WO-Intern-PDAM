import { Action, WorkorderStatus } from "@/types/workorderActionTypes";

export const getActionsForStatus = (
  status: WorkorderStatus,
  handlers: {
    approve: () => Promise<void>;
    resume: () => Promise<void>;
    accept: () => Promise<void>;
    reject: () => Promise<void>;
    extend: () => Promise<void>;
    delay: () => Promise<void>;
    revise: () => Promise<void>;
  }
): Action[] => {
  switch (status) {
    case WorkorderStatus.PENDING:
      return [
        { label: 'Setujui', onClick: handlers.approve, variant: 'primary', size: 'sm' },
        { label: 'Tolak', onClick: handlers.reject, variant: 'danger', size: 'sm' },
      ];
    case WorkorderStatus.IN_PROGRESS:
      return [
        { label: 'Perpanjang', onClick: handlers.extend, variant: 'warning', size: 'sm' },
        { label: 'Tunda', onClick: handlers.delay, variant: 'danger', size: 'sm' },
      ];
    case WorkorderStatus.DELAYED:
      return [{ label: 'Lanjutkan', onClick: handlers.resume, variant: 'primary', size: 'sm' }];
    case WorkorderStatus.CHECKING:
      return [
        { label: 'Revisi', onClick: handlers.revise, variant: 'danger' , size: 'sm' },
        { label: 'Terima', onClick: handlers.accept, variant: 'primary' , size: 'sm' },
      ];
    case WorkorderStatus.REVISION:
      return [{ label: 'Terima', onClick: handlers.accept, variant: 'primary', size: 'sm' }];
    default:
      return [];
  }
};
