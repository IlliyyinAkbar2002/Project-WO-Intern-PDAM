"use client";
import { Button } from "@/components/ui";
import { getActionsForStatus } from "./statusMap";
import { WorkorderStatus } from "@/types/workorderActionTypes";
import { useState } from "react";
import RejectModal from "../modal/RejectModal";
import ExtendModal from "../modal/ExtendModal";
import DelayModal from "../modal/DelayModal";
import ReviseModal from "../modal/ReviseModal";

type Props = {
  status: WorkorderStatus;
  handlers: {
    approve: () => Promise<void>;
    resume: () => Promise<void>;
    accept: () => Promise<void>;
    reject: (reason: string) => Promise<void>;
    extend: (date: string) => Promise<void>;
    delay: (reason: string) => Promise<void>;
    revise: (reason: string) => Promise<void>;
  };
};

export function WorkorderActionButtons({ status, handlers }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [showReviseModal, setShowReviseModal] = useState(false);

  const actions = getActionsForStatus(status, {
    ...handlers,
    approve: async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        await handlers.approve();
      } finally {
        setIsLoading(false);
      }
    },
    resume: async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        await handlers.resume();
      } finally {
        setIsLoading(false);
      }
    },
    accept: async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        await handlers.accept();
      } finally {
        setIsLoading(false);
      }
    },
    reject: async () => setShowRejectModal(true),
    extend: async () => setShowExtendModal(true),
    delay: async () => setShowDelayModal(true),
    revise: async () => setShowReviseModal(true),
  });

  return (
    <>
      <div className="flex gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            variant={action.variant}
            size={action.size}
          >
            {action.label}
          </Button>
        ))}
      </div>
      <RejectModal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={(reason) => handlers.reject(reason)}
      />
      <ExtendModal
        open={showExtendModal}
        onClose={() => setShowExtendModal(false)}
        onSubmit={(selectedDate) => handlers.extend(selectedDate)}
      />
      <DelayModal
        open={showDelayModal}
        onClose={() => setShowDelayModal(false)}
        onSubmit={(reason) => handlers.delay(reason)}
      />
      <ReviseModal
        open={showReviseModal}
        onClose={() => setShowReviseModal(false)}
        onSubmit={(reason) => handlers.revise(reason)}
      />
    </>
  );
}
