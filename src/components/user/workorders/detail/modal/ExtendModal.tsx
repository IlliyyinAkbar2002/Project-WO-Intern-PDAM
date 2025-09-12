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

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (date: string) => void;
};

export default function ExtendModal({ open, onClose, onSubmit }: Props) {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleSubmit = () => {
    if (!selectedDate) return;
    onSubmit(selectedDate);
    setSelectedDate("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Pilih Tanggal Perpanjangan
          </DialogTitle>
        </DialogHeader>
        <input
          type="datetime-local"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border rounded px-3 py-2"
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
