import { motion } from "framer-motion";
import { Download, Eye, FileText, Image as ImageIcon, Clock } from "lucide-react";
import type { Note } from "@/lib/data";

interface NoteCardProps {
  note: Note;
  index: number;
  onPreview: (note: Note) => void;
}

const NoteCard = ({ note, index, onPreview }: NoteCardProps) => {
  const timeAgo = getTimeAgo(note.createdAt);
  const isImage = note.fileType === "image";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass rounded-lg overflow-hidden brutal-border hover:brutal-border-accent transition-all group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {isImage && note.fileUrl ? (
          <img
            src={note.fileUrl}
            alt={note.fileName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-secondary">
            <FileText className="w-10 h-10 text-primary" />
            <span className="text-xs font-mono text-muted-foreground">PDF</span>
          </div>
        )}
        {/* Type badge */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-mono font-bold uppercase bg-background/80 backdrop-blur-sm text-foreground brutal-border">
          {isImage ? (
            <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> IMG</span>
          ) : (
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold truncate mb-1 text-foreground">{note.fileName}</p>
        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground mb-3">
          <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold">
            U{note.unit}
          </span>
          <span className="truncate">{note.subject}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {timeAgo}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => onPreview(note)}
              className="p-2 rounded bg-secondary hover:bg-muted brutal-border transition-colors"
              title="Preview"
            >
              <Eye className="w-3.5 h-3.5 text-foreground" />
            </button>
            <a
              href={note.fileUrl || "#"}
              download={note.fileName}
              className="p-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              title="Download"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default NoteCard;
