import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Card container */}
      <div
        className={cn(
          "relative w-full max-h-[90vh] flex flex-col bg-white dark:bg-[#15161e] border border-slate-200 dark:border-slate-800 rounded overflow-hidden z-10 shadow-lg transition-colors duration-200",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-2xl": size === "lg",
            "max-w-4xl": size === "xl",
          }
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d0e12]">
          <h3 className="text-xs font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase">
            {title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-white"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}
