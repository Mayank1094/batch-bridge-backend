import { motion } from "framer-motion";
import { SUBJECTS, type Subject } from "@/lib/data";

interface SubjectFilterProps {
  selected: Subject | null;
  onSelect: (subject: Subject | null) => void;
}

const SUBJECT_EMOJI: Record<Subject, string> = {
  "Data Communication": "📡",
  "DBMS": "🗄️",
  "Computer Graphics": "🖥️",
  "Kannada": "📚",
  "English": "📝",
  "Hindi": "📖",
};

const SubjectFilter = ({ selected, onSelect }: SubjectFilterProps) => {
  return (
    <section className="px-4 py-6">
      <div className="container max-w-4xl mx-auto">
        <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">
          Filter by Subject
        </h2>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(null)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-md brutal-border transition-all ${
              selected === null
                ? "bg-primary text-primary-foreground brutal-border-accent brutal-shadow"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            All
          </motion.button>
          {SUBJECTS.map((subject) => (
            <motion.button
              key={subject}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(subject)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-md brutal-border transition-all ${
                selected === subject
                  ? "bg-primary text-primary-foreground brutal-border-accent brutal-shadow"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              <span className="mr-1.5">{SUBJECT_EMOJI[subject]}</span>
              {subject}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectFilter;
