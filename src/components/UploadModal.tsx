import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileUp, CheckCircle2 } from "lucide-react";
import { SUBJECTS, UNITS, type Subject, type Unit } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/axios";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

const UploadModal = ({ open, onClose, onUploaded }: UploadModalProps) => {
  const [subject, setSubject] = useState<Subject>(SUBJECTS[0]);
  const [unit, setUnit] = useState<Unit>(1);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("unit", unit.toString());

    try {
      await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      toast({
        title: "Note uploaded! 🎉",
        description: "Your note has been submitted for approval.",
      });
      onUploaded();
      onClose();
      setFile(null);
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Upload failed ❌",
        description: error.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-background/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass rounded-xl brutal-border-accent p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Upload Note</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded bg-muted hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Subject */}
            <label className="block mb-4">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">
                Subject
              </span>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full bg-input text-foreground px-3 py-2.5 rounded-md brutal-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            {/* Unit */}
            <label className="block mb-4">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">
                Unit
              </span>
              <div className="flex gap-1.5">
                {UNITS.map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all brutal-border ${unit === u
                      ? "bg-primary text-primary-foreground brutal-border-accent"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    U{u}
                  </button>
                ))}
              </div>
            </label>

            {/* File input */}
            <div className="mb-6">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">
                File
              </span>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => inputRef.current?.click()}
                className="w-full py-8 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center gap-2"
              >
                {file ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                    <span className="text-sm font-semibold text-foreground truncate max-w-[250px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">Tap to change</span>
                  </>
                ) : (
                  <>
                    <FileUp className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-semibold">
                      Tap to select image or PDF
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Progress bar */}
            {uploading && (
              <div className="mb-4">
                <div className="h-2 bg-muted rounded-full overflow-hidden brutal-border">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-1 text-center">
                  Uploading... {progress}%
                </p>
              </div>
            )}

            {/* Upload button */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold text-sm rounded-md brutal-border-accent brutal-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload Note"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
