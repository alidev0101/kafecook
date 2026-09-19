"use client";

import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={26} className="text-red-500 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">{title || "تأیید عملیات"}</h3>
        <p className="text-sm text-muted-foreground mb-6">{message || "آیا از انجام این عملیات اطمینان دارید؟"}</p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            انصراف
          </Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm} loading={loading}>
            تأیید
          </Button>
        </div>
      </div>
    </Modal>
  );
}
