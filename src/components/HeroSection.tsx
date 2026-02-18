import { motion } from "framer-motion";
import { Upload, BookOpen } from "lucide-react";

interface HeroSectionProps {
  onUploadClick: () => void;
}

const HeroSection = ({ onUploadClick }: HeroSectionProps) => {
  return (
    <section className="relative px-4 pt-12 pb-8 md:pt-20 md:pb-12 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(hsl(82 85% 55%) 1px, transparent 1px), linear-gradient(90deg, hsl(82 85% 55%) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="relative container max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-mono text-sm text-primary tracking-widest uppercase">
            Classroom Hub
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
        >
          Share Notes,{" "}
          <span className="text-gradient">Ace Exams</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8"
        >
          Drop your handwritten notes, PDFs, and study material. 
          No login needed — just upload and help the batch.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUploadClick}
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-lg font-bold brutal-border-accent brutal-shadow-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none rounded-md"
        >
          <Upload className="w-5 h-5" />
          Share a Note
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
