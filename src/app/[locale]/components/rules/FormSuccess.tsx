import { BadgeCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FormSuccess({
  formStatus,
  message,
}: {
  formStatus: boolean;
  message: string;
}) {
  const [modal, setModal] = useState<boolean>(formStatus);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setModal(formStatus);

    if (formStatus) {
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 0);
    }
  }, [formStatus]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModal(false);
      }
    };
    if (modal) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal]);

  return (
    <AnimatePresence>
      {modal && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-base-300/75 z-50 fixed inset-0 flex items-center justify-center"
          onClick={() => setModal(false)}
        >
          <motion.div
            role="alert"
            aria-live="assertive"
            ref={dialogRef}
            className="alert alert-success m-5 w-fit"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
          >
            <BadgeCheck />
            {message}
            <button
              type="button"
              aria-label="Close success message"
              onClick={() => setModal(false)}
              className="rounded-full p-1 btn btn-ghost"
            >
              <X size={20} />
            </button>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
