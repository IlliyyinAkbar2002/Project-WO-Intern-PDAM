"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

export default function RejectModal({ open, onClose, onSubmit }: Props) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason.trim());
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Alasan Penolakan</DialogTitle>
        </DialogHeader>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Tulis alasan..."
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Kirim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
