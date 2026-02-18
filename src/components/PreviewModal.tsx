import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText } from "lucide-react";
import type { Note } from "@/lib/data";

interface PreviewModalProps {
  note: Note | null;
  onClose: () => void;
}

const PreviewModal = ({ note, onClose }: PreviewModalProps) => {
  return (
    <AnimatePresence>
      {note && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[85vh] glass rounded-xl brutal-border-accent overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <p className="font-bold text-sm text-foreground">{note.fileName}</p>
                <p className="text-xs font-mono text-muted-foreground">
                  {note.subject} · Unit {note.unit}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={note.fileUrl || "#"}
                  download={note.fileName}
                  className="p-2 rounded bg-primary text-primary-foreground"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 rounded bg-muted hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              {note.fileType === "image" && note.fileUrl ? (
                <img
                  src={note.fileUrl}
                  alt={note.fileName}
                  className="max-w-full max-h-full rounded-lg object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 py-12">
                  <FileText className="w-16 h-16 text-primary" />
                  <p className="text-muted-foreground text-sm">PDF preview not available</p>
                  <a
                    href={note.fileUrl || "#"}
                    download={note.fileName}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold text-sm brutal-border-accent brutal-shadow"
                  >
                    Download PDF
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreviewModal;
