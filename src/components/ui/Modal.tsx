"use client";

import { ReactNode, useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** id of the element that titles the dialog. */
  labelledBy: string;
  children: ReactNode;
  className?: string;
}

/**
 * Accessible modal built on the native <dialog> element.
 *
 * `showModal()` places it in the browser's top layer (above the fixed site
 * header), makes the rest of the page inert, traps focus, closes on Escape,
 * and returns focus to the element that opened it. Page scrolling is locked
 * in globals.css with `html:has(dialog:modal)`.
 */
export default function Modal({
  open,
  onClose,
  labelledBy,
  children,
  className = "",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pointerDownOnBackdrop = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onClose={onClose}
      // Close on backdrop clicks only: the dialog element itself is the
      // backdrop target, and both press and release must land on it so that
      // dragging a text selection out of the panel doesn't close it.
      onPointerDown={(event) => {
        pointerDownOnBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (pointerDownOnBackdrop.current && event.target === event.currentTarget) {
          onClose();
        }
      }}
      className={`m-auto w-[min(64rem,calc(100%-2rem))] overflow-hidden rounded-3xl bg-neutral-50 p-0 text-neutral-900 shadow-2xl backdrop:bg-primary-900/70 backdrop:backdrop-blur-sm open:animate-[modal-in_200ms_ease-out] motion-reduce:open:animate-none ${className}`}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-neutral-50/90 text-primary-800 shadow-sm transition-colors hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400">
        <XMarkIcon className="size-6" aria-hidden="true" />
      </button>
      {/* The inner wrapper scrolls so the close button stays in view. */}
      <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain">
        {children}
      </div>
    </dialog>
  );
}
