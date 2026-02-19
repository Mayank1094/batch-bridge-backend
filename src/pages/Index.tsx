import { useState } from "react";
import { type Subject, type Unit, type Note } from "@/lib/data";
import HeroSection from "@/components/HeroSection";
import SubjectFilter from "@/components/SubjectFilter";
import UnitTabs from "@/components/UnitTabs";
import NoteGrid from "@/components/NoteGrid";
import UploadModal from "@/components/UploadModal";
import PreviewModal from "@/components/PreviewModal";

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <span className="font-bold text-sm text-foreground tracking-tight">
            📓 <span className="text-gradient">NoteHub</span>
          </span>
          <button
            onClick={() => setUploadOpen(true)}
            className="px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded brutal-border-accent"
          >
            + Upload
          </button>
        </div>
      </header>

      <HeroSection onUploadClick={() => setUploadOpen(true)} />
      <SubjectFilter selected={selectedSubject} onSelect={setSelectedSubject} />
      <UnitTabs selected={selectedUnit} onSelect={setSelectedUnit} />
      <NoteGrid
        selectedSubject={selectedSubject}
        selectedUnit={selectedUnit}
        onPreview={setPreviewNote}
      />

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-xs font-mono text-muted-foreground">
          Built for the batch · No login needed · Just share & learn
        </p>
      </footer>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={() => { }}
      />
      <PreviewModal
        note={previewNote}
        onClose={() => setPreviewNote(null)}
      />
    </div>
  );
};

export default Index;
