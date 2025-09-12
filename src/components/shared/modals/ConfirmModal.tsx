import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "primary",
  loading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p>{description}</p>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }
          >
            {loading ? "Loading..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
