import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import NoteCard from "./NoteCard";
import { type Subject, type Unit, type Note } from "@/lib/data";
import api from "@/api/axios";
import { Loader2, FileX } from "lucide-react";

interface NoteGridProps {
  selectedSubject: Subject | "All";
  selectedUnit: Unit | "All";
  onPreview: (note: Note) => void;
}

const NoteGrid = ({ selectedSubject, selectedUnit, onPreview }: NoteGridProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedSubject !== "All") params.subject = selectedSubject;
        if (selectedUnit !== "All") params.unit = selectedUnit;

        const response = await api.get("/notes", { params });

        // Map backend response to frontend Note type
        const mappedNotes: Note[] = response.data.map((item: any) => ({
          _id: item._id,
          subject: item.subject,
          unit: item.unit,
          fileUrl: item.fileUrl,
          createdAt: item.createdAt,
          // Derive missing fields
          fileType: item.fileUrl.endsWith('.pdf') ? 'pdf' : 'image',
          fileName: item.publicId || `${item.subject} - Unit ${item.unit}`
        }));

        setNotes(mappedNotes);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedSubject, selectedUnit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="px-4 py-6">
      <div className="container max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Notes ({notes.length})
          </h2>
        </div>

        {notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 glass rounded-lg brutal-border"
          >
            <FileX className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-semibold">No notes yet</p>
            <p className="text-sm text-muted-foreground mt-1">Be the first to upload!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <AnimatePresence mode="popLayout">
              {notes.map((note, i) => (
                <NoteCard key={note._id} note={note} index={i} onPreview={onPreview} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default NoteGrid;
